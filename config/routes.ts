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
      {
        path: '/config-list/interface-list',
        name: 'interface-list',
        component: './config-list/interface-list',
      },
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
    path: '/',
    redirect: '/base-config-list/dictionary-list',
  },
  {
    component: './404',
  },
];
