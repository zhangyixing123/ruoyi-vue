<template>
  <div class="success">
    <div>手机号修改成功</div>
    <div class="back">
      <el-button type="primary" @click="back">返回首页</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },

  methods: {
    back() {
      this.$router.push('/index')
    },
  },
}
</script>

<style scoped>
.success {
  padding: 50px;
  text-align: center;
}

.back {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 100px;
}
</style>
