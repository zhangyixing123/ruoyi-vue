import request from '@/utils/request'

// 收支记录 获取文件列表接口  creditCode
export function getFileList(data) {
  return request({
    url: '/cls/msx/app/transfer/listFilePage',
    method: 'post',
    data,
  })
}

// 文件下载接口 查询单文件ID 加密后的code
export function getFileMaskId(data) {
  return request({
    url: '/cls/image/app/image/query',
    method: 'post',
    data,
  })
}
// 文件下载接口 查询多文件ID 加密后的ID
export function getFileMaskIds(data) {
  return request({
    url: '/cls/image/app/image/querys',
    method: 'post',
    data,
  })
}

// 文件下载接口  支持批量下载  文件id 拼接成字符串  imageNumbers
export function fileDownload(data) {
  return request({
    url: '/cls/image/app/image/download',
    method: 'get',
    params: data,
    responseType: 'blob',
  })
}
