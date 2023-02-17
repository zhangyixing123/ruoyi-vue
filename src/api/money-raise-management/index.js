import request from '@/utils/request'

// 获取字典数据
export function querySComCodeApi(comType) {
  return request({
    url: `/cls/bill/app/supplier/querySComCode/type/${comType}`,
    method: 'get',
  })
}
// 账单管理-账单分页列表
export function getBillListApi(data) {
  return request({
    url: '/cls/bill/app/supplier/bill/list',
    method: 'post',
    data,
  })
}

// 账单管理-数据授权结果查询
export function dataAuthResult(data) {
  return request({
    url: '/cls/bill/app/supplier/bill/dataAuth/result',
    method: 'post',
    data: data,
  })
}

// 账单管理-授权账单协议预览
export function dataAuthProtocolPreview() {
  return request({
    url: '/cls/bill/app/supplier/bill/dataAuth/preview',
    method: 'post',
  })
}

// 账单管理-授权账单协议同意授权
export function dataAuthProtocolSign() {
  return request({
    url: '/cls/bill/app/supplier/bill/dataAuth/sign',
    method: 'post',
  })
}

// 账单管理-同步账单
export function importBillsApi(data) {
  return request({
    url: '/cls/bill/app/supplier/bills/import',
    method: 'post',
    data,
  })
}
// 账单管理-详情
export function getBillDetailsApi(seqNo) {
  return request({
    url: `/cls/bill/app/supplier/bill/${seqNo}`,
    method: 'post',
  })
}
// 账单管理-文件列表
export function billDetailsAttachApi(data) {
  return request({
    url: `/cls/bill/app/supplier/voucher/list`,
    method: 'post',
    data,
  })
}
// 账单管理-订单列表
export function getOrderListApi(data) {
  return request({
    url: '/cls/bill/app/supplier/order/list',
    method: 'post',
    data,
  })
}
// 上传获取fileId
export function uploadFileApi(data) {
  return request({
    url: '/cls/bill/app/supplier/voucher/upload',
    method: 'post',
    data,
  })
}
// 账单管理-添加添加凭证记录
export function voucherAddApi(data) {
  return request({
    url: '/cls/bill/app/supplier/voucher/add',
    method: 'post',
    data,
  })
}
// 账单管理-账单跟踪记录
export function billsTraceListApi(data) {
  return request({
    url: '/cls/bill/app/supplier/billsTrace/list',
    method: 'post',
    data,
  })
}
// 凭证管理-批量添加凭证记录
export function batchInsertApi(data) {
  return request({
    url: '/cls/bill/app/supplier/voucher/batchInsert',
    method: 'post',
    data,
  })
}
// 账单管理-查看凭证
export function previewFileApi(data) {
  return request({
    url: '/cls/bill/app/supplier/voucher/preview',
    method: 'get',
    params: data,
    responseType: 'blob',
  })
}
// 账单管理-下载凭证
export function downloadFileApi(data) {
  return request({
    url: '/cls/bill/app/supplier/voucher/download',
    method: 'get',
    params: data,
    responseType: 'blob',
  })
}
// 账单管理-凭证管理-凭证批量下载(逗号分隔)
export function batchDownloadFileApi(data) {
  return request({
    url: `/cls/bill/app/supplier/voucher/batchDownload?${data}`,
    method: 'get',
    responseType: 'blob',
  })
}
// 账单管理-删除凭证
export function deleteFileApi(id) {
  return request({
    url: `/cls/bill/app/supplier/voucher/delete/${id}`,
    method: 'post',
  })
}
// 账单管理-融资申请预授信
export function creditPreApi(data) {
  return request({
    url: '/cls/credit/app/credit/bill/pre',
    method: 'post',
    data,
  })
}

// 融资管理-融资申请查看合同
export function getTempCodeApi(data) {
  return request({
    url: '/cls/core/app/product/getTempCode',
    method: 'post',
    data,
  })
}

//融资管理-融资前确认信息
export function preFinanceInfoConfirmApi(data) {
  return request({
    url: '/cls/bill/app/supplier/bill/preFinanceInfoConfirm',
    method: 'post',
    params: data,
  })
}
// 申请融资
export function financialApi(data) {
  return request({
    url: '/cls/bill/app/supplier/bill/financial',
    method: 'post',
    data,
  })
}
// 根据企业id获取法人信息
export function getEntAndLegalInfoByIdApi(data) {
  return request({
    url: '/cls/passport/app/enterprise/info/getEntAndLegalInfoById',
    method: 'post',
    params: data,
  })
}

// 获取法人刷脸的token
export function legalFaceTokenApi(data) {
  return request({
    url: '/cls/passport/app/creditFace/getLegalFaceToken',
    method: 'post',
    data,
  })
}
// 取消融资
export function financeCancelApi(seqNo) {
  return request({
    url: `/cls/bill/app/supplier/bill/financeCancel/${seqNo}`,
    method: 'get',
  })
}
// 获取融资列表
export function getListPage(data) {
  return request({
    url: '/cls/bill/app/supplier/bill/financeOrders',
    method: 'post',
    data,
  })
}
// 融资管理-详情
export function getFinanceDetailsApi(seqNo) {
  return request({
    url: `/cls/bill/app/supplier/bill/financeOrders/detail/${seqNo}`,
    method: 'get',
  })
}

// 融资管理-融资订单还款计划
export function getPlanApi(seqNo) {
  return request({
    url: `/cls/bill/app/supplier/bill/financeOrder/plan/${seqNo}`,
    method: 'get',
  })
}

// 主动还款详情

export function voluntaryRepayDetail(data) {
  return request({
    method: 'post',
    url: `/cls/bill/app/supplier/bill/repay/queryLoanInfo/${data.loanNo}`,
  })
}

// 试算接口
export function repayTrial(data) {
  return request({
    method: 'post',
    url: '/cls/bill/app/supplier/bill/repay/trial',
    data,
  })
}

// 获取融资审批列表
export function getMoneyRaiseApproveList(data) {
  return request({
    url: '/cls/bill/app/supplier/bill/repay/record/query',
    method: 'post',
    data,
  })
}

// 获取融资审批列表
export function repayFinanceApprove(data) {
  return request({
    url: '/cls/bill/app/supplier/bill/repay/audit',
    method: 'post',
    data,
  })
}

// 获取银行卡列表
export function getBankList() {
  return request({
    method: 'post',
    url: '/cls/bill/app/repay/getBankList',
  })
}

// 账单列表
export function getBillList(data) {
  return request({
    method: 'post',
    url: '/cls/bill/app/tbBills/list',
    data,
  })
}

// 主动还款保存
export function saveApply(data) {
  return request({
    method: 'post',
    url: '/cls/bill/app/supplier/bill/repay/save',
    data,
  })
}

// 融资管理-申请放款前确认
export function preApplyLoanConfirmApi(seqNo) {
  return request({
    url: `/cls/bill/app/supplier/bill/preApplyLoanConfirm/${seqNo}`,
    method: 'get',
  })
}
// 融资管理-申请放款前手续费试算
export function feeTrialApi(data) {
  return request({
    url: `/cls/bill/app/supplier/bill/preApplyLoanConfirm/feeTrial`,
    method: 'post',
    data,
  })
}
// 融资管理-申请放款
export function applyLoanApi(data) {
  return request({
    url: `/cls/bill/app/supplier/bill/applyLoan`,
    method: 'post',
    data,
  })
}
// 融资管理-确认放款前确认
export function preLoanConfirmApi(seqNo) {
  return request({
    url: `/cls/bill/app/supplier/bill/preLoanConfirm/${seqNo}`,
    method: 'get',
  })
}
// 融资管理-确认放款
export function loanDowmApi(seqNo) {
  return request({
    url: `/cls/bill/app/supplier/bill/loanDowm/${seqNo}`,
    method: 'get',
  })
}
// 融资管理-确认放款预览合同
export function loanContractApi(code, version, seqNo) {
  return request({
    method: 'get',
    url: `/cls/bill/app/supplier/preView/${code}/${version}/${seqNo}`,
  })
}
// 融资管理-再次申请融资
export function reFinancialApi(seqNo) {
  return request({
    url: `/cls/bill/app/supplier/bill/reFinancial/${seqNo}`,
    method: 'get',
  })
}
// 融资管理-获取缴费收款账户
export function shoukuanAccountApi(financeNo) {
  return request({
    url: `/cls/bill/app/supplier/bill/shoukuanAccount/${financeNo}`,
    method: 'get',
  })
}
// 融资管理-再次申请放款
export function reLoanDowmApi(seqNo) {
  return request({
    url: `/cls/bill/app/supplier/bill/reLoanDowm/${seqNo}`,
    method: 'get',
  })
}
// 获取所有省市区地址
export function getAreaTreeApi(data) {
  return request({
    method: 'post',
    url: `/cls/passport-personal/app/area/getAreaTree`,
    data,
  })
}
//根据parentCode获取省市区地址
export function passportUserGetAreaApi(parentCode) {
  return request({
    url: `/cls/passport-personal/app/passport/user/get/area`,
    method: 'post',
    data: { parentCode },
  })
}
// 获取银行卡列表
export function getBankListApi(data) {
  return request({
    url: `/cls/passport/app/common/bankList`,
    method: 'post',
    data,
  })
}

// 资质审批-提交认证
export function verifySmsCodeApi(data) {
  return request({
    url: `/cls/passport/app/enterprise/legal/card/verifySmsCode`,
    method: 'post',
    data,
  })
}

// 资质审批-获取验证码
export function bindCardSmsApi(data) {
  return request({
    url: `/cls/passport/app/enterprise/legal/card/bindCardSms`,
    method: 'post',
    data,
  })
}

// 申请放款-获取手机号
export function getPhoneNumber(data) {
  return request({
    url: `/cls/bill/app/supplier/bills/getPhoneNumber`,
    method: 'post',
    data: data,
  })
}
// 申请放款-获取验证码
export function apporveDialogSendAxqCheckCode(data) {
  return request({
    url: `/cls/bill/app/supplier/bills/sendAxqCheckCode`,
    method: 'post',
    data: data,
  })
}

// 申请放款-预览合同
export function viewContractApi(data) {
  return request({
    url: `/cls/bill/app/supplier/bills/viewContract`,
    method: 'post',
    params: data,
    responseType: 'blob',
  })
}
// 合同模板预览 type 2
export function perviewContractTemplateApi(data) {
  return request({
    url: '/cls/contract/app/contract/file/viewAfterSignPdf',
    method: 'get',
    responseType: 'blob',
    params: data,
  })
}
// 获取文件下载地址 type2  type3
export function getContractPDFUrlApi(data) {
  return request({
    method: 'get',
    url: `/cls/contract/app/contract/file/downloadAfterSignPdf`,
    responseType: 'blob',
    params: data,
  })
}
// 合同模板预览 type3
export function viewAfterSignPdfByFileIdApi(data) {
  return request({
    url: '/cls/contract/app/contract/file/viewAfterSignPdfByFileId',
    method: 'get',
    responseType: 'blob',
    params: data,
  })
}

// 申请放款-签署协议
export function confirmAxqCheckCodeApi(data) {
  return request({
    url: `/cls/bill/app/supplier/bills/confirmAxqCheckCode`,
    method: 'post',
    data: data,
  })
}
// 申请放款-判断是否有安心签Id
export function checkAxqUserIdApi(data) {
  return request({
    url: `/cls/bill/app/supplier/bills/checkAxqUserId`,
    method: 'post',
    data: data,
  })
}
// 申请放款-判断是否需要签署协议
export function checkSignPowerApi(data) {
  return request({
    url: `/cls/bill/app/supplier/bills/checkSignPower`,
    method: 'post',
    data: data,
  })
}
