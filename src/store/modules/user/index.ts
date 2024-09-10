import { defineStore } from 'pinia';
import router from '@/router';
import type { RouteRecordRaw} from 'vue-router';
import {
  login as userLogin,
  logout as userLogout,
  getUserInfo,
  LoginData,
} from '@/api/user';
import { setToken,getToken, clearToken } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { UserState} from './types';
import useAppStore from '../app';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    name: undefined,
    username: undefined,
    nickname: undefined,
    avatar: undefined,
    introduction: undefined,
    userId: 0,
    businessID: 0,
    rooturl: '',
    city: '',
    company: '',
    job:'',
    role:'',
    dept:'',
    sessionTimeout: false,//登录是否已过期
    isSuper:0,
    isSystem:0,
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },

  actions: {
    setTokenData(info: string | undefined) {
      setToken(info);
    },
    // Set user's information
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },
    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    // Get user's information/获取用户信息
    async info() {
      const res = await getUserInfo();
      this.setInfo(res);
    },
    //设置token
    async setTokenArr(token:any) {
      setToken(token);
    },
    // 登录/Login
    async login(loginForm: LoginData) {
      try {
        const res = await userLogin(loginForm);
        setToken(res.token);
        return this.afterLoginAction();
      } catch (err) {
        clearToken();
        throw err;
      }
    },
    //登录成功后加载菜单
    async afterLoginAction(){
      if (!getToken()) return false;
      this.info()
      const appStore = useAppStore();
      await appStore.fetchServerMenuConfig();
      //注册路由
      if (!appStore.getIsDynamicAddedRoute) {
        appStore.appAsyncRoute.forEach( route => {
          router.addRoute(route as unknown as RouteRecordRaw);
        })
        appStore.setDynamicAddedRoute(true);
      }
      return true;
    },
    logoutCallBack() {
      const appStore = useAppStore();
      this.resetInfo();
      clearToken();
      removeRouteListener();
      appStore.clearServerMenu();
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
   // 退出登录
   async logout(goLogin = false) {
    try {
      await userLogout();
    } finally {
      this.logoutCallBack();
    }
    setToken(undefined);
    // this.setSessionTimeout(false);
    goLogin && router.push('/login');
  },
  },
});

export default useUserStore;
