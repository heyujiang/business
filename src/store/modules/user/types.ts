// export type RoleType = '' | '*' | 'admin' | 'user';
export interface UserState {
  name?: string;
  username?: string;
  nickname?: string;
  avatar?: string;
  introduction?: string;
  userId?: number;
  businessID?: number;
  rooturl?: string;
  city?: string;
  company?: string;
  job?:string;
  role?:string;
  dept?:string;
  sessionTimeout?: boolean;
  isSuper?:number;
  isSystem?:number;
}
