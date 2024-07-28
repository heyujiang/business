import { defHttp } from '@/utils/http';
import md5 from 'md5'
enum Api {
   saveInfo = '/user/data/saveInfo',
   GetUser = '/user/data/get_user',
   checkPassword = '/user/data/checkPassword',
   changePassword = '/user/data/changePassword',
   GetCertification = '/user/data/get_certification',
}
export interface MyProjectRecord {
  id: number;
  name: string;
  description: string;
  peopleNumber: number;
  contributors: {
    name: string;
    email: string;
    avatar: string;
  }[];
}
export interface BasicInfoModel {
  id: number;
  nickname: string;
  email: string;
  mobile: string;
  remark: string;
  company: string;
  country: string;
  province: string;
  city: string;
  area: string;
  address: string;
  createtime: string;
}
export interface MyTeamRecord {
  id: number;
  avatar: string;
  name: string;
  peopleNumber: number;
}
//获取账户信息 
export function getUser() {
  return defHttp.get<BasicInfoModel>({ url:Api.GetUser});
}
//更新用户信息
export function saveInfo(params:object) {
  return defHttp.post({ url:Api.saveInfo,params:params}, { errorMessageMode: 'message' });
}
//校验密码正确性
export interface LoginData {
  username: string;
  password: string;
}
export function checkPassword(params:any) {
  params=Object.assign({},params,{password:md5(params.password)})//加密推送
  return defHttp.post({ url:Api.checkPassword,params:params}, { errorMessageMode: 'message' });
}
//修改密码
export interface ChangeData {
    oldpassword: string;
    password: string;
}
export function changePassword(params:ChangeData) {
  params=Object.assign({},params,{oldpassword:md5(params.oldpassword)})//加密推送
  params=Object.assign({},params,{password:md5(params.password)})//加密推送
  return defHttp.post({ url:Api.changePassword,params:params}, { errorMessageMode: 'message' });
}


export interface EnterpriseCertificationModel {
  id: number;
  status: number;
  nickname: string;
  email: string;
  remark: string;
  company: string;
  country: string;
  province: string;
  city: string;
  area: string;
  address: string;
  createtime: string;
}
export type CertificationRecord = Array<{
  certificationType: number;
  certificationContent: string;
  status: number;
  time: string;
}>;

export interface UnitCertification {
  enterpriseInfo: EnterpriseCertificationModel;
  record: CertificationRecord;
}
//认证
export function getCertification() {
  return defHttp.get<UnitCertification>({ url:Api.GetCertification});
}
/*************************userinfo */
enum ApiS {
  latestActivity = '/user/info/latestActivity',
  projectList = '/user/info/projectList',
  teamList = '/user/info/teamList',
}
export interface LatestActivity {
  id: number;
  title: string;
  description: string;
  avatar: string;
}
//获取动态
export function queryLatestActivity() {
  return defHttp.post<LatestActivity[]>({ url:ApiS.latestActivity}, { errorMessageMode: 'message' });
}
//项目
export function queryMyProjectList() {
  return defHttp.post({ url:ApiS.projectList}, { errorMessageMode: 'message' });
}
//我的团队
export function queryMyTeamList() {
  return defHttp.post({ url:ApiS.teamList}, { errorMessageMode: 'message' });
}