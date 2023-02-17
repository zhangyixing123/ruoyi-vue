import request from '@/utils/request'

// 企业信息管理-用户管理-ukey信息   获取ukey 列表
export function getEnterpriseUkeyList(data) {
  return request({
    url: '/cls/passport/app/enterprise/enterpriseUkeyList',
    method: 'post',
    data,
  })
}

// 新增ukey
export function addUkey(data) {
  return request({
    url: '/cls/passport/app/enterprise/enterpriseUkeyNewly',
    method: 'post',
    data,
  })
}

// 删除ukey
export function deleteUkey(data) {
  return request({
    url: '/cls/passport/app/enterprise/relieveEnterpriseUkey',
    method: 'post',
    params: data,
  })
}

// 上传数字承诺书
export function compareAdd(data) {
  return request({
    url: '/cls/passport/app/enterprise/enterpriseUkeyCommitment',
    method: 'post',
    data,
  })
}
