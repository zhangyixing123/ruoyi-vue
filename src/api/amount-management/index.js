import request from '@/utils/request'

// 账户管理 查询账户信息
export function enterpriseAccountListApi(data) {
  return request({
    url: '/cls/account/app/account/enterpriseAccountList',
    method: 'post',
    data,
  })
}

// 账户管理 查询转出记录
export function getTransferRecordApi(data) {
  return request({
    url: '/cls/account/app/account/getTransferRecord',
    method: 'post',
    data,
  })
}

// 账户管理 转出申请
export function transferOutApplyApi(data) {
  return request({
    url: '/cls/account/app/account/transferOutApply',
    method: 'post',
    data,
  })
}

// 账户管理 查询转出审批列表
export function getTransferApproveListApi(data) {
  return request({
    url: '/cls/account/app/account/getTransferApproveList',
    method: 'post',
    data,
  })
}

// 账户管理 查询交易明细
export function getTransactionDetailApi(data) {
  return request({
    url: '/cls/account/app/account/getTransactionDetail',
    method: 'post',
    data,
  })
}

// 账户管理 充值申请
export function rechargeApplyApi(data) {
  return request({
    url: '/cls/account/app/account/open/rechargeApply',
    method: 'post',
    data,
  })
}

// 账户管理 充值记录
export function rechargeRecordApi(data) {
  return request({
    url: '/cls/account/app/account/open/rechargeRecord',
    method: 'post',
    data,
  })
}

// 账户管理 充值详情
export function rechargeDetailApi(data) {
  return request({
    url: '/cls/account/app/account/recharge/rechargeDetail',
    method: 'post',
    data,
  })
}

// 账户管理 设置默认收款卡
export function setDefaultAccountApi(data) {
  return request({
    url: '/cls/account/app/account/open/setDefaultAccount',
    method: 'post',
    data,
  })
}

// 账户管理 开通现金管理账户
export function capitalAccountApi(data) {
  return request({
    url: '/cls/account/app/account/open/capitalAccount',
    method: 'post',
    data,
  })
}

// 账户管理 查询企业收款放款卡
export function getEnterpriseAccountApi(data) {
  return request({
    url: '/cls/account/app/account/getEnterpriseAccount',
    method: 'post',
    data,
  })
}

// 账户管理 转出审批
export function transferOutApproveApi(data) {
  return request({
    url: '/cls/account/app/account/transferOutApprove',
    method: 'post',
    data,
  })
}

// 账户管理 查询转出详情
export function transferOutDetailApi(data) {
  return request({
    url: '/cls/account/app/account/transferOutDetail',
    method: 'post',
    params: data,
  })
}

// 银行账户管理 -绑定外部户接口 --第一步   绑定外部户
export function bindOuterAccountApi(data) {
  return request({
    url: '/cls/account/app/account/out/bindOuterAccount',
    method: 'post',
    data,
  })
}
// 银行账户管理 -绑定外部户接口 --第二步   查询外部户信息
export function queryOuterAccountInfoApi(data) {
  return request({
    url: '/cls/account/app/account/out/queryOuterAccountInfo',
    method: 'post',
    data,
  })
}
// 银行账户管理 -绑定外部户接口 --第三步   协议签署
export function contractSignMq(data) {
  return request({
    url: '/cls/account/app/account/out/contractSignMq',
    method: 'post',
    data,
  })
}

// 用户中心的协议
// 获取协议
export function getAgreement(data) {
  return request({
    method: 'post',
    url: '/cls/passport/app/data/getDataDict',
    data,
  })
}

// 银行账户管理 -绑定外部户接口 --第三步  获取协议内容
// 获取协议
export function accountGetDataDict(data) {
  return request({
    method: 'post',
    url: '/cls/account/app/data/getDataDict',
    data,
  })
}

// 根据协议code 获取协议内容
export function previewContractByTemplateCodeApi(data) {
  return request({
    url: `/cls/contract/app/contract/file/preView/${data.templateCode}`,
    method: 'get',
  })
}

// 根据协议code 获取协议内容
export function previewLoginContractByTemplateCodeApi(data) {
  return request({
    url: `/cls/contract/app/contract/file/preViewLogin/${data.templateCode}`,
    method: 'get',
  })
}

// 账户管理 查询转出信息
export function getTransferAccountApi(data) {
  return request({
    url: '/cls/account/app/data/getTransferAccount',
    method: 'post',
    data,
  })
}

// 根据type获取code
export function getDataDictApi(data) {
  return request({
    url: '/cls/passport/app/data/getDataDict',
    method: 'post',
    data,
  })
}

// 查询用户对公账户
export function listCapitalAccountApi(data) {
  return request({
    url: '/cls/account/app/account/listCapitalAccount',
    method: 'post',
    data,
  })
}
// 查询用户电子账户
export function getFictitiousAccountListApi(data) {
  return request({
    url: '/cls/account/app/account/getFictitiousAccountList',
    method: 'post',
    data,
  })
}
// 查询电子户详情
export function getFictitiousAccountDetailApi(data) {
  return request({
    url: '/cls/account/app/account/getFictitiousAccount',
    method: 'post',
    data,
  })
}
// 账户中心-开通现金管理账户
export function saveAccountApi(data) {
  return request({
    url: '/cls/account/app/account/open/saveAccount',
    method: 'post',
    data,
  })
}
// 账户中心-小额鉴权
export function fundPennyVerifyApi(data) {
  return request({
    url: '/cls/account/app/account/open/fundPennyVerify',
    method: 'post',
    data,
  })
}

export function accountTranHistoryQueryApi(data) {
  return request({
    url: '/cls/account/app/account/accountTranHistoryQuery',
    method: 'post',
    data,
  })
}
// 查询余额
export function accountBalanceQueryApi(data) {
  return request({
    url: '/cls/account/app/account/accountBalanceQuery',
    method: 'post',
    data,
  })
}
