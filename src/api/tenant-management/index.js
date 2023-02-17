import request from '@/utils/request'

// 获取租户列表
export function tenantListApi(data) {
  return request({
    url: '/system/tenant/list',
    method: 'get',
    params: data,
  })
}

// 新增租户
export function tenantAddApi(data) {
  return request({
    url: '/system/tenant/add',
    method: 'post',
    data,
  })
}

// 修改租户
export function tenantEditApi(data) {
  return request({
    url: '/system/tenant/edit',
    method: 'post',
    data,
  })
}

// 失效租户
export function tenantInvalidApi(teanantId) {
  return request({
    url: `/system/tenant/invalid/${teanantId}`,
    method: 'post',
  })
}

// 生效租户
export function tenantValidApi(teanantId) {
  return request({
    url: `/system/tenant/valid/${teanantId}`,
    method: 'post',
  })
}

// 根据编号获取租户
export function tenantDetailsApi(teanantId) {
  return request({
    url: `/system/tenant/${teanantId}`,
    method: 'get',
  })
}

// 删除租户
export function tenantDeleteApi(teanantId) {
  return request({
    url: `/system/tenant/${teanantId}`,
    method: 'delete',
  })
}

// 获取变更记录
export function tenantAuditListApi(teanantId) {
  return request({
    url: `/system/tenant/getAuditList/${teanantId}`,
    method: 'get',
  })
}
//租户套餐-获取租户套餐下拉框
export function tenantSimpleList() {
  return request({
    url: `/system/tenant-package/get-simple-list`,
    method: 'get',
  })
}
