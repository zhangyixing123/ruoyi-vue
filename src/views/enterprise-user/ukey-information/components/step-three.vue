<template>
  <div class="step-three app-container flex1 flex-col over-hidden">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="绑定UKey"></el-step>
      <el-step title="上传《数字证书使用承诺函》"></el-step>
      <el-step title="平台审核"></el-step>
    </el-steps>
    <div class="content">
      <img :src="stepThreeSrc" mode="" />
      <div>UKey调整申请已提交，等待平台审批</div>
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
      active: 2,
      stepThreeSrc: require("@/assets/images/step-three.png")
    };
  },
  computed: {},
  created() {},
  methods: {
    handleReturn() {
      this.$router.push({ name: "Ukey-information" });
    }
  }
};
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
