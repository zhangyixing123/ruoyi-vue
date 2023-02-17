<template>
  <div class="raised-container">
    <el-form
      class="el-form-noValid flex-shrink-0"
      :model="queryParams"
      ref="queryForm"
      label-width="100px"
    >
      <el-row>
        <el-col :span="6">
          <el-form-item :label="`民商信编号`" prop="commercialCreditNo">
            <el-input
              v-model.trim="queryParams.commercialCreditNo"
              :placeholder="`请输入民商信编号`"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="`开立方`" prop="openerName ">
            <el-input
              v-model.trim="queryParams.openerName"
              :placeholder="`请输入开立方`"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="6">
          <el-form-item :label="`支付方`" prop="ownId">
            <el-input
              v-model.trim="queryParams.ownId"
              :placeholder="`请输入支付方`"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col> -->
        <el-col :span="6">
          <el-form-item :label="`承诺付款日`" prop="payTime">
            <el-date-picker
              :clearable="false"
              v-model.trim="payTime"
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
          <el-form-item :label="`状态`" prop="fnStatus">
            <el-select v-model.trim="queryParams.fnStatus" :placeholder="`请选择状态`" size="small">
              <el-option
                v-for="status in $staticData.civil_commercial_letter_status"
                :key="status.dictValue"
                :label="status.dictLabel"
                :value="status.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
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
          <el-button type="warning" plain size="mini" @click="exportFun">导出</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="success" plain size="mini" :disabled="single" @click="showDetail">
            查看详情
          </el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 剩余空间通过 flex1 全部分给表格，over-hidden 必须使用 -->
    <div class="flex1 over-hidden">
      <!-- el-table 配置 height 属性 100%，起到自动撑开，且表格标题固定的效果； -->
      <el-table
        height="100%"
        v-loading="loading"
        :data="tableData"
        ref="data3"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="80" align="center" />
        <el-table-column label="民商信编号" align="center" prop="commercialCreditNo" />
        <!-- <el-table-column label="支付方" align="center" prop="ownName" /> -->
        <el-table-column label="开立方" align="center" prop="openerName" />
        <el-table-column label="民商信总额(元)" align="center" prop="commercialCreditAmt" />
        <el-table-column label="融资金额(元)" align="center" prop="fnAmt" />
        <el-table-column label="承诺付款日" align="center" prop="payDay" />
        <el-table-column
          label="融资付息模式"
          align="center"
          prop="fnInterestModel"
          :formatter="interretTypeFormatter"
        />
        <el-table-column label="利息金额(元)" align="center" prop="makeLoanInterest" />
        <el-table-column label="平台手续费(元)" align="center" prop="makeLoanHandlingFee" />
        <el-table-column label="申请时间" align="center" prop="fnApplyDate" />
        <el-table-column label="审核时间" align="center" prop="fnVerifyDate" />
        <el-table-column label="资金方" align="center" prop="fundSide" />
        <el-table-column label="融资编号" align="center" prop="fnNo" />
        <el-table-column
          label="融资状态"
          align="center"
          prop="fnStatus"
          :formatter="fnStatusFormatter"
        />
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
      @size-change="handleSizeOrCurrentChange"
      @current-change="handleSizeOrCurrentChange"
      :total="total"
    >
    </el-pagination>
    <FinancingApplication
      v-if="financingShow"
      @sure="sureFinancingApplication"
      @cancel="cancelFinancingApplication"
    ></FinancingApplication>
  </div>
</template>

<script>
import {
  listFnApplPagesApi,
  financingexportRecordsApi,
  fnApplDetailsApi,
} from '@/api/civil-commercial-credit/financedApi'
import { downloadExcel } from '@/utils/ruoyi'
import { dictFilter } from '@/utils/filters/common.js'
export default {
  filters: { dictFilter },
  props: {
    receiverList: {
      require: true,
      typeof: Array,
      default: [],
    },
  },
  components: {},
  data() {
    return {
      payTime: [],
      loading: false,
      pageNum: 1,
      pageSize: 10,
      tableData: [],
      // 被选中的表格数据
      selectedData: [],
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        commercialCreditNo: null, //民商信编号
        openerName: null, //开立方
        // ownId: null, //支付方
        payDateStart: null, //承诺付款日起
        payDateEnd: null, //承诺付款日末
        fnStatus: null, //状态
        ownId: this.$store.state.enterprise.enterpriseId,
      },
      // 融资展示
      financingShow: false,
      single: true,
      selectionItem: null,
    }
  },
  computed: {},
  created() {
    this.getList()
  },
  methods: {
    handleQuery() {
      if (this.payTime) {
        this.queryParams.payDateStart = this.payTime[0]
        this.queryParams.payDateEnd = this.payTime[1]
      }
      this.queryParams.pageNum = 1
      this.pageNum = 1
      this.getList()
    },

    resetQuery() {
      this.payTime = []
      this.resetForm('queryForm')
      this.resetForm('queryParams')
      this.queryParams.openerName = null
      this.handleQuery()
    },
    // 获取列表
    getList() {
      this.loading = true
      listFnApplPagesApi(this.queryParams).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.rows
          this.total = res.data.total
          this.loading = false
        }
      })
    },
    // 导出
    exportFun() {
      let params = JSON.parse(JSON.stringify(this.queryParams))
      if (this.payTime.length > 0) {
        params.payDateStart = this.payTime[0]
        params.payDateEnd = this.payTime[1]
      }
      financingexportRecordsApi(params).then(res => {
        console.log(res)
        downloadExcel(res, '已融资列表.xlsx')
      })
    },
    // 查看详情
    showDetail() {
      fnApplDetailsApi({
        fnNo: this.selectionItem.fnNo,
        fnStatus: this.selectionItem.fnStatus,
      }).then(res => {
        if (res.code == 200) {
          if (res.data.queryType == '1') {
            this.$router.push({
              path: '/lcivil-commercial-credit/financingApplicationRecord/index',
              query: { activeName: '2', fnNo: this.selectionItem.fnNo },
            })
          } else {
            this.$router.push({
              path: '/lcivil-commercial-credit/financingApplicationRecord/index',
              query: { activeName: '3', fnNo: this.selectionItem.fnNo },
            })
          }
        }
      })
      // this.$router.push({
      //   path: '/lcivil-commercial-credit/financingApplicationRecord/index',
      //   query: { activeName: '3' },
      // })
    },
    handleSelectionChange(selection) {
      this.selectedData = selection
      this.selectionItem = selection[0]
      this.single = selection.length != 1
    },
    handleSizeOrSizePageChange(page) {
      this.queryParams.pageSize = page
      this.getList()
    },
    handleSizeOrCurrentChange(page) {
      this.queryParams.pageNum = page
      this.getList()
    },
    // 融资申请返回
    sureFinancingApplication(v) {
      this.financingShow = false
    },
    // 融资申请取消
    cancelFinancingApplication() {
      this.financingShow = false
    },

    // 状态字典翻译
    fnStatusFormatter(row, column) {
      if (row.menuType == 'F') {
        return ''
      }
      return this.selectDictLabel(this.$staticData.civil_commercial_letter_status, row.fnStatus)
    },

    // 融资付息模式字典翻译
    interretTypeFormatter(row, column) {
      if (row.menuType == 'F') {
        return ''
      }
      return this.selectDictLabel(this.$staticData.msx_interet_type, row.fnInterestModel)
    },
  },
}
</script>

<style scoped lang="scss">
.raised-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
