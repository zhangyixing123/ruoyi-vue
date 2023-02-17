import request from '@/utils/request'

// 创建企业
export function createEnterpriseApi(data) {
  return request({
    url: '/cls/passport/app/enterpriseAuth/createEnterprise',
    method: 'post',
    data,
  })
}
// 营业执照OCR（new）
export function parseLicenseInfoApi(data) {
  return request({
    method: 'post',
    url: `/cls/passport/app/user/info/parseLicenseInfoByFieldId`,
    params: data,
  })
}
// 获取登录人信息
export function getUserFrontMsgApi(data) {
  return request({
    method: 'post',
    url: `/cls/passport/app/user/info/getUserFrontMsg`,
    params: data,
  })
}
// 企业管理员认证
export function enterpriseAdminAuthApi(data) {
  return request({
    url: '/cls/passport/app/enterpriseAuth/enterpriseAdminAuth',
    method: 'post',
    data,
  })
}

// 企业认证 - 同名户基本认证
export function enterpriseBasicCardAuthApi(data) {
  return request({
    url: '/cls/passport/app/enterprise/enterpriseBasicCardAuth',
    method: 'post',
    data,
  })
}
// 企业认证- 查看打款状态
export function enterpriseBasicCardAuthQueryApi(data) {
  return request({
    url: '/cls/passport/app/enterprise/enterpriseBasicCardAuthQuery',
    method: 'post',
    data,
  })
}
// 企业认证-获取打款金额
export function enterpriseSmallPayAuthApi(data) {
  return request({
    url: '/cls/passport/app/enterprise/enterpriseSmallPayAuth',
    method: 'post',
    data,
  })
}
// 同名基本户-短信认证----供应链金融
export function basicCardAuthApi(data) {
  return request({
    url: '/cls/passport/app/enterprise/basicCardAuth',
    method: 'post',
    params: data,
  })
}

// 供应链金融企业认证-Ukey信息验证绑定接口
export function bindEnterpriseUkeyApi(data) {
  return request({
    url: '/cls/passport/app/enterprise/bindEnterpriseUkey',
    method: 'post',
    data,
  })
}

// 供应链金融企业认证-Ukey删除接口
export function relieveEnterpriseUkeyApi(data) {
  return request({
    url: '/cls/passport/app/enterprise/relieveEnterpriseUkey',
    method: 'post',
    params: data,
  })
}

// 供应链金融企业认证-Ukey信息认证接口
export function enterpriseUkeyAuthApi(data) {
  return request({
    url: '/cls/passport/app/enterprise/enterpriseUkeyAuth',
    method: 'post',
    data,
  })
}
// 获取刷脸结果
export function getFaceResultApi(data) {
  return request({
    url: '/cls/passport/app/faceAuth/faceResult',
    method: 'post',
    data,
  })
}
// 获取刷脸二维码
export function faceCallApi(data) {
  return request({
    url: '/cls/passport/app/faceAuth/faceCall',
    method: 'post',
    data,
    responseType: 'blob',
  })
}
// 获取法人授权方式二维码
export function createCodeApi(data) {
  return request({
    url: `/cls/passport/app/faceAuth/createCode`,
    method: 'post',
    params: data,
    responseType: 'blob',
  })
}
