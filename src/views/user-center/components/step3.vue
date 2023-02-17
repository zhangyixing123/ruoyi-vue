<template>
  <div>
    <div class="weixin" v-show="type == 'success'">
      <div class="QRcodeimg"><span>恭喜你认证完成</span></div>
      <div class="text-center m-t-10">
        <el-button type="primary" @click="back">请返回首页</el-button>
      </div>
    </div>
    <div class="weixin" v-show="type == 'fail'">
      <div class="QRcodeimg">
        <span>人脸识别失败次数过多，进入人工审核环节，请等待审核结果</span>
      </div>
      <div class="text-center m-t-10">
        <el-button type="primary" @click="back">请返回首页</el-button>
      </div>
    </div>
    <div class="weixin" v-show="type == 'auditFail'">
      <div class="QRcodeimg ">
        <img src="@/assets/images/approvel-fail.png" class="auditFailimg" />
        <span>审核失败</span>
      </div>
    </div>
  </div>
</template>

<script>
import { userInfoMsg } from '@/api/enterprise-information-management/index'
export default {
  props: ['url', ''],
  data() {
    return {
      QRcode: '',
      type: '',
    }
  },
  created() {
    // 查询是否认证
    userInfoMsg().then(res => {
      this.faceCheck = res.data.faceCheck
      if (this.faceCheck == '1') {
        this.type = 'success'
      } else if (this.faceCheck == '3') {
        this.type = 'auditFail'
      } else {
        this.type = 'fail'
      }
    })
  },
  methods: {
    next() {
      // utils.localStorageRemove('idCardFront')
      // utils.localStorageRemove('idCardBack')
      this.$message('人脸识别中')
    },

    back() {
      this.$store.dispatch('isRealName').then(() => {
        this.$router.push('/index')
      })
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
.QRBox {
  margin: 50px;
}
.auditFailimg {
  margin: 10px auto;
  width: 70px;
}
</style>
