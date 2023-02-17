<template>
  <div class="root app-container">
    <el-form label-width="120px" class="flex-shrink-0" ref="queryParams">
      <el-row>
        <el-col :span="6">
          <el-form-item label="合同编码">
            <el-input
              v-model.trim="queryParams.code"
              size="small"
              :placeholder="`请输入合同编码`"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="合同名称">
            <el-input
              v-model.trim="queryParams.name"
              size="small"
              :placeholder="`请输入合同名称`"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="合同生效日期">
            <div class="flex align-center">
              <div class="flex1">
                <el-date-picker
                  :clearable="false"
                  v-model.trim="billingDate"
                  size="small"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="daterange"
                  range-separator="-"
                  :start-placeholder="`开始时间`"
                  :end-placeholder="`结束时间`"
                  :default-time="['00:00:00', '23:59:59']"
                ></el-date-picker>
              </div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="">
            <el-button type="primary" @click="search" size="small">查 询</el-button>
            <el-button @click="reset" size="small">重 置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="flex-shrink-0">
      <el-button icon="el-icon-add" size="mini" @click="addContract" type="warning" plain
        >新增合同</el-button
      >
      <el-button
        @click="editContract"
        icon="el-icon-edit"
        :disabled="multipleSelection.length != 1"
        size="mini"
        type="primary"
        >编辑</el-button
      >
      <el-button
        @click="delContract"
        icon="el-icon-delete"
        :disabled="multipleSelection.length != 1"
        size="mini"
        type="danger"
        >删除</el-button
      >
    </div>
    <div class="flex1 over-hidden m-t-10">
      <el-table @selection-change="handleSelectionChange" :data="tableData">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="合同编号" align="center" prop="code" />
        <el-table-column label="合同名称" align="center" prop="name" />
        <el-table-column label="合同金额(元)" align="center" prop="amount" />
        <el-table-column label="购买方" align="center" prop="buyerName" />
        <el-table-column label="合同生效日期" align="center" prop="effectiveTime" />
        <el-table-column label="上传完成时间" align="center" prop="uploadTime" />
        <el-table-column label="合同附件" align="center">
          <template slot-scope="scope">
            <el-button @click="viewImg(scope.row)" type="text">下载</el-button>
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
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :total="total"
    >
    </el-pagination>
    <el-dialog
      :modal-append-to-body="false"
      width="720px"
      custom-class="el-dialog-center"
      :visible.sync="showDialog"
      @close="close"
    >
      <b slot="title">{{ seqNo ? '编辑合同' : '新增合同' }}</b>
      <el-form ref="contractInfo" :model="contractInfo" :rules="contractRules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="合同编码" prop="code">
              <el-input
                v-model.trim="contractInfo.code"
                size="small"
                maxlength="20"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同名称" prop="name">
              <el-input
                v-model.trim="contractInfo.name"
                size="small"
                maxlength="20"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="购买方" prop="buyerCode">
              <el-select
                v-model.trim="contractInfo.buyerCode"
                placeholder="请选择"
                size="small"
                @change="buyerChange(contractInfo.buyerCode)"
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
            <el-form-item label="合同金额" prop="amount">
              <el-input
                v-model.trim="contractInfo.amount"
                size="small"
                maxlength="20"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同生效日期" prop="effectiveTime">
              <el-date-picker
                :clearable="false"
                v-model.trim="contractInfo.effectiveTime"
                size="small"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                range-separator="-"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item label="合同附件" prop="fileList">
              <el-upload
                action=" "
                :auto-upload="false"
                accept=".docx,.pdf"
                :limit="1"
                :file-list="contractInfo.fileList"
                :on-change="(file, fileList) => handleImgChange(file, fileList, 'fileList')"
                :on-remove="(file, fileList) => handleRemove(file, fileList, 'fileList')"
              >
                <el-button size="mini" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item>
              1.请上传pdf、word文件。<br />
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
import * as API from '@/api/invoice-management'
import { uploadApi, downloadImageApi } from '@/api/image-management'
import { mapState } from 'vuex'
import { validTwoPoint } from '@/utils/validate'
import { downloadWord } from '@/utils/ruoyi'
import ukey from '@/views/components/ukey.vue'
export default {
  name: 'bills-manage-contract',
  components: {
    ukey,
  },
  data() {
    const amountValidator = (rules, value, callback) => {
      if (!value) {
        return callback('请输入合同金额！')
      }
      if (!validTwoPoint(value)) {
        return callback('合同金额大于零且最多两位小数！')
      }
      callback()
    }
    return {
      loading: false,
      multipleSelection: [],
      tableData: [],
      total: 0,
      queryParams: {
        code: undefined,
        name: undefined,
        startEffectiveTime: undefined,
        endEffectiveTime: undefined,
        supplierCode: undefined,
        pageSize: 10,
        pageNum: 1,
      },
      billingDate: [], // 生效时间
      eventName: '',
      fileType: '',
      multiple: false,
      files: [],
      showDialog: false,
      contractInfo: {
        code: '',
        name: '',
        buyerName: '',
        buyerCode: '',
        amount: '',
        effectiveTime: '',
        fileList: [],
      },
      contractRules: {
        code: [
          {
            required: true,
            trigger: ['blur'],
            message: '请输入合同编码',
          },
        ],
        name: [
          {
            required: true,
            trigger: ['blur'],
            message: '请输入合同名称',
          },
        ],
        buyerCode: [
          {
            required: true,
            trigger: ['blur', 'change'],
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
        effectiveTime: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请选择合同生效日期',
          },
        ],
        fileList: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请上传合同附件',
          },
        ],
      },
      seqNo: '',
      isDel: false, // 是否是删除
    }
  },
  created() {
    this.getList()
  },
  computed: {
    ...mapState({
      enterpriseCertNo: state => state.enterprise.enterpriseCertNo,
      enterpriseName: state => state.enterprise.enterpriseName,
    }),
  },
  methods: {
    getList() {
      let params = JSON.parse(JSON.stringify(this.queryParams))
      if (this.billingDate.length > 0) {
        params.startEffectiveTime = this.billingDate[0]
        params.endEffectiveTime = this.billingDate[1]
      }
      params.supplierCode = this.enterpriseCertNo
      API.contractApi(params).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.rows
          this.total = res.data.total
        }
      })
    },
    // 重置
    reset() {
      this.billingDate = []
      this.queryParams = {
        code: undefined,
        name: undefined,
        startEffectiveTime: undefined,
        endEffectiveTime: undefined,
        supplierCode: undefined,
        pageSize: 10,
        pageNum: 1,
      }
      this.getList()
    },
    // 查询
    search() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    // 新增
    addContract() {
      this.seqNo = ''
      this.showDialog = true
      this.isDel = false
      this.$nextTick(() => {
        this.$refs.contractInfo.clearValidate()
      })
    },
    // 修改
    async editContract() {
      this.isDel = false
      let res = await API.contractDetailApi(this.seqNo)
      if (res.code === 200) {
        this.contractInfo = res.data
        this.showDialog = true
      }
      API.voucherApi(this.seqNo).then(res => {
        if (res.code === 200) {
          res.data[0].name = res.data[0].fileName
          this.$set(this.contractInfo, 'fileList', res.data)
        }
      })
    },
    async handleImgChange(file, fileList, key) {
      const isJPG =
        file.raw.type ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.raw.type === 'application/pdf'
      const isLt10M = file.raw.size / 1024 / 1024 < 10

      if (!isJPG) {
        this.contractInfo[key] = []
        this.$message.error('请上传pdf、word类型的文件')
        return false
      }
      if (!isLt10M) {
        this.contractInfo[key] = []
        this.$message.error('请上传小于10M的文件')
        return false
      }
      this.contractInfo[key] = []
      const formData = new FormData()
      formData.append('file', file.raw)
      formData.append('imageTypeNumber', '13')
      formData.append('businessId', this.$staticData.core_enterprise[0].dictValue)
      formData.append('businessCode', '001')
      let res = await uploadApi(formData)
      if (res.code == 200) {
        this.contractInfo[key].push({
          fileName: res.data.fileName,
          name: res.data.fileName,
          fileNo: res.data.imageNumber,
          fileSize: res.data.fileSize,
          fileSuffix: res.data.fileName.substr(res.data.fileName.lastIndexOf('.') + 1),
          fileType: res.data.imageTypeNumber,
        })
        this.$refs.contractInfo.clearValidate([key])
      }
    },
    handleRemove() {
      this.contractInfo.fileList = []
    },
    // 取消
    close() {
      this.contractInfo = {
        code: '',
        name: '',
        buyerName: '',
        buyerCode: '',
        amount: '',
        effectiveTime: '',
        fileList: [],
      }
      this.showDialog = false
    },
    // 取消ukey
    cancel() {
      this.$refs.ukey.open = false
    },
    // 提交ukey
    sure() {
      this.isDel ? this.delSumit() : this.modifySubmit()
    },
    // 购买方切换
    buyerChange(val) {
      this.$staticData.core_enterprise.forEach(item => {
        if (item.dictValue == val) {
          this.contractInfo.buyerName = item.dictLabel
        }
      })
    },
    // 新增修改提交
    modifySubmit() {
      let params = JSON.parse(JSON.stringify(this.contractInfo))
      params.supplierCode = this.enterpriseCertNo
      params.supplierName = this.enterpriseName
      let requestMethod = this.seqNo ? API.contractUploadApi : API.contractAddApi
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
    // 确认
    confirm() {
      this.$refs.contractInfo.validate((valid, obj) => {
        if (valid) {
          this.$refs.ukey.open = true
        }
      })
    },
    // 删除提交
    delSumit() {
      API.contractDeleteApi(this.seqNo).then(res => {
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
    delContract() {
      this.isDel = true
      this.$confirm('是否删除该合同?', '提示', {
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

    handleSelectionChange(val) {
      this.multipleSelection = val
      if (val.length > 0) this.seqNo = val[0].seqNo
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getList()
    },
    viewImg(row) {
      API.voucherApi(row.seqNo).then(res => {
        if (res.code === 200) {
          downloadImageApi({
            imageNumber: res.data[0].fileNo,
            type: 1,
          }).then(result => {
            downloadWord(result, res.data[0].fileName)
          })
        }
      })
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
</style>
