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
    path: '/list',
    name: 'admin',
    icon: 'crown',
    routes: [
      {
        path: '/list/table-list',
        name: 'table-list',
        icon: 'smile',
        component: './list/table-list',
      },
      {
        path: '/list/config-list',
        name: 'config-list',
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
