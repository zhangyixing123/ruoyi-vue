<template>
  <div class="page-name   flex1 flex-col">
    <el-form
      class="el-form-noValid flex-shrink-0"
      :model="queryParams"
      ref="queryForm"
      label-width="100px"
    >
      <el-row>
        <!-- <el-col :span="6">
          <el-form-item :label="`创建时间`" prop="creatTime">
            <el-date-picker :clearable="false"
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
        </el-col> -->
        <el-col :span="6">
          <el-form-item :label="`交易类型`" prop="tradeType">
            <el-select
              v-model.trim="queryParams.tradeType"
              :placeholder="`请选择交易类型`"
              size="small"
            >
              <el-option
                v-for="status in statusArr"
                :key="status.dictValue"
                :label="status.dictLabel"
                :value="status.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="`交易时间`" prop="tradeTime">
            <el-date-picker
              :clearable="false"
              v-model.trim="tradeTime"
              size="small"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              :start-placeholder="`开始时间`"
              :end-placeholder="`结束时间`"
            ></el-date-picker>
          </el-form-item>
        </el-col>

        <!-- 
        <el-col :span="6">
          <el-form-item :label="`交易流水号`" prop="tradeFlowNum">
            <el-input
              v-model.trim="queryParams.tradeFlowNum"
              :placeholder="`请输入交易流水号`"
              size="small"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="`支付账号`" prop="fromTradeMaskAccount">
            <el-select
              v-model.trim="queryParams.fromTradeMaskAccount"
              :placeholder="`请选择支付账号`"
              size="small"
            >
              <el-option
                v-for="status in cardList"
                :key="status.accountNo"
                :label="status.accountNameAndNo"
                :value="status.accountNo"
              ></el-option>
            </el-select>
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
                :label="item.accountNameAndNo"
                :value="item.accountNo"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
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
      <el-table height="100%" v-loading="loading" :data="tableData">
        <el-table-column label="互金主流水" align="center" prop="trcNo" />
        <el-table-column
          label="交易时间"
          :show-overflow-tooltip="true"
          align="center"
          prop="tradeTime"
          :formatter="formatTime"
        />
        <el-table-column label="交易金额" align="center" prop="tradeAmt" />
        <el-table-column label="交易类型" align="center" prop="tradeType" :formatter="formatType" />
        <el-table-column
          label="查询方账号"
          align="center"
          prop="baseAccNo"
          :show-overflow-tooltip="true"
        />
        <!-- <el-table-column label="查询方账号名" align="center" prop="baseAccSeqn" />
        <el-table-column label="对手联行号" align="center" prop="otherBankCode" /> -->
        <el-table-column label="对手方账号" align="center" prop="otherAccNo" />
        <el-table-column
          label="对手方名称"
          align="center"
          :show-overflow-tooltip="true"
          prop="otherAccName"
        />
        <!-- <el-table-column label="对手方子账户号" align="center" prop="otherAccSeqn" /> -->
        <el-table-column label="增加标识" align="center" prop="addFlag" :formatter="formatAdd" />
        <el-table-column label="交易后余额" align="center" prop="bal" />
        <el-table-column label="备注" align="center" prop="remark" />
        <!-- <el-table-column label="附言" align="center" prop="postscript  " /> -->
      </el-table>
    </div>
    <!-- 分页必须加 flex-shrink-0 样式不一定用我的，好看就行 -->
    <!-- size-change 和 current-change 统一用一个时间处理就行了，无非是再去获取列表数据 -->
    <el-pagination
      class="text-center bgfff pd10 flex-shrink-0"
      layout="total, sizes, prev, pager, next, jumper"
      :current-page.sync="currPage"
      :page-sizes="[10, 20, 30, 50]"
      :page-size.sync="eachPageNum"
      @size-change="handleSizeOrSizePageChange"
      @current-change="handleSizeOrCurrentChange"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import { accountTranHistoryQueryApi } from '@/api/amount-management/index'
export default {
  // name 属性，如果需要使用 keep-alive 缓存页面，name必须配置
  name: 'trade-detail',
  props: {
    amountList: {
      type: Array,
      default: [],
    },
    item: {
      type: Object,
    },
  },
  // 这里不说了 data(){return {}}模式；
  data() {
    return {
      loading: false,
      tableData: [],
      total: 0,
      eachPageNum: 10,
      currPage: 1,
      creatTime: [],
      tradeTime: [],
      queryParams: {
        eachPageNum: 10,
        currPage: 1,
        tradeType: undefined,
        begDate: undefined,
        endDate: undefined,
      },
      single: false,
      rows: [],
      statusArr: [],
    }
  },
  mounted: function() {
    this.statusArr = this.$staticData.supply_trade_type.filter(v => {
      return v.dictValue == '01' || v.dictValue == '02'
    })
    this.getList()
  },
  methods: {
    getList() {
      let params = JSON.parse(JSON.stringify(this.queryParams))
      if (!this.tradeTime) this.tradeTime = []
      if (this.tradeTime.length > 0) {
        params.begDate = this.tradeTime[0].replaceAll('-', '')
        params.endDate = this.tradeTime[1].replaceAll('-', '')
      } else {
        params.begDate = params.endDate = `${this.moment().format('yyyy')}${this.moment().format(
          'MM'
        )}${this.moment().format('DD')}`
        let showBegin, showEnd
        showBegin = showEnd = `${this.moment().format('yyyy')}-${this.moment().format(
          'MM'
        )}-${this.moment().format('DD')}`
        this.tradeTime = [showBegin, showEnd]
      }
      params.seqNo = this.item.seqNo
      params.thirdChannel = 'zgc'
      accountTranHistoryQueryApi(params).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.list

          this.total = res.data.totalNum
        }
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.currPage = 1
      this.queryParams.currPage = 1

      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.creatTime = []
      this.tradeTime = []
      this.queryParams = {
        currPage: 1,
        enterpriseCertNo: this.$store.state.enterprise.enterpriseCertNo,
        eachPageNum: 10,
        tradeType: undefined,
        begDate: undefined,
        endDate: undefined,
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
      this.queryParams.eachPageNum = page
      this.getList()
    },
    handleSizeOrCurrentChange(page) {
      this.queryParams.currPage = page
      this.getList()
    },

    formatType(row) {
      return this.selectDictLabel(this.$staticData.supply_trade_type, row.tradeType)
    },
    formatAdd(row) {
      let text = ''
      if (!row.addFlag) {
        return text
      }
      text = row.addFlag == 'AF01' ? '增' : '减'
      return text
    },
    formatTime(row) {
      let time = ''
      if (!row.tradeTime) {
        return time
      }
      let arrDate = []
      arrDate = row.tradeTime.split('')
      arrDate[4] = '-' + arrDate[4]
      arrDate[6] = '-' + arrDate[6]
      arrDate[8] = ' ' + arrDate[8]
      arrDate[11] = ':' + arrDate[11]
      arrDate[13] = ':' + arrDate[12]
      time = arrDate.join().replace(/,/g, '')
      return time
    },
  },
}
</script>

<style lang="scss" scoped>
/* style 建议使用, scoped 可以用可不用，如果不用 scoped，第一级必须是 本页面的独有的page-name */
/* 必须按规范，不然会对别人的页面造成样式干扰 */
.page-name {
  padding: 10px;
  height: 100%;
}
</style>
