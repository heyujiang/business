import type { RouteRecordRaw } from 'vue-router';
import { REDIRECT_ROUTE_NAME } from '@/router/constants';

export const DEFAULT_LAYOUT = () => import('@/layout/default-layout.vue');

export const REDIRECT_MAIN: RouteRecordRaw = {
  path: '/redirect',
  name: 'redirectWrapper',
  component: DEFAULT_LAYOUT,
  meta: {
    requiresAuth: true,
    hideInMenu: true,
  },
  children: [
    {
      path: '/redirect/:path',
      name: REDIRECT_ROUTE_NAME,
      component: () => import('@/views/systool/redirect/index.vue'),
      meta: {
        requiresAuth: true,
        hideInMenu: true,
      },
    },
  ],
};

export const NOT_FOUND_ROUTE: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: 'notFound',
  component: () => import('@/views/systool/not-found/index.vue'),
};

export const PRO_NOT_EXIST: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: 'proNotExist',
  component: () => import('@/views/systool/pro-not-exist/index.vue'),
};

