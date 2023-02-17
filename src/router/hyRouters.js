export default [
  {
    name: 'civil-commercial-credit',
    path: '/lcivil-commercial-credit',
    component: 'Layout',
    redirect: 'noRedirect',
    alwaysShow: true,
    meta: {
      title: '民商信',
      icon: 'dashboard',
      noCache: false,
    },
    children: [
      {
        name: 'index',
        path: 'index',
        component: 'civil-commercial-credit/index/index',
        meta: {
          title: '民商信首页',
          noCache: false,
          showTagsView: true,
        },
      },
      {
        name: 'signed',
        path: 'signed',
        component: 'civil-commercial-credit/signed/signedLog',
        meta: {
          title: '待签收记录',
          noCache: false,
          showTagsView: true,
        },
      },
      {
        name: 'revenueExpenditure',
        path: 'revenueExpenditure',
        component: 'civil-commercial-credit/revenueExpenditure/revenueExpenditureLog',
        meta: {
          title: '收支记录',
          noCache: false,
          showTagsView: true,
        },
      },
      {
        name: 'financingApplicationRecord',
        path: 'financingApplicationRecord',
        component: 'civil-commercial-credit/financingApplicationRecord/index',
        meta: {
          title: '融资申请记录',
          noCache: false,
          showTagsView: true,
        },
      },
      {
        name: 'financing',
        path: 'financing',
        component: 'civil-commercial-credit/financingApplicationRecord/financing',
        hidden: true,
        meta: {
          title: '融资申请',
          noCache: false,
          showTagsView: false,
        },
      },
      {
        name: 'relation',
        path: 'relation',
        component: 'civil-commercial-credit/financingApplicationRecord/relation',
        hidden: true,
        meta: {
          title: '关联发票合同',
          noCache: false,
          showTagsView: false,
        },
      },
      {
        name: 'financingConfirmation',
        path: 'financingConfirmation',
        component: 'civil-commercial-credit/financingApplicationRecord/financingConfirmation',
        hidden: true,
        meta: {
          title: '融资申请确认',
          noCache: false,
          showTagsView: false,
        },
      },
      {
        name: 'downloadCenter',
        path: 'downloadCenter',
        component: 'civil-commercial-credit/downloadCenter/index',
        meta: {
          title: '下载中心',
          noCache: false,
          showTagsView: true,
        },
      },
      {
        name: 'openCreditApplication',
        path: 'openCreditApplication',
        component: 'civil-commercial-credit/openCreditApplication/index',
        meta: {
          title: '民商信开立',
          noCache: false,
          showTagsView: true,
        },
      },
      {
        name: 'establishTradeRelations',
        path: 'establishTradeRelations',
        component: 'civil-commercial-credit/establishTradeRelations/index',
        meta: {
          title: '贸易关系的建立',
          noCache: false,
          showTagsView: true,
        },
      },
      {
        name: 'rollOverRecord',
        path: 'rollOverRecord',
        component: 'civil-commercial-credit/rollOverRecord/index',
        meta: {
          title: '展期记录',
          noCache: false,
          showTagsView: true,
        },
      },
      {
        name: 'rollOverCollectionDetail',
        path: 'rollOverCollectionDetail',
        component: 'civil-commercial-credit/rollOverCollectionDetail/index',
        meta: {
          title: '展期收款明细',
          noCache: false,
          showTagsView: true,
        },
      },
    ],
  },
]
