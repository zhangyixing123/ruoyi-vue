<template>
  <div class="page-name app-container">
    <div class="page-name app-container" v-show="!showFiles">
      <el-form
        class="el-form-noValid flex-shrink-0"
        :model="queryParams"
        ref="queryForm"
        label-width="100px"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item :label="`民商信编号`" prop="creditCode">
              <el-input
                v-model.trim="queryParams.creditCode"
                :placeholder="`请输入民商信编号`"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="`开立项目`" prop="orderName">
              <el-input
                v-model.trim="queryParams.orderName"
                :placeholder="`请输入开立项目`"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="`订单编号`" prop="orderNo">
              <el-input
                v-model.trim="queryParams.orderNo"
                :placeholder="`请输入订单编号`"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="`订单状态`" prop="orderSts">
              <el-select
                v-model.trim="queryParams.orderSts"
                :placeholder="`请选择订单状态`"
                size="small"
              >
                <el-option
                  v-for="status in $staticData.order_status"
                  :key="status.dictValue"
                  :label="status.dictLabel"
                  :value="status.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="`审批状态`" prop="status">
              <el-select
                v-model.trim="queryParams.status"
                :placeholder="`请选择审批状态`"
                size="small"
              >
                <el-option
                  v-for="status in $staticData.open_credit_status"
                  :key="status.dictValue"
                  :label="status.dictLabel"
                  :value="status.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="`申请日期`" prop="createTime">
              <el-date-picker
                :clearable="false"
                v-model.trim="createTime"
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
            <el-button type="primary" plain icon="el-icon-add" size="mini" @click="addApply"
              >新增申请</el-button
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
          <el-table-column label=" 民商信编号" align="center" prop="creditCode" />
          <el-table-column
            label="开立方"
            align="center"
            prop="openerName"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="项目名称" align="center" prop="orderName" />
          <el-table-column label="订单编号" align="center" prop="orderNo" />
          <el-table-column label="订单金额 " align="center" prop="orderAmount" />
          <el-table-column
            label="订单状态"
            align="center"
            :formatter="orderStsFormatter"
            prop="orderSts"
          />
          <el-table-column label="申请材料" align="center" prop="issuanceDate">
            <template slot-scope="scope"
              ><el-button plain size="small" type="primary" @click="seeFile(scope.row)"
                >查看</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="申请日期" align="center" prop="createTime" />
          <el-table-column label="申请人" align="center" prop="createUser" />
          <el-table-column
            label="审批状态"
            align="center"
            :formatter="statusFormatter"
            prop="status"
          />
          <el-table-column label="备注" align="center" prop="applyRemark" />
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
    >
      <el-form ref="formData" :model="formData" :rules="formDataRules" label-width="120px">
        <el-row class="p-t-10">
          <el-col v-show="type == 'sure'">
            <el-form-item :label="`开立方`" prop="openerCode" class="is-required">
              <el-select
                v-model.trim="formData.openerCode"
                :placeholder="`请选择开立方`"
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
            <el-form-item :label="`订单编号`" prop="orderNo">
              <el-input v-model.trim="formData.orderNo" :disabled="true">
                <i slot="suffix" class="el-icon-search" @click="searchIcon"></i
              ></el-input>
            </el-form-item>
            <el-form-item :label="`开立项目`" prop="orderName" class="is-required">
              <el-input v-model.trim="formData.orderName" disabled></el-input>
            </el-form-item>
            <el-form-item :label="`订单金额`" prop="orderAmount" class="is-required">
              <el-input v-model.trim="formData.orderAmount" disabled></el-input>
            </el-form-item>
            <el-form-item :label="`订单状态`" prop="orderSts" class="is-required">
              <el-select v-model.trim="formData.orderSts" disabled :placeholder="`请选择订单状态`">
                <el-option
                  v-for="status in $staticData.order_status"
                  :key="status.dictValue"
                  :label="status.dictLabel"
                  :value="Number(status.dictValue)"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="`上传凭证`" prop="proofs" class="is-required">
              <el-upload
                class="upload-demo"
                drag
                :action="uploadFileUrl"
                multiple
                ref="uploaddemo"
                show-file-list
                :on-error="handleUploadError"
                :on-success="handleUploadSuccess"
                :before-upload="handleBeforeUpload"
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
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" v-model.trim="formData.remark"></el-input>
            </el-form-item>
          </el-col>

          <el-col v-show="type == 'refuse'"
            ><el-form-item :label="`拒绝原因`" prop="ukey" class="is-required">
              <el-input
                type="textarea"
                v-model.trim="formData.reasonRejection"
              ></el-input> </el-form-item></el-col
        ></el-row>
      </el-form>
      <div slot="footer" class="dialog-footer text-center">
        <el-button type="primary" @click="applyFn">申请</el-button>
        <el-button type="warning" @click="cancel">取消</el-button>
      </div>
    </el-dialog>
    <!-- 订单列表弹框 -->
    <choose-order-list
      ref="chooseOrderList"
      :open.sync="orderOpen"
      @echoData="echoData"
    ></choose-order-list>

    <!-- 文件列表 -->
    <vocher-file
      v-show="showFiles"
      @hideFiles="hideFiles"
      :seqNo="seqNo"
      :fileType="fileType"
    ></vocher-file>
  </div>
</template>

<script>
import chooseOrderList from './components/orderList'
import vocherFile from '../downloadCenter/vocher-file.vue'
import { downloadImageApi, batchDownloadFileApi } from '@/api/image-management'
import { downloadZip, downloadWord } from '@/utils/ruoyi'
import { msxOpenRecordreditApplyApi } from '@/api/civil_and_ommercial_letter/zq'
import { getToken } from '@/utils/auth'
import { listOpenRecordPageApi, listFilePageApi } from '@/api/civil_and_ommercial_letter/zq'
export default {
  name: 'dataList',
  components: {
    chooseOrderList,
    'vocher-file': vocherFile,
  },
  data() {
    return {
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
      loading: false,
      tableData: [],
      showFiles: false, // 凭证文件
      total: 0,
      pageSize: 10,
      pageNum: 1,
      issuanceDate: [],
      single: '',
      ids: '',
      title: '',
      open: false,
      orderOpen: false,
      type: '',
      fileType: '', //文件类型
      createTime: '', //申请日期
      queryParams: {
        pageSize: 10,
        pageNum: 1,
        creditCode: null, //民商信编号
        orderName: null, //项目名称
        orderNo: null, //订单编号
        orderSts: null, //订单状态
        status: null, //审批状态
        createTimeStart: null,
        createTimeEnd: null,
        ownId: this.$store.state.enterprise.enterpriseId, //企业ID
      },
      formData: {
        openerName: '', //开立方名称
        openerCode: '', //开立方编号
        orderName: '', //项目名称
        orderNo: '', //订单编号
        orderAmount: '', //订单金额
        orderSts: '', //订单状态
        remark: '',
        proofs: [], //文件id
        ownId: this.$store.state.enterprise.enterpriseId, //企业ID
        ownName: this.$store.state.enterprise.enterpriseName, //企业名称
        ownCertNo: this.$store.state.enterprise.enterpriseCertNo, //企业信用代码
      },
      fileObiectInfo: {},
      formDataRules: {
        openerCode: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '此项必填',
          },
        ],
        orderName: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '此项必填',
          },
        ],
        orderNo: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '此项必填',
          },
        ],
        orderAmount: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '此项必填',
          },
        ],
        orderSts: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '此项必填',
          },
        ],
        proofs: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '此项必填',
          },
        ],
        remark: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '此项必填',
          },
        ],
      },
    }
  },
  mounted: function() {
    if (this.$staticData.core_enterprise) {
      this.loaddata.businessId = this.$staticData.core_enterprise[0].dictValue
    }
    this.getList()
  },

  methods: {
    // 弹出订单列表弹框
    searchIcon() {
      this.orderOpen = true
    },

    // 确认选择回显数据
    echoData(data) {
      this.formData.orderNo = data.orderNo
      this.formData.orderName = data.orderName
      this.formData.orderAmount = data.orderAmount
      this.formData.orderSts = data.orderSts
    },
    getList() {
      listOpenRecordPageApi(this.queryParams).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.rows
          this.total = res.data.total
          this.loading = false
        }
      })
    },
    //查询
    handleQuery() {
      this.queryParams.createTimeStart = this.createTime[0]
      this.queryParams.createTimeEnd = this.createTime[1]
      this.queryParams.pageNum = 1
      this.pageNum = 1
      this.getList()
    },
    //重置
    resetQuery() {
      this.createTime = []

      this.queryParams = {
        pageSize: 10,
        pageNum: 1,
        creditCode: null, //民商信编号
        orderName: null, //项目名称
        orderNo: null, //订单编号
        orderSts: null, //订单状态
        status: null, //审批状态
        createTimeStart: null,
        createTimeEnd: null,
        ownId: this.$store.state.enterprise.enterpriseId, //企业ID
      }
      this.formData = {
        openerName: '', //开立方名称
        openerCode: '', //开立方编号
        orderName: '', //项目名称
        orderNo: '', //订单编号
        orderAmount: '', //订单金额
        orderSts: '', //订单状态
        remark: '',
        proofs: [], //文件id
        ownId: this.$store.state.enterprise.enterpriseId, //企业ID
        ownName: this.$store.state.enterprise.enterpriseName, //企业名称
        ownCertNo: this.$store.state.enterprise.enterpriseCertNo, //企业信用代码
      }
      this.handleQuery()
    },
    //新增申请
    addApply() {
      this.open = true
      this.title = '新增申请'
      this.type = 'sure'
    },
    //拒绝签收
    refuseSign() {
      this.title = '不同意'
      this.open = true
      this.type = 'refuse'
    },
    // 查看文件
    seeFile(row) {
      this.showFiles = true
      this.seqNo = row.creditCode
      this.fileType = 'open'
    },

    // 隐藏文件
    hideFiles() {
      this.showFiles = false
    },
    //查看凭证
    // seeVoucher() {
    //   //跳转下载中心
    //   this.$router.push({
    //     name: 'DownloadCenter/index',
    //     query: {},
    //   })
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
          fileSize: file.size,
          fileSuffix: file.name.split('.')[1],
          imageTypeNumber: '12',
          fileId: res.data.imageNumber,
        }
        this.formData.proofs.push(this.fileObiectInfo)
        this.$message.success('上传成功')
      } else {
        fileList.pop()
        this.$message.error(res.msg)
      }
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
          message: '请上传后缀名为jpg、png、 pdf、 xls、xlsx、zip或rar的附件！',
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
      this.resetForm('formData')
      this.formData.proofs = []
      this.$refs.uploaddemo.clearFiles()
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
      this.ids = selection.map(item => item.msxId)
      this.single = selection.length != 1
    },
    // 确认申请
    applyFn() {
      this.$refs.formData.validate((val, obj) => {
        if (val) {
          const item = this.$staticData.core_enterprise.filter(
            item => item.dictValue == this.formData.openerCode
          )
          this.formData.openerName = item[0].dictLabel
          msxOpenRecordreditApplyApi(this.formData).then(res => {
            if (res.code == 200) {
              this.msgSuccess('成功')
              this.getList()
              this.open = false
              this.resetQuery()
            } else {
              this.msgSuccess('失败')
              this.open = false
              this.resetQuery()
            }
          })
        }
      })
    },
    cancel() {
      this.open = false
      this.formData = {}
    },

    // 订单状态字典翻译
    orderStsFormatter(row, column) {
      if (row.menuType == 'F') {
        return ''
      }
      return this.selectDictLabel(this.$staticData.order_status, row.orderSts)
    },

    // 审批状态字典翻译
    statusFormatter(row, column) {
      if (row.menuType == 'F') {
        return ''
      }
      return this.selectDictLabel(this.$staticData.open_credit_status, row.status)
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
::v-deep .page-name ::v-deep .app-container {
  height: 100%;
}
</style>
