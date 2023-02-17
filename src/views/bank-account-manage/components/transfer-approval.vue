<template>
  <div class="page-name app-container flex1 flex-col over-hidden">
    <el-form
      class="el-form-noValid flex-shrink-0"
      :model="queryParams"
      ref="queryForm"
      label-width="100px"
    >
      <el-row>
        <el-col :span="6">
          <el-form-item :label="`创建时间`" prop="creatTime">
            <el-date-picker
              :clearable="false"
              v-model.trim="creatTime"
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
          <el-form-item :label="`收款账号`" prop="toTradeAccount">
            <el-select
              v-model.trim="queryParams.toTradeAccount"
              :placeholder="`请选择收款账号`"
              size="small"
            >
              <el-option
                v-for="item in amountList"
                :key="item.accountNo"
                :label="item.accountName"
                :value="item.accountNo"
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
    <div class="flex-shrink-0">
      <el-button @click="approvelRollOver" :disabled="single" type="primary" size="mini"
        >审批</el-button
      >
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
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="交易流水号" align="center" prop="tradeFlowNum" />
        <el-table-column
          label="收款账号"
          align="center"
          prop="toTradeMaskAccount"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="收款账号名" align="center" prop="toAccountName" />
        <el-table-column label="金额" align="center" prop="tradeAmount" />
        <el-table-column label="创建时间" align="center" prop="createTime" />
        <el-table-column label="提交人" align="center" prop="createUser" />
        <el-table-column label="说明" align="center" prop="tradeExplain" />
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
    <!-- 审批弹框 -->
    <transfer-dialog
      :isApprovel="isApprovel"
      :transferShow="transferShow"
      :amountInfo="amountInfo"
      :amountList="amountList"
      @hideTransferDialog="hideTransferDialog"
      :row="rows[0]"
    ></transfer-dialog>
  </div>
</template>

<script>
import transferDialog from './transfer-dialog.vue'
import { getTransferApproveListApi } from '@/api/amount-management/index'
export default {
  // name 属性，如果需要使用 keep-alive 缓存页面，name必须配置
  name: 'transfer-approval',
  // 这里不说了 data(){return {}}模式；
  components: {
    'transfer-dialog': transferDialog,
  },
  props: {
    amountList: {
      type: Array,
      default: [],
    },
    amountInfo: {
      type: Array,
    },
  },
  data() {
    return {
      isApprovel: '',
      loading: false,
      tableData: [],
      total: 0,
      pageSize: 10,
      pageNum: 1,
      creatTime: [],
      queryParams: {
        pageSize: 10,
        pageNum: 1,
        tradeCertNo: this.$store.state.enterprise.enterpriseCertNo,
        createTimeOfBegin: null,
        createTimeOfEnd: null,
        toTradeAccount: null,
      },
      single: true,
      rows: [],
      transferShow: false,
    }
  },
  mounted: function() {
    this.getList()
  },
  methods: {
    getList() {
      if (this.creatTime) {
        this.queryParams.createTimeOfBegin = this.creatTime[0]
        this.queryParams.createTimeOfEnd = this.creatTime[1]
      }

      getTransferApproveListApi(this.queryParams).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.rows
          this.total = res.data.total
        }
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.creatTime = []
      this.tradeTime = []
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        tradeCertNo: this.$store.state.enterprise.enterpriseCertNo,
        createTimeOfBegin: null,
        createTimeOfEnd: null,
        toTradeAccount: null,
      }
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.rows = selection
      this.ids = selection.map(item => item.seqNo)
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
    // 审核
    approvelRollOver() {
      this.isApprovel = '111'
      this.transferShow = true
    },
    hideTransferDialog() {
      this.transferShow = false
    },
  },
}
</script>

<style lang="scss" scoped>
/* style 建议使用, scoped 可以用可不用，如果不用 scoped，第一级必须是 本页面的独有的page-name */
/* 必须按规范，不然会对别人的页面造成样式干扰 */
.page-name {
  padding: 10px;
}
</style>
