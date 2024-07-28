import type { RouteRecordNormalized } from 'vue-router';
import type { AppRouteRecordRaw } from '/@/router/types';
export interface AppState {
  theme: string;
  colorWeak: boolean;
  navbar: boolean;
  menu: boolean;
  topMenu: boolean;
  hideMenu: boolean;
  menuCollapse: boolean;
  footer: boolean;
  themeColor: string;
  menuWidth: number;
  globalSettings: boolean;
  device: string;
  tabBar: boolean;
  menuFromServer: boolean;
  serverMenu: RouteRecordNormalized[];
  serverRoute: AppRouteRecordRaw[];
  isDynamicAddedRoute:boolean;
  [key: string]: unknown;
}
