import { defHttp } from '@/utils/http';
//类型
export interface LoginData {
  username: string;
  password: string;
}
enum Api {
    getList = '/developer/devapi/get_list',
    getGroup = '/developer/devapi/get_group',
    getDBField = '/developer/devapi/get_DBField',
    getTables = '/developer/devapi/get_tables',
    getRoutes = '/developer/devapi/get_routes',
    getModel = '/developer/devapi/getModel',
    getTablelist = '/developer/devapi/get_tablelist',
    save = '/developer/devapi/save',
    del = '/developer/devapi/del',
}

//数据列表
export function getList(params: object) {
  return defHttp.get({ url: Api.getList, params:params }, { errorMessageMode: 'none' });
}
//选择分组
export function getGroup() {
 return defHttp.get({ url: Api.getGroup }, { errorMessageMode: 'none' });
}
//获取数据库字段说明
export function getDBField(params: object) {
  return defHttp.get({ url: Api.getDBField, params:params }, { errorMessageMode: 'none' });
}
//获取测试Token
export function getToken(params: object) {
  return defHttp.get(params, { errorMessageMode: 'message',isTransformResponse:false,isRootUrl:false});
}
//获取数据库表
export function getTables(params: object) {
  return defHttp.get({ url: Api.getTables, params:params }, { errorMessageMode: 'message'});
}
//获取所有路由列表
export function getRoutes(params: object) {
  return defHttp.get({ url: Api.getRoutes, params:params }, { errorMessageMode: 'message'});
}
//获取模块目录列表
export function getModel(params: object) {
  return defHttp.get({ url: Api.getModel, params:params }, { errorMessageMode: 'message'});
}
//获取数据库对用数据
export function getTablelist(params: object) {
  return defHttp.get({ url: Api.getTablelist, params:params }, { errorMessageMode: 'message'});
}
//提交
export function save(params: any) {
  return defHttp.post({ url: Api.save, params:params}, { errorMessageMode: 'message' });
}
//删除数据
export function del(params: object) {
    return defHttp.delete({ url: Api.del, params:params}, { errorMessageMode: 'message' });
}
/**数据类型 */
export interface DataItem {
    id:number,
    pid:number,
    locale: string;
    title: string;
  }
/**数据库表类型 */
export interface TableItem {
    name: string;
    title: string;
  }
/**用户类型 */
export interface UserItem {
    id:number,
    name: string;
  }