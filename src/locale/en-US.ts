import localeMessageBox from '@/components/message-box/locale/en-US';
import localeSettings from './en-US/settings';
//自动加载 views下的语言包
const autoLocle = import.meta.glob('@/views/**/locale/en-US.ts', {
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
  'menu.dashboard': 'Dashboard',
  'menu.server.dashboard': 'Dashboard-Server',
  'menu.server.workplace': 'Workplace-Server',
  'menu.server.monitor': 'Monitor-Server',
  'menu.list': 'List',
  'menu.result': 'Result',
  'menu.exception': 'Exception',
  'menu.form': 'Form',
  'menu.profile': 'Profile',
  'menu.visualization': 'Data Visualization',
  'menu.user': 'User Center',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': 'FAQ',
  'menu.system':"System",
  'navbar.docs': 'Docs',
  'navbar.action.locale': 'Switch to English',
  'searchTable.operation.create': 'Create',
  'searchTable.form.reset': 'Reset',
  ...localeSettings,
  ...localeMessageBox,
  ...formatModules(autoLocle,{})
};
