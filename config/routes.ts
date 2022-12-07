export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/Login',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: 'config-list',
    name: 'config-list',
    icon: 'form',
    routes: [
      {
        path: '/config-list/interface-list',
        name: 'interface-list',
        component: './config-list/interface-list',
      },
      {
        path: '/config-list/procedure-list',
        name: 'procedure-list',
        component: './config-list/procedure-list',
      },
      {
        path: '/config-list/er-map',
        name: 'er-map',
        component: './config-list/er-map',
      },
    ],
  },
  {
    path: '/list',
    name: 'list',
    icon: 'table',
    routes: [
      {
        path: '/list/table-list',
        name: 'table-list',
        component: './list/table-list',
      },
      {
        path: '/list/base-list',
        name: 'base-list',
        component: './list/base-list',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/account',
    name: 'account',
    icon: 'crown',
    routes: [
      {
        path: '/account/management-account',
        name: 'management-account',
        component: './account/management-account',
      },
    ],
  },
  {
    path: '/',
    redirect: '/config-list/er-map',
  },
  {
    component: './404',
  },
];
