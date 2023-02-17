<template>
  <div class="financing-process">
    <div class="menu-title">融资进度跟踪</div>
    <el-table :data="tbFinanceTraces" style="width: 100%">
      <el-table-column prop="createTime" label="时间"> </el-table-column>
      <el-table-column prop="nodeName" label="操作说明"> </el-table-column>
      <el-table-column prop="userName" label="操作员ID"> </el-table-column>
      <el-table-column prop="remark" label="操作备注"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
// FIXME:引入顺序，先引入npm包，再是绝对路径，最后是相对路径
export default {
  name: 'financing-process',
  components: {},
  mixins: [],
  props: ['tbFinanceTraces'],
  data() {
    return {
      tableData: [
        {
          time: '2017-10-01 12:00',
          operatorDesc: '发起申请',
          operatorID: '取货员 ID1234',
          operatRemark: '5mins',
        },
        {
          time: '2017-10-01 12:00',
          operatorDesc: '取货员出发',
          operatorID: '取货员 ID1234',
          operatRemark: '2h',
        },
        {
          time: '2017-10-01 12:00',
          operatorDesc: '取货员接单',
          operatorID: '取货员 ID1234',
          operatRemark: '2mins',
        },
        {
          time: '2017-10-01 12:00',
          operatorDesc: '申请审批通过',
          operatorID: '系统',
          operatRemark: '23s',
        },
        {
          time: '2017-10-01 12:00',
          operatorDesc: '发起申请',
          operatorID: '用户',
          operatRemark: '0s',
        },
      ],
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
.financing-process {
  padding: 20px 0;
}
</style>
