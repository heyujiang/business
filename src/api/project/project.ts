import { defHttp } from '@/utils/http';

import md5 from 'md5'
import dayjs from "dayjs";
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
    getProjectNodes = '/api/project/nodes/',
    getProjectContacts = '/api/project/contact/',
    getProjectPersons = '/api/project/person/',
    delProjectContact = '/api/project/contact/',
    delProjectPerson = '/api/project/person/',
    saveProjectPerson = '/api/project/person',
    saveProjectContact = '/api/project/contact',
    projectOption = '/api/project/option',
    projectNodeOption = '/api/project/nodes/option/',
    getProjectAttached = '/api/project/attached',
    createProjectAttached = '/api/project/attached',
    getProjectRecordByNode = '/api/project/record/node',
}

//数据列表
export function getList(params: any) {
    if (params.createdAt[0] > 100000000){
        params=Object.assign({},params,{createdAt:[Math.floor(params.createdAt[0] / 1000),Math.floor(params.createdAt[1] / 1000)]})
    }
   return defHttp.get({ url: Api.getList, params:params }, { errorMessageMode: 'message' });
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
    if ( typeof params.beginTime != 'number') {
        params=Object.assign({},params,{beginTime:dayjs(params.beginTime).unix()})
    }else if ( params.beginTime > 100000000){
        params=Object.assign({},params,{beginTime:Math.floor(params.beginTime / 1000)})
    }
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

export function getProjectContacts(id: number) {
    return defHttp.get({ url: Api.getProjectContacts + id}, { errorMessageMode: 'message' });
}

export function getProjectPersons(id: number) {
    return defHttp.get({ url: Api.getProjectPersons + id}, { errorMessageMode: 'message' });
}

export function delProjectPerson(id: number) {
    return defHttp.delete({ url: Api.delProjectPerson + id}, { errorMessageMode: 'message' });
}

export function delProjectContact(id: number) {
    return defHttp.delete({ url: Api.delProjectContact + id}, { errorMessageMode: 'message' });
}

export function saveProjectPerson(params: any) {
    return defHttp.post({ url: Api.saveProjectPerson , params: params}, { errorMessageMode: 'message' });
}

export function saveProjectContact(params: any) {
    return defHttp.post({ url: Api.saveProjectContact, params: params}, { errorMessageMode: 'message' });
}

export function getProjectOption() {
    return defHttp.get({ url: Api.projectOption }, { errorMessageMode: 'none' });
}

export function getProjectNodeOption(id: any) {
    return defHttp.get({ url: Api.projectNodeOption + id}, { errorMessageMode: 'none' });
}

export function getProjectAttached(params:any) {
    return defHttp.get({ url: Api.getProjectAttached , params:params}, { errorMessageMode: 'message' });
}


export function createProjectAttached(params:any) {
    return defHttp.post({ url: Api.createProjectAttached , params:params}, { errorMessageMode: 'message' });
}

export function getProjectRecordByNode(params:any) {
    return defHttp.get({ url: Api.getProjectRecordByNode , params:params}, { errorMessageMode: 'message' });
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
