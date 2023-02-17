import request from '@/utils/request'
import { Encrypt } from '@/utils/jsencrypt'

// 用户注册--供应链金融
export function registUserApi(data) {
  return request({
    method: 'POST',
    url: '/cls/passport/app/user/register/registUser',
    data,
  })
}

/**
 * * 用户登录--供应链金融
 * @param {object} data 请求参数
 *
 */
export function userLoginApi(data) {
  return request({
    method: 'POST',
    url: '/cls/passport/app/user/login/userLogin',
    data,
  })
}

/**
 * * 用户登录--通过第三方平台跳转登录
 * @param {object} data 请求参数
 *
 */
export function userLoginByThird(data) {
  return request({
    method: 'POST',
    url: '/cls/passport/app/user/login/userLoginByThird',
    data,
  })
}

/**
 * 用户中心---注册登录短信发送
 * @param {object} data 请求参数
 */
export function loginAndRegisterSendCode(data) {
  return request({
    method: 'POST',
    url: '/cls/passport/app/loginAndRegister/sendCode',
    data,
  })
}

/**
 * 用户中心---短信发送
 * @param {object} data 请求参数
 */
export function commonSendCode(data) {
  return request({
    method: 'POST',
    url: '/cls/passport/app/common/sendCode',
    data,
  })
}

/**
 * 用户中心---验证码注册登录
 * @param {object} data 请求参数
 */
export function userLogin(data) {
  return request({
    method: 'POST',
    url: '/cls/passport/app/user/login/userVerifyCodeLogin',
    data,
  })
}

/**
 * 用户中心---图形验证码
 * @param {object} data 请求参数
 */
export function garphVerfyCode(data) {
  return request({
    method: 'POST',
    url: '/cls/passport/app/common/garphVerfyCode',
    responseType: 'blob',
    data,
  })
}
/**
 * 用户中心---获取手机验证码
 * @param {object} data 请求参数
 */
export function sendRegisterCodeApi(data) {
  return request({
    method: 'POST',
    url: '/cls/passport/app/common/sendCodeByPass',
    data,
  })
}

/**
 * 用户中心---修改手机号确认-供应链金融
 * @param {object} data 请求参数
 */
export function checkPasswordApi(data) {
  return request({
    method: 'POST',
    url: '/cls/passport/app/updateMobile/checkPassword',
    data,
  })
}

/**
 * 用户中心---修改手机号确认
 * @param {object} data 请求参数
 */
export function updateNewMobileApi(data) {
  return request({
    method: 'POST',
    url: '/cls/passport/app/updateMobile/updateNewMobile',
    data,
  })
}

/**
 * 用户中心---修改手机号获取验证码
 * @param {object} data 请求参数
 */
export function sendCodeApi(data) {
  return request({
    method: 'POST',
    url: '/app/loginAndRegister/sendCode',
    data,
  })
}

// 身份证OCR识别（new）
export function OcrIdCardNewApi(data) {
  return request({
    method: 'post',
    url: `/cls/passport/app/common/OcrIdCardNew`,
    params: data,
  })
}
/**
 * 用户中心---供应链金融ocr识别用户身份证信息
 * @param {object} data 请求参数
 */
export function authOrIdentidentCardApi(data) {
  return request({
    method: 'POST',
    url: '/cls/passport/app/authOrIdent/identCard',
    data,
  })
}

/**
 * 用户中心---供应链金融身份证二要素认证
 * @param {object} data 请求参数
 */
export function twoBasicAuthApi(data) {
  return request({
    method: 'POST',
    url: '/cls/passport/app/authOrIdent/twoBasicAuth',
    data,
  })
}
/**用户中心---个人授权书 */
export function signContractApi(data) {
  return request({
    method: 'POST',
    url: '/cls/passport/app/authOrIdent/signContract',
    params: data,
  })
}
/**
 * 用户中心---供应链金融二要素认证
 * @param {object} data 请求参数
 */
export function twoBasicAuthNewApi(data) {
  return request({
    method: 'POST',
    url: '/cls/passport/app/authOrIdent/twoBasicAuthNew',
    data,
  })
}

// 上传获取fileId
export function uploadFileApi(data) {
  return request({
    url: '/cls/bill/app/supplier/voucher/upload',
    method: 'post',
    data,
  })
}

// 企业管理-加入企业
export function joinEnterpriseByUserApi(data) {
  return request({
    url: '/cls/passport/app/enterprise/joinEnterpriseByUser',
    method: 'post',
    data,
  })
}

// 企业管理-企业管理-ukey信息
export function enterpriseUkeyListApi(data) {
  return request({
    url: '/cls/passport/app/enterprise/enterpriseUkeyList',
    method: 'post',
    data,
  })
}

// 企业管理-企业管理-用户管理-用户绑定ukey
export function userBindUkeyApi(data) {
  return request({
    url: '/cls/passport/app/enterprise/userBindUkey',
    method: 'post',
    data,
  })
}

// 企业管理-企业管理-用户管理-邀请用户
export function invitationUserApi(data) {
  data.mobile = Encrypt(data.mobile)
  data.idCardNo = Encrypt(data.idCardNo)
  return request({
    url: '/cls/passport/app/enterprise/invitationUser',
    method: 'post',
    data,
  })
}
/**
 * 用户中心---用户修改密码-未登录
 * @param {object} data 请求参数
 */
export function modifyPasswordByPassApi(data) {
  return request({
    method: 'POST',
    url: '/cls/passport/app/user/info/modifyPasswordByPass',
    data,
  })
}

/**
 * 用户中心---用户认证--人脸识别二维码(二要素刷脸)
 * @param {object} data 请求参数
 */
export function faceCallCheckApi(data) {
  return request({
    method: 'POST',
    url: '/cls/passport/app/faceAuth/faceCallCheck',
    data,
  })
}

/**
 * 用户中心---用户认证--人脸识别二维码
 * @param {object} data 请求参数
 */
export function faceCallApi(data) {
  return request({
    method: 'POST',
    url: '/cls/passport/app/faceAuth/faceCall',
    data,
    responseType: 'blob',
  })
}
/**获取刷脸token */
export function getFaceTokenApi(data) {
  return request({
    method: 'POST',
    url: '/cls/passport/app/faceAuth/faceToken',
    data,
  })
}
/**
 * 用户中心---用户认证--刷脸结果查询
 * @param {object} data 请求参数
 */
export function faceResultApi(data) {
  return request({
    method: 'POST',
    url: '/cls/passport/app/faceAuth/faceResult',
    data,
  })
}

/**
 * 判断手机号是否已注册-- true 已注册 false 未注册
 *
 */
export function isRegistPhoneApi(data) {
  return request({
    method: 'POST',
    url: '/cls/passport/app/common/isRegistPhone',
    params: data,
  })
}
