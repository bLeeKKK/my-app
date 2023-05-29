﻿export default [
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
    path: '/welcome',
    name: 'welcome',
    // icon: 'smile',
    component: './Welcome',
  },
  // {
  //   path: 'base-config-list',
  //   name: 'base-config-list',
  //   icon: 'book',
  //   access: 'base-config-list',
  //   routes: [
  //     {
  //       path: '/base-config-list/dictionary-list',
  //       name: 'dictionary-list',
  //       access: 'base-config-list:dictionary-list',
  //       component: './base-config-list/dictionary-list',
  //       lazyLoad: true,
  //       wrappers: ['@/wrappers/withKeepLive'],
  //     },
  //   ],
  // },
  {
    path: 'config-list',
    name: 'config-list',
    icon: 'form',
    access: 'config-list',
    routes: [
      {
        path: '/config-list/over-time-level',
        name: 'over-time-level',
        component: './config-list/over-time-level',
        access: 'config-list:over-time-level',
        wrappers: ['@/wrappers/withKeepLive'],
      },
      {
        path: '/config-list/operation-flow',
        name: 'operation-flow',
        access: 'config-list:operation-flow',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/config-list/operation-flow',
            name: 'operation-flow',
            component: './config-list/operation-flow',
            exact: true,
            access: 'config-list:operation-flow',
            wrappers: ['@/wrappers/withKeepLive'],
          },
          {
            path: '/config-list/operation-flow/flow-map',
            name: 'flow-map',
            access: 'config-list:operation-flow:flow-map',
            component: './config-list/flow-map',
          },
        ],
      },
      {
        path: '/config-list/node-timer-flow',
        name: 'node-timer-flow',
        component: './config-list/node-timer-flow',
        access: 'config-list:node-timer-flow',
        wrappers: ['@/wrappers/withKeepLive'],
      },
    ],
  },
  {
    path: '/list',
    name: 'list',
    icon: 'table',
    // access: 'list',
    routes: [
      {
        path: '/list/base-time-list',
        name: 'base-time-list',
        component: './list/base-time-list',
        access: 'list:base-time-list',
        wrappers: ['@/wrappers/withKeepLive'],
      },
      {
        path: '/list/base-show-list',
        name: 'base-show-list',
        component: './list/base-show-list',
        access: 'list:base-show-list',
        wrappers: ['@/wrappers/withKeepLive'],
      },
      {
        path: '/list/base-show-list-b',
        name: 'base-show-list-b',
        component: './list/base-show-list-b',
        access: 'list:base-show-list-b',
        wrappers: ['@/wrappers/withKeepLive'],
      },
      {
        path: '/list/base-show-list-r',
        name: 'base-show-list-r',
        component: './list/base-show-list-r',
        access: 'list:base-show-list-r',
        wrappers: ['@/wrappers/withKeepLive'],
      },
      {
        path: '/list/base-show-list-r-b',
        name: 'base-show-list-r-b',
        component: './list/base-show-list-r-b',
        access: 'list:base-show-list-r-b',
        wrappers: ['@/wrappers/withKeepLive'],
      },
      {
        path: '/list/base-show-list-no',
        name: 'base-show-list-no',
        component: './list/base-show-list-no',
        access: 'list:base-show-list-no',
        wrappers: ['@/wrappers/withKeepLive'],
      },
      // {
      //   path: '/list/base-report-forms',
      //   name: 'base-report-forms',
      //   component: './list/base-report-forms',
      //   access: 'list:base-report-forms',
      //   wrappers: ['@/wrappers/withKeepLive'],
      // },
      {
        path: '/list/base-node-time-list',
        name: 'base-node-time-list',
        component: './list/base-node-time-list',
        access: 'list:base-node-time-list',
        wrappers: ['@/wrappers/withKeepLive'],
      },
      {
        path: '/list/mofc-sure-list',
        name: 'mofc-sure-list',
        component: './list/mofc-sure-list',
        access: 'list:mofc-sure-list',
        wrappers: ['@/wrappers/withKeepLive'],
      },
      {
        path: '/list/uso-mofc-dz-list',
        name: 'uso-mofc-dz-list',
        component: './list/uso-mofc-dz-list',
        access: 'list:uso-mofc-dz-list',
        wrappers: ['@/wrappers/withKeepLive'],
      },
      {
        layout: false,
        hideInMenu: true,
        path: '/list/base-show',
        name: 'base-show',
        component: './list/base-show',
      },
    ],
  },
  {
    path: '/account',
    name: 'account',
    icon: 'crown',
    access: 'account',
    routes: [
      {
        path: '/account/account-management',
        name: 'account-management',
        component: './account/account-management',
        access: 'account:account-management',
        wrappers: ['@/wrappers/withKeepLive'],
      },
      {
        path: '/account/role-management',
        name: 'role-management',
        component: './account/role-management',
        access: 'account:role-management',
        wrappers: ['@/wrappers/withKeepLive'],
      },
      {
        path: '/account/right-management',
        name: 'right-management',
        component: './account/right-management',
        access: 'account:right-management',
        wrappers: ['@/wrappers/withKeepLive'],
      },
    ],
  },
  {
    path: '/monitor',
    name: 'monitor',
    icon: 'appstore',
    access: 'monitor',
    routes: [
      {
        path: '/monitor/interface-list',
        name: 'interface-list',
        component: './monitor/interface-list',
        access: 'monitor:interface-list',
        wrappers: ['@/wrappers/withKeepLive'],
      },
      {
        path: '/monitor/base-list',
        name: 'base-list',
        component: './monitor/base-list',
        access: 'monitor:base-list',
        wrappers: ['@/wrappers/withKeepLive'],
      },
      {
        path: '/monitor/table-list',
        name: 'table-list',
        component: './monitor/table-list',
        access: 'monitor:table-list',
        wrappers: ['@/wrappers/withKeepLive'],
      },
    ],
  },
  {
    path: 'others',
    name: 'others',
    layout: false,
    hideInMenu: true,
    routes: [
      {
        path: '/others/base-show-list-b',
        name: 'base-show-list-b',
        component: './list/base-show-list-b',
      },
      {
        // layout: false,
        // hideInMenu: true,
        path: '/others/base-show',
        name: 'base-show',
        component: './list/base-show',
      },
    ],
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
