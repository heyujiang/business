import { defHttp } from '@/utils/http';
//类型
export interface LoginData {
  username: string;
  password: string;
}
enum Api {
    getList = '/api/node',
    getParent = '/api/node/parent',
    save = '/api/node',
    update = '/api/node/',
    upStatus = '/system/rule/upStatus',
    del = '/api/node/',
    nodeOptions = '/api/node/options'
}

//菜单选择菜单
export function getList(params: object) {
  return defHttp.get({ url: Api.getList, params:params }, { errorMessageMode: 'message' });
}
//菜单选择菜单
export function getParent() {
  return defHttp.get({ url: Api.getParent }, { errorMessageMode: 'none' });
}
//提交菜单
export function save(params: object) {
    return defHttp.post({ url: Api.save, params:params}, { errorMessageMode: 'message' });
}

export function update(id: number,params: object) {
    return defHttp.post({ url: Api.update + id, params:params}, { errorMessageMode: 'message' });
}

//更新状态
export function upStatus(params: object) {
    return defHttp.post({ url: Api.upStatus, params:params}, { errorMessageMode: 'message' });
}
//删除数据
export function del(id: number) {
    return defHttp.delete({ url: Api.del + id}, { errorMessageMode: 'message' });
}

//OPTIONS
export function getNodeOptions() {
    return defHttp.get({ url: Api.nodeOptions}, { errorMessageMode: 'none' });
}

/**数据类型 */
export interface NodeOption {
    value:number,
    label:string,
}

export interface NodeSaveItem {
    name:string,
    pid:number,
    sort:number,
}
