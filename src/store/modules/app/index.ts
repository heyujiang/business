import { defineStore } from 'pinia';
import { Message,Notification } from '@arco-design/web-vue';
import type { RouteRecordNormalized } from 'vue-router';
import defaultSettings from '@/config/settings.json';
import { getMenuList } from '@/api/user';
import { AppState } from './types';
import { cloneDeep } from 'lodash-es';

import type { AppRouteRecordRaw } from '/@/router/types';
import { transformObjToRoute } from '/@/router/helper/routeHelper';

const useAppStore = defineStore('app', {
  state: (): AppState => ({ ...defaultSettings }),

  getters: {
    appCurrentSetting(state: AppState): AppState {
      return { ...state };
    },
    appDevice(state: AppState) {
      return state.device;
    },
    appAsyncMenus(state: AppState): RouteRecordNormalized[] {
      return state.serverMenu as unknown as RouteRecordNormalized[];
    },
    appAsyncRoute(state: AppState): RouteRecordNormalized[] {
      return state.serverRoute as unknown as RouteRecordNormalized[];
    },
    //获取路由状态
    getIsDynamicAddedRoute():boolean{
      return this.isDynamicAddedRoute;
    },
    //获取主题
    getTheme():string{
      return this.theme;
    },
  },

  actions: {
    //设置动态路由加载状态
    setDynamicAddedRoute(added: boolean) {
      this.isDynamicAddedRoute = added;
    },
    // Update app settings
    updateSettings(partial: Partial<AppState>) {
      // @ts-ignore-next-line
      this.$patch(partial);
    },

    // Change theme color
    toggleTheme(dark: boolean) {
      if (dark) {
        this.theme = 'dark';
        document.body.setAttribute('arco-theme', 'dark');
      } else {
        this.theme = 'light';
        document.body.removeAttribute('arco-theme');
      }
    },
    toggleDevice(device: string) {
      this.device = device;
    },
    toggleMenu(value: boolean) {
      this.hideMenu = value;
    },
    async fetchServerMenuConfig() {
      try {
        Message.loading({content:"加载中...",id:"menuNotice"})
        const data = await getMenuList();
        this.serverMenu = data;
         // 动态引入组件
        let routeList: AppRouteRecordRaw[] = [];
        routeList=cloneDeep(data)
        var routeLists = transformObjToRoute(routeList);
        this.serverRoute =routeLists
        Message.success({content:"加载完成",id:"menuNotice"})
      } catch (error) {
        Message.clear("top")
         Notification.error({
          id: 'menuNotice',
          title: '错误提示',
          content: '加载菜单出错了!',
          position: 'bottomRight'
        });
      }
    },
    clearServerMenu() {
      this.serverMenu = [];
    },
  },
});

export default useAppStore;
