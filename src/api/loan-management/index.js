import request from '@/utils/request'

//#region 还款方式配置对应接口
// 还款方式配置-查询列表(分页)
export function getRepayMtdConfigListApi(data) {
  return request({
    url: '/cls/loans/app/repayMtdConfig/list',
    method: 'post',
    data: data,
  })
}
// 还款方式配置-查询列表
export function getRepayMtdConfigListAllApi(data) {
  return request({
    url: '/cls/loans/app/repayMtdConfig/list/all',
    method: 'post',
    params: data,
  })
}
//还款方式配置-添加
export function repayMtdConfigAddApi(data) {
  return request({
    url: '/cls/loans/app/repayMtdConfig/add',
    method: 'post',
    data: data,
  })
}
// 还款方式配置-修改
export function repayMtdConfigUpdateApi(data) {
  return request({
    url: '/cls/loans/app/repayMtdConfig/update',
    method: 'post',
    data: data,
  })
}
// 还款方式配置-删除
export function repayMtdConfigDeleteApi(seqNo) {
  return request({
    url: `/cls/loans/app/repayMtdConfig/delete/${seqNo}`,
    method: 'get',
  })
}

// 还款方式配置-查看
export function repayMtdConfigDetailApi(seqNo) {
  return request({
    url: `/cls/loans/app/repayMtdConfig/detail/${seqNo}`,
    method: 'get',
  })
}

//#endregion

//#region 产品大类熔断对应接口
// 产品大类熔断-列表
export function getPTypeFuseConfigListApi(data) {
  return request({
    url: '/cls/core/app/pTypeFuseConfig/list',
    method: 'post',
    data: data,
  })
}
// 产品大类熔断-详情
export function pTypeFuseConfigDetailApi(seqNo) {
  return request({
    url: `/cls/core/app/pTypeFuseConfig/detail/${seqNo}`,
    method: 'get',
  })
}
// 产品大类熔断-新增
export function pTypeFuseConfigAddApi(data) {
  return request({
    url: '/cls/core/app/pTypeFuseConfig/add',
    method: 'post',
    data: data,
  })
}
// 产品大类熔断-修改
export function pTypeFuseConfigUpdateApi(data) {
  return request({
    url: '/cls/core/app/pTypeFuseConfig/update',
    method: 'post',
    data: data,
  })
}
// 产品大类熔断-删除
export function pTypeFuseConfigDeleteApi(seqNo) {
  return request({
    url: `/cls/core/app/pTypeFuseConfig/delete/${seqNo}`,
    method: 'post',
    data: {},
  })
}
//#endregion

//#region 商户管理对应接口
// 商户管理- 列表
export function getScooprListApi(data) {
  return request({
    url: '/cls/core/app/scoopr/list',
    method: 'post',
    data: data,
  })
}
// 商户管理- 新增
export function scooprAddApi(data) {
  return request({
    url: '/cls/core/app/scoopr/add',
    method: 'post',
    data: data,
  })
}
// 商户门店- 审核
export function scooprAuditApi(data) {
  return request({
    url: '/cls/core/app/scoopr/audit',
    method: 'post',
    data: data,
  })
}
// 商户影像文件- 列表
export function getScooprBImageRecordListApi(data) {
  return request({
    url: '/cls/core/app/scoopr/bImageRecord/list',
    method: 'post',
    data: data,
  })
}
// 商户影像文件- 上传
export function scooprBImageRecordUploadApi(data) {
  return request({
    url: '/cls/core/app/scoopr/bImageRecord/upload',
    method: 'post',
    data: data,
  })
}
// 商户门店详情
export function scooprDetailApi(seqNo) {
  return request({
    url: `/cls/core/app/scoopr/detail/${seqNo}`,
    method: 'get',
  })
}
// 商户门店信息变更审核
export function scooprMerchantAuditApi(data) {
  return request({
    url: '/cls/core/app/scoopr/merchantAudit',
    method: 'post',
    data: data,
  })
}
//商户门店信息变更详情
export function scooprMerchantAuditDetailApi(seqNo) {
  return request({
    url: `/cls/core/app/scoopr/merchantAuditDetail/${seqNo}`,
    method: 'get',
    params: {},
  })
}
//商户门店信息变更列表
export function scooprMerchantAuditListApi(data) {
  return request({
    url: '/cls/core/app/scoopr/merchantAuditList',
    method: 'post',
    data: data,
  })
}
//查看门店产品
export function scooprQueryProductApi(data) {
  return request({
    url: '/cls/core/app/scoopr/queryProduct',
    method: 'post',
    data: data,
  })
}
//商户门店提交审核
export function scooprSubmitAuditApi(data) {
  return request({
    url: '/cls/core/app/scoopr/submitAudit',
    method: 'post',
    data: data,
  })
}
//商户门店修改
export function scooprUpdateApi(data) {
  return request({
    url: '/cls/core/app/scoopr/update',
    method: 'post',
    data: data,
  })
}
//商户门店信息变更
export function scooprUpdateWhenNormalApi(data) {
  return request({
    url: '/cls/core/app/scoopr/updateWhenNormal',
    method: 'post',
    data: data,
  })
}
//#endregion

//#region 借款申请信息
//借款申请信息-借款申请记录查询
export function getLcApplListApi(data) {
  return request({
    url: '/cls/core/app/lcAppl/list',
    method: 'post',
    data: data,
  })
}
//借款申请信息-根据借据号查看轨迹
export function lcApplApprvTrackQueryByApplCdeApi(applCde) {
  return request({
    url: `/cls/core/app/lcApplApprvTrack/queryByApplCde/${applCde}`,
    method: 'post',
  })
}
//借款申请信息-审批接口
export function lcApplAuditApi(data) {
  return request({
    url: '/cls/core/app/lcAppl/audit',
    method: 'post',
    data: data,
  })
}
//#endregion

//获取省市区地址
export function passportUserGetAreaApi(parentCode) {
  return request({
    url: `/cls/passport-personal/app/passport/user/get/area`,
    method: 'post',
    data: { parentCode },
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
export function getListByDeptIdApi(deptId) {
  return request({
    url: `/system/user/listByDeptId/${deptId}`,
    method: 'get',
    params: {},
  })
}
export function getProductConfigListNewAllApi(data) {
  return request({
    url: '/cls/core/app/productConfig/list/new/all',
    method: 'post',
    data: data,
  })
}

// 资金一审列表
export function getlcApplfundReviewListApi(data) {
  return request({
    url: '/cls/core/app/lcApplfundReview/list',
    method: 'post',
    data: data,
  })
}

// 资金二审列表
export function getlcApplfundReviewListTwiceApi(data) {
  return request({
    url: '/cls/core/app/lcApplfundReview/listTwice',
    method: 'post',
    data: data,
  })
}

// 审批接口
export function getlcApplfundReviewAuditApi(data) {
  return request({
    url: '/cls/core/app/lcApplfundReview/audit',
    method: 'post',
    data: data,
  })
}
