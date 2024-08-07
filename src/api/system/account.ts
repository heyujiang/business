import { defHttp } from '@/utils/http';
import md5 from 'md5'
//类型
export interface LoginData {
  username: string;
  password: string;
}
enum Api {
    getList = '/api/user',
    save = '/api/user',
    update = '/api/user/',
    Isaccountexist = '/system/account/isaccountexist',
    enable = '/api/user/enable/',
    disable = '/api/user/disable/',
    del = '/api/user/',
}

//数据列表
export function getList(params: object) {
  return defHttp.get({ url: Api.getList, params:params }, { errorMessageMode: 'message' });
}

//新增用户
export function save(params: any) {
  if(params.password){
    params=Object.assign({},params,{password:md5(params.password)})//加密推送
  }
  return defHttp.post({ url: Api.save, params:params}, { errorMessageMode: 'message' });
}

//新增用户
export function update(id:number,params: any) {
    if(params.password){
        params=Object.assign({},params,{password:md5(params.password)})//加密推送
    }
    return defHttp.post({ url: Api.update + id, params:params}, { errorMessageMode: 'message' });
}

//判断账号是否已经存在
export function isAccountexist(params: object) {
  return defHttp.post({ url: Api.Isaccountexist, params:params}, { errorMessageMode: 'message',isTransformResponse:false});
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
