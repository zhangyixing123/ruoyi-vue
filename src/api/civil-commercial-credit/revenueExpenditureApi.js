import request from '@/utils/request'

// 民商信 收支记录列表    已支付    支付失败
export function listFlowRecordPage(data) {
  return request({
    url: '/cls/msx/app/transfer/listFlowRecordPage',
    method: 'post',
    data,
  })
}
// 民商信 收支记录列表    已支付导出
export function exportListFlowRecord(data) {
  return request({
    url: '/cls/msx/app/transfer/exportListFlowRecord',
    method: 'post',
    data,
    responseType: 'blob',
  })
}
// 民商信 收支记录列表    支付失败导出
export function exportOpenRecord(data) {
  return request({
    url: '/cls/msx/app/transfer/exportFlowRecordList',
    method: 'post',
    data,
    responseType: 'blob',
  })
}
// 民商信 收支记录列表    可用  已到期列表
export function listBalanceRecordPage(data) {
  return request({
    url: '/cls/msx/app/transfer/listBalanceRecordPage',
    method: 'post',
    data,
  })
}

// 民商信 收支记录列表    可用列表导出
export function exportUsableList(data) {
  return request({
    url: '/cls/msx/app/transfer/exportUsableList',
    method: 'post',
    data,
    responseType: 'blob',
  })
}

// 民商信 收支记录列表 可用列表  余额变动记录列表
export function listMoneyRecordPage(data) {
  return request({
    url: '/cls/msx/app/transfer/listMoneyRecordPage',
    method: 'post',
    data,
  })
}

// 民商信 收支记录列表   支付中
export function listPayingRecordPage(data) {
  return request({
    url: '/cls/msx/app/transfer/listPayingRecordPage',
    method: 'post',
    data,
  })
}
// 民商信 收支记录列表  可用列表--支付
export function transferMsx(data) {
  return request({
    url: '/cls/msx/app/transfer/transferMsx',
    method: 'post',
    data,
  })
}

// 审核人确认
export function transferAudit(data) {
  return request({
    url: '/cls/msx/app/transfer/transferAduit',
    method: 'post',
    data,
  })
}

// 到期列表导出
export function exportExpireList(data) {
  return request({
    url: '/cls/msx/app/transfer/exportExpireList',
    method: 'post',
    data,
    responseType: 'blob',
  })
}
// 到期列表导出
export function paidDetail(data) {
  return request({
    url: '/cls/msx/app/transfer/paidDetail',
    method: 'post',
    data,
  })
}
// 民商信 收支记录列表   原始
export function originalList(data) {
  return request({
    url: '/cls/msx/app/transfer/listSinRecordPage',
    method: 'post',
    data,
  })
}
// 民商信 收支记录列表   原始导出
export function exportOriginalList(data) {
  return request({
    url: '/cls/msx/app/transfer/exportOriginalList',
    method: 'post',
    data,
    responseType: 'blob',
  })
}

// 接收方列表   供应商列表
export function acceptorList(data) {
  return request({
    url: '/cls/passport/app/enterprise/enterpriseList',
    method: 'post',
    data,
  })
}
