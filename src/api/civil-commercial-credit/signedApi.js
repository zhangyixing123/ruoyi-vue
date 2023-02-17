import request from '@/utils/request'

// 民商信 待签收记录
export function listSinRecordPage(data) {
  return request({
    url: '/cls/msx/app/transfer/listSinRecordPage',
    method: 'post',
    data,
  })
}

// 民商信  确认/拒绝签收
export function handleSign(data) {
  return request({
    url: '/cls/msx/app/transfer/sign',
    method: 'post',
    data,
  })
}

export function previewContractByTemplateCodeApi(data) {
  return request({
    url: `/cls/contract/app/contract/file/preView/${data.templateCode}`,
    method: 'get',
  })
}

// 获取文件下载地址
export function getContractPDFUrlApi(data) {
  return request({
    method: 'get',
    url: `/cls/contract/app/contract/file/downloadPDF/${data}`,
    responseType: 'blob',
  })
}
