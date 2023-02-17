export default [
  {
    name: 'MoneyRaiseManagement',
    path: '/money-raise-management',
    component: 'Layout',
    redirect: 'noRedirect',
    alwaysShow: true,
    meta: {
      title: '融资管理',
      icon: 'system',
      noCache: false,
    },
    children: [
      {
        name: 'MoneyRaiseList',
        path: '/money-raise-list',
        component: 'money-raise-management/money-raise-list',
        meta: {
          title: '融资列表',
          noCache: false,
          // showTagsView: true
        },
      },
      {
        name: 'MoneyRaiseApproveList',
        path: '/money-raise-approve-list',
        component: 'money-raise-management/money-raise-approve-list',
        meta: {
          title: '主动还款记录',
          noCache: false,
          // showTagsView: true
        },
      },
    ],
  },
]
