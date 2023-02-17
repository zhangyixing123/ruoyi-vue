<template>
  <div class="page-name app-container">
    <el-dialog
      :modal-append-to-body="false"
      :title="title"
      :visible.sync="open"
      width="1250px"
      append-to-body
      :close-on-click-modal="false"
      @close="cancel"
    >
      <el-form
        class="el-form-noValid flex-shrink-0"
        :model="queryParams"
        ref="queryForm"
        label-width="100px"
      >
        <el-row>
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
            <el-form-item :label="`发票代码`" prop="code">
              <el-input
                v-model.trim="queryParams.code"
                :placeholder="`请选择支付方`"
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
            <el-form-item :label="`购买方`" prop="buyerName">
              <el-input
                v-model.trim="queryParams.buyerName"
                :placeholder="`请选择购买方`"
                clearable
                size="small"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!-- <el-col :span="6">
            <el-form-item :label="`上传日期`" prop="uploadDate">
              <el-date-picker :clearable="false"
                v-model.trim="uploadDate"
                size="small"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="-"
                :start-placeholder="`开始时间`"
                :end-placeholder="`结束时间`"
                :default-time="['00:00:00', '23:59:59']"
              ></el-date-picker>
            </el-form-item>
          </el-col> -->
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
            <el-button type="primary" plain icon="el-icon-add" size="mini" @click="exportFun"
              >导出</el-button
            >
          </el-col>
        </el-row>
      </div>
      <!-- 剩余空间通过 flex1 全部分给表格，over-hidden 必须使用 -->
      <div class="flex1 over-hidden">
        <el-table @selection-change="handleSelectionChange" :data="invoiceList" ref="data1">
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
            :formatter="formatSts"
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
        <!-- el-table 配置 height 属性 100%，起到自动撑开，且表格标题固定的效果； -->
        <!-- <el-table
          height="400"
          v-loading="loading"
          :data="invoiceList"
          ref="data1"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="发票号码" align="center" prop="number" />
          <el-table-column label="发票代码" align="center" prop="code" />
          <el-table-column label="购买方" align="center" prop="buyerName" />
          <el-table-column label="含税金额" align="center" prop="amount" />
          <el-table-column label="可用金额(元)" align="center" prop="exclTaxAmt" />
          <el-table-column label="开票日期" align="center" prop="invoiceDate" />
          <el-table-column label="发票附件" align="center" prop="appendicesInvoice">
            <template slot-scope="scope">
              <el-button type="text" @click="downloadInvoice(scope.row)">下载</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="发票状态"
            align="center"
            prop="uploadSts"
            :formatter="formatSts"
          />
        </el-table> -->
      </div>
      <!-- 分页必须加 flex-shrink-0 样式不一定用我的，好看就行 -->
      <!-- size-change 和 current-change 统一用一个时间处理就行了，无非是再去获取列表数据 -->
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
      <div>
        说明：1、勾选所需发票，点击”确认“，添加至申请页；2、点击<el-button
          type="text"
          @click="toInvoice"
          >我的单据</el-button
        >，管理发票
      </div>
      <div slot="footer" class="footer dialog-footer text-center">
        <el-button type="primary" @click="submitForm" :disabled="single">确认</el-button>
        <el-button @click="cancel">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { utils } from '@/utils/utils.js'
import { invoiceApi, exportInvoiceApi } from '@/api/civil-commercial-credit/financing'
import { downloadImageApi } from '@/api/image-management'
import { downloadWord } from '@/utils/ruoyi'
import { mapState } from 'vuex'
export default {
  name: 'selectInvoice',
  props: {
    backInvoice: {
      type: Function,
    },
  },
  data() {
    return {
      title: '关联发票信息',
      open: false,
      loading: false,
      invoiceList: [],
      total: 0,
      single: '',
      billingDate: [],
      uploadDate: [],
      queryParams: {
        number: undefined,
        code: undefined,
        billingDate: undefined,
        invoiceDateStart: undefined,
        invoiceDateEnd: undefined,
        buyerName: undefined,
        uploadDate: undefined,
        pageSize: 10,
        pageNum: 1,
      },
      selection: [],
      tableHead: {
        title: '关联发票信息',
        headName: [
          '序号',
          '发票号码',
          '发票代码',
          '购买方',
          '发票含税金额',
          '可用金额(元)',
          '开票日期',
          '发票附件',
          '发票状态',
        ],
        headField: [
          'id',
          'number',
          'code',
          'buyerName',
          'invoiceAmountIncludingTax',
          'availableAmount',
          'billingDate',
          'appendicesInvoice',
          'invoiceState',
        ],
      },
    }
  },
  watch: {
    open() {
      this.getList()
    },
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
      params.supplyCoCode = this.enterpriseCertNo
      // params.supplyCoName = this.enterpriseName
      params.uploadSts = '1'
      if (this.billingDate.length > 0) {
        params.invoiceDateStart = this.billingDate[0]
        params.invoiceDateEnd = this.billingDate[1]
      }
      invoiceApi(params).then(res => {
        if (res.code == 200) {
          this.total = res.data.total
          this.invoiceList = res.data.rows
        }
      })
    },
    // 下载发票
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
    // 发票状态
    formatSts(row) {
      return this.selectDictLabel(this.$staticData.invoice_upload_status, row.uploadSts)
    },
    // 导出
    exportFun() {
      // let params = JSON.parse(JSON.stringify(this.queryParams))
      // if (this.billingDate.length > 0) {
      //   params.invoiceDateStart = this.billingDate[0]
      //   params.invoiceDateEnd = this.billingDate[1]
      // }
      // params.supplyCoCode = this.enterpriseCertNo
      // params.supplyCoName = this.enterpriseName
      // params.uploadSts = '1'
      exportInvoiceApi({
        supplyCoCode: this.enterpriseCertNo,
        // uploadSts: '1',
      }).then(res => {
        downloadWord(res, '发票列表.xlsx')
      })
    },
    // 销项发票
    toInvoice() {
      this.$router.push('/bills-manage/invoice')
    },
    handleQuery() {
      this.getList()
    },
    resetQuery() {
      this.billingDate = []
      this.resetForm('queryForm')
      this.handleQuery()
      this.committedPaymentDate = []
    },
    handleSizeChange(page) {
      this.queryParams.pageSize = page
      this.getList()
    },
    handleCurrentChange(page) {
      this.queryParams.pageNum = page
      this.getList()
    },
    handleSelectionChange(selection) {
      this.selection = selection
      this.single = selection.length != 1
    },
    submitForm() {
      this.open = false
      this.$emit('backInvoice', this.selection)
      this.$refs.data1.clearSelection()
    },
    cancel() {
      this.open = false
      this.$refs.data1.clearSelection()
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
