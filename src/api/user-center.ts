import { defHttp } from '@/utils/http';
import md5 from 'md5'
enum Api {
   saveInfo = '/api/user/updateBasic',
   GetUser = '/api/user/getUserInfo',
   updateAvatar = '/api/user/updateAvatar',
   changePassword = '/api/user/updatePassword',

   checkPassword = '/user/data/checkPassword',
   GetCertification = '/user/data/get_certification',
}
export interface MyProjectRecord {
  id: number;
  name: string;
  description: string;
  peopleNumber: number;
  star:number;
  attr:number;
  type:number;
  capacity:number;
  state:number;
  createdAt:string;
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
  phoneNumber:string;
  createdAt:string;
  introduction:string;
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
    oldPassword: string;
    password: string;
}
export function changePassword(params:ChangeData) {
  params=Object.assign({},params,{oldPassword:md5(params.oldPassword)})//加密推送
  params=Object.assign({},params,{password:md5(params.password)})//加密推送
  return defHttp.post({ url:Api.changePassword,params:params}, { errorMessageMode: 'message' });
}

export function updateAvatar(params:object) {
  return defHttp.post({ url:Api.updateAvatar,params:params}, { errorMessageMode: 'message' });
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
  latestActivity = '/api/user/myLatestRecords',
  projectList = '/api/user/myProjects',
  teamList = '/api/user/myTeams',
}
export interface LatestActivity {
  id: number;
  projectId:number;
  title: string;
  description: string;
  avatar: string;
  nodeName:string;
  overview:string;
  projectName:string;
  createdAt:string;
  username:string;
}
//获取动态
export function queryLatestActivity() {
  return defHttp.get<LatestActivity[]>({ url:ApiS.latestActivity}, { errorMessageMode: 'message' });
}
//项目
export function queryMyProjectList() {
  return defHttp.get({ url:ApiS.projectList}, { errorMessageMode: 'message' });
}
//我的团队
export function queryMyTeamList() {
  return defHttp.get({ url:ApiS.teamList}, { errorMessageMode: 'message' });
}

export interface TeamRecord {
  userId: number;
  username:string;
  avatar:string;
  phoneNumber:string;
}