<template>
  <div>
    <el-dialog
      :modal-append-to-body="false"
      :title="title"
      :visible.sync="open"
      width="600px"
      append-to-body
      :close-on-click-modal="false"
      @close="cancel"
    >
      <el-table :data="tableData" style="width: 100%" show-summary>
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column prop="feeType" label="息费名称" :formatter="formatRate"> </el-table-column>
        <el-table-column prop="amt" label="预计金额(元)"> </el-table-column>
      </el-table>
      <div class="text-center m-t-10">
        <el-button type="primary" size="small" @click="cancel">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    tableData: {
      type: Array,
    },
  },
  data() {
    return {
      title: '息费详情',
      open: false,
    }
  },
  created() {},
  computed: {},
  methods: {
    cancel() {
      this.open = false
    },

    formatRate(row) {
      console.log(this.$staticData.msx_fee_number)
      return this.selectDictLabel(this.$staticData.msx_fee_number, row.feeType)
    },
  },
}
</script>
<style lang="scss" scoped></style>
