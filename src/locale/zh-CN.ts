import localeMessageBox from '@/components/message-box/locale/zh-CN';
import localeSettings from './zh-CN/settings';

//自动加载
const autoLocle = import.meta.glob('@/views/**/locale/zh-CN.ts', {
  eager: true,
});
function formatModules(_modules: any, result: {}) {
  Object.keys(_modules).forEach((key) => {
    const defaultModule = _modules[key].default;
    if (!defaultModule) return;
    result=Object.assign({},result,defaultModule);
  });
  return result;
}
export default {
  'menu.dashboard': '仪表盘',
  'menu.server.dashboard': '仪表盘-服务端',
  'menu.server.workplace': '工作台-服务端',
  'menu.server.monitor': '实时监控-服务端',
  'menu.list': '列表页',
  'menu.result': '结果页',
  'menu.exception': '异常页',
  'menu.form': '表单页',
  'menu.profile': '详情页',
  'menu.visualization': '数据可视化',
  'menu.user': '个人中心',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': '常见问题',
  'menu.system':"系统管理",
  'navbar.docs': '文档中心',
  'navbar.action.locale': '切换为中文',
  'searchTable.operation.create': '新建',
  'searchTable.form.reset': '重置',
  ...localeSettings,
  ...localeMessageBox,
  ...formatModules(autoLocle,{})
};
