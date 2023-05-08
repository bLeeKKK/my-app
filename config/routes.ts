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
        lazyLoad: true,
        wrappers: ['@/wrappers/withKeepLive'],
      },
    ],
  },
  {
    path: 'config-list',
    name: 'config-list',
    icon: 'form',
    routes: [
      {
        path: '/config-list/over-time-level',
        name: 'over-time-level',
        component: './config-list/over-time-level',
        wrappers: ['@/wrappers/withKeepLive'],
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
            wrappers: ['@/wrappers/withKeepLive'],
          },
          {
            path: '/config-list/operation-flow/flow-map',
            name: 'flow-map',
            component: './config-list/flow-map',
          },
        ],
      },

      {
        path: '/config-list/node-timer-flow',
        name: 'node-timer-flow',
        component: './config-list/node-timer-flow',
        wrappers: ['@/wrappers/withKeepLive'],
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
        wrappers: ['@/wrappers/withKeepLive'],
      },
      {
        path: '/list/base-show-list',
        name: 'base-show-list',
        component: './list/base-show-list',
        wrappers: ['@/wrappers/withKeepLive'],
      },
      {
        path: '/list/base-show-list-b',
        name: 'base-show-list-b',
        component: './list/base-show-list-b',
        wrappers: ['@/wrappers/withKeepLive'],
      },
      {
        path: '/list/base-show-list-no',
        name: 'base-show-list-no',
        component: './list/base-show-list-no',
        wrappers: ['@/wrappers/withKeepLive'],
      },
      {
        path: '/list/base-report-forms',
        name: 'base-report-forms',
        component: './list/base-report-forms',
        wrappers: ['@/wrappers/withKeepLive'],
      },
      {
        path: '/list/base-node-time-list',
        name: 'base-node-time-list',
        component: './list/base-node-time-list',
        wrappers: ['@/wrappers/withKeepLive'],
      },
      {
        path: '/list/mofc-sure-list',
        name: 'mofc-sure-list',
        component: './list/mofc-sure-list',
        wrappers: ['@/wrappers/withKeepLive'],
      },
      {
        layout: false,
        hideInMenu: true,
        path: '/list/base-show',
        name: 'base-show',
        component: './list/base-show',
        // wrappers: ['@/wrappers/withKeepLive'],
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
        wrappers: ['@/wrappers/withKeepLive'],
      },
      {
        path: '/account/role-management',
        name: 'role-management',
        component: './account/role-management',
        wrappers: ['@/wrappers/withKeepLive'],
      },
      {
        path: '/account/right-management',
        name: 'right-management',
        component: './account/right-management',
        wrappers: ['@/wrappers/withKeepLive'],
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
        wrappers: ['@/wrappers/withKeepLive'],
      },
      {
        path: '/monitor/base-list',
        name: 'base-list',
        component: './monitor/base-list',
        wrappers: ['@/wrappers/withKeepLive'],
      },
      {
        path: '/monitor/table-list',
        name: 'table-list',
        component: './monitor/table-list',
        wrappers: ['@/wrappers/withKeepLive'],
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
