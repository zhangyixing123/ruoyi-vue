<template>
  <div class="page-name app-container">
    <el-dialog
      :modal-append-to-body="false"
      :title="title"
      :visible.sync="open"
      width="600px"
      append-to-body
      :close-on-click-modal="false"
      @close="cancel"
    >
      <div class="flex1 over-hidden">
        <el-table height="400" v-loading="loading" :data="feeList" ref="data1">
          <el-table-column label="序号" align="center" prop="id" />
          <el-table-column label="息费名称" align="center" prop="feeName" />
          <el-table-column label="预计金额(元)" align="center" prop="estimatedAmount" />
        </el-table>
      </div>
      <div slot="footer" class="footer dialog-footer text-center">
        <el-button type="primary" @click="cancel">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'selectInvoice',
  data() {
    return {
      title: '息费详情',
      open: true,
      loading: false,
      feeList: [
        {
          id: '1', //序号
          feeName: '融资利息', //息费名称
          estimatedAmount: '100.22', //预计金额(元)
        },
        {
          id: '2', //序号
          feeName: '银行手续费', //息费名称
          estimatedAmount: '100.22', //预计金额(元)
        },
        {
          id: '3', //序号
          feeName: '保荐费', //息费名称
          estimatedAmount: '100.22', //预计金额(元)
        },
        {
          id: '4', //序号
          feeName: '平台手续费', //息费名称
          estimatedAmount: '100.22', //预计金额(元)
        },
      ],
      total: 0,
      pageSize: 10,
      pageNum: 1,
    }
  },
  mounted: function() {},
  methods: {
    getList() {},
    cancel() {
      this.$emit('sure')
    },
  },
}
</script>

<style lang="scss" scoped>
/* style 建议使用, scoped 可以用可不用，如果不用 scoped，第一级必须是 本页面的独有的page-name */
/* 必须按规范，不然会对别人的页面造成样式干扰 */
.page-name {
  padding: 10px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
