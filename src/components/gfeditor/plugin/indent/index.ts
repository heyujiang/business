import {
	$,
	addUnit,
	isEngine,
	NodeInterface,
	Plugin,
	PluginEntry,
	removeUnit,
	SchemaGlobal,
	PluginOptions,
	ConversionFromValue,
	ConversionToValue,
} from '@/components/gfeditor/emain';

export interface IndentOptions extends PluginOptions {
	hotkey?: {
		in?: string;
		out?: string;
	};
	maxPadding?: number;
}

export const TEXT_INENT_KEY = 'text-indent';

const KEYDOWN_BACKSPACE = 'keydown:backspace';
const KEYDOWN_TAB = 'keydown:tab';
const KEYDOWN_SHIFT_TAB = 'keydown:shift-tab';
const PASTE_EACH = 'paste:each';
export default class<
	T extends IndentOptions = IndentOptions,
> extends Plugin<T> {
	static get pluginName() {
		return 'indent';
	}

	init() {
		const editor = this.editor;
		editor.schema.add(this.schema());
		this.conversion().forEach(({ from, to }) => {
			editor.conversion.add(from, to);
		});
		editor.on(KEYDOWN_BACKSPACE, this.onBackspace);
		editor.on(KEYDOWN_TAB, this.onTab);
		editor.on(KEYDOWN_SHIFT_TAB, this.onShiftTab);
		if (isEngine(editor)) {
			editor.on(PASTE_EACH, this.pasteEach);
		}
	}

	execute(type: 'in' | 'out' = 'in') {
		const editor = this.editor;
		if (!isEngine(editor)) return;
		const { change, list, block } = editor;
		list.split();
		const range = change.range.get();
		const blocks = block.findBlocks(range);
		// 没找到目标 block
		if (!blocks) {
			return;
		}
		const maxPadding = this.options.maxPadding || 50;
		// 其它情况
		blocks.forEach((block) => {
			this.addPadding(block, type === 'in' ? 2 : -2, maxPadding);
		});
		list.merge();
	}

	queryState() {
		const editor = this.editor;
		if (!isEngine(editor)) return;
		const { change, list, node } = editor;
		const range = change.range.get();
		if (!range.startNode.inEditor()) return 0;
		const block = editor.block.closest(range.startNode);
		if (block.name === 'li') {
			return list.getIndent(block.closest('ul,ol'));
		}

		if (node.isRootBlock(block) || node.isNestedBlock(block)) {
			return removeUnit(block.css(TEXT_INENT_KEY));
		}
		return 0;
	}

	addPadding(block: NodeInterface, padding: number, maxPadding: number) {
		const editor = this.editor;
		const { list, node } = editor;
		if (block.name === 'li') return;
		if (node.isList(block)) {
			list.addIndent(block, padding, maxPadding);
		} else if (node.isRootBlock(block) || node.isNestedBlock(block)) {
			if (padding > 0) {
				if (removeUnit(block.css(TEXT_INENT_KEY))) {
					const currentValue = block.css(TEXT_INENT_KEY);
					let newValue = removeUnit(currentValue) + padding;
					// 获取自身宽度计算最大的indent
					let width = block.width();
					width = width === 0 ? editor.root.width() : width;
					// 获取字体大小用作计算em
					let fontSize = block.css('font-size');
					// 如果本身没有字体大小就，获取编辑器根节点默认字体大小
					fontSize =
						!fontSize || fontSize.endsWith('em')
							? editor.root.css('font-size')
							: fontSize;
					if (fontSize.endsWith('em')) {
						fontSize = $(document.body).css('font-size');
					}
					if (!fontSize.endsWith('px')) fontSize = '16px';
					const widthMax =
						width > 0 ? width / removeUnit(fontSize) : maxPadding;

					newValue = Math.min(
						currentValue.endsWith('px')
							? newValue / removeUnit(fontSize)
							: newValue,
						maxPadding,
						widthMax,
					);
					if (newValue <= 0) block.css(TEXT_INENT_KEY, '');
					else {
						block.css(
							TEXT_INENT_KEY,
							addUnit(newValue > 0 ? newValue : 0, 'em'),
						);
					}
				} else {
					block.css(TEXT_INENT_KEY, `${padding}em`);
				}
			} else {
				const currentValue = block.css(TEXT_INENT_KEY);
				const newValue = removeUnit(currentValue) + padding;
				if (newValue <= 0) block.css(TEXT_INENT_KEY, '');
				else {
					block.css(
						TEXT_INENT_KEY,
						addUnit(newValue > 0 ? newValue : 0, 'em'),
					);
				}
			}
		}
	}

	hotkey() {
		const inHotkey = this.options.hotkey?.in || 'mod+]';
		const outHotkey = this.options.hotkey?.out || 'mod+[';
		return [
			{ key: inHotkey, args: 'in' },
			{ key: outHotkey, args: 'out' },
		];
	}

	schema(): SchemaGlobal {
		return {
			type: 'block',
			attributes: {
				style: {
					[TEXT_INENT_KEY]: '@length',
				},
			},
		};
	}

	conversion(): Array<{ from: ConversionFromValue; to: ConversionToValue }> {
		return [
			{
				from: (_, styles, attributes) => {
					return (
						!!styles['padding-left'] || !!attributes[TEXT_INENT_KEY]
					);
				},
				to: (name, styles, attributes) => {
					const node = $(`<${name} />`);
					let valueStr =
						styles['padding-left'] || attributes[TEXT_INENT_KEY];

					// 转换为px
					if (valueStr.endsWith('pt')) {
						valueStr = this.convertToPX(valueStr);
					}
					// 转换为em
					if (valueStr.endsWith('px')) {
						// 获取自身的字体大小
						let fontSize = styles['font-size'];
						// 如果本身没有字体大小就，获取编辑器根节点默认字体大小
						fontSize =
							!fontSize || fontSize.endsWith('em')
								? this.editor.root.css('font-size')
								: fontSize;
						if (fontSize.endsWith('em')) {
							fontSize = $(document.body).css('font-size');
						}
						if (!fontSize.endsWith('px')) fontSize = '16px';
						const value =
							removeUnit(valueStr) / removeUnit(fontSize);
						styles[TEXT_INENT_KEY] = `${value}em`;
					} else if (valueStr.endsWith('em')) {
						styles[TEXT_INENT_KEY] = valueStr;
					}
					delete styles['padding-left'];
					delete attributes[TEXT_INENT_KEY];
					node.css(styles);
					Object.keys(attributes).forEach((name) => {
						node.attributes(name, attributes[name]);
					});
					return node;
				},
			},
		];
	}

	onBackspace = (event: KeyboardEvent) => {
		const editor = this.editor;
		if (!isEngine(editor)) return;
		const { change, list, node } = editor;
		const blockApi = editor.block;
		let range = change.range.get();
		const block = blockApi.closest(range.startNode);
		if (!node.isBlock(block)) return;
		const parent = block.parent();
		let blocks = change.blocks;
		if (parent && node.isBlock(parent)) {
			blocks = blocks.filter((b) => !b.equal(parent));
		}
		if ('li' === block.name) {
			if (range.collapsed && !list.isFirst(range)) {
				return;
			} else if (!range.collapsed) return;
		} else if (
			(((range.collapsed && blockApi.isLastOffset(range, 'end')) ||
				!blockApi.isFirstOffset(range, 'start')) &&
				!node.isEmptyWidthChild(block)) ||
			blocks.length > 1
		)
			return;
		else if (!range.collapsed) return;
		if (this.queryState()) {
			event.preventDefault();
			editor.command.execute(
				(this.constructor as PluginEntry).pluginName,
				'out',
			);
			return false;
		}
		return;
	};

	onTab = (event: KeyboardEvent) => {
		const editor = this.editor;
		if (!isEngine(editor)) return;
		const { change, list, block } = editor;
		const range = change.range.get();
		//列表
		if (range.collapsed && list.isFirst(range)) {
			event.preventDefault();
			editor.command.execute(
				(this.constructor as PluginEntry).pluginName,
				'in',
			);
			return false;
		}
		// <p><cursor />foo</p>
		if (!range.collapsed || block.isFirstOffset(range, 'start')) {
			event.preventDefault();
			editor.command.execute(
				(this.constructor as PluginEntry).pluginName,
				'in',
				true,
			);
			return false;
		}
		return;
	};

	onShiftTab = (event: KeyboardEvent) => {
		const editor = this.editor;
		if (!isEngine(editor)) return;
		event.preventDefault();
		editor.command.execute(
			(this.constructor as PluginEntry).pluginName,
			'out',
		);
		return false;
	};

	convertToPX(value: string) {
		const match = /([\d\.]+)(pt|px)$/i.exec(value);
		if (match && match[2] === 'pt') {
			return (
				String(Math.round((parseInt(match[1], 10) * 96) / 72)) + 'px'
			);
		}
		return value;
	}

	pasteEach = (node: NodeInterface) => {
		const editor = this.editor;
		//pt 转为px
		if (node.isElement() && !node.isCard() && editor.node.isBlock(node)) {
			const styles = node.css();
			const textIndentSource = styles[TEXT_INENT_KEY];
			if (!!textIndentSource && textIndentSource.endsWith('pt')) {
				const textIndent = this.convertToPX(textIndentSource);
				if (!!textIndent) {
					const maxPadding = this.options.maxPadding || 50;
					let newValue = removeUnit(textIndent);
					// 获取自身宽度计算最大的indent
					let width = node.width();
					width = width === 0 ? editor.root.width() : width;
					// 获取字体大小用作计算em
					let fontSize = node.css('font-size');
					// 如果本身没有字体大小就，获取编辑器根节点默认字体大小
					fontSize =
						!fontSize || fontSize.endsWith('em')
							? editor.root.css('font-size')
							: fontSize;
					if (fontSize.endsWith('em')) {
						fontSize = $(document.body).css('font-size');
					}
					if (!fontSize.endsWith('px')) fontSize = '16px';
					const widthMax =
						width > 0 ? width / removeUnit(fontSize) : maxPadding;

					newValue = Math.min(
						textIndent.endsWith('px')
							? newValue / removeUnit(fontSize)
							: newValue,
						maxPadding,
						widthMax,
					);
					if (newValue <= 0) node.css(TEXT_INENT_KEY, '');
					else {
						node.css(
							TEXT_INENT_KEY,
							addUnit(newValue > 0 ? newValue : 0, 'em'),
						);
					}
				}
			}
		}
	};

	destroy() {
		const editor = this.editor;
		editor.off(KEYDOWN_BACKSPACE, this.onBackspace);
		editor.off(KEYDOWN_TAB, this.onTab);
		editor.off(KEYDOWN_SHIFT_TAB, this.onShiftTab);
		if (isEngine(editor)) {
			editor.off(PASTE_EACH, this.pasteEach);
		}
	}
}
