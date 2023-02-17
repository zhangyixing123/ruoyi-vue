import request from '@/utils/request'

// 影像中心-单文件上传接口
export function getAreaApi(data) {
  // data 传入一个string就行，这里为了避免以后拓展，直接用obj
  return request({
    url: `/cls/passport/app/common/getArea/${data.parentCode || ''}`,
    method: 'post',
    data: {}
  })
}