// 融资申请记录接口
import request from '@/utils/request'
// 民商信 融资申请记录接口    0：询价记录  1：申请中 2 融资进度
export function listFnApplPageType(data) {
  return request({
    url: `/cls/msx/app/financing/listFnApplPageType?queryType=${data.queryType}`,
    method: 'post',
    data: data.query,
  })
}

// 民商信 融资申请记录接口   申请中   审核接口
export function financingCheck(data) {
  return request({
    url: `/cls/msx/app/financing/financingCheck`,
    method: 'post',
    data,
  })
}

// 民商信 融资申请记录接口   申请中   发起提款接口
export function startWithdraw(data) {
  return request({
    url: `/cls/msx/app/financing/startWithdraw`,
    method: 'post',
    data,
  })
}
// 民商信 融资进度 导出
export function exportFinance(data) {
  return request({
    url: `/cls/msx/app/financing/exportFinance`,
    method: 'post',
    data,
    responseType: 'blob',
  })
}
// 民商信 融资进度 刷新放款状态
export function queryOneLoanStatus(data) {
  return request({
    url: `/cls/msx/app/financing/queryOneLoanStatus`,
    method: 'post',
    params: data,
  })
}
