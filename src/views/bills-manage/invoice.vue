<template>
  <div class="root app-container">
    <el-form label-width="100px" class="flex-shrink-0">
      <el-row>
        <el-col :span="6">
          <el-form-item :label="`发票代码`" prop="code">
            <el-input
              v-model.trim="queryParams.code"
              :placeholder="`请输入发票代码`"
              clearable
              size="small"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="`发票号码`" prop="number">
            <el-input
              v-model.trim="queryParams.number"
              :placeholder="`请输入发票号码`"
              clearable
              size="small"
            />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item :label="`开票日期`" prop="billingDate">
            <el-date-picker
              :clearable="false"
              v-model.trim="billingDate"
              size="small"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              :start-placeholder="`开始时间`"
              :end-placeholder="`结束时间`"
              :default-time="['00:00:00', '23:59:59']"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="`发票状态`" prop="uploadSts">
            <el-select v-model.trim="queryParams.uploadSts" placeholder="请选择" size="small">
              <el-option
                v-for="dict in $staticData.invoice_upload_status"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="">
            <el-button type="primary" @click="search" size="small">查 询</el-button>
            <el-button @click="reset" size="small">重 置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="flex-shrink-0 flex">
      <el-button size="mini" type="warning" plain @click="addInvoice">新增发票</el-button>
      <el-button
        @click="edit"
        type="primary"
        plain
        :disabled="multipleSelection.length != 1"
        size="mini"
        >修改</el-button
      >
      <el-button
        :disabled="multipleSelection.length != 1"
        @click="delInvoice"
        size="mini"
        type="danger"
        >删除</el-button
      >
      <el-button
        size="mini"
        type="danger"
        plain
        @click="uploadFj"
        :disabled="multipleSelection.length != 1"
        v-if="showUpload"
        >上传发票附件</el-button
      >
      <el-upload
        class="upload-demo"
        action=" "
        :auto-upload="false"
        :show-file-list="false"
        :on-change="file => importInvoiceFile(file, '0301')"
        v-else
      >
        <el-button size="mini" type="danger" plain :disabled="multipleSelection.length != 1"
          >上传发票附件</el-button
        >
      </el-upload>
      <el-button
        size="mini"
        type="warning"
        class="m-r-5 m-l-10"
        plain
        @click="uploadQd"
        :disabled="multipleSelection.length != 1"
        v-if="showUploadQd"
        >上传发票清单</el-button
      >
      <el-upload
        class="upload-demo"
        action=" "
        :auto-upload="false"
        :show-file-list="false"
        :on-change="file => importInvoiceFile(file, '0302')"
        v-else
      >
        <el-button size="mini" type="warning" plain :disabled="multipleSelection.length != 1"
          >上传发票清单</el-button
        >
      </el-upload>

      <el-upload
        class="upload-demo m-r-10"
        action=" "
        :auto-upload="false"
        :show-file-list="false"
        :on-change="importFile"
      >
        <el-button size="mini" type="success" plain>批量导入</el-button>
      </el-upload>
      <el-button size="mini" plain @click="downloadTemplate">批量导入模板下载</el-button>
    </div>
    <div class="flex1 over-hidden m-t-10">
      <el-table @selection-change="handleSelectionChange" :data="tableData">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="发票代码" align="center" prop="code" />
        <el-table-column label="发票号码" align="center" prop="number" />
        <el-table-column label="购买方" align="center" prop="buyerName" />
        <el-table-column label="含税金额(元)" align="center" prop="amount" />
        <el-table-column label="不含税金额(元)" align="center" prop="exclTaxAmt" />
        <el-table-column label="开票日期" align="center" prop="invoiceDate" />
        <el-table-column
          label="上传状态"
          align="center"
          prop="uploadSts"
          :formatter="formatStatus"
        />
        <el-table-column label="上传完成时间" align="center" prop="uploadTime" />
        <el-table-column label="发票附件" align="center">
          <template slot-scope="scope">
            <el-button @click="viewImg(scope.row.fileList, 'fj')" type="text">下载</el-button>
          </template>
        </el-table-column>
        <el-table-column label="发票清单" align="center">
          <template slot-scope="scope">
            <el-button @click="viewImg(scope.row.fileList, 'qd')" type="text">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      class="text-center bgfff pd10 flex-shrink-0"
      layout="total, sizes, prev, pager, next, jumper"
      :current-page.sync="queryParams.pageNum"
      :page-sizes="[10, 20, 30, 50]"
      :page-size.sync="queryParams.pageSize"
      @size-change="handleSizeOrCurrentChange"
      @current-change="handleSizeOrCurrentChange"
      :total="total"
    >
    </el-pagination>
    <el-dialog
      :modal-append-to-body="false"
      width="800px"
      custom-class="el-dialog-center"
      :visible.sync="showDialog"
      @close="close"
    >
      <b slot="title">{{ title }}</b>
      <el-form ref="invoiceInfo" :model="invoiceInfo" :rules="invoiceRules" label-width="150px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="发票代码" prop="code">
              <el-input v-model.trim="invoiceInfo.code" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发票号码" prop="number">
              <el-input v-model.trim="invoiceInfo.number" size="small"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="购买方" prop="buyerCode">
              <el-select
                v-model.trim="invoiceInfo.buyerCode"
                placeholder="请选择"
                size="small"
                @change="buyerChange(invoiceInfo.buyerCode)"
              >
                <el-option
                  v-for="dict in $staticData.core_enterprise"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发票金额" prop="amount">
              <el-input v-model.trim="invoiceInfo.amount" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="不含税金额（元）" prop="exclTaxAmt">
              <el-input v-model.trim="invoiceInfo.exclTaxAmt" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开票日期" prop="invoiceDate">
              <el-date-picker
                :clearable="false"
                v-model.trim="invoiceInfo.invoiceDate"
                size="small"
                value-format="yyyy-MM-dd"
                type="date"
                range-separator="-"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发票附件" prop="fileList">
              <el-upload
                action=" "
                :auto-upload="false"
                accept=".jpg,.bmp,.png,.pdf,.xls,.xlsx,.docx"
                :limit="1"
                :file-list="invoiceInfo.fileList"
                :on-change="(file, fileList) => handleImgChange(file, fileList, 'fileList', '0301')"
                :on-remove="(file, fileList) => handleRemove(file, fileList, 'fileList')"
              >
                <el-button size="mini" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发票清单" prop="file">
              <el-upload
                action=" "
                :auto-upload="false"
                accept=".jpg,.bmp,.png,.pdf,.xls,.xlsx,.docx"
                :limit="1"
                :file-list="invoiceInfo.file"
                :on-change="(file, fileList) => handleImgChange(file, fileList, 'file', '0302')"
                :on-remove="(file, fileList) => handleRemove(file, fileList, 'file')"
              >
                <el-button size="mini" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item>
              1.请上传pdf、jpg、png、bmp、excel、word文件。<br />
              2.只可上传一个附件，不超过10M。
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="confirm">确认</el-button>
      </div>
    </el-dialog>
    <ukey ref="ukey" @cancel="cancel" @sure="sure"></ukey>
  </div>
</template>

<script>
import { uploadApi, downloadImageApi } from '@/api/image-management'
import * as API from '@/api/invoice-management'
import { mapState } from 'vuex'
import { validTwoPoint, validInteger } from '@/utils/validate'
import { downloadWord } from '@/utils/ruoyi'
import ukey from '@/views/components/ukey.vue'

export default {
  name: 'bills-manage-invoice',
  components: {
    ukey,
  },
  data() {
    const amountNumber = (rules, value, callback) => {
      if (!value) {
        return callback('请输入发票号码！')
      }
      if (!validInteger(value)) {
        return callback('发票号码格式不正确！')
      }
      callback()
    }
    const amountValidator = (rules, value, callback) => {
      if (!value) {
        return callback('请输入发票金额！')
      }
      if (!validTwoPoint(value)) {
        return callback('发票金额大于零且最多两位小数！')
      }
      callback()
    }
    const amountExclTaxAmt = (rules, value, callback) => {
      if (!value) {
        return callback('请输入不含税金额！')
      }
      if (!validTwoPoint(value)) {
        return callback('不含税金额大于零且最多两位小数！')
      }
      callback()
    }
    return {
      files: [],
      loading: false,
      multipleSelection: [],
      tableData: [],
      total: 0,
      queryParams: {
        uploadSts: undefined,
        code: undefined,
        dateStart: undefined,
        dateEnd: undefined,
        buyer: undefined,
        status: undefined,
        pageSize: 10,
        pageNum: 1,
      },
      eventName: '',
      fileType: '',
      multiple: false,
      dialogVisible: false,
      showDialog: false,
      billingDate: [],
      invoiceInfo: {
        number: '',
        code: '',
        buyerName: '',
        buyerCode: '',
        amount: '',
        exclTaxAmt: '',
        invoiceDate: '',
        file: [],
        fileList: [],
      },
      invoiceRules: {
        number: [
          {
            required: true,
            trigger: ['blur'],
            validator: amountNumber,
          },
        ],
        code: [
          {
            required: true,
            trigger: ['blur'],
            message: '请输入发票代码',
          },
        ],
        buyerCode: [
          {
            required: true,
            trigger: ['change'],
            message: '请选择购买方',
          },
        ],
        amount: [
          {
            required: true,
            trigger: ['blur'],
            validator: amountValidator,
          },
        ],
        exclTaxAmt: [
          {
            required: true,
            trigger: ['blur'],
            validator: amountExclTaxAmt,
          },
        ],
        invoiceDate: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请选择开票日期',
          },
        ],
        fileList: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请上传发票附件',
          },
        ],
      },
      seqNo: '',
      idDel: false, // 是否删除
      showUpload: true,
      showUploadQd: true,
      title: '',
    }
  },
  computed: {
    ...mapState({
      enterpriseCertNo: state => state.enterprise.enterpriseCertNo,
      enterpriseName: state => state.enterprise.enterpriseName,
    }),
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取列表
    getList() {
      let params = JSON.parse(JSON.stringify(this.queryParams))
      params.supplyCoCode = this.enterpriseCertNo
      // params.supplyCoName = this.enterpriseName
      if (this.billingDate.length > 0) {
        params.invoiceDateStart = this.billingDate[0]
        params.invoiceDateEnd = this.billingDate[1]
      }
      API.invoiceApi(params).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.rows
          this.total = res.data.total
        }
      })
    },
    // 发票状态
    formatStatus(row) {
      return this.selectDictLabel(this.$staticData.invoice_upload_status, row.uploadSts)
    },
    // 新增
    addInvoice() {
      this.idDel = false
      this.showDialog = true
      this.seqNo = ''
      this.title = '新增发票'
      this.$nextTick(() => {
        this.$refs.invoiceInfo.clearValidate()
      })
    },
    // 修改
    edit() {
      this.idDel = false
      this.title = '编辑发票'
      API.invoiceDetailsApi({
        seqNo: this.seqNo,
      }).then(res => {
        if (res.code == 200) {
          this.invoiceInfo = res.data
          console.log(this.invoiceInfo)
          if (this.invoiceInfo.fileList.length > 0) {
            this.invoiceInfo.fileList.forEach(item => {
              item.name = item.fileName
            })
          }
          this.invoiceInfo.file = this.invoiceInfo.fileList.filter(v => {
            return v.fileType == '0302'
          })
          this.invoiceInfo.fileList = this.invoiceInfo.fileList.filter(v => {
            return v.fileType == '0301'
          })

          console.log(this.invoiceInfo.file)
          this.$staticData.core_enterprise.forEach(item => {
            if (item.dictLabel == this.invoiceInfo.buyerName) {
              this.invoiceInfo.buyerCode = item.dictValue
            }
          })
          this.showDialog = true
          this.$nextTick(() => {
            this.$refs.invoiceInfo.clearValidate()
          })
        }
      })
    },
    // 上传文件
    async handleImgChange(file, fileList, key, type) {
      let allowType = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'application/vnd.ms-excel',
        'application/pdf',
        'image/bmp',
        'image/jpeg',
        'image/png',
      ]
      const isAllow = allowType.includes(file.raw.type)

      const isLt10M = file.raw.size / 1024 / 1024 < 10

      if (!isAllow) {
        this.invoiceInfo[key] = []
        this.$message.error('请上传pdf、jpg、png、bmp、excel、word类型的文件')
        return false
      }
      if (!isLt10M) {
        this.invoiceInfo[key] = []
        this.$message.error('请上传小于10M的文件')
        return false
      }
      this.invoiceInfo[key] = []
      const formData = new FormData()
      formData.append('file', file.raw)
      formData.append('imageTypeNumber', '14')
      formData.append('businessId', this.$store.state.enterprise.enterpriseCertNo)

      formData.append('businessCode', '001')
      let res = await uploadApi(formData)
      if (res.code == 200) {
        this.invoiceInfo[key].push({
          fileName: res.data.fileName,
          name: res.data.fileName,
          fileNo: res.data.imageNumber,
          fileSize: res.data.fileSize,
          fileSuffix: res.data.fileName.substr(res.data.fileName.lastIndexOf('.') + 1),
          fileType: type,
        })
        this.$refs.invoiceInfo.clearValidate([key])
      }
    },
    // 移除文件
    handleRemove(file, fileList, key) {
      this.invoiceInfo[key] = []
    },
    // 取消ukey
    cancel() {
      this.$refs.ukey.open = false
    },
    // 提交ukey
    sure() {
      this.idDel ? this.delSumit() : this.modifySubmit()
    },
    // 删除提交
    delSumit() {
      API.invoiceDeleteApi({
        seqNo: this.seqNo,
      }).then(res => {
        if (res.code == 200) {
          this.$refs.ukey.open = false
          this.getList()
          this.$message({
            type: 'success',
            message: '操作成功',
          })
        }
      })
    },
    // 删除
    delInvoice() {
      this.idDel = true
      this.$confirm('是否删除该发票?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$refs.ukey.open = true
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    // 购买方切换
    buyerChange(val) {
      this.$staticData.core_enterprise.forEach(item => {
        if (item.dictValue == val) {
          this.invoiceInfo.buyerName = item.dictLabel
        }
      })
    },
    // 新增修改提交
    modifySubmit() {
      let params = JSON.parse(JSON.stringify(this.invoiceInfo))
      params.supplyCoCode = this.enterpriseCertNo
      params.supplyCoName = this.enterpriseName
      if (params.file.length > 0) params.fileList = [params.fileList[0], params.file[0]]
      delete params.file
      let requestMethod = this.seqNo ? API.invoiceUploadApi : API.invoiceAddApi
      requestMethod(params).then(res => {
        if (res.code == 200) {
          this.$refs.ukey.open = false
          this.$message({
            type: 'success',
            message: '操作成功',
          })
          this.close()
          this.getList()
        }
      })
    },
    // 取消
    close() {
      this.invoiceInfo = {
        number: '',
        code: '',
        buyerName: '',
        buyerCode: '',
        amount: '',
        exclTaxAmt: '',
        invoiceDate: '',
        file: [],
        fileList: [],
      }
      this.showDialog = false
    },
    // 确定
    confirm() {
      this.$refs.invoiceInfo.validate((valid, obj) => {
        if (valid) {
          this.$refs.ukey.open = true
        }
      })
    },

    // 批量导入
    importFile(file) {
      let formData = new FormData()
      formData.append('file', file.raw)
      let data = {
        formData,
        supply: {
          supplyCoCode: this.enterpriseCertNo,
          supplyCoName: this.enterpriseName,
        },
      }
      API.invoiceImportApi(data).then(res => {
        this.$message({
          type: 'success',
          message: res.msg,
        })
        this.getList()
      })
    },
    // 批量导入模板下载
    downloadTemplate() {
      API.getImportTemplateApi().then(res => {
        downloadWord(res, '发票导入模板.xlsx')
      })
    },
    // 上传发票清单
    uploadQd() {
      if (this.showUploadQd) {
        this.$message({
          type: 'warning',
          message: '发票清单已存在',
        })
      }
    },
    // 上传发票附件
    uploadFj() {
      if (this.showUpload) {
        this.$message({
          type: 'warning',
          message: '发票附件已存在',
        })
      }
    },
    async importInvoiceFile(file, type) {
      let allowType = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'application/vnd.ms-excel',
        'application/pdf',
        'image/bmp',
        'image/jpeg',
        'image/png',
      ]
      const isAllow = allowType.includes(file.raw.type)

      const isLt10M = file.raw.size / 1024 / 1024 < 10

      if (!isAllow) {
        this.$message.error('请上传pdf、jpg、png、bmp、excel、word类型的文件')
        return false
      }
      if (!isLt10M) {
        this.$message.error('请上传小于10M的文件')
        return false
      }
      const formData = new FormData()
      formData.append('file', file.raw)
      formData.append('imageTypeNumber', '14')
      formData.append('businessId', this.$staticData.core_enterprise[0].dictValue)
      formData.append('businessCode', '001')
      let res = await uploadApi(formData)
      if (res.code == 200) {
        let file1 = {
          fileName: res.data.fileName,
          name: res.data.fileName,
          fileNo: res.data.imageNumber,
          fileSize: res.data.fileSize,
          fileSuffix: res.data.fileName.substr(res.data.fileName.lastIndexOf('.') + 1),
          fileType: type,
        }
        this.multipleSelection[0].fileList.push(file1)
        let parmas = JSON.parse(JSON.stringify(this.multipleSelection[0]))
        API.invoiceUploadApi(parmas).then(res => {
          if (res.code == 200) {
            this.getList()
            this.$message({
              message: '上传成功',
              type: 'success',
            })
          }
        })
      }
    },
    search() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    reset() {
      this.billingDate = []
      this.queryParams = {
        buyerName: undefined,
        code: undefined,
        dateStart: undefined,
        dateEnd: undefined,
        buyer: undefined,
        status: undefined,
        pageSize: 10,
        pageNum: 1,
      }
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      if (val.length > 0) {
        this.seqNo = val[0].seqNo
        let fjList = val[0].fileList.filter(v => {
          return v.fileType == '0301'
        })
        this.showUpload = fjList.length == 1
        let qdList = val[0].fileList.filter(v => {
          return v.fileType == '0302'
        })
        this.showUploadQd = qdList.length == 1
        this.multipleSelection[0].supplyCoName = this.enterpriseName
        this.multipleSelection[0].supplyCoCode = this.enterpriseCertNo
      }
    },
    handleSizeOrCurrentChange() {
      this.getList()
    },
    viewImg(files, type) {
      if (files.length == 0) {
        this.$message({
          type: 'warning',
          message: '此发票暂无文件信息',
        })
        return
      }
      if (type == 'fj') {
        let fjList = files.filter(v => {
          return v.fileType == '0301'
        })
        if (fjList.length == 0) {
          this.$message({
            type: 'warning',
            message: '暂无发票附件',
          })
        } else {
          downloadImageApi({
            imageNumber: fjList[0].fileNo,
            type: 1,
          }).then(result => {
            downloadWord(result, fjList[0].fileName)
          })
        }
      }
      if (type == 'qd') {
        let qdList = files.filter(v => {
          return v.fileType == '0302'
        })
        if (qdList.length == 0) {
          this.$message({
            type: 'warning',
            message: '暂无发票清单',
          })
        } else {
          downloadImageApi({
            imageNumber: qdList[0].fileNo,
            type: 1,
          }).then(result => {
            downloadWord(result, qdList[0].fileName)
          })
        }
      }
    },
  },
}
</script>

<style lang="scss">
.root {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
.upload-demo {
  margin-left: 10px;
}
</style>
