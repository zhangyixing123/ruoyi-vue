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
              v-model.trim="queryParams.creditCode"
              :placeholder="`请输入民商信编号`"
              clearable
              size="small"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="`核心企业名称`" prop="openerName">
            <el-input
              v-model.trim="queryParams.openerName"
              :placeholder="`请输入核心企业名称`"
              clearable
              size="small"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="`申请时间范围`" prop="applyDate">
            <el-date-picker
              :clearable="false"
              v-model.trim="applyDate"
              size="small"
              value-format="yyyy-MM-dd HH-mm-ss"
              type="daterange"
              range-separator="-"
              :start-placeholder="`开始时间`"
              :end-placeholder="`结束时间`"
              :default-time="['00:00:00', '23:59:59']"
            ></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item :label="`当前状态`" prop="extStatus">
            <el-select
              v-model.trim="queryParams.extStatus"
              :placeholder="`请选择当前状态`"
              size="small"
            >
              <el-option
                v-for="status in $staticData.CLEAR_RECORD_STS"
                :key="status.dictValue"
                :label="status.dictLabel"
                :value="status.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">
              查询
            </el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"> 重置 </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 中间有其他按钮或者展示区，也可以加 -->
    <div class="flex-shrink-0"></div>
    <!-- 剩余空间通过 flex1 全部分给表格，over-hidden 必须使用 -->
    <div class="flex1 over-hidden">
      <!-- el-table 配置 height 属性 100%，起到自动撑开，且表格标题固定的效果； -->
      <el-table
        height="100%"
        v-loading="loading"
        :data="tableData"
        ref="data1"
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="民商信编号" align="center" prop="creditCode" />
        <el-table-column label="开立方" align="center" prop="openerName" />
        <el-table-column label="展期付款方" align="center" prop="repayUser" />
        <el-table-column label="民商信持有金额/元" align="center" prop="ownLimit" />
        <el-table-column label="展期费率" align="center" prop="extensionRate" />
        <el-table-column label="承诺付款日" align="center" prop="dueDate" />
        <el-table-column label="展期付款日" align="center" prop="extDate" />
        <el-table-column label="展期天数/天" align="center" prop="extDays" />
        <el-table-column label="展期费用/元" align="center" prop="extensionAmount" />
        <el-table-column label="实际入账费用/元" align="center" prop="tradeAmount" />
        <el-table-column
          label="当前状态"
          align="center"
          prop="extStatus"
          :formatter="rollOverStaFormatter"
        />
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
import { extCollectionDetailApi } from '@/api/roll-over-collection-detail/index'
export default {
  data() {
    return {
      loading: false,
      tableData: [],
      applyDate: [], //申请时间范围
      queryParams: {
        ownCertNo: this.$store.state.enterprise.enterpriseCertNo,
        pageSize: 10,
        pageNum: 1,
        creditCode: null,
        openerName: null,
        extStatus: null,
        applyStartTime: null,
        applyEndTime: null,
      },
      statusList: [],
      total: 1000,
      pageSize: 10,
      pageNum: 1,
    }
  },
  mounted: function() {
    this.addUser()
  },
  created() {
    this.getList()
  },
  methods: {
    addUser() {},
    getList() {
      extCollectionDetailApi(this.queryParams).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.rows
          this.total = res.data.total
        }
      })
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
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
    rollOverStaFormatter(row) {
      return this.selectDictLabel(this.$staticData.CLEAR_RECORD_STS, row.extStatus)
    },
    handleQuery() {
      this.pageNum = 1
      this.pageSize = 10
      this.queryParams.pageNum = 1

      if (this.applyDate) {
        this.queryParams.applyStartTime = this.applyDate[0]
        this.queryParams.applyEndTime = this.applyDate[1]
      }
      this.getList()
    },
    // 重置
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        ownCertNo: this.$store.state.enterprise.enterpriseCertNo,
      }
      this.applyDate = []
      this.resetForm('queryForm')
      this.handleQuery()
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
