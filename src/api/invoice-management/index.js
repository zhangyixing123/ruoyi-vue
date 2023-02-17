import request from '@/utils/request'

// 销项合同 - 分页列表
export function contractApi(data) {
  return request({
    url: '/cls/msx/app/sales-contract/listPage',
    method: 'post',
    data,
  })
}
// 销项合同 - 新增
export function contractAddApi(data) {
  return request({
    url: '/cls/msx/app/sales-contract/add',
    method: 'post',
    data,
  })
}
// 销项合同 - 删除
export function contractDeleteApi(seqNo) {
  return request({
    url: `/cls/msx/app/sales-contract/delete/${seqNo}`,
    method: 'post',
  })
}
// 销项合同 - 详情
export function contractDetailApi(seqNo) {
  return request({
    url: `/cls/msx/app/sales-contract/detail/${seqNo}`,
    method: 'get',
  })
}
// 销项合同 - 导出
export function contractExportApi(data) {
  return request({
    url: '/cls/msx/app/sales-contract/export',
    method: 'post',
    data,
  })
}
// 销项合同 - 修改
export function contractUploadApi(data) {
  return request({
    url: '/cls/msx/app/sales-contract/update',
    method: 'post',
    data,
  })
}
//销项合同-文件
export function voucherApi(seqNo) {
  return request({
    url: `/cls/msx/app/sales-contract/${seqNo}/voucher`,
    method: 'get',
  })
}
// 销项合同-导出
export function exportContractApi(data) {
  return request({
    url: '/cls/msx/app/sales-contract/export',
    method: 'post',
    data,
    responseType: 'blob',
  })
}

// 销项发票 - 分页列表
export function invoiceApi(data) {
  return request({
    url: '/cls/msx/app/output/invoice/listPage',
    method: 'post',
    data,
  })
}
// 销项发票-导出
export function exportInvoiceApi(data) {
  return request({
    url: '/cls/msx/app/output/invoice/export',
    method: 'post',
    data,
    responseType: 'blob',
  })
}
//销项发票-获取导入模板
export function getImportTemplateApi() {
  return request({
    url: '/cls/msx/app/output/invoice/getImportTemplate',
    method: 'get',
    responseType: 'blob',
  })
}
// 销项发票-新增
export function invoiceAddApi(data) {
  return request({
    url: '/cls/msx/app/output/invoice/add',
    method: 'post',
    data,
  })
}
// 销项发票-删除
export function invoiceDeleteApi(data) {
  return request({
    url: '/cls/msx/app/output/invoice/delete',
    method: 'post',
    params: data,
  })
}
// 销项发票-获取详情
export function invoiceDetailsApi(data) {
  return request({
    url: '/cls/msx/app/output/invoice/getById',
    method: 'post',
    params: data,
  })
}
// 销项发票-导入
export function invoiceImportApi(data) {
  return request({
    url: '/cls/msx/app/output/invoice/importData',
    method: 'post',
    data: data.formData,
    params: data.supply,
  })
}
// 销项发票-修改
export function invoiceUploadApi(data) {
  return request({
    url: '/cls/msx/app/output/invoice/update',
    method: 'post',
    data,
  })
}
