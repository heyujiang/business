// export type RoleType = '' | '*' | 'admin' | 'user';
export interface UserState {
  name?: string;
  nickname?: string;
  avatar?: string;
  introduction?: string;
  userId?: number;
  businessID?: number;
  rooturl?: string;
  city?: string;
  company?: string;
  sessionTimeout?: boolean;
}
