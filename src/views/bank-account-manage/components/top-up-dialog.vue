<template>
  <div>
    <el-dialog
      :modal-append-to-body="false"
      :visible.sync="topupDialogShow"
      :before-close="close"
      width="45%"
      center
    >
      <div class="header">
        {{ title }}
      </div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="150px"
        class="demo-ruleForm"
      >
        <el-form-item label="平台账户:" prop="accountNo">
          <el-input v-model.trim="amountData.accountNo" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="平台账户名:" prop="accountName">
          <el-input v-model.trim="amountData.accountName" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="账户余额:" prop="balance">
          <el-input v-model.trim="amountData.balance" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item :label="`上传凭证`" prop="tradeFile" class="is-required">
          <el-upload
            class="upload-demo"
            drag
            :action="uploadFileUrl"
            multiple
            ref="uploaddemo"
            show-file-list
            :on-error="handleUploadError"
            :on-success="handleUploadSuccess"
            :headers="headers"
            :data="loaddata"
            :on-remove="removeFile"
            :limit="1"
            accept="jpg/png/excel/pdf/rar/zip"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <!-- <div class="el-upload__tip" slot="tip">
              支持上传jpg/png/excel/pdf/rar/zip文件，文件大小不建议超过20M
            </div> -->
          </el-upload>
        </el-form-item>

        <el-form-item label="充值金额（元）:" prop="tradeAmount">
          <el-input v-model.trim="ruleForm.tradeAmount"></el-input>
        </el-form-item>
        <el-form-item label="说明:" prop="tradeExplain">
          <el-input v-model.trim="ruleForm.tradeExplain"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="m-t-20">
        <el-button type="primary" size="small" @click="applyFn('ruleForm')">申请审核</el-button>
        <el-button type="primary" size="small" @click="close">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { UKeyModal } from '@/utils/ukey'
import { getToken } from '@/utils/auth'
import { rechargeApplyApi } from '@/api/amount-management/index'
import $bus from '@/utils/eventBus'

import { Encrypt, Decrypt } from '@/utils/jsencrypt'
export default {
  props: {
    topupDialogShow: {
      type: Boolean,
    },
    isApprovel: {
      type: String,
    },
    hidetopupDialog: {
      type: Function,
    },
    showPayInfoClose: {
      type: Function,
    },
    amountInfo: {
      type: Array,
      default: [],
    },
  },
  created() {},
  data() {
    return {
      disabled: null,
      uploadFileUrl: process.env.VUE_APP_BASE_API + '/cls/image/app/image/upload', // 上传的图片服务器地址
      headers: {
        Authorization: 'Bearer ' + getToken(),
      },
      loaddata: {
        imageTypeNumber: '11',
        businessId: this.$staticData.core_enterprise[0].dictValue,
        businessCode: '001',
      },
      isLt20M: '',
      amountData: {},
      ruleForm: {
        platform: 1,
        tradeCertNo: this.$store.state.enterprise.enterpriseCertNo,
        tradeFile: null,
      },
      submitData: {},
      fileObiectInfo: {}, //文件信息
      rules: {
        tradeFile: [
          {
            required: true,
            message: '请上传凭证',
            trigger: ['blur', 'change'],
          },
        ],
        receiveAccount: [
          { required: true, message: '请选择收款账户', trigger: ['blur', 'change'] },
        ],
        tradeAmount: [{ required: true, message: '请输入充值金额', trigger: 'blur' }],
        tradeExplain: [{ required: true, message: '请输入说明', trigger: 'blur' }],
      },
      title: '上传转账凭证',
    }
  },
  watch: {
    topupDialogShow(change) {
      if (change) {
        if (this.isApprovel) {
          this.title = '充值审批'
          this.getDetails()
        } else {
          this.title = '上传转账凭证'
          this.amountData = this.amountInfo[0]
          this.disabled = true
        }
      }
    },
  },
  computed: {},
  methods: {
    // 详情
    getDetails() {},
    applyTransfer(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          UKeyModal(this, null, () => {
            this.submitDataFn()
          })
        } else {
          return false
        }
      })
    },
    submitDataFn() {
      this.submitData = { ...this.ruleForm }
      this.submitData.tradeAccount = Encrypt(this.amountData.accountNo) // 提交的时候先加密
      this.submitData.tradeAccountName = this.amountData.accountName //平台账户名
      rechargeApplyApi(this.submitData).then(res => {
        if (res.code == 200) {
          this.$parent.getInfo()
          $bus.$emit('top-up-record')
          this.$message.success('申请成功')
          this.$emit('hidetopupDialog')
          this.$emit('showPayInfoClose')
        } else {
          this.$message.error(res.msg)
          this.$emit('hidetopupDialog')
        }
      })
    },
    close() {
      this.amountData = {}
      this.ruleForm = {
        platform: 1,
        tradeCertNo: this.$store.state.enterprise.enterpriseCertNo,
        tradeFile: [],
      }
      this.submitData = {}
      this.$emit('hidetopupDialog')
    },

    // 同意
    applyFn(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          UKeyModal(this, null, () => {
            this.submitDataFn()
            this.$emit('hidetopupDialog')
          })
        } else {
          return false
        }
      })
    },
    // 上传失败
    handleUploadError(err) {
      this.$message.error('上传失败, 请重试')
    },
    // 上传成功回调
    handleUploadSuccess(res, file, fileList) {
      if (res.code == 200) {
        // this.fileObiectInfo = {
        //   fileName: file.name,
        //   fileSize: file.size,
        //   fileSuffix: file.name.split('.')[1],
        //   imageTypeNumber: '12',
        //   fileId: res.data.imageNumber,
        // }

        this.ruleForm.tradeFile = res.data.imageNumber
        // this.ruleForm.tradeFile.push(this.fileObiectInfo)
        this.$message.success('上传成功')
      } else {
        fileList.pop()
        this.$message.error(res.msg)
      }
    },
    // 上传前校检格式和大小
    // handleBeforeUpload(file) {
    //   // 校检文件类型
    //   var FileExt = file.name.replace(/.+\./, '')
    //   if (
    //     ['jpg', 'png', 'zip', 'rar', 'pdf', 'xls', 'xlsx'].indexOf(FileExt.toLowerCase()) === -1
    //   ) {
    //     this.$message({
    //       type: 'warning',
    //       message: '请上传后缀名为jpg、png、 pdf、 xls、xlsx、zip或rar的附件！',
    //     })
    //     return false
    //   }
    //   // 校检文件大小
    //   this.isLt20M = file.size / 1024 / 1024 < 20 ? '1' : '0'
    //   if (this.isLt20M === '0') {
    //     this.$message({
    //       message: '上传文件大小不能超过20M!',
    //       type: 'error',
    //     })
    //   }
    //   return this.isLt20M === '1' ? true : false
    // },
    // 删除文件
    removeFile(file, fileList) {
      // let arr = []
      // fileList.forEach(e => {
      //   arr.push(e.response.data.imageNumber)
      // })
      this.ruleForm.tradeFile = ''
    },
  },
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 0;
}
::v-deep .el-dialog__header {
  display: none;
}
::v-deep .el-checkbox__inner {
  border-radius: 50%;
}
.header {
  background: #f2f2f2;
  padding: 10px;
  color: #000;
  font-weight: 600;
  font-size: 16px;
}
.demo-ruleForm {
  padding: 20px 40px 20px 20px;
}
</style>
