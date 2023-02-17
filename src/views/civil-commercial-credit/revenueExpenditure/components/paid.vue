<template>
  <div class="paid-container">
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
          <el-form-item :label="`接收方`" prop="receiverCertNo">
            <el-select
              v-model.trim="queryParams.receiverCertNo"
              :placeholder="`请选择接收方`"
              size="small"
            >
              <el-option
                v-for="(status, index) in receiverList"
                :key="index"
                :label="status.enterpriseName"
                :value="status.enterpriseCertNo"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="`开立方`" prop="openerCode">
            <el-select
              v-model.trim="queryParams.openerCode"
              :placeholder="`请选择开立方`"
              size="small"
            >
              <el-option
                v-for="status in openCubeList"
                :key="status.dictValue"
                :label="status.dictLabel"
                :value="status.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="`承诺付款日`" prop="payTime">
            <el-date-picker
              :clearable="false"
              v-model.trim="queryParams.payTime"
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
            :disabled="!single"
            type="primary"
            plain
            icon="el-icon-add"
            size="mini"
            @click="downVoucher"
          >
            下载凭证
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" plain size="mini" @click="exportFun">导出</el-button>
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
        ref="multipleTable"
        show-summary
        :summary-method="getSummaries"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
      >
        <el-table-column type="selection" width="80" align="center" />
        <el-table-column label="民商信编号" align="center" prop="rootCreditCode" />
        <el-table-column label="开立方" align="center" prop="firstOwnName"></el-table-column>
        <el-table-column label="接收方" align="center" prop="ownName"></el-table-column>
        <el-table-column label="支付金额(元)" align="center" prop="creditLimit" />
        <el-table-column label="承诺付款日" align="center" prop="payTime" />
        <el-table-column label="融资付息模式" align="center">
          <template slot-scope="scope">
            <span>
              {{ scope.row.interestType | dictFilter(financeModeList) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="审核人" align="center" prop="auditUser" />
        <el-table-column label="支付日期" align="center" prop="createTime" />
        <el-table-column label="支付备注" align="center" prop="remark" />
      </el-table>
    </div>
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
  </div>
</template>

<script>
import {
  listFlowRecordPage,
  exportListFlowRecord,
} from '@/api/civil-commercial-credit/revenueExpenditureApi'
import { dictFilter } from '@/utils/filters/common.js'
export default {
  props: {
    receiverList: {
      require: true,
      typeof: Array,
      default: [],
    },
  },
  filters: { dictFilter },
  data() {
    return {
      loading: false,
      pageNum: 1,
      pageSize: 10,
      tableData: [],
      total: 0,
      selectedData: [],
      queryParams: {
        // 民商信编号
        creditCode: '',
        // 开立方
        openerCode: '',
        // 承诺付款日
        payTime: ['', ''],
      },
    }
  },
  computed: {
    financeModeList() {
      return this.$store.state.msx.financeModeList
    },
    statusList() {
      return this.$store.state.msx.statusList
    },
    single() {
      return this.selectedData.length === 1
    },
    openCubeList() {
      return this.$staticData.core_enterprise
    },
    ownId() {
      return this.$store.state.enterprise.enterpriseId
    },
  },
  components: {},
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      const {
        payTime: [payTimeStart, payTimeEnd],
        creditCode,
        openerCode,
        receiverCertNo,
      } = this.queryParams
      const query = {
        creditCode,
        openerCode,
        payTimeStart,
        payTimeEnd,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        ownId: this.ownId,
        receiverCertNo,
        type: '1',
      }
      listFlowRecordPage(query).then(res => {
        this.tableData = res.data.rows
        this.total = res.data.total
        this.loading = false
      })
    },
    // 重置按钮
    resetQuery() {
      this.$refs.queryForm.resetFields()
    },
    // 查询按钮
    handleQuery() {
      this.pageNum = 1
      this.pageSize = 10
      this.getList()
    },
    // 下载凭证
    downVoucher() {
      //跳转下载中心
      const { rootCreditCode } = this.selectedData[0]
      this.$router.push({
        name: 'DownloadCenter/index',
        query: { creditCode: rootCreditCode },
      })
    },
    // 导出
    exportFun() {
      const {
        payTime: [payTimeStart, payTimeEnd],
        creditCode,
        openerCode,
        receiverCertNo,
      } = this.queryParams
      const query = {
        creditCode,
        openerCode,
        payTimeStart,
        payTimeEnd,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        ownId: this.ownId,
        receiverCertNo,
        type: '1',
      }
      exportListFlowRecord(query).then(res => {
        downloadWord(res, '已支付列表.xlsx')
      })
    },
    // 获得合计行
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      const sumColumns = ['creditLimit', 'limit']
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (sumColumns.indexOf(column.property) !== -1 && !values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] += ' 元'
        } else {
          sums[index] = ''
        }
      })
      for (let i = 0; i < sums.length; i++) {
        if (sums[i] !== '合计' && sums[i] !== '') {
          sums[i] = parseFloat(sums[i]).toFixed(2) + '元'
        }
      }
      this.$nextTick(() => {
        this.$refs.multipleTable.doLayout()
      })
      return sums
    },
    // 更新选中表单内容
    handleSelectionChange(select) {
      this.selectedData = select
    },
    //点击行触发，选中或不选中复选框
    handleRowClick(row, column, event) {
      this.$refs.multipleTable.toggleRowSelection(row)
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
  },
}
</script>

<style scoped lang="scss">
.paid-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
