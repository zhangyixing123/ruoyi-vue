<template>
  <div class="step-three app-container flex1 flex-col over-hidden">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="1.填写银行账号"></el-step>
      <el-step title="2.账号实名验证"></el-step>
      <el-step title="3.签署绑定协议"></el-step>
      <el-step title="4.绑定成功"></el-step>
    </el-steps>
    <div class="content">
      <img src="../../../assets/images/step-four.png" mode="" />
      <div>恭喜您，绑定成功！</div>
    </div>
    <div class="return-btn">
      <el-button type="primary" @click="handleReturn">返回</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 4,
    }
  },
  computed: {},
  created() {},
  methods: {
    handleReturn() {
      this.$router.push({
        path: '/company-manage/index',
      })
    },
  },
}
</script>

<style scoped lang="scss">
.step-three {
  .content {
    width: 50%;
    padding: 80px 0;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    img {
      width: 200px;
      margin-bottom: 20px;
    }
  }
  .return-btn {
    width: 200px;
    margin: 20px auto;
    display: flex;
    justify-content: center;
  }
}
</style>
