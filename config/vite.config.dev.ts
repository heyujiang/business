import { mergeConfig } from 'vite';
import baseConfig from './vite.config.base';

export default mergeConfig(
  {
    mode: 'development',
    server: {
      open: false,
      fs: {
        strict: true,
      },
      host: true,
      port:9106,
      proxy: {
        '/resource': {
          target: 'http://sg.goflys.cn/resource',//代理的地址
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/resource/, '')//这里的/需要转义
        }
      }
    },
    plugins: [
    ],
  },
  baseConfig
);
