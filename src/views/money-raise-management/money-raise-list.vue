<template>
  <div class="root money-raise-list">
    <div
      class="money-raise-list app-container over-hidden"
      v-show="!showStep && !showListItemRepayPlan && !showRepaymentRequest"
    >
      <el-form
        class="flex-shrink-0"
        :model="queryParams"
        ref="queryForm"
        v-show="showSearch"
        label-width="160px"
      >
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
                v-model.trim="dateRange"
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
            <el-form-item label="融资状态：">
              <el-select
                size="small"
                v-model.trim="queryParams.financeStatus"
                placeholder="请选择融资状态"
              >
                <el-option
                  v-for="dict in financeStatusList"
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
                v-hasPermi="['supplier:financeOrders:list']"
                >查询</el-button
              >
              <el-button
                icon="el-icon-refresh"
                size="mini"
                @click="resetQuery"
                v-hasPermi="['supplier:financeOrders:list']"
                >重置</el-button
              >
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6">
            <el-form-item label="融资主体：">
              <el-select
                v-model.trim="queryParams.name"
                placeholder="请选择融资主体"
                clearable
                size="small"
              >
                <el-option
                  v-for="key in typeList"
                  :key="key"
                  :value="key"
                  :label="typeList[key]"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
        </el-row>
      </el-form>
      <div class="flex1 over-hidden">
        <el-table height="100%" v-loading="loading" :data="List">
          <el-table-column
            label="融资编号"
            prop="financeNo"
            align="center"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="融资类型"
            prop="financeType"
            align="center"
            :show-overflow-tooltip="true"
            :formatter="formatType"
          />
          <el-table-column
            label="融资主体"
            prop="companyName"
            align="center"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="申请日期"
            prop="applyTime"
            align="center"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="申请人" align="center" prop="applyUser" />
          <el-table-column label="应收账款金额" prop="billsAmount" align="center" />
          <el-table-column
            label="融资状态"
            align="center"
            prop="financeStatus"
            :formatter="formatStatus"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="可用额度" align="center" prop="financeAmount" />
          <el-table-column label="放款金额" align="center" prop="financeLoanAmount" />
          <el-table-column label="融资期限" align="center" prop="financeTerm" />
          <el-table-column label="放款机构" align="center" prop="loanMerName" />

          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="scope">
              <el-button
                @click="handleView(scope.row)"
                type="text"
                size="small"
                v-hasPermi="['supplier:financeOrders:detail']"
                >查看</el-button
              >
              <!-- 取消-->
              <template v-if="['7'].includes(scope.row.financeStatus)">
                <el-button
                  @click="handleCancel(scope.row)"
                  type="text"
                  size="small"
                  v-hasPermi="['supplier:financeCancel:cancel']"
                  >取消</el-button
                >
              </template>
              <template v-if="scope.row.financeStatus == 3">
                <el-button @click="handleApplRepay(scope.row)" type="text" size="small"
                  >申请放款</el-button
                >
              </template>
              <template>
                <el-button
                  @click="handlePayFee(scope.row)"
                  v-if="scope.row.financeStatus == 7"
                  type="text"
                  size="small"
                  >确认提款</el-button
                >
              </template>
              <!-- <template v-if="scope.row.financeStatus == 11">
                <el-button
                  @click="handleReRepay(scope.row)"
                  type="text"
                  size="small"
                  v-hasPermi="['supplier:reLoanDown:apply']"
                  >再次申请放款</el-button
                >
              </template> -->
              <template v-if="scope.row.financeStatus == 12 || scope.row.financeStatus == 13">
                <el-button
                  @click="handleShowListItemRepayPlay(scope.row)"
                  type="text"
                  size="small"
                  v-hasPermi="['supplier:financeOrder:plan']"
                  >还款计划</el-button
                >
              </template>
              <template v-if="scope.row.financeStatus == 12">
                <el-button
                  @click="handleAutoToRepay(scope.row)"
                  type="text"
                  size="small"
                  v-hasPermi="['supplier:repay:save']"
                  >主动还款</el-button
                >
              </template>
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

    <div class="over-auto" v-if="showStep">
      <financing-step
        :active="active"
        :view="view"
        :otherView="otherView"
        @return="handleReturn"
        :seqNo="seqNo"
        :financeNo="financeNo"
        :loanNo="loanNo"
      ></financing-step>
    </div>

    <div v-if="showListItemRepayPlan">
      <list-item-repayment-plan
        class="pd20"
        :seqNo="seqNo"
        @hidePlan="hidePlan"
      ></list-item-repayment-plan>
    </div>
    <voluntary-repayment-request
      v-if="showRepaymentRequest"
      :loanNo="loanNo"
      @hidePlan="hidePlan"
    ></voluntary-repayment-request>
  </div>
</template>

<script>
// FIXME:引入顺序，先引入npm包，再是绝对路径，最后是相对路径
import financingStep from './components/financing-step'
import financingInfo from './components/financing-info.vue'
import {
  getListPage,
  querySComCodeApi,
  financeCancelApi,
  reFinancialApi,
} from '@/api/money-raise-management'
import { updateZgcSignContractApi } from '@/api/civil-commercial-credit/financing'
import ListItemRepaymentPlan from './components/list-item-repayment-plan.vue'
import VoluntaryRepaymentRequest from './components/voluntary-repayment-request.vue'
export default {
  name: 'money-raise-list',
  components: {
    'financing-step': financingStep,
    'financing-info': financingInfo,
    ListItemRepaymentPlan,
    VoluntaryRepaymentRequest,
  },
  mixins: [],
  props: [],
  data() {
    return {
      queryParams: {
        financeNo: undefined,
        loanMerName: undefined,
        applyStartTime: undefined,
        applyEndTime: undefined,
        financeStatus: undefined,
        subject: undefined,
        pageSize: 10,
        pageNum: 1,
        companyCode: undefined,
      },
      showSearch: true,
      loading: false,
      List: [],
      dateRange: [],
      total: 0,
      showStep: false,
      showListItemRepayPlan: false, // 列表Item还款计划
      showRepaymentRequest: false, // 还款详情
      seqNo: '',
      active: 1,
      statusList: [], // 订单状态
      view: false,
      otherView: '',
      financeStatusList: [], //  融资状态
      financeTypeList: [], //   融资类型
      financeNo: '',
      loanNo: '',
      isThird: '', //是否三方返回
      merSignSeq: '',
    }
  },
  computed: {},
  watch: {},
  filters: {},
  created() {
    querySComCodeApi('ORDER_STATUS').then(res => {
      this.statusList = res.data
    })
    this.getDictData()
    this.isThirdChannel()
  },
  mounted() {},
  destroyed() {},
  methods: {
    // 判断是否三方
    isThirdChannel() {
      this.isThird = this.getURLParam('from')
      this.merSignSeq = this.getURLParam('merSignSeq')
      this.financeNo = this.getURLParam('financeNo')
      if (this.isThird == 'thirdChannel' && this.merSignSeq && this.financeNo) {
        this.updataSignStatus()
      }
    },
    // 更新协议签署状态
    async updataSignStatus() {
      let res = await updateZgcSignContractApi({
        financeNo: this.financeNo,
        merSignSeq: this.merSignSeq,
      })
      if (res.code == 200) {
        window.history.pushState({}, 0, `${window.location.origin}${window.location.pathname}`)
      }
    },
    getURLParam(name) {
      return (
        decodeURIComponent(
          (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)', 'ig').exec(location.search) || [
            ,
            '',
          ])[1].replace(/\+/g, '%20')
        ) || null
      )
    },
    /**获取数据 */
    getList() {
      let params = JSON.parse(JSON.stringify(this.queryParams))
      // params.companyCode = this.$store.state.enterprise.enterpriseCertNo
      if (this.dateRange.length > 0) {
        params.applyStartTime = this.dateRange[0]
        params.applyEndTime = this.dateRange[1]
      }
      getListPage(params).then(res => {
        if (res.code === 200) {
          this.List = res.data.rows
          this.total = res.data.total
        }
      })
    },
    getDictData() {
      querySComCodeApi('FINANCE_STATUS').then(res => {
        this.financeStatusList = res.data
      })
      querySComCodeApi('FINANCE_TYPE').then(res => {
        this.financeTypeList = res.data
      })
      this.getList()
    },
    /**查询 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.queryParams.pageSize = 10
      this.getList()
    },

    /**重置查询条件 */
    resetQuery() {
      this.dateRange = []
      this.queryParams = {
        financeNo: undefined,
        loanMerName: undefined,
        status: undefined,
        subject: undefined,
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
    /**导出 */
    exportData() {},

    /************************列表按钮操作*********************/

    /**查看 */
    handleView(row) {
      let step = -1
      this.otherView = row.financeStatus
      this.financeNo = row.financeNo
      switch (row.financeStatus) {
        case '1': // 1.未融资
          step = -1
          break
        case '2': // 2.额度审批中
          step = 1
          break
        case '3': // 3.资金方审批通过 4.资金方审批退回 5.合同待签署 6.签署合同失败
        case '4':
        case '6':
        case '5':
          step = 2
          break
        case '7':
        case '8': //7.待提款 8.放款审批中 9.待放款
        case '9':
          step = 3
          break
        case '10':
        case '11':
        case '15':
          // 10.放款中 15.放款失败 11 放款审批退回
          step = 4
          break
        case '12': // 12.还款中  13已结清 14已取消
        case '13':
        case '14':
          step = 5
          break
        default:
          break
      }
      this.seqNo = row.seqNo
      this.common(step, true)
    },

    /**取消融资 financeCancelApi*/
    financeCancel(seqNo) {
      financeCancelApi(seqNo).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'warning',
            message: '取消成功',
          })
          this.getDictData()
        }
      })
    },
    handleCancel(row) {
      this.$confirm('确定取消融资?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
      }).then(() => {
        this.financeCancel(row.seqNo)
      })
    },

    /**申请放款 */
    handleApplRepay(row) {
      this.seqNo = row.seqNo
      this.common(2)
    },
    /**再次申请放款 */
    handleReRepay(row) {
      this.seqNo = row.seqNo
      this.common(2)
    },

    /**签约缴费 */
    handlePayFee(row) {
      this.seqNo = row.seqNo
      this.financeNo = row.financeNo
      this.loanNo = row.loanNo
      this.common(3)
    },

    /**查看还款计划*/
    handleShowListItemRepayPlay(row) {
      this.seqNo = row.seqNo
      this.showListItemRepayPlan = true
    },
    /**主动还款*/
    handleAutoToRepay(row) {
      this.loanNo = row.loanNo
      this.showRepaymentRequest = true
    },

    /************************emit事件************************/
    handleReturn(flag) {
      this.showStep = flag
      this.getDictData()
    },
    // 隐藏
    hidePlan() {
      this.loanNo = this.seqNo = ''
      this.showListItemRepayPlan = false
      this.showRepaymentRequest = false
    },
    /***********************格式化***************************/

    formatStatus(row) {
      return this.selectComLabel(this.financeStatusList, row.financeStatus)
    },

    formatType(row) {
      return this.selectComLabel(this.financeTypeList, row.financeType)
    },

    /************************tools **************************/
    common(val, status = false) {
      this.active = val
      this.view = status
      this.showStep = true
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
