<template>
  <div class="create-step4">
    <div v-if="showResult === 0">
      <img src="@/assets/images/step-three.png" mode="" />
      <p class="m-t-20">认证申请已提交，请等待审核结果!</p>
    </div>
    <div v-if="showResult === 1">
      <img src="@/assets/images/approvel-fail.png" mode="" />
      <p class="m-t-20">审核失败!</p>
      <el-button type="primary" class="m-t-20" size="small" @click="authAgain">重新认证</el-button>
    </div>
    <div v-if="showResult === 2">
      <img src="@/assets/images/auth-success.png" mode="" />
      <p><b>恭喜你,企业认证完成!</b></p>
    </div>
    <el-button class="m-t-20" size="small" @click="backIndex">返回</el-button>
  </div>
</template>

<script>
import { enterpriseListApi } from '@/api/enterprise-information-management/index'

export default {
  props: {
    back: {
      type: Function,
    },
    enterpriseId: {
      type: [String, Number],
    },
    activeChange: {
      type: Function,
    },
  },
  data() {
    return {
      showResult: '',
      queryParams: {
        pageSize: 10,
        pageNum: 1,
      },
    }
  },
  computed: {
    checkStatus() {
      return this.$store.state.enterprise.checkStatus
    },
  },
  created() {
    this.getList()
  },
  methods: {
    backIndex() {
      this.$emit('back')
    },
    authAgain() {
      this.$emit('activeChange', 1)
    },
    getList() {
      enterpriseListApi(this.queryParams).then(res => {
        if (res.code == 200) {
          this.showResult = Number(res.data.rows[0].authStatus)
        }
      })
    },
  },
}
</script>

<style lang="scss">
.create-step4 {
  text-align: center;
  padding-top: 20px;
  img {
    height: 140px;
  }
}
</style>
