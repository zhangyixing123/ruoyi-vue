<template>
  <div class="enquiry-record">
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
          <el-form-item :label="`询价时间`" prop="applyDate">
            <el-date-picker
              :clearable="false"
              v-model.trim="queryParams.applyDate"
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
          <el-form-item :label="`开立方`" prop="openerName">
            <el-input
              v-model.trim="queryParams.openerName"
              :placeholder="`请输入开立方`"
              clearable
              size="small"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="`承诺付款日`" prop="payDate">
            <el-date-picker
              :clearable="false"
              v-model.trim="queryParams.payDate"
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
      </el-row>
      <el-row>
        <!-- <el-col :span="6">
          <el-form-item :label="`融资状态`" prop="fnStatus">
            <el-select v-model.trim="queryParams.fnStatus" :placeholder="`请选择融资状态`" size="small">
              <el-option
                v-for="status in fnStatusList"
                :key="status.dictValue"
                :label="status.dictLabel"
                :value="status.dictValue"
              ></el-option>
            </el-select>
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
    <div class="flex1 over-hidden">
      <el-table
        height="100%"
        v-loading="loading"
        :data="tableData"
        ref="data1"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="询价编号" align="center" prop="inquiryNo" />
        <el-table-column label="民商信编号" align="center" prop="commercialCreditNo" />
        <el-table-column label="民商信金额（元）" align="center" prop="commercialCreditAmt" />
        <el-table-column label="融资金额(元)" align="center" prop="fnAmt" />
        <el-table-column label="开立方" align="center" prop="openerName"> </el-table-column>
        <el-table-column label="承诺付款日" align="center" prop="payDay" />
        <el-table-column label="询价日期" align="center" prop="inquiryDate" />
        <el-table-column label="资金方" align="center" prop="fundSideNo" />
        <el-table-column label="预计融资利率" align="center" prop="financingFeeRate">
          <template slot-scope="scope">
            <span> {{ formatRate(scope.row.financingFeeRate) }} </span>
          </template>
        </el-table-column>
        <el-table-column label="手续费率" align="center">
          <template slot-scope="scope">
            <span> {{ formatRate(scope.row.handlingFeeRate) }} </span>
          </template>
        </el-table-column>
        <el-table-column label="手续费金额" align="center" prop="handlingFee" />
        <el-table-column label="融资付息模式" align="center">
          <template slot-scope="scope">
            <span>
              {{ scope.row.fnInterestModel | dictFilter(financeModeList) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="融资状态" align="center" prop="fnStatus">
          <template slot-scope="scope">
            <span>
              {{ scope.row.fnStatus | dictFilter(fnStatusList) }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
</template>

<script>
import { dictFilter } from '@/utils/filters/common.js'
import { listFnApplPageType } from '@/api/civil-commercial-credit/financingApplicationRecord'
export default {
  props: {},
  components: {},
  filters: { dictFilter },
  data() {
    return {
      loading: false,
      queryParams: {
        // 开立方名称
        openerName: '',
        // 民商信编号
        commercialCreditNo: '',
        // 询价日期
        applyDate: ['', ''],
        // 承诺付款日
        payDate: ['', ''],
        // 融资状态
        fnStatus: '',
      },
      pageNum: 1,
      pageSize: 10,
      tableData: [],
      selectedData: [],
      total: 0,
    }
  },
  computed: {
    single() {
      return this.selectedData.length === 1
    },
    financeModeList() {
      return this.$store.state.msx.financeModeList
    },
    openCubeList() {
      return this.$staticData.core_enterprise
    },
    fnStatusList() {
      return this.$staticData.civil_commercial_letter_status
    },
    ownId() {
      return this.$store.state.enterprise.enterpriseId
    },
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      const {
        commercialCreditNo,
        fnStatus,
        openerName,
        createUser,
        payDate: [payDateStart, payDateEnd],
        applyDate: [inquiryDateStart, inquiryDateEnd],
      } = this.queryParams
      const query = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        commercialCreditNo,
        fnStatus,
        openerName,
        createUser,
        inquiryDateStart,
        inquiryDateEnd,
        payDateStart,
        payDateEnd,
        ownId: this.ownId,
      }
      listFnApplPageType({ query, queryType: '0' }).then(res => {
        this.tableData = res.data.rows
        this.total = res.data.total
        this.loading = false
      })
    },
    handleQuery() {
      this.pageNum = 1
      this.pageSize = 10
      this.getList()
    },
    resetQuery() {
      this.$refs.queryForm.resetFields()
      this.handleQuery()
    },
    handleSelectionChange(selection) {
      this.selectedData = selection
    },
    handleSizeOrSizePageChange(page) {
      this.pageSize = page
      this.getList()
    },
    handleSizeOrCurrentChange(page) {
      this.pageNum = page
      this.getList()
    },
    formatRate(rate) {
      const val = Number(rate) * 100
      return `${val.toFixed(2)}%`
    },
  },
}
</script>

<style scoped lang="scss">
.enquiry-record {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
