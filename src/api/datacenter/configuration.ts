import { defHttp } from '@/utils/http';
enum Api {
    getEmail = '/datacenter/configuration/get_email',
    saveEmail = '/datacenter/configuration/saveEmail',
}

//列表数据
export function getEmail(params: object) {
  return defHttp.get({ url: Api.getEmail, params:params }, { errorMessageMode: 'none' });
}
//提交数据
export function saveEmail(params: object) {
    return defHttp.post({ url: Api.saveEmail, params:params}, { errorMessageMode: 'message' });
}
/**数据类型 */
export   interface menuItem {
    id:number,
    title: string;
}
