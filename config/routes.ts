export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: '登录',
        path: '/user/login',
        component: './user/Login',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/list',
    name: '管理页',
    icon: 'crown',
    routes: [
      {
        path: '/list/table-list',
        // name: 'table-list',
        name: '基础列表',
        icon: 'smile',
        component: './list/table-list',
      },
      {
        path: '/list/config-list',
        // name: 'config-list',
        name: '配置列表',
        icon: 'smile',
        component: './list/config-list',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/',
    redirect: '/list/table-list',
  },
  {
    component: './404',
  },
];
