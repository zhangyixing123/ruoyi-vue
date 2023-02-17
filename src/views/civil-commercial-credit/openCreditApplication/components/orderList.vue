<template>
  <el-dialog
    :modal-append-to-body="false"
    class="text-center"
    title="订单列表"
    :visible.sync="open"
    width="1000px"
    :append-to-body="true"
    @close="cancel"
  >
    <el-form
      class="el-form-noValid flex-shrink-0"
      :model="queryParams"
      ref="queryForm"
      v-show="showSearch"
      label-width="100px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item :label="`订单号`" prop="orderNo">
            <el-input
              v-model.trim="queryParams.orderNo"
              :placeholder="`请输入订单号`"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label-width="0">
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">
              查询
            </el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">
              重置
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="flex1 over-hidden">
      <!-- el-table 配置 height 属性 100%，起到自动撑开，且表格标题固定的效果； -->
      <el-table v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="订单号" align="center" prop="orderNo" />
        <el-table-column label="项目名称 " align="center" prop="orderName" />
        <el-table-column label="订单金额" align="center" prop="orderAmount" />
        <el-table-column
          label="订单状态"
          align="center"
          prop="orderSts"
          :formatter="formatStatus"
        />
        <el-table-column label="卖出方" align="center" prop="seller" />
        <el-table-column label="交易日期" align="center" prop="procureTime" />
        <el-table-column label="经办人" align="center" prop="agent" />
        <el-table-column label="备注" align="center" prop="remark" />
      </el-table>
    </div>
    <el-pagination
      class="text-center bgfff pd10 flex-shrink-0"
      layout="total, sizes, prev, pager, next, jumper"
      :current-page.sync="pageNum"
      :page-sizes="[10, 20, 30, 50]"
      :page-size.sync="pageSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :total="total"
    >
    </el-pagination>
    <div slot="footer" class="dialog-footer text-center">
      <el-button type="primary" @click="submitForm" :disabled="single">选择并返回</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { listOrderPageApi } from '@/api/civil_and_ommercial_letter/zq'
export default {
  props: {
    echoData: {
      type: Function,
    },
    open: {
      type: Boolean,
    },
  },
  data() {
    return {
      showSearch: true,
      loading: false,
      tableData: [],
      total: 0,
      pageSize: 10,
      pageNum: 1,
      creditTableData: [], // 合同模板列表
      single: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderNo: undefined,
      },
      creditData: [], //选取值
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 分页
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getList()
    },

    // 弹框多选
    handleSelectionChange(selection) {
      this.creditData = selection
      this.single = selection.length != 1
      this.ids = selection.map(item => item.seqNo)
    },

    // 获取订单列表
    getList() {
      listOrderPageApi(this.queryParams).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.rows
          this.total = res.data.total
        }
      })
    },
    formatStatus(row) {
      return this.selectDictLabel(this.$staticData.order_status, row.orderSts)
    },
    // 查询
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    // 重置
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 选取返回
    submitForm() {
      if (this.creditData.length > 0) this.creditData = this.creditData[0]
      this.$emit('echoData', this.creditData)
      this.$emit('update:open', false)
    },
    cancel() {
      this.$emit('update:open', false)
    },
  },
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog {
  min-height: 480px;
}
</style>
