<template>
  <div class="company-manage-create">
    <div class="p-40-20">
      <el-steps :active="active" align-center finish-status="finish">
        <el-step title="验证登录信息"></el-step>
        <el-step title="验证新手机"></el-step>
        <el-step title="修改成功"></el-step>
      </el-steps>
    </div>
    <div class="h20 bgf5f5f5 m-b-20" />
    <create-step1 @activeChange="activeChange" @next="next" v-show="active == 1"> </create-step1>
    <create-step2 @activeChange="activeChange" @next="next" v-show="active == 2"> </create-step2>
    <create-step3 @activeChange="activeChange" v-show="active == 3"> </create-step3>
  </div>
</template>

<script>
import createStep1 from './components/numStep1.vue'
import createStep2 from './components/numStep2.vue'
import createStep3 from './components/numStep3.vue'
export default {
  name: 'company-manage-create',
  components: {
    'create-step1': createStep1,
    'create-step2': createStep2,
    'create-step3': createStep3,
  },
  watch: {
    active(val, newval) {
      if (val == 3) {
        this.$message({
          message: '修改成功，请重新登录 ',
          type: 'success',
        })
        setTimeout(() => {
          this.$store.dispatch('LogOut')
          this.$router.push(`/login`)
        }, 1000)
      }
    },
  },
  data() {
    return {
      active: 1,
    }
  },
  methods: {
    activeChange(active) {
      this.active = active
    },
    next() {
      this.active++
    },
  },
}
</script>

<style lang="scss" scoped></style>
