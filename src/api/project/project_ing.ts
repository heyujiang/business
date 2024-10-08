import { defHttp } from '@/utils/http';
import md5 from 'md5'
//类型
export interface LoginData {
  username: string;
  password: string;
}
enum Api {
    getList = '/api/project/record',
    save = '/api/project/record',
    update = '/api/project/record/',
    del = '/api/project/record/',
}

//数据列表
export function getList(params: object) {
  return defHttp.get({ url: Api.getList, params:params }, { errorMessageMode: 'message' });
}

//新增用户
export function save(params: any) {
  if (params.beginTime > 100000000){
      params=Object.assign({},params,{beginTime:params.beginTime/1000})//加密推送
  }
  return defHttp.post({ url: Api.save, params:params}, { errorMessageMode: 'message' });
}

//
export function update(id:number,params: any) {
    return defHttp.post({ url: Api.update + id, params:params}, { errorMessageMode: 'message' });
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
