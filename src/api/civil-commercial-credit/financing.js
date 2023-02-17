import request from '@/utils/request'

// 供应商校验可融资
export function isFinacingApi(data) {
  return request({
    url: '/cls/msx/app/financing/isFinacing',
    method: 'post',
    params: data,
  })
}
// 查询所有资方接口
export function getMerListApi() {
  return request({
    url: '/cls/msx/app/financing/getMerList',
    method: 'post',
  })
}
// 预选资金方路由接口
export function chooseMerApi(data) {
  return request({
    url: '/cls/msx/app/financing/chooseMer',
    method: 'post',
    params: data,
  })
}
// 民商信的可用金额
export function getAvailableLimitApi(data) {
  return request({
    url: '/cls/msx/app/financing/getAvailableLimit',
    method: 'post',
    params: data,
  })
}
// 民商信-民商信供应商询价接口
export function inquiryApi(data) {
  return request({
    url: '/cls/msx/app/supplier/inquiry',
    method: 'post',
    data,
  })
}
// 供应商-息费详情
export function getFeeInformationApi(data) {
  return request({
    url: '/cls/msx/app/financing/getFeeInformation',
    method: 'post',
    params: data,
  })
}
// 供应商-融资申请提交审批接口
export function financingSubmitApi(data) {
  return request({
    url: '/cls/msx/app/financing/financingSubmit',
    method: 'post',
    data,
  })
}
// 融资关联合同 - 分页列表
export function contractApi(data) {
  return request({
    url: '/cls/msx/app/sales-contract/listPage',
    method: 'post',
    data,
  })
}
//销售合同文件列表
export function voucherApi(seqNo) {
  return request({
    url: `/cls/msx/app/sales-contract/${seqNo}/voucher`,
    method: 'get',
  })
}
// 导出销项合同
export function exportContractApi(data) {
  return request({
    url: '/cls/msx/app/sales-contract/export',
    method: 'post',
    data,
    responseType: 'blob',
  })
}

// 融资关联发票 - 分页列表
export function invoiceApi(data) {
  return request({
    url: '/cls/msx/app/output/invoice/listPage',
    method: 'post',
    data,
  })
}
// 导出销项发票
export function exportInvoiceApi(data) {
  return request({
    url: '/cls/msx/app/output/invoice/export',
    method: 'post',
    data,
    responseType: 'blob',
  })
}

//供应商首页统计-持仓到期分布
export function getHoldSpreadApi(data) {
  return request({
    url: '/cls/msx/app/graphSuppply/getHoldSpread',
    method: 'post',
    params: data,
  })
}
//供应商首页统计-民商信状态分布
export function getSupplyGraphDataApi(data) {
  return request({
    url: '/cls/msx/app/graphSuppply/getStatusSpread',
    method: 'post',
    params: data,
  })
}
// 供应商-开立方分布
export function msxKailfApi(data) {
  return request({
    url: '/cls/msx/app/graphCore/msxKailf',
    method: 'post',
    params: data,
  })
}

// 民商信统计
export function getMsxSumApi(data) {
  return request({
    url: '/cls/msx/app/graphCore/getMsxSum',
    method: 'post',
    params: data,
  })
}
// 首页-应收账款到期分布统计
export function getEndStatisticsApi(data) {
  return request({
    url: '/cls/bill/app/supplier/bill/index/end/statistics',
    method: 'post',
    params: data,
  })
}
// 首页-应收账款状态分布
export function getStatusStatisticsApi(data) {
  return request({
    url: '/cls/bill/app/supplier/bill/index/status/statistics',
    method: 'post',
    params: data,
  })
}
// 首页-应收账款统计
export function getTextStatisticsApi(data) {
  return request({
    url: '/cls/bill/app/supplier/bill/index/text/statistics',
    method: 'post',
    params: data,
  })
}
// 融资申请签署合同
export function contractAgreementApi() {
  return request({
    url: '/cls/msx/app/financing/contractAgreement',
    method: 'post',
  })
}
// 预览合同
export function previewContractApi(data) {
  return request({
    method: 'get',
    url: `/cls/core/app/contract/file/preView/${data}`,
  })
}

//根据企业id获取法人信息
export function getLegalInfoApi(data) {
  return request({
    method: 'post',
    url: `/cls/passport/app/enterprise/info/getEntAndLegalInfoById`,
    params: data,
  })
}
// 更新企业及法人信息
export function updateEntAndLegalInfoApi(data) {
  return request({
    method: 'post',
    url: `/cls/passport/app/enterprise/info/updateEntAndLegalInfoById`,
    data: data,
  })
}
// 资质审批-根据订单编号查询授信信息
export function creditInfoByFinanceNoApi(data) {
  return request({
    method: 'post',
    url: `/cls/credit/app/credit/bill/apply/getCreditInfoByFinanceNo`,
    params: data,
  })
}
// 更新中关村补充信息状态 -- 填写完成后，点击提交
export function updateZgcCompleteStsApi(data) {
  return request({
    method: 'post',
    url: `/cls/credit/app/credit/bill/apply/bill/updateZgcCompleteSts`,
    params: data,
  })
}
// 获取中关村合同签署链接
export function getZgcContractUrlApi(data) {
  return request({
    method: 'post',
    url: `/cls/credit/app/credit/bill/apply/bill/getZgcContractUrl`,
    params: data,
  })
}
// 回更中关村协议签署状态
export function updateZgcSignContractApi(data) {
  return request({
    method: 'post',
    url: `/cls/credit/app/credit/bill/apply/bill/updateZgcSignContractSts`,
    params: data,
  })
}
// 查询授信协议
export function getTempByApplyInfoApi(data) {
  return request({
    method: 'post',
    url: `/cls/credit/app/credit/bill/apply/getTempByApplyInfo`,
    data: data,
  })
}
