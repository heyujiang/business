import { defHttp } from '@/utils/http';
import md5 from 'md5'
//类型
export interface LoginData {
  username: string;
  password: string;
}
enum Api {
  //用户
   Login = '/login ',
   registerUser = '/user/registerUser ',
   Logout = '/user/logout',
   getCode = '/user/get_code',
   resetPassword = '/user/resetPassword',
   GetUserInfo = '/api/user/getUserInfo',
   GetMenu = '/api/user/menus',
   UserOptions = '/api/user/options',
   getlogininfo = '/user/get_logininfo',
}
//登录
export function login(params: LoginData) {
  params=Object.assign({},params,{password:md5(params.password)})//加密推送
  return defHttp.post({ url: Api.Login, params:params}, { errorMessageMode: 'message' });
}
//注册
export function registerUser(params: LoginData) {
  params=Object.assign({},params,{password:md5(params.password)})//加密推送
  return defHttp.post({ url: Api.registerUser, params:params}, { errorMessageMode: 'message' });
}
//重置密码
export function resetPassword(params: LoginData) {
  params=Object.assign({},params,{password:md5(params.password)})//加密推送
  return defHttp.post({ url: Api.resetPassword, params:params}, { errorMessageMode: 'message' });
}
//退出登录
export function logout() {
  return defHttp.post({ url: Api.Logout}, { errorMessageMode: 'message' });
}
//获取用信息
export function getUserInfo() {
  return defHttp.get({ url: Api.GetUserInfo }, { errorMessageMode: 'none' });
}
//获取验证码
export function getCode(params:object) {
  return defHttp.get({ url: Api.getCode, params:params }, { errorMessageMode: 'message' });
}

//获取后台菜单
export function getMenuList() {
  return defHttp.get({ url: Api.GetMenu }, { errorMessageMode: 'none' });
}

//获取登录信息
export function getlogininfo(params:object) {
  return defHttp.get({ url: Api.getlogininfo, params:params }, { errorMessageMode: 'message' });
}

//获取登录信息
export function getUserOptions() {
    return defHttp.get({ url: Api.UserOptions }, { errorMessageMode: 'message' });
}

