<template>
  <div class="pdfView">
    <div v-if="pdfFile">
      <el-dialog
        :modal-append-to-body="false"
        :visible.sync="show"
        width="900"
        append-to-body
        center
        @close="canacle"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <div v-html="pdfFile"></div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="canacle('sure')" :disabled="showTime > 0"
            ><span v-if="showTime > 0">{{ showTime }}s</span>确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { previewContractApi } from '@/api/civil-commercial-credit/financing'

import { loanContractApi } from '@/api/money-raise-management/index'
export default {
  props: {
    contractFile: {
      type: Object,
    },
    hideDialog: {
      type: Function,
    },
    lessTime: {
      type: Number,
      default: 0,
    },
    fileType: {
      type: String,
      default: '',
    },
    mySeqno: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      pdfFile: '',
      show: true,
      timer: '',
      showTime: 0,
    }
  },
  created() {
    this.showTime = this.lessTime
    this.viewPdf()
  },
  computed: {},
  methods: {
    viewPdf() {
      this.pdfFile = ''

      if (this.fileType == 'loan') {
        this.viewLoanFile()
      } else {
        this.viewOtherFile()
      }
    },
    viewLoanFile() {
      loanContractApi(this.contractFile.tempCode, this.contractFile.version, this.mySeqno).then(
        res => {
          this.$nextTick(() => {
            let str = res.substr(0, res.indexOf('<style>')) + res.substr(res.indexOf('</style>'))
            this.pdfFile = str
          })
        }
      )
    },
    viewOtherFile() {
      previewContractApi(this.contractFile.tempCode).then(res => {
        this.$nextTick(() => {
          let str = res.substr(0, res.indexOf('<style>')) + res.substr(res.indexOf('</style>'))
          this.pdfFile = str
          this.timer = setInterval(() => {
            this.showTime--
            if (this.showTime <= 0) {
              clearInterval(this.timer)
            }
          }, 1000)
        })
      })
    },
    canacle(type) {
      this.$emit('hideDialog', type)
    },
  },
}
</script>
<style lang="scss" scoped>
.pdfView {
  height: 500px !important;
  overflow-y: auto;
}
</style>
