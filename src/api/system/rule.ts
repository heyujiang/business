import { defHttp } from '@/utils/http';
//类型
export interface LoginData {
  username: string;
  password: string;
}
enum Api {
    save = '/api/system/rule',
    del = '/api/system/rule/',
    update = '/api/system/rule/',
    upStatus = '/api/system/rule/updateStatus/',
    getList = '/api/system/rule',
    getParent = '/api/system/rule/parents',
}

//菜单选择菜单
export function getList(params: object) {
  return defHttp.get({ url: Api.getList, params:params }, { errorMessageMode: 'none' });
}
//菜单选择菜单
export function getParent(params: object) {
  return defHttp.get({ url: Api.getParent, params:params  }, { errorMessageMode: 'none' });
}
//提交菜单
export function save(params: object) {
    return defHttp.post({ url: Api.save, params:params}, { errorMessageMode: 'message' });
}
export function update(id:number,params: object) {
    return defHttp.post({ url: Api.update+id, params:params}, { errorMessageMode: 'message' });
}
//更新状态
export function upStatus(id:number,params: object) {
    return defHttp.post({ url: Api.upStatus+id, params:params}, { errorMessageMode: 'message' });
}
//删除数据
export function del(id:number) {
    return defHttp.delete({ url: Api.del+id}, { errorMessageMode: 'message' });
}
/**数据类型 */
export interface RuleItem {
    id:number,
    pid:number,
    locale: string;
    title: string;
  }