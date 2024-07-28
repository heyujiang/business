// import { defHttp } from '@/utils/http';
// import md5 from 'md5'
// //类型
// export interface LoginData {
//   username: string;
//   password: string;
// }
// enum Api {
//     getList = '/api/user',
//     getRole = '/system/account/get_role',
//     save = '/api/user',
//     update = '/api/user/',
//     Isaccountexist = '/system/account/isaccountexist',
//     upStatus = '/system/account/upStatus',
//     del = '/api/user/',
// }
//
// //数据列表
// export function getList(params: object) {
//   return defHttp.get({ url: Api.getList, params:params }, { errorMessageMode: 'none' });
// }
// //选择角色
// export function getRole() {
//   return defHttp.get({ url: Api.getRole }, { errorMessageMode: 'none' });
// }
// //提交菜单
// export function save(params: any) {
//   if(params.password){
//     params=Object.assign({},params,{password:md5(params.password)})//加密推送
//   }
//   return defHttp.post({ url: Api.save, params:params}, { errorMessageMode: 'message' });
// }
// //判断账号是否已经存在
// export function isAccountexist(params: object) {
//   return defHttp.post({ url: Api.Isaccountexist, params:params}, { errorMessageMode: 'message',isTransformResponse:false});
// }
// //更新状态
// export function upStatus(params: object) {
//     return defHttp.post({ url: Api.upStatus, params:params}, { errorMessageMode: 'message' });
// }
// //删除数据
// export function del(params: object) {
//     return defHttp.delete({ url: Api.del, params:params}, { errorMessageMode: 'message' });
// }
// /**数据类型 */
// export interface DataItem {
//     id:number,
//     pid:number,
//     locale: string;
//     title: string;
//   }
