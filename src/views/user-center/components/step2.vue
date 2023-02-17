<template>
  <div>
    <div class="weixin">
      <div>
        请使用微信扫描二维码，完成人脸识别
      </div>
      <div class="QRBox" v-if="url"><img :src="url" class="QRcodeimg" /></div>
      <div v-if="url" class="f-s-14">
        如果二维码签名失效，点击<span class="c-1890ff cur-pointer" @click="faceCheck"
          >重新获取</span
        >
      </div>
      <el-button type="primary" @click="getFaceResult" class="m-t-20">完成</el-button>
    </div>
  </div>
</template>

<script>
import { utils } from '@/utils/utils'
import {
  faceCallCheckApi,
  faceCallApi,
  faceResultApi,
  getFaceTokenApi,
} from '@/api/user-center/index'
import { getUid } from '@/utils/auth'
import { getFileUrl } from '@/utils/ruoyi'
export default {
  data() {
    return {
      url: '',
      type: '',
      faceStatus: 0,
      faceId: '',
    }
  },
  created() {
    this.faceCheck()
  },

  methods: {
    faceCheck() {
      let params = {
        faceType: 1,
        userId: getUid(),
      }
      // 人脸识别
      faceCallCheckApi(params).then(res => {
        if (res.code == '400') {
          this.type = 'fail'
        } else if (res.code == 200) {
          this.getFaceToken()
        }
      })
    },
    // 获取刷脸token
    async getFaceToken() {
      let params = {
        faceType: 1,
        userId: getUid(),
        callbackUrl: 'http://10.4.1.38:8080/user-center/certification-info',
      }
      let res = await getFaceTokenApi(params)
      if (res.code == 200) {
        this.faceId = res.data
        this.getFaceUrl(params, res.data)
      }
    },
    // 获取刷脸url
    async getFaceUrl(params, faceId) {
      let urlParams = {
        ...params,
        faceId,
      }
      let res = await faceCallApi(urlParams)
      getFileUrl(res).then(url => {
        this.url = url
      })
    },

    // 刷脸结果查询
    getFaceResult() {
      let that = this
      faceResultApi({
        faceType: 1,
        userId: getUid(),
        callbackUrl: 'http://10.4.1.38:8080/user-center/certification-info',
        faceId: that.faceId,
      })
        .then(res => {
          if (res.code == 200) {
            that.faceStatus = res.data.status
            if (res.data.status == '1') {
              that.$store.dispatch('isRealName').then(() => {
                that.type = 'success'
                that.$emit('activeChange', 2)
              })
            } else {
              that.faceStatus = res.data.status
            }
          }
        })
        .catch(err => {
          that.faceStatus = 2
        })
    },

    prev() {
      this.$emit('activeChange', 0)
    },
    next() {
      this.$emit('activeChange', 2)
    },
  },
}
</script>

<style scoped>
.weixin {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
  font-size: 18px;
  margin-top: 50px;
}
.QRcodeimg {
  width: 300px;
  height: 300px;
  font-size: 18px;
  text-align: center;
  margin: auto;
  display: flex;
  justify-content: center;
  flex-direction: column;
}
</style>
