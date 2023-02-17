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
      // {
      //   name: 'bank-account-manage',
      //   path: 'bank-account-manage',
      //   component: 'bank-account-manage/index',
      //   meta: {
      //     title: '银行账户管理',
      //     noCache: true,
      //   },
      // },
      {
        name: 'open-account',
        path: 'open-account',
        component: 'bank-account-manage/open-account',
        hidden: true,
        meta: {
          title: '开通现金管理账户',
          noCache: true,
        },
      },
      {
        name: 'out-account',
        path: 'out-account',
        component: 'bank-account-manage/out-account',
        hidden: true,
        meta: {
          title: '绑定外部账户',
          noCache: true,
        },
      },
      {
        name: 'account-detail',
        path: 'account-detail',
        component: 'bank-account-manage/account-detail',
        hidden: false,
        meta: {
          title: '账户详情',
          noCache: true,
        },
      },
    ],
  },
  {
    name: 'bills-manage',
    path: '/bills-manage',
    component: 'Layout',
    redirect: 'noRedirect',
    alwaysShow: true,
    meta: {
      title: '单据管理',
      icon: 'dashboard',
      noCache: true,
    },
    children: [
      {
        name: 'bills-manage-invoice',
        path: 'invoice',
        component: 'bills-manage/invoice',
        meta: {
          title: '销项发票',
          noCache: true,
        },
      },
      {
        name: 'bills-manage-contract',
        path: 'contract',
        component: 'bills-manage/contract',
        meta: {
          title: '销售合同',
          noCache: true,
        },
      },
    ],
  },
]
