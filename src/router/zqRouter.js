export default [
  {
    name: 'UserCenter',
    path: '/user-center',
    component: 'Layout',
    redirect: 'noRedirect',
    alwaysShow: true,
    meta: {
      title: '用户中心',
      icon: 'system',
      noCache: false,
    },
    children: [
      {
        name: 'BasicInfo',
        path: 'basic-info',
        component: 'user-center/basic-info',
        meta: {
          title: '基本信息',
          noCache: false,
          // showTagsView: true
        },
      },
      {
        name: 'CertificationInfo',
        path: 'certification-info',
        component: 'user-center/certification-info',
        meta: {
          title: '认证信息',
          noCache: false,
          // showTagsView: true
        },
      },
      {
        name: 'ChangePhone',
        path: 'change-phone',
        component: 'user-center/change-phone',
        meta: {
          title: '修改手机号',
          noCache: false,
          // showTagsView: true
        },
      },
      // {
      //   name: 'ChangePwd',
      //   path: 'change-pwd',
      //   component: 'user-center/change-pwd',
      //   meta: {
      //     title: '修改密码',
      //     noCache: false,
      //     // showTagsView: true
      //   },
      // },
    ],
  },
]
