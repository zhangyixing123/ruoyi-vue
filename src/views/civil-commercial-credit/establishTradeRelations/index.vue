<template>
  <div class="page-name app-container">
    <div class="page-name" v-show="!showFiles">
      <el-form
        class="el-form-noValid flex-shrink-0"
        :model="queryParams"
        ref="queryForm"
        label-width="100px"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item :label="`贸易对象`" prop="coreCoCode">
              <el-select
                v-model.trim="queryParams.coreCoCode"
                :placeholder="`请选择贸易对象`"
                size="small"
              >
                <el-option
                  v-for="dict in $staticData.core_enterprise"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="`贸易关系`" prop="relationStatus">
              <el-select v-model.trim="relationStatus" :placeholder="`请选择贸易关系`" size="small">
                <el-option
                  v-for="status in $staticData.relations_status"
                  :key="status.dictValue"
                  :label="status.dictLabel"
                  :value="status.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="`创建时间`" prop="createDate">
              <el-date-picker
                :clearable="false"
                v-model.trim="createDate"
                size="small"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="daterange"
                range-separator="-"
                :start-placeholder="`开始时间`"
                :end-placeholder="`结束时间`"
                :default-time="['00:00:00', '23:59:59']"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">
                查询
              </el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">
                重置
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="flex-shrink-0">
        <el-row :gutter="10" class="mb8 flex-shrink-0">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="el-icon-add" size="mini" @click="addFn"
              >新增</el-button
            >
          </el-col>

          <!-- <el-col :span="1.5">
            <el-button type="warning" plain icon="el-icon-add" size="mini" @click="seeVoucher"
              >下载凭证</el-button
            >
          </el-col> -->
        </el-row>
      </div>
      <!-- 剩余空间通过 flex1 全部分给表格，over-hidden 必须使用 -->
      <div class="flex1 over-hidden">
        <!-- el-table 配置 height 属性 100%，起到自动撑开，且表格标题固定的效果； -->
        <el-table
          height="100%"
          v-loading="loading"
          :data="tableData"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="编号" align="center" type="index" />
          <el-table-column
            label="贸易对象"
            align="center"
            prop="coreCoCode"
            :formatter="coreEnterpriseFormatter"
          />
          <el-table-column label="创建日期" align="center" prop="createTime" />
          <el-table-column label="创建人" align="center" prop="createUser" />
          <el-table-column label="凭证文件" align="center" prop="applicationMaterials">
            <template slot-scope="scope"
              ><el-button plain size="small" type="primary" @click="seeFile(scope.row)"
                >查看</el-button
              >
            </template>
          </el-table-column>
          <el-table-column
            label="贸易关系"
            align="center"
            prop="relationStatus"
            :formatter="relationStatusFormatter"
          />
          <el-table-column label="融资关系" align="center" prop="financingRelationship">
            <template slot-scope="scope"
              ><el-button plain size="small" type="primary" @click="seeDetail(scope.row)"
                >详情</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center" prop="applyReason" />
        </el-table>
      </div>
      <!-- 分页必须加 flex-shrink-0 样式不一定用我的，好看就行 -->
      <!-- size-change 和 current-change 统一用一个时间处理就行了，无非是再去获取列表数据 -->
      <el-pagination
        class="text-center bgfff pd10 flex-shrink-0"
        layout="total, sizes, prev, pager, next, jumper"
        :current-page.sync="pageNum"
        :page-sizes="[10, 20, 30, 50]"
        :page-size.sync="pageSize"
        @size-change="handleSizeOrSizePageChange"
        @current-change="handleSizeOrCurrentChange"
        :total="total"
      >
      </el-pagination>
    </div>

    <el-dialog
      :modal-append-to-body="false"
      :title="title"
      :visible.sync="open"
      @close="close"
      width="600px"
      append-to-body
      class="el-dialog-center"
    >
      <el-table
        v-loading="loading"
        :data="financingTableData"
        height="50vh"
        v-show="type == 'list'"
      >
        <el-table-column label="编号" align="center" prop="funderCode" />
        <el-table-column label="融资方" align="center" prop="funderName" />
        <el-table-column
          label="融资关系状态"
          align="center"
          prop="relationStatus"
          :formatter="finacingRelationStatusFormatter"
        />
      </el-table>
      <div slot="footer" class="dialog-footer text-center" v-show="type == 'list'">
        <el-button type="warning" @click="cancel">取消</el-button>
      </div>

      <el-form
        ref="addFormDate"
        :model="addFormDate"
        :rules="addFormDateRules"
        label-width="120px"
        v-show="type == 'add'"
      >
        <el-row class="p-t-10">
          <el-col>
            <el-form-item :label="`贸易对象`" prop="coreCoCode">
              <el-select
                v-model.trim="addFormDate.coreCoCode"
                :placeholder="`请选择贸易对象`"
                size="small"
              >
                <el-option
                  v-for="status in $staticData.core_enterprise"
                  :key="status.dictValue"
                  :label="status.dictLabel"
                  :value="status.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="fileList" class="is-required">
              <el-upload
                class="upload-demo"
                drag
                ref="uploaddemo"
                :action="uploadFileUrl"
                multiple
                show-file-list
                :before-upload="handleBeforeUpload"
                :on-error="handleUploadError"
                :on-success="handleUploadSuccess"
                :headers="headers"
                :data="loaddata"
                :on-remove="removeFile"
                accept="jpg/png/excel/pdf/rar/zip"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">
                  支持上传jpg/png/excel/pdf/rar/zip文件，文件大小不建议超过20M
                </div>
              </el-upload>
            </el-form-item>
            <el-form-item label="备注" prop="applyReason">
              <el-input type="textarea" v-model.trim="addFormDate.applyReason"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer text-center" v-show="type == 'add'">
        <el-button type="primary" @click="confirmFn">确认</el-button>
        <el-button type="warning" @click="cancel">取消</el-button>
      </div>
    </el-dialog>
    <vocher-file v-show="showFiles" @hideFiles="hideFiles" :seqNo="seqNo"></vocher-file>
  </div>
</template>

<script>
import {
  tradeRelationListApi,
  addTradeRelationApi,
  financingRelationDetailApi,
} from '@/api/civil_and_ommercial_letter/zq'
import vocherFile from '../downloadCenter/vocher-file.vue'
import { getToken } from '@/utils/auth'
// import moment from 'moment'

export default {
  name: 'dataList',
  components: {
    'vocher-file': vocherFile,
  },
  data() {
    var validateCheck = (rule, value, callback) => {
      if (!value) {
        callback('后续操作需勾选协议！')
      } else {
        callback()
      }
    }
    return {
      relationStatus: '',
      seqNo: '',
      uploadFileUrl: process.env.VUE_APP_BASE_API + '/cls/image/app/image/upload', // 上传的图片服务器地址
      headers: {
        Authorization: 'Bearer ' + getToken(),
      },
      loaddata: {
        imageTypeNumber: '11',
        businessId: '',
        businessCode: '001',
      },
      isLt20M: '',
      showFiles: false, // 凭证文件
      createDate: [],
      type: '',
      loading: false,
      addFormDate: {
        coreCoName: '11', //核心企业名称
        supplierId: '', //供应商企业Id
        coreCoCode: '',
        applyReason: '',
        fileList: [],
      },
      tableData: [],
      financingTableData: [],
      total: 0,
      pageSize: 10,
      pageNum: 1,
      issuanceDate: [],
      single: '',
      title: '',
      open: false,
      type: '',
      queryParams: {
        relationStatus: [], //贸易关系
        coreCoCode: null, //贸易对象
        startCreateTime: null, //开始创建时间
        endCreateTime: null, //结束创建时间
        pageSize: 10,
        pageNum: 1,
      },
      formData: {
        check: true,
        ukey: '',
        reasonRejection: '',
      },
      addFormDateRules: {
        coreCoCode: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '此项必填',
          },
        ],
        applyReason: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '此项必填',
          },
        ],
        fileList: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '此项必填',
          },
        ],
      },
      formDataRules: {
        ukey: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '此项必填',
          },
        ],
        check: [
          {
            validator: validateCheck,
            trigger: ['change'],
          },
        ],
      },
    }
  },
  mounted: function() {
    this.getList()
  },
  created() {
    if (this.$staticData.core_enterprise) {
      this.loaddata.businessId = this.$staticData.core_enterprise[0].dictValue
    }
  },
  methods: {
    getList() {
      this.queryParams.supplierCode = this.$store.state.enterprise.enterpriseCertNo
      if (this.relationStatus) {
        this.queryParams.relationStatus.push(Number(this.relationStatus))
      }
      tradeRelationListApi(this.queryParams).then(res => {
        this.tableData = res.data.rows
        this.total = Number(res.data.total)
      })
    },
    //查询
    handleQuery() {
      this.queryParams.relationStatus = []
      if (this.createDate) {
        this.queryParams.startCreateTime = this.createDate[0]
        this.queryParams.endCreateTime = this.createDate[1]
      }

      this.queryParams.pageNum = 1
      this.pageNum = 1
      this.getList()
    },
    //重置
    resetQuery() {
      this.relationStatus = null

      this.queryParams.relationStatus = []
      this.createDate = []
      this.resetForm('queryForm')
      this.resetForm('addFormDate')
      this.addFormDate.fileList = []
      this.handleQuery()
    },
    // 查看详情
    seeDetail(row) {
      financingRelationDetailApi({ seqNo: row.seqNo }).then(res => {
        this.financingTableData = res.data
      })
      this.type = 'list'
      this.open = true
    },
    // 上传前校检格式和大小
    handleBeforeUpload(file) {
      // 校检文件类型
      var FileExt = file.name.replace(/.+\./, '')
      if (
        ['jpg', 'png', 'zip', 'rar', 'pdf', 'xls', 'xlsx'].indexOf(FileExt.toLowerCase()) === -1
      ) {
        this.$message({
          type: 'warning',
          message: '请上传后缀名为jpg、png、 pdf、xls、xlsx、zip或rar的附件！',
        })
        return false
      }
      // 校检文件大小
      this.isLt20M = file.size / 1024 / 1024 < 20 ? '1' : '0'
      if (this.isLt20M === '0') {
        this.$message({
          message: '上传文件大小不能超过20M!',
          type: 'error',
        })
      }
      return this.isLt20M === '1' ? true : false
    },
    // 移除失败文件
    // beforeRemove(file, fileList) {
    //   if (this.isLt20M === '1' || this.isLt20M === '') {
    //     return this.$confirm(`确定移除 ${file.name}`)
    //   } else if (this.isLt20M === '0') {
    //     return true
    //   }
    // },
    // 上传失败
    handleUploadError(err) {
      this.$message.error('上传失败, 请重试')
    },
    // 上传成功回调
    handleUploadSuccess(res, file, fileList) {
      if (res.code == 200) {
        this.fileObiectInfo = {
          fileName: file.name,
          fileNo: res.data.imageNumber,
          fileSize: file.size,
          fileSuffix: file.name.split('.')[1],
          fileType: '11',
        }

        this.addFormDate.fileList.push(this.fileObiectInfo)
        this.$message.success('上传成功')
      } else {
        fileList.pop()
        this.$message.error(res.msg)
      }
    },
    // 删除文件
    removeFile(file, fileList) {
      let arr = []
      fileList.forEach(e => {
        arr.push(e.response.data.imageNumber)
      })
      this.formData.proofs = arr
    },
    // 关闭弹窗
    close() {
      this.resetForm('addFormDate')
      this.$refs.uploaddemo.clearFiles()
    },
    // 查看文件
    seeFile(row) {
      this.seqNo = row.seqNo
      this.showFiles = true
    },

    // 隐藏文件
    hideFiles() {
      this.showFiles = false
    },
    // 新增
    addFn() {
      this.type = 'add'
      this.open = true
    },
    //查看凭证
    // seeVoucher() {
    //   //跳转下载中心
    //   this.$router.push({
    //     name: 'DownloadCenter/index',
    //     query: {},
    //   })
    // },
    // 确认
    confirmFn() {
      this.$refs.addFormDate.validate((val, obj) => {
        if (val) {
          // 添加贸易关系
          const newArr = this.$staticData.core_enterprise.filter(
            item => item.dictValue == this.addFormDate.coreCoCode
          )
          this.addFormDate.supplierId = this.$store.state.enterprise.enterpriseId
          this.addFormDate.coreCoName = newArr[0].dictLabel
          addTradeRelationApi(this.addFormDate).then(res => {
            if (res.code == 200) {
              this.msgSuccess('成功')
              this.type = ''
              this.open = false
              // 重新获取文件列表
              this.getList()
            } else {
              this.open = false
              this.msgSuccess('失败')
            }
          })
        }
      })
    },
    cancel() {
      this.open = false
      this.formData = {}
      this.resetForm('addFormDate')
    },

    handleSizeOrSizePageChange(page) {
      this.queryParams.pageSize = page
      this.getList()
    },
    handleSizeOrCurrentChange(page) {
      this.queryParams.pageNum = page
      this.getList()
    },

    handleSelectionChange(selection) {
      this.seqNo = selection.map(item => item.seqNo)
      this.single = selection.length != 1
    },
    submitForm() {
      this.$refs.formData.validate((val, obj) => {
        if (val) {
          this.cancel()
        }
      })
    },

    // 贸易关系状态字典翻译
    relationStatusFormatter(row, column) {
      if (row.menuType == 'F') {
        return ''
      }
      return this.selectDictLabel(this.$staticData.relations_status, row.relationStatus)
    },

    // 贸易关系状态字典翻译
    finacingRelationStatusFormatter(row, column) {
      if (row.menuType == 'F') {
        return ''
      }
      return this.selectDictLabel(this.$staticData.financing_relation_status, row.relationStatus)
    },

    // 贸易对象字典翻译
    coreEnterpriseFormatter(row, column) {
      if (row.menuType == 'F') {
        return ''
      }
      if (this.$staticData.core_enterprise)
        return this.selectDictLabel(this.$staticData.core_enterprise, row.coreCoCode)
    },
  },
}
</script>

<style lang="scss" scoped>
/* style 建议使用, scoped 可以用可不用，如果不用 scoped，第一级必须是 本页面的独有的page-name */
/* 必须按规范，不然会对别人的页面造成样式干扰 */
.page-name {
  padding: 10px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

::v-deep .el-table {
  display: flex;
  flex-direction: column;
}

::v-deep .el-table__body-wrapper {
  flex: 1;
}
</style>
