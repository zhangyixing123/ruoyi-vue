<template>
  <div class="app-container text-center">
    <div v-if="billStatus == 1">
      <span class="title">额度申请结果</span>
      <div class="result">
        <span class="el-icon-success icon success"></span>
        <p class="title">授信成功</p>
      </div>
    </div>
    <div v-if="billStatus == 2">
      <span class="title">额度申请结果</span>
      <div class="result">
        <span class="el-icon-error icon error"></span>
        <p class="title">授信失败</p>
        <p>失败原因：综合评分不足，额度申请失败！</p>
      </div>
    </div>
    <div v-if="billStatus == 3">
      <span class="title">额度申请结果</span>
      <div class="result">
        <span class="el-icon-time icon time"></span>
        <p class="title">处理中...</p>
      </div>
    </div>
    <div class="m-t-20">
      <el-button type="primary" size="small" @click="cancel">{{ btnText }}</el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    hideDetails: {
      type: Function,
    },
    billStatus: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      value: '',
      btnText: '返回账单',
    }
  },
  created() {},
  computed: {},
  methods: {
    cancel() {
      this.$emit('hideDetails')
    },
  },
}
</script>
<style lang="scss" scoped>
.title {
  font-size: 26px;
  font-weight: bold;
}
.result {
  height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.icon {
  font-size: 80px;
}
.success {
  color: #50bf19;
}
.error {
  color: #f5222d;
}
.time {
  color: #c0c0c0;
}
</style>
