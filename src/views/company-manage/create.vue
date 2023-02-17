<template>
  <div class="company-manage-create">
    <div>
      <el-button @click="backIndex" size="small">返回</el-button>
    </div>
    <div class="p-40-20">
      <el-steps :active="active" align-center finish-status="success">
        <el-step title="企业信息采集"></el-step>
        <el-step title="管理员认证"></el-step>
        <el-step title="企业认证"></el-step>
        <el-step title="审批资料"></el-step>
      </el-steps>
    </div>
    <div class="h20 bgf5f5f5 m-b-20"></div>
    <create-step1
      :enterpriseId="enterpriseId"
      @activeChange="activeChange"
      @enterpriseIdChange="enterpriseIdChange"
      v-if="active == 0"
    >
    </create-step1>
    <create-step2
      :status="status"
      :enterpriseId="enterpriseId"
      :legelPhone="legelPhone"
      @activeChange="activeChange"
      v-if="active == 1"
    >
    </create-step2>
    <create-step3 :enterpriseId="enterpriseId" @activeChange="activeChange" v-if="active == 2">
    </create-step3>
    <create-step4
      :enterpriseId="enterpriseId"
      @activeChange="activeChange"
      v-if="active == 3"
      @back="backIndex"
      :authStatus="authStatus"
    >
    </create-step4>
  </div>
</template>

<script>
import createStep1 from './components/create-step1.vue'
import createStep2 from './components/create-step2.vue'
import createStep3 from './components/create-step3.vue'
import createStep4 from './components/create-step4.vue'
import { getEnterpriseMsgApi } from '@/api/enterprise-information-management/index'

export default {
  name: 'company-manage-create',
  props: {
    seqNo: {
      type: String,
      default: '',
    },
    showIndex: {
      type: Function,
    },
    status: {
      type: [Number, String],
      default: '',
    },
    authStatus: {
      type: [Number, String],
      default: '',
    },
  },
  components: {
    'create-step1': createStep1,
    'create-step2': createStep2,
    'create-step3': createStep3,
    'create-step4': createStep4,
  },
  data() {
    return {
      active: 0,
      enterpriseId: '',
      legelPhone: '',
      bankList: [],
    }
  },
  created() {
    if (this.seqNo) {
      this.getDetails()
      this.enterpriseId = this.seqNo
    }
  },
  methods: {
    getDetails() {
      getEnterpriseMsgApi({
        seqNo: this.seqNo,
      }).then(res => {
        this.legelPhone = res.data.maskMobile
        if (this.status == 3 && this.authStatus == 2) {
          // 调完企业认证
          this.active = 3
        } else if (this.status == 1 && this.authStatus == 0 && res.data.scFaceSts != 1) {
          // 调完创建企业
          this.active = 1
        } else if (this.status == 0 && this.authStatus == 0) {
          this.active = 0
        } else {
          this.active = 2
        }
      })
    },
    enterpriseIdChange(enterpriseId) {
      this.enterpriseId = enterpriseId
    },
    activeChange(active) {
      this.active = active
    },
    backIndex() {
      this.$emit('showIndex')
    },
  },
}
</script>

<style lang="scss"></style>
