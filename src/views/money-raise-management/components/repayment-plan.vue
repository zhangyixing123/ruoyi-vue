<template>
  <div class="setBg">
    <!-- <el-button size="mini" type="primary" @click="back">导出</el-button> -->
    <el-button size="mini" @click="back">返回</el-button>
    <div>
      <el-table :data="tableData" v-loading="loading" class="m-t-20" border>
        <el-table-column label="期号" prop="perdNo" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="还款日期" prop="dueDt" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="期供金额" prop="psInstmAmount" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="应还本金" prop="prcpAmt" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="应还利息" prop="intAmt" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="应还费用" prop="instmAmt" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="应还罚息" prop="tradeResult" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="已还本金" prop="tradeResult" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="已还利息" prop="tradeResult" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="已还费用" prop="tradeResult" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="已还罚息" prop="tradeResult" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="实还日期" prop="tradeResult" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="是否结清" prop="tradeResult" :show-overflow-tooltip="true">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    playList: {
      type: Array,
    },
    hidePlan: {
      type: Function,
    },
  },
  data() {
    return {
      loading: false,
      tableData: [],
      billTradeType: [], // 节点类型
      billTradeStatus: [], //交易结果
    }
  },
  created() {
    this.tableData = this.playList
  },
  computed: {},
  methods: {
    // 返回
    back() {
      this.$emit('hidePlan')
    },
  },
}
</script>
<style lang="scss" scoped>
::v-deep .over-auto {
  background: #fff !important;
}
.setBg {
  background: #fff;
  padding: 20px;
}
</style>
