import { defHttp } from '@/utils/http';
enum Api {
    getList = '/developer/generatecode/get_list',
    upCodeTable = '/developer/generatecode/upCodeTable',
    getContent= '/developer/generatecode/getContent',
    save = '/developer/generatecode/save',
    upStatus = '/developer/generatecode/upStatus',
    del = '/developer/generatecode/del',
    uninstallcode = '/developer/generatecode/uninstallcode',
    getdbfield = '/developer/generatecode/get_dbfield',
    get_tablelist = '/developer/generatecode/get_tablelist',
}

//列表数据
export function getList(params: object) {
  return defHttp.get({ url: Api.getList, params:params }, { errorMessageMode: 'none' });
}
//获取内容
export function getContent(params: object) {
  return defHttp.get({ url: Api.getContent, params:params }, { errorMessageMode: 'none' });
}
//更新生成代码数据表
export function upCodeTable(params: object) {
    return defHttp.post({ url: Api.upCodeTable, params:params}, { errorMessageMode: 'message' });
}
//提交数据
export function save(params: object) {
    return defHttp.post({ url: Api.save, params:params}, { errorMessageMode: 'message' });
}
//更新状态
export function upStatus(params: object) {
    return defHttp.post({ url: Api.upStatus, params:params}, { errorMessageMode: 'message' });
}
//删除数据
export function del(params: object) {
    return defHttp.delete({ url: Api.del, params:params}, { errorMessageMode: 'message' });
}
//卸载
export function uninstallcode(params: object) {
    return defHttp.post({ url: Api.uninstallcode, params:params}, { errorMessageMode: 'message' });
}
//获取数据表字段
export function getdbfield(params: object) {
    return defHttp.get({ url: Api.getdbfield, params:params }, { errorMessageMode: 'none' });
  }
//获取数据表字段
export function get_tablelist(params: object) {
    return defHttp.get({ url: Api.get_tablelist, params:params }, { errorMessageMode: 'none' });
  }
/**数据类型 */
export interface DataItem {
    id:number,
    name: string;
}
/**数据类型 */
export interface TreeItem {
    value:string,
    label: string;
}
/**生成代码数据 */
export interface CodedataItem {
  id:number,
  tablename:string,
  comment:string,
  pid:number,
  rule_id:number,
  rule_name:string,
  icon:string,
  is_install:number,
  routePath:string,
  routeName:string,
  component:string,
  api_path:string,
  api_filename:string,
  tpl_type:string,
  cate_tablename:string,
}
//生成字段礼列表
export interface CodeListItem {
  id:number,
  generatecode_id:number,
  islist: boolean,
  name:string,
  field:string,
  isorder: boolean,
  align:string,
  width:number,
  isform: boolean,
  required: boolean,
  formtype:string,
  datatable:string,
  datatablename:string,
  issearch:boolean,
  searchway:string,
  searchtype:string,
  field_weigh:number,
  list_weigh:number,
  search_weigh:number,
  def_value:string,
}