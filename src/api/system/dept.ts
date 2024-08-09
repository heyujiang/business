import { defHttp } from '@/utils/http';
//类型
export interface LoginData {
  username: string;
  password: string;
}
enum Api {
    getParent = '/api/system/dept/parents',
    save = '/api/system/dept',
    del = '/api/system/dept/',
    update = '/api/system/dept/',
    getList = '/api/system/dept',
    upStatus = '/api/system/dept/updateStatus/',
}

//列表数据
export function getList(params: object) {
  return defHttp.get({ url: Api.getList, params:params }, { errorMessageMode: 'none' });
}
//选择数据
export function getParent() {
  return defHttp.get({ url: Api.getParent }, { errorMessageMode: 'none' });
}
//提交数据
export function save(params: object) {
    return defHttp.post({ url: Api.save, params:params}, { errorMessageMode: 'message' });
}
//修改数据
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