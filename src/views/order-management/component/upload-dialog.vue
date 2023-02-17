<template>
  <div>
    <el-dialog :modal-append-to-body="false" :visible.sync="show" width="26%" center>
      <div class="header">上传文件</div>
      <div class="content">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="80px"
          class="demo-ruleForm"
          :label-position="labelPosition"
        >
          <el-form-item label="文件类型" prop="fileType">
            <el-select
              v-model.trim="ruleForm.fileType"
              placeholder="请选择文件类型"
              @change="fileSelectType(ruleForm.fileType)"
            >
              <el-option
                v-for="item in fileTypeList"
                :key="item.comCode"
                :value="item.comCode"
                :label="item.comCodeDesc"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择文件" prop="fileName">
            <div class="flex">
              <el-input v-model.trim="ruleForm.fileName" disabled></el-input>
              <el-upload
                class="m-l-5"
                :show-file-list="false"
                ref="uploadImage"
                :multiple="false"
                :auto-upload="false"
                :on-change="uploadFile"
                action=""
              >
                <el-button class="m-l-10" type="primary">选择</el-button>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item label="文件名" prop="fileInputName">
            <el-input v-model.trim="ruleForm.fileName"></el-input>
          </el-form-item>
          <el-form-item v-if="isShowContractInput" label="合同编号" prop="contractNo">
            <el-input v-model.trim="ruleForm.contractNo"></el-input>
          </el-form-item>
          <el-form-item v-if="isShowInvoiceInput" label="发票号码" prop="invoiceNo">
            <el-input v-model.trim="ruleForm.invoiceNo"></el-input>
          </el-form-item>
          <el-form-item v-if="isShowInvoiceInput" label="发票代码" prop="invoiceCode">
            <el-input v-model.trim="ruleForm.invoiceCode"></el-input>
          </el-form-item>
          <el-form-item v-if="isShowInvoiceInput" label="发票金额" prop="invoiceAmt">
            <el-input v-model.trim="ruleForm.invoiceAmt"></el-input>
          </el-form-item>
          <el-form-item label="文件备注" prop="remark">
            <el-input v-model.trim="ruleForm.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="m-t-20">
        <el-button
          type="primary"
          @click="submit('ruleForm')"
          size="small"
          :disabled="!ruleForm.fileName"
          v-hasPermi="['supplier:voucher:add']"
          >确定上传</el-button
        >
        <el-button @click="handleClose('ruleForm')" size="small">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { voucherAddApi } from '@/api/money-raise-management'
import { uploadApi } from '@/api/image-management'

export default {
  props: {
    selected: {
      type: Array,
    },
    fileTypeList: {
      type: Array,
    },
    type: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      attachType: 1,
      show: false,
      labelPosition: 'left',
      // 是否显示合同相关输入项
      isShowContractInput: false,
      // 是否显示发票相关输入项
      isShowInvoiceInput: false,

      ruleForm: {
        fileType: '',
        fileName: '',
        remark: '',

        contractNo: '',

        invoiceNo: '',
        invoiceCode: '',
        invoiceAmt: '',
      },
      rules: {
        fileType: [
          {
            required: true,
            message: '请选择文件类型',
            trigger: ['submit', 'change'],
          },
        ],
        fileName: [{ required: true, message: '请上传文件', trigger: 'submit' }],

        contractNo: [],

        invoiceNo: [],
        invoiceCode: [],
        invoiceAmt: [],
      },
      submitParams: {},
    }
  },
  watch: {
    show() {},
  },
  created() {
    if (this.type) this.attachType = 2
  },
  computed: {},
  methods: {
    fileSelectType(selectFileType) {
      //控制合同、发票相关输入项的显示
      if (selectFileType == 1) {
        this.isShowContractInput = true
        this.isShowInvoiceInput = false

        this.rules.contractNo = [{ required: true, message: '请输入合同编号', trigger: 'submit' }]
      } else if (selectFileType == 5) {
        this.isShowContractInput = false
        this.isShowInvoiceInput = true
        this.rules.invoiceNo = [{ required: true, message: '请输入发票号码', trigger: 'submit' }]
        this.rules.invoiceCode = [{ required: true, message: '请输入发票代码', trigger: 'submit' }]
        this.rules.invoiceAmt = [{ required: true, message: '请输入发票金额', trigger: 'submit' }]
      } else {
        this.isShowContractInput = false
        this.isShowInvoiceInput = false
        this.rules.contractNo = []

        this.rules.invoiceNo = []
        this.rules.invoiceCode = []
        this.rules.invoiceAmt = []
      }
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.submitParams.fileType = this.ruleForm.fileType
          this.submitParams.remark = this.ruleForm.remark
          this.submitParams.fileName = this.ruleForm.fileName

          this.submitParams.contractNo = this.ruleForm.contractNo
          this.submitParams.invoiceNo = this.ruleForm.invoiceNo
          this.submitParams.invoiceCode = this.ruleForm.invoiceCode
          this.submitParams.invoiceAmt = this.ruleForm.invoiceAmt

          console.log(this.submitParams)
          voucherAddApi(this.submitParams).then(res => {
            if (res.code === 200 && res.success) {
              this.$parent.getFileLists()
              this.$refs[formName].resetFields()
              this.show = false
            }
          })
        } else {
          return false
        }
      })
    },
    handleClose(formName) {
      this.$refs[formName].resetFields()
      this.show = false
    },
    uploadFile(file) {
      this.ruleForm.fileName = ''
      let pointIndex = file.name.lastIndexOf('.')
      let fileSuffix = file.name.substr(pointIndex + 1)
      let formData = new FormData()
      formData.append('file', file.raw)
      formData.append('imageTypeNumber', '6')
      formData.append('businessId', this.$store.state.enterprise.enterpriseCertNo)

      formData.append('businessCode', '001')
      this.submitParams = {
        attachType: this.attachType,
        attachNo: this.selected[0].seqNo,
        fileType: '',
        fileName: file.name,
        fileSize: file.size,
        fileSuffix: fileSuffix,
        remark: '',
        uploader: '',
      }
      uploadApi(formData).then(res => {
        if (res.code === 200 && res.success) {
          this.submitParams.fileNo = res.data.imageNumber
          this.ruleForm.fileName = res.data.fileName.substr(0, pointIndex)
        }
      })
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
  padding: 16px 10px;
  color: #000;
  font-weight: 600;
  font-size: 14px;
}
.content {
  padding: 20px;
}
</style>
