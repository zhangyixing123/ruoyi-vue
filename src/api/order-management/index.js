import request from '@/utils/request'

/**
 * 订单管理---订单列表
 * @param {object} data 请求参数
 */
export function getOrderList(data) {
  return request({
    method: 'POST',
    url: '/cls/bill/app/supplier/order/list',
    data,
  })
}

/**
 * 订单管理---订单详情
 * @param {object} data 请求参数
 */
export function getOrderDetail(data) {
  return request({
    method: 'POST',
    url: `/cls/bill/app/supplier/order/${data.seqNo}`,
    data,
  })
}

/**
 * 订单管理---上传凭证
 * @param {object} data 请求参数
 */
export function supplierUpload(data) {
  return request({
    method: 'POST',
    url: `/cls/bill/app/supplier/voucher/upload`,
    data,
  })
}

/**
 * 订单管理---凭证分页列表
 * @param {object} data 请求参数
 */
export function voucherList(data) {
  return request({
    method: 'POST',
    url: `/cls/bill/app/supplier/voucher/list`,
    data,
  })
}

/**
 * 订单管理---凭证下载
 * @param {object} data 请求参数
 */
export function downloadVoucher(data) {
  return request({
    method: 'POST',
    url: `/cls/bill/app/tbVoucherRecord/downloadVoucher`,
    data,
  })
}

/**
 * 订单管理---凭证删除
 * @param {object} data 请求参数
 */
export function voucherDelete(data) {
  return request({
    method: 'POST',
    url: `/cls/bill/app/supplier/voucher/delete/${data.id}`,
    data,
  })
}

/**
 * 订单管理---凭证查看
 * @param {object} data 请求参数
 */
export function voucherPreview(data) {
  return request({
    url: '/cls/bill/app/supplier/voucher/preview',
    method: 'get',
    params: data,
    responseType: 'blob',
  })
}

/**
 * 订单管理---凭证下载
 * @param {object} data 请求参数
 */
export function downloadFileApi(data) {
  return request({
    url: '/cls/bill/app/supplier/voucher/download',
    method: 'get',
    params: data,
    responseType: 'blob',
  })
}
/**
 * 订单管理---凭证批量下载
 * @param {object} data 请求参数
 */
export function batchDownloadFileApi(data) {
  return request({
    url: `/cls/bill/app/supplier/voucher/batchDownload?${data}`,
    method: 'get',
    responseType: 'blob',
  })
}
