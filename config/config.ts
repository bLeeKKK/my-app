// https://umijs.org/config/
import { defineConfig } from 'umi';
import path, { join } from 'path';

import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';

const { REACT_APP_ENV } = process.env;
const appConfigPath = path.join(__dirname, '../public/app.config.json');
// const pkg = path.join(__dirname, '../package.json');
const { base } = require(appConfigPath);
// const { name, title } = require(pkg);

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? `${base}/` : '/',
  publicPath: process.env.NODE_ENV === 'production' ? `${base}/` : '/',
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true, // 菜单国际化
    siderWidth: 208,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  access: {
    strictMode: false,
  },
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // 如果不想要 configProvide 动态设置主题需要把这个设置为 default
    // 只有设置为 variable， 才能使用 configProvide 动态设置主色调
    // https://ant.design/docs/react/customize-theme-variable-cn
    'root-entry-name': 'variable',
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  openAPI: [
    {
      requestLibPath: "import { request } from 'umi'",
      schemaPath: 'https://decmp.changhong.com/bizlog-core/v2/api-docs',
      // projectName: 'swagger',
    },
    {
      requestLibPath: "import { request } from 'umi'",
      // 或者使用在线的版本
      // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
      schemaPath: join(__dirname, 'oneapi.json'),
      mock: false,
    },
  ],
  // define: {
  //   'process.env.MOCK': process.env.MOCK,
  // },
  // request: { dataField: 'data' },
  nodeModulesTransform: { type: 'none' },
  mfsu: {},
  webpack5: {},
  exportStatic: {},
  // mountElementId: 'root',
  qiankun: {
    master: {
      // 注册子应用信息
      apps: [
        {
          name: 'bizlog-web', // 唯一 id
          // entry: 'http://localhost:8001', // html entry // ?sourceOrderkey=82135509&sourceSys=SCMC&userName=MOFC-管理员
          // entry: 'https://decmp.changhong.com/bizlog-web/index.html', // html entry // ?sourceOrderkey=82135509&sourceSys=SCMC&userName=MOFC-管理员
          entry:
            process.env.NODE_ENV === 'development'
              ? 'http://localhost:8001'
              : 'https://decmp.changhong.com/bizlog-web/index.html',
        },
      ],
    },
  },
});
