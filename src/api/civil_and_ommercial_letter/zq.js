import request from '@/utils/request'

// 民商信-贸易关系列表查询(供应商)
export function tradeRelationListApi(data) {
  return request({
    url: '/cls/msx/app/trade-relation/supplier/list',
    method: 'post',
    data,
  })
}

// 民商信-添加贸易关系(供应商)
export function addTradeRelationApi(data) {
  return request({
    url: '/cls/msx/app/trade-relation',
    method: 'post',
    data,
  })
}

// 民商信-融资关系详情(供应商)
export function financingRelationDetailApi(data) {
  return request({
    url: `/cls/msx/app/trade-relation/${data.seqNo}/financing_relation`,
    method: 'get',
    data,
  })
}

// 民商信-供应商信申请接口
export function msxOpenRecordreditApplyApi(data) {
  return request({
    url: '/cls/msx/app/supplier/open/creditApply',
    method: 'post',
    data,
  })
}

// 民商信-民商信列表
export function listOpenRecordPageApi(data) {
  return request({
    url: '/cls/msx/app/transfer/listApplyRecordPage',
    method: 'post',
    data,
  })
}

// 凭证列表
export function voucherListApi(seqNo) {
  return request({
    url: `/cls/msx/app/trade-relation/${seqNo}/voucher`,
    method: 'get',
  })
}
// 订单列表
export function listOrderPageApi(data) {
  return request({
    url: '/cls/msx/app/transfer/listOrderPage',
    method: 'POST',
    data,
  })
}

// 信开立文件列表
export function listFilePageApi(data) {
  return request({
    url: '/cls/msx/app/transfer/listFilePage',
    method: 'POST',
    data,
  })
}

/** 展期审批列表 */
export function rollOverRecordApi(data) {
  return request({
    url: '/cls/msx/app/supplier/msx/ext/list',
    method: 'POST',
    data,
  })
}

/**展期付款明细 */
export function rollOverPayDetail(data) {
  return request({
    url: `/cls/msx/app/supplier/msx/ext/pay/detail/${data.applySeq}`,
    method: 'POST',
    data,
  })
}

/** 展期审批 */
export function rollOverRecordApproveApi(data) {
  return request({
    url: '/cls/msx/app/supplier/msx/ext/doMsxExtensionApprove',
    method: 'POST',
    data,
  })
}

/**发起清分 */
export function rollOverClean(data) {
  return request({
    url: '/cls/msx/app/supplier/clearRecord/reClear',
    method: 'POST',
    data,
  })
}

/**获取展期账户列表 */

export function getCardList(data) {
  return request({
    url: '/cls/msx/app/supplier/msx/card/list',
    method: 'POST',
    params: data,
  })
}
