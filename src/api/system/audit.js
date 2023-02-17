import request from '@/utils/request'

// 系统审核-列表查询
export function examineList(data) {
  return request({
    url: '/system/examine/list',
    method: 'get',
    params: data,
  })
}

// 系统审核-获取审核页面查询类型
export function typeQuery() {
  return request({
    url: '/system/examine/typeQuery',
    method: 'get',
  })
}

// 系统审核-撤销
export function examineRevoke(query) {
  return request({
    url: '/system/examine/revoke',
    method: 'get',
    params: query,
  })
}

// 系统应用-新增
export function addApplication(data) {
  return request({
    url: '/system/application/add',
    method: 'post',
    data: data,
  })
}

// 系统应用-删除
export function delDept(query) {
  return request({
    url: '/system/application/delete',
    method: 'get',
    params: query,
  })
}

// 系统应用-列表查询
export function applicationList(data) {
  return request({
    url: '/system/application/list',
    method: 'get',
    params: data,
  })
}

// 租户管理-租户审批回调接口
export function callbackApi(data) {
  return request({
    url: '/system/tenant/callback',
    method: 'POST',
    data,
  })
}

// 租户套餐-获取租户套餐列表
export function packageList(data) {
  return request({
    url: '/system/tenant-package/list',
    method: 'get',
    params: data,
  })
}

// 租户套餐-获取租户套餐下拉列表
export function getSimpleList() {
  return request({
    url: '/system/tenant-package/get-simple-list',
    method: 'get',
  })
}

// 租户套餐-新增租户套餐
export function addPackage(data) {
  return request({
    url: '/system/tenant-package/add',
    method: 'post',
    data: data,
  })
}

// 租户套餐-修改租户套餐
export function editPackage(data) {
  return request({
    url: '/system/tenant-package/edit',
    method: 'put',
    data: data,
  })
}

// 租户套餐-删除租户套餐
export function deletePackage(packageId) {
  return request({
    url: `/system/tenant-package/${packageId}`,
    method: 'delete',
  })
}

// 租户套餐-根据编号获取租户套餐
export function getpackageById(packageId) {
  return request({
    url: `/system/tenant-package/${packageId}`,
  })
}
// 租户应用列表-合作租户
export function tenantAllList(data) {
  return request({
    url: '/system/tenant/allList',
    method: 'get',
  })
}
