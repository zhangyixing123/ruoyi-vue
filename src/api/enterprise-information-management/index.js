import request from '@/utils/request'

// 企业信息管理-用户管理-用户信息
export function getUserInfoList(data) {
  return request({
    url: '/cls/passport/app/user/userInfoList',
    method: 'post',
    data,
  })
}

// 企业信息管理-企业管理-ukey信息
export function getEnterpriseUkeyList(data) {
  return request({
    url: '/cls/passport/app/enterprise/enterpriseUkeyList',
    method: 'post',
    data,
  })
}

// 企业信息管理-用户管理-邀请用户
export function invitationUser(data) {
  return request({
    url: '/cls/passport/app/enterprise/invitationUser',
    method: 'post',
    data,
  })
}

// 企业信息管理-企业管理-加入企业
export function joinEnterpriseByUser(data) {
  return request({
    url: '/cls/passport/app/enterprise/joinEnterpriseByUser',
    method: 'post',
    data,
  })
}

// 企业信息管理-用户管理-用户绑定ukey
export function userBindUkey(data) {
  return request({
    url: '/cls/passport/app/enterprise/userBindUkey',
    method: 'post',
    data,
  })
}

// 企业信息管理-企业管理-用户管理
export function userManagement(data) {
  return request({
    url: '/cls/passport/app/enterprise/userManagement',
    method: 'post',
    data,
  })
}

// 企业信息管理-用户管理-删除用户
export function userRemove(data) {
  return request({
    url: '/cls/passport/app/enterprise/userRemove',
    method: 'post',
    data,
  })
}

// 企业信息管理-用户管理-管理员移交
export function transferAdmin(data) {
  return request({
    url: '/cls/passport/app/enterprise/transferAdmin',
    method: 'post',
    data,
  })
}
// 企业信息管理-用户管理-停用/启用
export function frostUser(data) {
  return request({
    url: '/cls/passport/app/user/frostUser',
    method: 'post',
    data,
  })
}

// 用户中心-查询用户基本信息
export function userInfoMsg(data) {
  return request({
    url: '/cls/passport/app/user/userInfoMsg',
    method: 'post',
    data,
  })
}

// 用户中心-完善用户基本信息
export function supplyUserMsg(data) {
  return request({
    url: '/cls/passport/app/user/supplyUserMsg',
    method: 'post',
    data,
  })
}

// 用户中心-用户修改密码-登陆后
export function modifyPasswordApi(data) {
  return request({
    url: '/cls/passport/app/user/info/modifyPassword',
    method: 'post',
    data,
  })
}

/**-----------cyp ----------- */
// 用户中心-企业基本信息----供应链金融
export function enterpriseBasicInfoApi(data) {
  return request({
    url: '/cls/passport/app/enterprise/enterpriseBasicInfo',
    method: 'post',
    data,
  })
}
// 企业管理-分页列表
export function enterpriseListApi(data) {
  return request({
    url: '/cls/passport/app/enterprise/selectEnterpriseManagementByParam',
    method: 'post',
    data,
  })
}
//企业管理-待审批企业详细信息
export function getEnterpriseMsgApi(data) {
  return request({
    url: '/cls/passport/app/enterprises/approveEnterpriseDetailInfo',
    method: 'post',
    params: data,
  })
}

// 法人信息校验
export function enterpriseAdminCheckApi(data) {
  return request({
    method: 'POST',
    url: '/cls/passport/app/enterpriseAuth/enterpriseAdminCheck',
    params: data,
  })
}
// 企业小额打款银行列表
export function bankListEnterpriseApi(data) {
  return request({
    method: 'POST',
    url: '/cls/passport/app/common/bankListEnterprise',
    data,
  })
}
// 企业信息查询授权状态
export function getAuthStatusApi(data) {
  return request({
    method: 'POST',
    url: '/cls/passport/app/enterprise/getAuthStatus',
    params: data,
  })
}
// 供应链金融企业认证-企业认证失败作废
export function cancellationApi(data) {
  return request({
    method: 'POST',
    url: '/cls/passport/app/enterprise/cancellation',
    params: data,
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
//开户银行列表查询
export function sAccBankBchListApi(data) {
  return request({
    url: `/cls/core/app/sAccBankBch/list`,
    method: 'post',
    data: data,
  })
}
