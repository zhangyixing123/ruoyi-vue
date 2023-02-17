import request from '@/utils/request'

// 企业信息管理-用户管理-ukey信息
export function getEnterpriseBasicInfo() {
  return request({
    url: '/cls/passport/app/enterprise/enterpriseBasicInfo',
    method: 'post',
  })
}
