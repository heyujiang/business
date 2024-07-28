import { defHttp } from '@/utils/http';
import md5 from 'md5'
//类型
export interface LoginData {
  username: string;
  password: string;
}
enum Api {
    getList = '/developer/devapigroup/get_list',
    getParent = '/developer/devapigroup/get_parent',
    save = '/developer/devapigroup/save',
    del = '/developer/devapigroup/del',
}

//数据列表
export function getList(params: object) {
  return defHttp.get({ url: Api.getList, params:params }, { errorMessageMode: 'none' });
}
//选择数据
export function getParent() {
    return defHttp.get({ url: Api.getParent }, { errorMessageMode: 'none' });
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
    name: string;
  }