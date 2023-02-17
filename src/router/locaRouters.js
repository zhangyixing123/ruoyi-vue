import tools from "./tools";

export default [
  ...tools,
  {
    component: "Layout",
    hidden: false,
    meta: {
      title: "系统管理",
      icon: "system",
      noCache: false
    },
    name: "System",
    path: "/system",
    redirect: "noRedirect",
    alwaysShow: true,
    children: [
      {
        component: "system/user/index",
        hidden: false,
        meta: {
          title: "用户管理",
          // icon: "user",
          noCache: false
        },
        name: "User",
        path: "user"
      },
      {
        component: "system/role/index",
        hidden: false,
        meta: {
          title: "角色管理",
          // icon: "peoples",
          noCache: false
        },
        name: "Role",
        path: "role"
      },
      {
        component: "system/menu/index",
        hidden: false,
        meta: {
          title: "菜单管理",
          // icon: "tree-table",
          noCache: false
        },
        name: "Menu",
        path: "menu"
      },
      {
        component: "system/dept/index",
        hidden: false,
        meta: {
          title: "部门管理",
          // icon: "tree",
          noCache: false
        },
        name: "Dept",
        path: "dept"
      },
      // {
      //     component: "system/post/index",
      //     hidden: false,
      //     meta: {title: "岗位管理", icon: "post", noCache: false},
      //     name: "Post",
      //     path: "post",
      // },
      {
        component: "system/dict/index",
        hidden: false,
        meta: {
          title: "字典管理",
          // icon: "dict",
          noCache: false
        },
        name: "Dict",
        path: "dict"
      },
      {
        component: "system/config/index",
        hidden: false,
        meta: {
          title: "参数设置",
          // icon: "edit",
          noCache: false
        },
        name: "Config",
        path: "config"
      }
    ]
  }
];
