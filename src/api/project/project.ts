import { defHttp } from '@/utils/http';
import md5 from 'md5'
//类型
export interface LoginData {
  username: string;
  password: string;
}
enum Api {
    getList = '/api/project',
    save = '/api/project',
    update = '/api/project/',
    del = '/api/project/',
    getProjectInfo = '/api/project/',
    getProjectNodes = '/api/project/nodes/'
}

//数据列表
export function getList(params: any) {
    if (params.createdAt[0] > 100000000){
        params=Object.assign({},params,{createdAt:[Math.floor(params.createdAt[0] / 1000),Math.floor(params.createdAt[1] / 1000)]})
    }
   return defHttp.get({ url: Api.getList, params:params }, { errorMessageMode: 'none' });
}

//新增用户
export function save(params: any) {
  if (params.beginTime > 100000000){
      params=Object.assign({},params,{beginTime:Math.floor(params.beginTime / 1000)})
  }
  return defHttp.post({ url: Api.save, params:params}, { errorMessageMode: 'message' });
}

//新增用户
export function update(id:number,params: any) {
    return defHttp.post({ url: Api.update + id, params:params}, { errorMessageMode: 'message' });
}

//删除数据
export function del(id: number) {
    return defHttp.delete({ url: Api.del + id}, { errorMessageMode: 'message' });
}

export function getProjectInfo(id: number) {
    return defHttp.get({ url: Api.getProjectInfo + id}, { errorMessageMode: 'message' });
}


export function getProjectNodes(id: number) {
    return defHttp.get({ url: Api.getProjectNodes + id}, { errorMessageMode: 'message' });
}


/**数据类型 */
export interface DataItem {
    id:number,
    pid:number,
    locale: string;
    title: string;
}

export interface ProjectPersonItem {
    id?: number,
    userId?: number,
    projectId?: number,
    name?: string,
    phoneNumber?: string,
    type?: number,
}

export interface ProjectContactItem {
    id?: number,
    projectId?: number,
    name?: string,
    phoneNumber?: string,
    type?: number,
    description?: string,
}
