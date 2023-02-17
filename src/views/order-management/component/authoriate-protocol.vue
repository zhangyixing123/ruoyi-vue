<template>
  <div class="container">
    <div v-if="showResultType == 0">
      <div>
        <span v-html="msg" class="template-preview"></span>
      </div>

      <div class="flex just-center align-center p-b-60">
        <el-button
          type="primary"
          @click="agreeAuthoriate"
          v-hasPermi="['supplier:bill:dataAuth:sign']"
          >同意授权</el-button
        >
        <el-button type="warning" class="btnBack" @click="back">返回</el-button>
      </div>
    </div>

    <div v-if="showResultType == 1" class="text-center">
      <p class="m-t-80"><b>授权结果</b></p>

      <div class="m-t-120 flex-col align-center">
        <img src="../../../assets/images/step-three.png" class="authoriateResultIcon" />
        <p><b>授权处理中</b></p>
      </div>

      <div>
        <el-button type="primary" class="m-t-80" @click="back">返回</el-button>
      </div>
    </div>

    <div v-if="showResultType == 2" class="text-center">
      <p class="m-t-80"><b>授权结果</b></p>

      <div class="m-t-120 flex-col align-center">
        <img src="../../../assets/images/approvel-fail.png" class="authoriateResultIcon" />
        <p><b>授权失败</b></p>
        <p v-if="failMsg">
          <b>失败原因:{{ failMsg }}</b>
        </p>
      </div>

      <div>
        <el-button type="primary" class="m-t-80" @click="back">返回</el-button>
      </div>
    </div>
    <div v-if="showResultType == 3" class="text-center">
      <p class="m-t-80"><b>授权结果</b></p>

      <div class="m-t-120 flex-col align-center">
        <img src="../../../assets/images/auth-success.png" class="authoriateResultIcon" />
        <p><b>授权成功</b></p>
      </div>

      <div>
        <el-button type="primary" class="m-t-80" @click="back">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  dataAuthProtocolPreview,
  dataAuthProtocolSign,
  dataAuthResult,
} from '@/api/money-raise-management'

export default {
  props: {
    hideDetails: {
      type: Function,
    },
  },

  data() {
    return {
      showResultType: 0,
      msg: '',
      failMsg: '',
      queryDataAuthResultInterval: undefined,
    }
  },

  created() {
    dataAuthProtocolPreview().then(res => {
      const html = res
      let str = html.substr(0, html.indexOf('<head>')) + html.substr(html.indexOf('</head>'))
      this.msg = str
    })
  },

  methods: {
    agreeAuthoriate() {
      dataAuthProtocolSign().then(res => {
        if (res.code == 200) {
          this.showResultType = 1

          //处理中，循环获取授权结果
          this.circleQueryDataAuthResult()
        } else {
          this.showResultType = 2
          this.failMsg = res.msg
        }
      })
    },
    circleQueryDataAuthResult() {
      this.queryDataAuthResultInterval = setInterval(() => {
        this.checkDataAuthResult()
      }, 60000)
    },
    //查看是否授权
    checkDataAuthResult() {
      let param = new FormData()
      param.append('supplierName', '')

      dataAuthResult(param).then(res => {
        if (res.code == 200) {
          // 数据授权状态,1已授权,2授权处理中,3授权失败,4未授权
          if ('1' === res.data.status) {
            //授权成功
            this.showResultType = 3
            this.clearDataAuthInterval()
          } else if ('3' === res.data.status) {
            //授权失败
            this.showResultType = 2
            this.failMsg = res.data.desc
            this.clearDataAuthInterval()
          }
        }
      })
    },
    clearDataAuthInterval() {
      if (this.queryDataAuthResultInterval) {
        clearInterval(this.queryDataAuthResultInterval)
      }
    },
    back() {
      this.clearDataAuthInterval()
      this.$emit('hideDetails')
    },
    destroyed() {
      this.clearDataAuthInterval()
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.btnBack {
  margin-left: 80px;
}

.m-t-50 {
  margin-top: 50px;
}
.m-t-80 {
  margin-top: 80px;
}

.m-t-120 {
  margin-top: 120px;
}

.m-t-200 {
  margin-top: 200px;
}

.p-t-80 {
  padding-top: 80px;
}

.authoriateResultIcon {
  width: 50px;
  height: 50px;
}
</style>
