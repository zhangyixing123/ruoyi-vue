import request from '@/utils/request'
import { utils } from '@/utils/utils'

// 影像件类型
const imageTypeNumberArr = [
  { type: '1', name: '企业营业执照' },
  { type: '2', name: '法人授权书' },
  { type: '3', name: '数字证书使用承诺函' },
  { type: '4', name: '用户头像' },
  { type: '5', name: '人脸识别图片' },
  { type: '6', name: '操作凭证' },
  { type: '7', name: '身份证正面' },
  { type: '8', name: '身份证反面' },
  { type: '9', name: '放款公司Logo' },
  { type: '10', name: '合同模板' },
  { type: '11', name: '贸易申请材料' },
  { type: '12', name: '信开立申请材料' },
]
// 影像中心-单文件上传接口

export function uploadApi(data) {
  // 在这里统一创建 FormData,使用的时候就方便很多
  let formData = new FormData()
  formData.append('file', data.file)
  formData.append('imageTypeNumber', data.imageTypeNumber)
  return request({
    url: `/cls/image/app/image/upload`,
    method: 'post',
    data: data,
  })
}

// 文件 上传 - 查询 - 获取URL 整个流程Api
export function uploadAndGetUrlApi(data) {
  let formData = new FormData()
  formData.append('file', data.file)
  formData.append('imageTypeNumber', data.imageTypeNumber)
  formData.append('businessId', window.vm.$store.state.enterprise.enterpriseCertNo)
  formData.append('businessCode', '001')
  return new Promise((resolve, reject) => {
    request({
      url: `/cls/image/app/image/upload`, // 上传接口
      method: 'post',
      data: formData,
    })
      .then(res => {
        let imageNumber = res.data.imageNumber
        request({
          url: `/cls/image/app/image/query`, // 单文件查询
          method: 'post',
          data: {
            imageNumber: imageNumber,
            type: 1,
          },
        })
          .then(res => {
            resolve({
              imageNumber: imageNumber,
              url: `/cls/image/app/image/permissionsView?imageNumber=${res.data.imageNumberEncryption}&type=${data.showType}`,
            })
            return
            // 这里直接用get调用，无需以下方法了

            request({
              url: `/cls/image/app/image/permissionsView`, // 文件查看接口
              method: 'get',
              params: {
                imageNumber: res.data.imageNumberEncryption,
                type: data.showType,
              },
            })
              .then(res => {
                console.log('-------res------', res)
                let url = URL.createObjectURL(new Blob([res], { type: 'image/jpeg' }))
                console.log(url)
                resolve(url)
              })
              .catch(err => {
                reject(err)
              })
          })
          .catch(err => {
            reject(err)
          })
      })
      .catch(err => {
        reject(err)
      })
  })
}

// 影像中心-影像文件查看接口
export function imageNumberApi(data) {
  return request({
    url: `/cls/image/app/image/query`, // 单文件查询
    method: 'post',
    data: {
      imageNumber: data.imageNumber,
      type: data.type,
    },
  })
    .then(res => {
      // resolve(`/cls/image/app/image/permissionsView?imageNumber=${res.data.imageNumberEncryption}&type=${data.showType}`);
      // // 这里直接用get调用，无需以下方法了

      return request({
        url: `/cls/image/app/image/permissionsView`, // 文件查看接口
        method: 'get',
        params: {
          imageNumber: res.data.imageNumberEncryption,
          type: 0,
        },
        responseType: 'blob',
      })
    })
    .catch(err => {})
}
// 单文件查询
export function queryApi(data) {
  return request({
    url: `/cls/image/app/image/query`,
    method: 'post',
    data: {
      imageNumber: data.imageNumber,
      type: data.type,
    },
  })
}
// 单文件查看
export function permissionsViewApi(data) {
  return request({
    url: `/cls/image/app/image/permissionsView`, // 文件查看接口
    method: 'get',
    params: {
      imageNumber: data,
      type: 0,
    },
    responseType: 'blob',
  })
}
// 影像中心-文件下载接口
export function downloadImageApi(data) {
  return request({
    url: `/cls/image/app/image/query`, // 单文件查询
    method: 'post',
    data: {
      imageNumber: data.imageNumber,
      type: data.type,
    },
  })
    .then(res => {
      utils.sessionStorageSet('fileName', res.data.fileName)
      return request({
        url: `/cls/image/app/image/download`, // 文件下载接口
        method: 'get',
        params: {
          imageNumbers: res.data.imageNumberEncryption,
        },
        responseType: 'blob',
      })
    })
    .catch(err => {})
}

// 凭证批量下载(逗号分隔)
export function batchDownloadFileApi(data) {
  return request({
    url: `/cls/bill/app/supplier/voucher/batchDownload?${data}`,
    method: 'get',
    responseType: 'blob',
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
    url: '/cls/image/app/image/downloadZip',
    method: 'get',
    params: data,
    responseType: 'blob',
  })
}
