<template>
  <div class="page-name app-container">
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
              size="small"
              placeholder="请输入民商信编号"
              v-model.trim="queryParams.creditCode"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="`开立日期`" prop="openDate">
            <el-date-picker
              :clearable="false"
              v-model.trim="queryParams.openDate"
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
          <el-button
            type="primary"
            plain
            icon="el-icon-add"
            size="mini"
            @click="confirmSignBtn"
            :disabled="single"
          >
            确认签收
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="el-icon-edit"
            size="mini"
            @click="refuseSignBtn"
            :disabled="single"
          >
            拒绝签收
          </el-button>
        </el-col>
        <!-- <el-col :span="1.5">
          <el-button type="warning" plain icon="el-icon-add" size="mini" @click="seeVoucher">
            查看凭证
          </el-button>
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
        <el-table-column label="民商信编号" align="center" prop="creditCode" />
        <el-table-column label="接收方" align="center" prop="ownName" />
        <el-table-column label="开立方" align="center" prop="openerName" />
        <el-table-column label="民商信金额(元)" align="center" prop="creditLimit" />
        <el-table-column label="承诺付款日" align="center" prop="payTime" />
        <el-table-column label="开立日期" align="center" prop="openDate" />
        <el-table-column label="融资付息模式" align="center" prop="interestType">
          <template slot-scope="scope">
            <span>
              {{ scope.row.interestType | dictFilter(financeModeList) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="addition" />
        <el-table-column label="付款承诺函" align="center">
          <template slot-scope="scope">
            <el-button size="small" type="text" plain @click="checkCommitment(scope.row)">
              查看
            </el-button>
            <el-button size="small" type="text" plain @click="downloadCommitment(scope.row)">
              下载
            </el-button>
          </template>
        </el-table-column>
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
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :total="total"
    >
    </el-pagination>
    <el-dialog
      :modal-append-to-body="false"
      :title="dialogTitle"
      :visible.sync="showSignDialog"
      width="600px"
      append-to-body
      @close="cancel"
    >
      <el-form ref="formData" :model="formData" :rules="formDataRules" label-width="120px">
        <el-row class="p-t-10">
          <el-col v-if="signType == '1'">
            <el-form-item :label="`请输入用户口令`" prop="ukey" class="is-required">
              <el-input v-model.trim="formData.ukey" type="password"></el-input>
            </el-form-item>

            <!-- <el-form-item label-width="0px" prop="check">
              <div class="flex">
                <el-checkbox v-model.trim="formData.check"></el-checkbox>
                <div class="flex">
                  我已阅读并同意
                  <el-button type="text">《民商信支付转让协议》</el-button>
                </div>
              </div>
            </el-form-item> -->
          </el-col>
          <el-col v-if="signType == '2'">
            <el-form-item :label="`拒绝原因`" prop="reason" class="is-required">
              <el-input type="textarea" v-model.trim="formData.reason"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer text-center">
        <el-button type="primary" @click="handleSign">确定</el-button>
        <el-button type="warning" @click="cancel">取消</el-button>
      </div>
    </el-dialog>

    <!-- PDF 查看弹窗 -->
    <el-dialog class="text-center" :visible.sync="PDFpreviewDialog" width="1200px" top="5vh">
      <div v-html="PDFsrc"></div>
    </el-dialog>
  </div>
</template>

<script>
import { dictFilter } from '@/utils/filters/common.js'
import {
  listSinRecordPage,
  handleSign,
  previewContractByTemplateCodeApi,
  getContractPDFUrlApi,
} from '@/api/civil-commercial-credit/signedApi'
import { downloadWord } from '@/utils/ruoyi'
export default {
  name: 'dataList',
  filters: { dictFilter },
  data() {
    // var validateCheck = (rule, value, callback) => {
    //   if (!value) {
    //     callback('后续操作需勾选协议！')
    //   } else {
    //     callback()
    //   }
    // }
    return {
      loading: false,
      tableData: [],
      total: 0,
      pageSize: 10,
      pageNum: 1,
      // 被选中的表单数据
      selectedData: [],
      signType: '',
      dialogTitle: '',
      showSignDialog: false,
      queryParams: {
        creditCode: '',
        openDate: [],
      },
      formData: {
        check: false,
        ukey: '',
        reason: '',
      },
      formDataRules: {},
      PDFpreviewDialog: false,
      PDFsrc: '',
    }
  },
  computed: {
    // 融资付息模式
    financeModeList() {
      return this.$store.state.msx.financeModeList
    },
    // 表单数据是否是单选
    single() {
      return this.selectedData.length !== 1
    },
    ownId() {
      return this.$store.state.enterprise.enterpriseId
    },
  },
  mounted: function() {
    this.getList()
  },

  methods: {
    getList() {
      const {
        openDate: [openDateStart, openDateEnd],
        creditCode,
      } = this.queryParams
      const query = {
        openDateStart,
        openDateEnd,
        creditCode,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        // 未签收
        status: '3',
        ownId: this.ownId,
      }
      this.loading = true
      listSinRecordPage(query).then(res => {
        this.tableData = res.data.rows
        this.total = res.data.total
        this.loading = false
      })
    },
    confirmSignBtn() {
      this.signType = '1'
      this.$refs.formData && this.$refs.formData.clearValidate()
      this.dialogTitle = '确认签收'
      this.showSignDialog = true

      this.formDataRules = {
        ukey: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入用户口令',
          },
        ],
      }
    },
    refuseSignBtn() {
      this.signType = '2'
      this.$refs.formData && this.$refs.formData.clearValidate()
      this.dialogTitle = '拒绝签收'
      this.showSignDialog = true

      this.formDataRules = {
        reason: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入拒绝原因',
          },
        ],
      }
    },
    handleSign() {
      this.$refs.formData.validate((val, obj) => {
        if (val) {
          const {
            creditCode,
            creditLimit,
            openerCode,
            openerName,
            ownCertNo,
            ownId,
            ownName,
            seqNo,
            creditType: type,
          } = this.selectedData[0]
          const query = {
            creditCode,
            creditLimit,
            openerCode,
            openerName,
            ownCertNo,
            ownId,
            ownName,
            seqNo,
            signType: this.signType,
            type,
            remark: this.formData.reason,
          }
          handleSign(query).then(res => {
            this.cancel()
            this.getList()
            res.success && this.msgSuccess('操作成功！')
            res.error && this.msgSuccess(res.data)
          })
        }
      })
    },
    //查询
    handleQuery() {
      this.pageSize = 10
      this.pageNum = 1
      this.getList()
    },
    //重置
    resetQuery() {
      this.$refs['queryForm'].resetFields()
      this.handleQuery()
    },
    //查看凭证
    // seeVoucher() {
    //   //跳转下载中心
    //   this.$router.push({
    //     name: 'DownloadCenter/index',
    //     query: {},
    //   })
    // },
    // 查看
    checkCommitment({ contractCode }) {
      let tips = this.$message({
        message: '数据请求中....',
        duration: 0,
      })
      const templateCode = contractCode ? contractCode : 'SQ000001'
      const query = { templateCode }
      previewContractByTemplateCodeApi(query)
        .then(res => {
          tips.close()
          const html = res
          let str = html.substr(0, html.indexOf('<head>')) + html.substr(html.indexOf('</head>'))
          this.PDFsrc = str
          this.PDFpreviewDialog = true
        })
        .catch(e => {
          tips.close()
          tips = this.$message({
            message: '数据请求失败.',
            duration: 1500,
            type: 'error',
          })
        })
    },
    // 下载
    downloadCommitment({ contractCode }) {
      let tips = this.$message({
        message: '数据请求中....',
        duration: 0,
      })
      const templateCode = contractCode ? contractCode : 'SQ000001'
      getContractPDFUrlApi(templateCode)
        .then(res => {
          tips.close()
          downloadWord(res, '付款承诺函.pdf')
        })
        .catch(e => {
          tips.close()
          tips = this.$message({
            message: '数据请求失败.',
            duration: 1500,
            type: 'error',
          })
        })
    },
    // pageSize 变化回调
    handleSizeChange(size) {
      this.pageSize = size
      this.getList()
    },
    // pageNum 变化回调
    handleCurrentChange(current) {
      this.pageNum = current
      this.getList()
    },
    cancel() {
      this.$refs.formData.resetFields()
      this.showSignDialog = false
    },
    handleSelectionChange(select) {
      this.selectedData = select
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
</style>
