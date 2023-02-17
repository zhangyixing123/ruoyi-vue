<template>
  <div class="app-container text-center">
    <div v-if="billStatus == 1">
      <span class="title">{{ statusText }}结果</span>
      <div class="result">
        <span class="el-icon-success icon success"></span>
        <p class="title">{{ statusText }}成功</p>
      </div>
    </div>
    <div v-if="billStatus == 0">
      <span class="title">{{ statusText }}结果</span>
      <div class="result">
        <span class="el-icon-error icon error"></span>
        <p class="title">{{ statusText }}失败</p>
        <p>失败原因：xxxxxxxxxxxxxxxxxx</p>
      </div>
    </div>
    <div v-if="billStatus == 3">
      <span class="title">{{ statusText }}结果</span>
      <div class="result">
        <span class="el-icon-time icon time"></span>
        <p class="title">查询处理中</p>
        <p>查询处理中</p>
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
    resultType: {
      type: String,
      default: '',
    },
    hideResult: {
      type: Function,
    },
  },
  data() {
    return {
      value: '',
      btnText: '返回融资列表',
      statusText: '',
      billStatus: '1',
    }
  },
  created() {
    if (this.resultType == 'loan') {
      this.statusText = '申请放款'
    } else if (this.resultType == 'fangkuan') {
      this.statusText = '确认放款'
    }
  },
  computed: {},
  methods: {
    cancel() {
      this.$emit('hideResult')
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
.app-container {
  background: #fff;
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
