import request from '@/utils/request'

//展期-展期收款明细
export function extCollectionDetailApi(data) {
  return request({
    url: `/cls/msx/app/supplier/msx/ext/collection/detail`,
    method: 'post',
    data,
  })
}
