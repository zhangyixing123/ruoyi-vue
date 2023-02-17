<template>
  <div>
    <el-button size="mini" @click="back">返回</el-button>
    <el-table :data="tableData" v-loading="loading" class="m-t-20">
      <el-table-column label="操作时间" prop="operateTime" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        label="节点"
        prop="nodeType"
        :show-overflow-tooltip="true"
        :formatter="formatNodeType"
      >
      </el-table-column>
      <el-table-column label="申请人" prop="applicant" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column label="交易对手" prop="tradeEntity" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        label="交易结果"
        prop="tradeResult"
        :show-overflow-tooltip="true"
        :formatter="formatTradeResult"
      >
      </el-table-column>
    </el-table>
    <div class="m-t-20">
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
  </div>
</template>
<script>
import { billsTraceListApi, querySComCodeApi } from '@/api/money-raise-management'
export default {
  props: {
    hideDetails: {
      type: Function,
    },
    selectArr: {
      type: Array,
    },
  },
  data() {
    return {
      loading: false,
      tableData: [],
      queryParams: {
        billSeqNo: '',
        pageSize: 10,
        pageNum: 1,
      },
      total: 0,
      billTradeType: [], // 节点类型
      billTradeStatus: [], //交易结果
    }
  },
  created() {
    this.queryParams.billSeqNo = this.selectArr[0].seqNo
    this.getDictData()
    this.getTraceLists()
  },
  computed: {},
  methods: {
    // 查询字典
    getDictData() {
      // 节点类型
      querySComCodeApi('BILL_TRACE_NODE_TYPE').then(res => {
        this.billTradeType = res.data
      })
      // 交易结果
      querySComCodeApi('BILL_TRADE_STATUS').then(res => {
        this.billTradeStatus = res.data
      })
    },
    getTraceLists() {
      billsTraceListApi(this.queryParams).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.rows
          this.total = res.data.total
        }
      })
    },
    formatNodeType(row) {
      return this.selectComLabel(this.billTradeType, row.nodeType)
    },
    formatTradeResult(row) {
      return this.selectComLabel(this.billTradeStatus, row.tradeResult)
    },
    // 分页
    handleSizeChange(size) {
      this.queryParams.pageSize = size
      this.getTraceLists()
    },
    handleCurrentChange(cur) {
      this.queryParams.pageNum = cur
      this.getTraceLists()
    },
    // 返回
    back() {
      this.$emit('hideDetails')
    },
  },
}
</script>
<style lang="less" scoped></style>
