<template>
  <div class="root money-raise-list">
    <div class="money-raise-list app-container over-hidden" v-if="!showFinanceDetails">
      <el-form class="flex-shrink-0" :model="queryParams" ref="queryForm" label-width="160px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="融资编号：">
              <el-input
                size="small"
                v-model.trim="queryParams.financeNo"
                clearable
                placeholder="请输入融资编号"
                @keyup.enter.native="handleQuery"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="申请时间：">
              <el-date-picker
                :clearable="false"
                v-model.trim="applyDateRange"
                size="small"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="到期日：">
              <el-date-picker
                :clearable="false"
                v-model.trim="dealineDateRange"
                size="small"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="还款状态：">
              <el-select size="small" v-model.trim="queryParams.status" placeholder="请选择">
                <el-option
                  v-for="dict in repayStatusList"
                  :key="dict.comCode"
                  :label="dict.comCodeDesc"
                  :value="dict.comCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="放款机构：">
              <el-input
                size="small"
                v-model.trim="queryParams.loanMerName"
                clearable
                placeholder="请输入放款机构"
                @keyup.enter.native="handleQuery"
              >
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label-width="0px">
              <el-button
                type="primary"
                icon="el-icon-search"
                size="mini"
                @click="handleQuery"
                v-hasPermi="['supplier:repay:record:query']"
                >查询</el-button
              >
              <el-button
                icon="el-icon-refresh"
                size="mini"
                @click="resetQuery"
                v-hasPermi="['supplier:repay:record:query']"
                >重置</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="m-b-20 flex">
        <el-button
          type="primary"
          size="mini"
          :disabled="single"
          @click="financeApprove"
          v-hasPermi="['supplier:repay:audit']"
          >审批</el-button
        >
      </div>

      <div class="flex1 over-hidden">
        <el-table
          height="100%"
          v-loading="loading"
          :data="List"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column
            label="还款流水号"
            prop="repaySeqNo"
            align="center"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="融资编号"
            prop="financeNo"
            align="center"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="融资主体"
            prop="companyName"
            align="center"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="借款期限"
            prop="financeTerm"
            align="center"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="放款金额" align="center" prop="financeLoanAmount" />
          <el-table-column label="放款日期" align="center" prop="dnDt" />
          <el-table-column label="放款机构" align="center" prop="loanMerName" />
          <el-table-column label="到期日" align="center" prop="dueTime" />
          <el-table-column label="还款金额(元)" align="center" prop="repayAmount" />
          <el-table-column label="申请人" align="center" prop="applyUser" />
          <el-table-column label="申请时间" align="center" prop="applyTime" />
          <el-table-column
            label="还款状态"
            align="center"
            prop="status"
            :formatter="formatStatus"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="scope">
              <el-button
                @click="handleSeedetails(scope.row)"
                type="text"
                size="small"
                v-hasPermi="['supplier:financeOrders:detail']"
                >查看融资信息</el-button
              >
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
    </div>

    <el-dialog
      :modal-append-to-body="false"
      title="审批"
      width="500px"
      :visible.sync="approveVisible"
    >
      <el-form
        :model="approveForm"
        inline
        label-width="100px"
        ref="approveForm"
        :rules="approveRules"
      >
        <div>
          <el-form-item label="审批结论" prop="auditResut">
            <el-radio-group v-model.trim="approveForm.auditResut">
              <el-radio label="Y"> 通过 </el-radio>
              <el-radio label="N"> 拒绝</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <el-form-item label="流程意见" prop="message">
          <el-input
            type="textarea"
            style="width: 280px"
            v-model.trim="approveForm.message"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="opt-btn text-center">
        <el-button type="primary" size="mini" @click="confirmSubmit"> 确定 </el-button>
        <el-button size="mini" @click="approveVisible = false"> 取消 </el-button>
      </div>
    </el-dialog>
    <div v-if="showFinanceDetails" class="pd20" style="height:100%;overflow:auto">
      <finance-details
        :financeDetails="financeDetails"
        @hideFinance="hideFinance"
        formType="approvel"
      ></finance-details>
    </div>
  </div>
</template>

<script>
import {
  getMoneyRaiseApproveList,
  querySComCodeApi,
  repayFinanceApprove,
  getFinanceDetailsApi,
} from '@/api/money-raise-management'
import financeDetails from './components/finance-details.vue'

export default {
  components: { financeDetails },
  data() {
    return {
      loading: false,
      queryParams: {
        financeNo: undefined,
        loanMerName: undefined,
        applyStartTime: undefined,
        applyEndTime: undefined,
        dueStartTime: undefined,
        dueEndTime: undefined,
        financeStatus: undefined,
        pageSize: 10,
        pageNum: 1,
      },
      List: [],
      applyDateRange: [],
      dealineDateRange: [],
      total: 0,

      single: true,
      selectArr: [],

      approveVisible: false,
      approveForm: {
        auditResut: 'Y',
        message: '',
      },
      approveRules: {
        message: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入流程意见',
          },
        ],
      },

      repayStatusList: [], //  还款状态

      showFinanceDetails: false, // 列表Item还款计划
      seqNo: '',
      financeDetails: {}, // 融资详情
    }
  },

  created() {
    this.getPageData()
  },
  computed: {
    isMultipled() {
      return this.selectArr.length === 1
    },
  },

  methods: {
    /**查询 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.queryParams.pageSize = 10
      this.getList()
    },
    /**重置查询条件 */
    resetQuery() {
      this.applyDateRange = []
      this.dealineDateRange = []
      this.queryParams = {
        financeNo: undefined,
        loanMerName: undefined,
        applyStartTime: undefined,
        applyEndTime: undefined,
        dueStartTime: undefined,
        dueEndTime: undefined,
        status: undefined,
        pageSize: 10,
        pageNum: 1,
      }

      this.handleQuery()
    },
    // 分页
    handleSizeChange(size) {
      this.queryParams.pageSize = size
      this.getList()
    },
    handleCurrentChange(cur) {
      this.queryParams.pageNum = cur
      this.getList()
    },

    getPageData() {
      querySComCodeApi('FINANCE_ORDER_REPAY_STS').then(res => {
        this.repayStatusList = res.data
      })
      this.getList()
    },

    /**获取数据 */
    getList() {
      let params = JSON.parse(JSON.stringify(this.queryParams))
      if (this.applyDateRange.length > 0) {
        params.applyStartTime = this.applyDateRange[0]
        params.applyEndTime = this.applyDateRange[1]
      }
      if (this.dealineDateRange.length > 0) {
        params.dueStartTime = this.dealineDateRange[0]
        params.dueEndTime = this.dealineDateRange[1]
      }
      getMoneyRaiseApproveList(params).then(res => {
        if (res.code === 200) {
          this.List = res.data.rows
          this.total = res.data.total
        }
      })
    },

    handleSelectionChange(select) {
      this.single = select.length != 1
      this.selectArr = select
    },
    // 审批
    financeApprove() {
      if (this.selectArr[0].status === '0') {
        this.$refs.approveForm && this.$refs.approveForm.resetFields()
        this.approveVisible = true
      } else {
        this.$message.error('只有待审批的记录可以审批！')
      }
    },

    confirmSubmit() {
      this.$refs.approveForm.validate(val => {
        if (val) {
          const repaySeqNo = this.selectArr[0]?.repaySeqNo
          const query = { ...this.approveForm, repaySeqNo }
          // 调用审核接口
          repayFinanceApprove(query).then(res => {
            if (res.code === 200) {
              this.msgSuccess('审批成功！')
              this.approveVisible = false
            }

            this.getList()
          })
        }
      })
    },

    // 详情
    handleSeedetails(row) {
      getFinanceDetailsApi(row.financeSeqNo).then(res => {
        if (res.code === 200) {
          this.financeDetails = res.data
          this.showFinanceDetails = true
        }
      })
    },
    // 隐藏
    hideFinance() {
      this.seqNo = ''
      this.showFinanceDetails = false
    },
    /***********************格式化***************************/
    formatStatus(row) {
      return this.selectComLabel(this.repayStatusList, row.status)
    },
  },
}
</script>

<style lang="scss" scoped>
.money-raise-list {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.over-auto {
  overflow: auto;
  background: #f2f2f2;
}
</style>
