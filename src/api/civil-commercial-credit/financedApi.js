import request from '@/utils/request'

// 供应商-收支记录--已融资列表接口
export function listFnApplPagesApi(data) {
  return request({
    url: '/cls/msx/app/financing/listFnApplPages',
    method: 'post',
    data,
  })
}

// 供应商-收支记录--已融资列表-导出
export function financingexportRecordsApi(data) {
  return request({
    url: '/cls/msx/app/financing/exportRecords',
    responseType: 'blob',
    method: 'POST',
    data,
  })
}

// 供应商-收支记录--已融资列表-查看详情
export function fnApplDetailsApi(data) {
  return request({
    url: '/cls/msx/app/financing/fnApplDetails',
    method: 'POST',
    data,
  })
}
