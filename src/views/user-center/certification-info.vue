<template>
  <div class="company-manage-create">
    <div class="p-40-20">
      <el-steps :active="active" align-center finish-status="success">
        <el-step title="提交身份信息"></el-step>
        <el-step title="人脸认证"></el-step>
        <el-step title="认证完成" :status="setStatus"></el-step>
      </el-steps>
    </div>
    <div class="h20 bgf5f5f5 m-b-20" />
    <create-step1 @activeChange="activeChange" @next="next" v-show="active == 0"> </create-step1>
    <create-step2
      @activeChange="activeChange"
      v-if="active == 1"
      :active="active"
      @next="next"
      :url="url"
    >
    </create-step2>
    <create-step3 @activeChange="activeChange" v-if="active == 2" ref="steps" :type="type">
    </create-step3>
  </div>
</template>

<script>
import createStep1 from './components/step1.vue'
import createStep2 from './components/step2.vue'
import createStep3 from './components/step3.vue'
import { userInfoMsg } from '@/api/enterprise-information-management/index'

export default {
  name: 'company-manage-create',
  components: {
    'create-step1': createStep1,
    'create-step2': createStep2,
    'create-step3': createStep3,
  },

  data() {
    return {
      faceCheck: null,
      active: 0,
      fileIdArr: [],
      processImg: '',
      url: '',
      type: 'wait',
      setStatus: '',
    }
  },
  created() {
    this.enterpriseId = this.$store.state.enterprise.enterpriseId

    // 查询是否认证
    userInfoMsg().then(res => {
      if (!res.data.realNameCheck) {
        this.active = 0
      } else {
        this.faceCheck = res.data.faceCheck
        if (!this.faceCheck) {
          this.active = 1
        } else if (this.faceCheck == '1') {
          this.active = 2
          this.setStatus = this.type = 'success'
        } else if (this.faceCheck == '3') {
          this.active = 2
          this.type = 'auditFail'
        } else {
          this.active = 2
          this.type = 'fail'
          this.setStatus = 'error'
        }
      }
    })
  },
  methods: {
    activeChange(active) {
      this.active = active
    },
    next() {
      this.active++
    },
    faceResult() {},
  },
}
</script>

<style lang="scss" scoped></style>
