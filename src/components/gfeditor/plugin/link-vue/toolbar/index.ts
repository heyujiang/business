import {
	$,
	DATA_ELEMENT,
	EngineInterface,
	isMobile,
	NodeInterface,
	Position,
	UI,
} from '@/components/gfeditor/emain';
import { createApp, App } from 'vue';
import AmEditor from './editor.vue';
import AmPreview from './preview.vue';

export type ToolbarOptions = {
	onConfirm?: (
		text: string,
		link: string,
		juptType: string,
	) => Promise<{ text: string; link: string ,juptType:string}>;
};

class Toolbar {
	private engine: EngineInterface;
	private root?: NodeInterface;
	private target?: NodeInterface;
	private options?: ToolbarOptions;
	private mouseInContainer: boolean = false;
	private vm?: App;
	position: Position;

	constructor(engine: EngineInterface, options?: ToolbarOptions) {
		this.engine = engine;
		const { change } = this.engine;
		this.options = options;
		this.position = new Position(this.engine);
		change.event.onWindow('mousedown', (event: MouseEvent) => {
			if (!event.target) return;
			const target = $(event.target);
			const container = target.closest('.data-link-container');
			this.mouseInContainer = container && container.length > 0;
			if (!target.inEditor() && !this.mouseInContainer) this.hide();
		});
	}

	private create() {
		if (!this.target) return;
		let root = $('.data-link-container');
		if (root.length === 0) {
			root = $(
				`<div ${DATA_ELEMENT}="${UI}" class="data-link-container${
					isMobile ? ' data-link-container-mobile' : ''
				}"></div>`,
			);
		}
		this.root = root;
		const rect = this.target.get<Element>()?.getBoundingClientRect();
		if (!rect) return;
		this.root.css({
			top: `${window.pageYOffset + rect.bottom + 4}px`,
			left: `${window.pageXOffset}px`,
			position: 'absolute',
			'z-index': 125,
		});
	}

	private async onOk(text: string, link: string,juptType:string) {
		if (!this.target) return;
		const { change } = this.engine;
		const range = change.range.get();
		if (!change.rangePathBeforeCommand) {
			if (!range.startNode.inEditor()) {
				range.select(this.target, true);
				change.range.select(range);
			}
			change.cacheRangeBeforeCommand();
		}
		const { onConfirm } = this.options || {};
		if (onConfirm) {
			const result = await onConfirm(text, link,juptType);
			text = result.text;
			link = result.link;
			juptType = result.juptType;
		}
		this.target.attributes('href', link);
		this.target.attributes('target', juptType);
		text = text.trim() === '' ? link : text;
		const oldText = this.target.text();
		if (oldText !== text) {
			const children = this.target.children();
			// 左右两侧有零宽字符
			if (children.length < 3) {
				this.target.text(text);
			}
			// 中间节点是文本字符
			else if (children.length === 3 && children.eq(1)?.isText()) {
				this.target.text(text);
			}
			// 中间节点是非文本节点
			else if (children.length === 3) {
				let element = children.eq(1);
				while (element) {
					const child = element.children();
					// 有多个子节点就直接设置文本，覆盖里面的mark样式
					if (child.length > 1 || child.length === 0) {
						element.text(text);
						break;
					}
					// 里面的子节点是文本就设置文本
					else if (child.eq(0)?.isText()) {
						element.text(text);
						break;
					}
					// 里面的子节点非文本节点就继续循环
					else {
						element = child;
					}
				}
			}
			// 多个其它节点
			else {
				this.target.text(text);
			}
		}
		this.engine.inline.repairCursor(this.target);
		range.setStart(this.target.next()!, 1);
		range.setEnd(this.target.next()!, 1);
		change.apply(range);
		this.mouseInContainer = false;
		this.hide();
	}

	editor(text: string, href: string,juptType:string, callback?: () => void) {
		const vm = createApp(AmEditor, {
			language: this.engine.language,
			defaultText: text,
			defaultLink: href,
			defaultjuptType: juptType||"_blank",
			onLoad: () => {
				this.mouseInContainer = true;
				if (callback) callback();
			},
			onOk: (text: string, link: string,juptType:string) => this.onOk(text, link,juptType),
		});
		return vm;
	}

	preview(href: string, callback?: () => void) {
		const { change, inline, language } = this.engine;
		const vm = createApp(AmPreview, {
			language,
			href,
			readonly: this.engine.readonly,
			onLoad: () => {
				if (callback) callback();
			},
			onEdit: () => {
				if (!this.target) return;
				this.mouseInContainer = false;
				this.hide(undefined, false);
				this.show(this.target, true);
			},
			onRemove: () => {
				if (!this.target) return;
				const range = change.range.get();
				range.select(this.target, true);
				inline.repairRange(range);
				change.range.select(range);
				change.cacheRangeBeforeCommand();
				inline.unwrap();
				this.mouseInContainer = false;
				this.target = undefined;
				this.hide();
			},
		});
		return vm;
	}

	show(target: NodeInterface, forceEdit?: boolean) {
		if (this.target?.equal(target) && !!this.root?.parent()?.length) return;
		this.target = target;
		this.create();
		const text = target.text().replace(/\u200B/g, '');
		const href = target.attributes('href');
		const juptType = target.attributes('target');
		const container = this.root!.get<HTMLDivElement>()!;

		const name =
			(!href || forceEdit) && !this.engine.readonly
				? 'am-link-editor'
				: 'am-link-preview';
		if (this.vm && this.vm._component.name === name) {
			if (!this.root || !this.target) return;
			this.position?.destroy();
			this.position?.bind(this.root, this.target);
			return;
		} else if (this.vm) {
			this.vm.unmount();
			this.vm = undefined;
			this.position?.destroy();
		}

		setTimeout(() => {
			this.position?.destroy();
			this.position?.bind(this.root!, this.target!);
			this.vm =
				(!href || forceEdit) && !this.engine.readonly
					? this.editor(text, href,juptType, () => {
							this.position?.update();
					  })
					: this.preview(href, () => {
							this.position?.update();
					  });
			this.vm.mount(container);
		}, 20);
	}

	hide(target?: NodeInterface, clearTarget?: boolean) {
		if (target && this.target && target.equal(this.target)) return;
		const element = this.root?.get<Element>();
		if (element && !this.mouseInContainer) {
			if (this.vm) {
				this.vm.unmount();
				this.vm = undefined;
				this.position?.destroy();
			}
			this.root = undefined;
			if (this.target && !this.target.attributes('href')) {
				const { change, inline } = this.engine;
				const range = change.range.get();
				range.select(this.target, true);
				inline.unwrap(range);
				change.apply(range.collapse(true));
			}
			if (clearTarget !== false) this.target = undefined;
		}
	}
}
export default Toolbar;
