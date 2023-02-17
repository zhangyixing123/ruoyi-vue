export default [
  // 企业用户
  //   {
  //     name: "enterprise-user",
  //     path: "/enterprise-user",
  //     component: "Layout",
  //     redirect: "noRedirect",
  //     alwaysShow: true,
  //     meta: {
  //       title: "企业信息管理",
  //       icon: "system",
  //       noCache: false
  //     },
  //     children: [
  //       {
  //         name: "User-management",
  //         path: "user-management",
  //         component: "enterprise-user/user-management/index",
  //         meta: {
  //           title: "用户管理",
  //           noCache: false
  //         }
  //       },
  //       {
  //         name: "Ukey-adjustment",
  //         path: "ukey-adjustment",
  //         component: "enterprise-user/ukey-information/adjustUKey",
  //         meta: {
  //           title: "ukey调整",
  //           noCache: false
  //         },
  //         hidden: true
  //       },
  //       {
  //         name: "Ukey-information",
  //         path: "ukey-information",
  //         component: "enterprise-user/ukey-information/index",
  //         meta: {
  //           title: "Ukey信息",
  //           noCache: false
  //         }
  //       },
  //       {
  //         name: "enterprise-information",
  //         path: "enterprise-information",
  //         component: "enterprise-user/enterprise-information/index_1",
  //         meta: {
  //           title: "企业基本信息",
  //           noCache: false
  //         }
  //       }
  //     ]
  //   },
  // 我的任务
  {
    name: "task",
    path: "/task",
    component: "Layout",
    redirect: "noRedirect",
    alwaysShow: true,
    meta: {
      title: "我的任务",
      icon: "system",
      noCache: false
    },
    children: [
      {
        name: "Todo-task",
        path: "todo-task",
        component: "task/todo-task",
        meta: {
          title: "待办任务",
          noCache: false
        }
      },
      {
        name: "Done-task",
        path: "done-task",
        component: "task/done-task",
        meta: {
          title: "已办任务",
          noCache: false
        }
      }
    ]
  }
];
