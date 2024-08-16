import { defHttp } from '@/utils/http';
import md5 from 'md5'

//类型
export interface LoginData {
  username: string;
  password: string;
}

export interface UserCond {
    phoneNumber?: string;
    username?: string;
    state?: number;
}


export interface SaveAccount {
    id?:number;
    username?: string;
    phoneNumber?:string;
    job?:string;
    deptId?:string;
    roleIds?:number[];
    password?: string | undefined;
    email?:string;
    avatar?:string;
}


enum Api {
    getList = '/api/user',
    save = '/api/user',
    update = '/api/user/',
    enable = '/api/user/enable/',
    disable = '/api/user/disable/',
    del = '/api/user/',
}

//数据列表
export function getList(params: object) {
  return defHttp.get({ url: Api.getList, params:params }, { errorMessageMode: 'message' });
}

//新增用户
export function save(params: SaveAccount) {
  if(params.password){
    params=Object.assign({},params,{password:md5(params.password)})//加密推送
  }
  return defHttp.post({ url: Api.save, params:params}, { errorMessageMode: 'message' });
}

//新增用户
export function update(id:number,params: SaveAccount) {
    if(params.password){
        params=Object.assign({},params,{password:md5(params.password)})//加密推送
    }
    return defHttp.post({ url: Api.update + id, params:params}, { errorMessageMode: 'message' });
}

export function enable(id: number) {
    return defHttp.post({ url: Api.enable + id}, { errorMessageMode: 'message' });
}
export function disable(id: number) {
    return defHttp.post({ url: Api.disable + id}, { errorMessageMode: 'message' });
}
//删除数据
export function del(id: number) {
    return defHttp.delete({ url: Api.del + id}, { errorMessageMode: 'message' });
}
/**数据类型 */
export interface DataItem {
    id:number,
    pid:number,
    locale: string;
    title: string;
  }
