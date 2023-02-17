<template>
  <div class="bill-info">
    <div class="menu-title">账单信息</div>
    <el-table :data="billsList" border show-summary style="width: 100%">
      <el-table-column prop="billCreateTime" label="账单创建时间"> </el-table-column>
      <el-table-column prop="billNo" label="账单编号"> </el-table-column>
      <el-table-column prop="projectName" label="项目名称"> </el-table-column>
      <el-table-column prop="orderNum" sortable label="订单数量"> </el-table-column>
      <el-table-column prop="paymentSubject" label="付款主体"> </el-table-column>
      <el-table-column prop="billAmount" sortable label="账单金额（元）"> </el-table-column>
      <el-table-column label="操作" width="80">
        <template>
          <el-button type="text" size="small">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// FIXME:引入顺序，先引入npm包，再是绝对路径，最后是相对路径
export default {
  name: 'bill-info',
  components: {},
  mixins: [],
  props: ['billsList'],
  data() {
    return {
      tableData: [],
    }
  },
  computed: {},
  watch: {},
  filters: {},
  created() {},
  mounted() {},
  destroyed() {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.bill-info {
  // margin: 20px 0;
  padding: 20px 0;
}
</style>
