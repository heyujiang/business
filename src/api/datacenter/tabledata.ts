import { defHttp } from '@/utils/http';
enum Api {
    getList = '/datacenter/tabledata/get_list',
    save = '/datacenter/tabledata/save',
    del = '/datacenter/tabledata/del',
}

//列表数据
export function getmenuList(params: object) {
  return defHttp.get({ url: Api.getList, params:params }, { errorMessageMode: 'none' });
}
//提交数据
export function save(params: object) {
    return defHttp.post({ url: Api.save, params:params}, { errorMessageMode: 'message' });
}
//删除数据
export function delMenuList(params: object) {
    return defHttp.delete({ url: Api.del, params:params}, { errorMessageMode: 'message' });
}
/**数据类型 */
export interface menuItem {
    id:number,
    businessID:number,
    title: string;
    remark: string;
    tablename: string;
    data_from: string;
    weigh: number;
    status: number;
}
