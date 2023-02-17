<template>
  <div>
    <el-button @click="back" size="small">返回</el-button>
    <el-table :data="tableData" style="width: 100%" v-loading="loading" class="m-t-20" border>
      <el-table-column label="期号" prop="perdNo" :show-overflow-tooltip="true"> </el-table-column>
      <el-table-column label="到期日" prop="endDt" :show-overflow-tooltip="true"> </el-table-column>
      <el-table-column label="本金" prop="prcp" :show-overflow-tooltip="true"> </el-table-column>
      <el-table-column label="利息" prop="normInt" :show-overflow-tooltip="true"> </el-table-column>
      <el-table-column label="罚息/复利" prop="" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.odInt }}</span
          ><span v-show="scope.row.odInt && scope.row.commInt">/</span>
          <span>{{ scope.row.commInt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="剩余本金" prop="remPrcp" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column label="已还本金" prop="setlPrcp" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column label="已还利息" prop="setlNormInt" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column label="已还罚息/复利" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.setlOdInt }}</span
          ><span v-show="scope.row.setlCommInt && scope.row.setlOdInt">/</span>
          <span>{{ scope.row.setlCommInt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应还费用" prop="fee" :show-overflow-tooltip="true"> </el-table-column>
      <el-table-column label="已还费用" prop="setlFee" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column label="息费减免" prop="wvIntFee" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column label="实际还款日" prop="lastSetlDt" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column label="结清标志" prop="setlInd" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-if="scope.row.setlInd == 1">是</span>
          <span v-if="scope.row.setlInd == 0">否</span>
        </template>
      </el-table-column>
      <el-table-column label="逾期标志" prop="odInd" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-if="scope.row.odInd == 1">是</span>
          <span v-if="scope.row.odInd == 0">否</span>
        </template>
      </el-table-column>
      <el-table-column label="还款方式" prop="repayMode" :show-overflow-tooltip="true">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getPlanApi } from '@/api/money-raise-management'
export default {
  props: {
    hidePlan: {
      type: Function,
    },
    seqNo: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      loading: false,
      tableData: [],
      billTradeType: [], // 节点类型
      billTradeStatus: [], //交易结果
      queryParams: {},
    }
  },
  created() {
    this.getPlanList()
  },
  computed: {},
  methods: {
    // 返回
    back() {
      this.$emit('hidePlan')
    },
    getPlanList() {
      getPlanApi(this.seqNo).then(res => {
        if (res.code == 200) {
          this.tableData = res.data
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped></style>
