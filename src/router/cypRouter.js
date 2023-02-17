export default [
  {
    name: 'company-manage',
    path: '/company-manage',
    component: 'Layout',
    redirect: 'noRedirect',
    alwaysShow: true,
    meta: {
      title: '企业管理',
      icon: 'dashboard',
      noCache: true,
    },
    children: [
      {
        name: 'company-manage-list',
        path: 'company-manage-list',
        component: 'company-manage/company-manage-list',
        meta: {
          title: '企业管理',
          noCache: true,
        },
      },
    ],
  },
]
