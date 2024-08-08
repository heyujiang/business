import { defHttp } from '@/utils/http';
//类型
export interface LoginData {
  username: string;
  password: string;
}
enum Api {
    getParent = '/api/system/role/parents',
    getMenuList = '/api/system/rule/getRules/',
    save = '/api/system/role',
    del = '/api/system/role/',
    update = '/api/system/role/',
    getList = '/api/system/role',
    upStatus = '/api/system/role/updateStatus/',
}

//选择数据
export function getParent() {
  return defHttp.get({ url: Api.getParent }, { errorMessageMode: 'none' });
}
//获取菜单数据
export function getMenuList(id: number) {
  return defHttp.get({ url: Api.getMenuList + id}, { errorMessageMode: 'none' });
}
//提交数据
export function save(params: object) {
    return defHttp.post({ url: Api.save, params:params}, { errorMessageMode: 'message' });
}
//删除数据
export function del(id: number) {
    return defHttp.delete({ url: Api.del + id }, { errorMessageMode: 'message' });
}
export function update(id:number,params: object) {
    return defHttp.post({ url: Api.update + id, params:params}, { errorMessageMode: 'message' });
}

//更新状态
export function upStatus(id:number,params: object) {
    return defHttp.post({ url: Api.upStatus+id, params:params}, { errorMessageMode: 'message' });
}

//列表数据
export function getList(params: object) {
    return defHttp.get({ url: Api.getList, params:params }, { errorMessageMode: 'none' });
}
/**数据类型 */
export interface RuleItem {
    id:number,
    title:string;
    children:RuleItem[];
  }