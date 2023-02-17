<template>
  <div class="page-name app-container">
    <el-dialog
      :modal-append-to-body="true"
      :title="``"
      :visible.sync="show"
      @close="cancel"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form
        class="el-form-noValid flex-shrink-0"
        :model="queryParams"
        ref="queryForm"
        label-width="100px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item :label="`公司名称`" prop="companyName">
              <el-input
                v-model.trim="queryParams.companyName"
                :placeholder="`请输入公司名称`"
                clearable
                size="small"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery(1)">
                查询
              </el-button>
              <el-button
                type="warning"
                icon="el-icon-plus"
                :disabled="single"
                size="mini"
                @click="selectItemFun"
              >
                选择返回
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="flex1 over-hidden">
        <el-table :data="tableData" @selection-change="handleSelectionChange">
          <el-table-column type="selection" align="center" />
          <el-table-column :label="`序号`" align="center" prop="seqNo" />
          <el-table-column :label="`公司名称`" align="center" prop="enterpriseName" />
        </el-table>
      </div>
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
    </el-dialog>
  </div>
</template>
<script>
import {
  // 接收方列表接口
  acceptorList,
} from '@/api/civil-commercial-credit/revenueExpenditureApi'

export default {
  name: 'Receiver',
  data() {
    return {
      show: true,
      loading: false,
      tableData: [],
      total: 0,
      pageSize: 10,
      pageNum: 1,
      single: '',
      ids: '',
      title: '',
      open: false,
      type: '',
      queryParams: {
        companyName: '',
      },
      selectItem: {},
    }
  },
  mounted: function() {
    this.getList()
  },
  methods: {
    cancel() {
      this.$emit('cancel')
    },
    selectItemFun() {
      this.$emit('sure', this.selectItem[0])
    },
    getList() {
      const query = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        status: '1',
        enterpriseName: this.queryParams.companyName,
      }
      acceptorList(query).then(res => {
        this.tableData = res.data.rows
        this.total = res.data.total
      })
    },
    //查询
    handleQuery() {
      this.pageNum = 1
      this.pageSize = 10
      this.getList()
    },
    //重置
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    handleSizeOrSizePageChange(page) {
      this.pageSize = page
      this.getList()
    },
    handleSizeOrCurrentChange(page) {
      this.pageNum = page
      this.getList()
    },
    handleSelectionChange(selection) {
      this.selectItem = selection
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
    },
  },
}
</script>

<style lang="scss" scoped>
.page-name {
  padding: 10px;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
