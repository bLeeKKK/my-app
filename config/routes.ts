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
    path: 'base-config-list',
    name: 'base-config-list',
    icon: 'book',
    routes: [
      {
        path: '/base-config-list/dictionary-list',
        name: 'dictionary-list',
        component: './base-config-list/dictionary-list',
      },
    ],
  },
  {
    path: 'config-list',
    name: 'config-list',
    icon: 'form',
    routes: [
      // {
      //   path: '/config-list/interface-list',
      //   name: 'interface-list',
      //   component: './config-list/interface-list',
      // },
      {
        path: '/config-list/operation-flow',
        name: 'operation-flow',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/config-list/operation-flow',
            name: 'operation-flow',
            component: './config-list/operation-flow',
            exact: true,
          },
          {
            path: '/config-list/operation-flow/flow-map',
            name: 'flow-map',
            component: './config-list/flow-map',
          },
        ],
      },
    ],
  },
  {
    path: '/list',
    name: 'list',
    icon: 'table',
    routes: [
      // {
      //   path: '/list/table-list',
      //   name: 'table-list',
      //   component: './list/table-list',
      // },
      // {
      //   path: '/list/base-list',
      //   name: 'base-list',
      //   component: './list/base-list',
      // },
      {
        path: '/list/base-time-list',
        name: 'base-time-list',
        component: './list/base-time-list',
      },
      {
        path: '/list/base-show-list',
        name: 'base-show-list',
        component: './list/base-show-list',
      },
      {
        layout: false,
        hideInMenu: true,
        path: '/list/base-show',
        name: 'base-show',
        component: './list/base-show',
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
        path: '/account/account-management',
        name: 'account-management',
        component: './account/account-management',
      },
      {
        path: '/account/role-management',
        name: 'role-management',
        component: './account/role-management',
      },
      {
        path: '/account/right-management',
        name: 'right-management',
        component: './account/right-management',
      },
    ],
  },
  {
    path: '/monitor',
    name: 'monitor',
    icon: 'appstore',
    routes: [
      {
        path: '/monitor/interface-list',
        name: 'interface-list',
        component: './monitor/interface-list',
      },
      {
        path: '/monitor/base-list',
        name: 'base-list',
        component: './monitor/base-list',
      },
      {
        path: '/monitor/table-list',
        name: 'table-list',
        component: './monitor/table-list',
      },
    ],
  },
  {
    path: '/',
    redirect: '/base-config-list/dictionary-list',
  },
  {
    component: './404',
  },
];
