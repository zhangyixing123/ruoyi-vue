<template>
  <div class="app-container">
    <div>
      <div class="border">
        <span class="f-weight-bold f-s-18">供应商数量太多怎么办？</span>
        <div class="flex">
          <p>
            运营平台会为您提供批量录入供应商，您只需要上传含有供应商信息的Excel文件。
            <span class="c-1890ff cur-pointer">供应商名单表格下载</span>
          </p>
          <div class="m-l-30">
            <el-button type="primary">批量上传供应商名单</el-button>
          </div>
        </div>
      </div>
      <div class="m-t-20">
        <el-form :model="queryParams" ref="queryForm" class="flex-shrink-0" label-width="120px">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="供应商名称" prop="billNumber">
                <el-input
                  v-model.trim="queryParams.billNumber"
                  placeholder="请输入供应商名称"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="状态" prop="billStatus">
                <el-select
                  v-model.trim="queryParams.billStatus"
                  placeholder="请选择状态"
                  clearable
                  size="small"
                >
                  <el-option
                    v-for="dict in statusOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label-width="0">
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery"
                  >搜索</el-button
                >
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div>
        <el-button icon="el-icon-plus" size="mini" type="primary" @click="addInfo">新增</el-button>
        <div class="flex1 over-hidden m-t-20">
          <el-table :data="tableData" v-loading="loading">
            <el-table-column type="index" width="55" label="序号"> </el-table-column>
            <el-table-column label="供应商名称" prop="supplyName" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column label="统一社会信用代码" prop="cerNo" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column label="联系人" prop="linkman" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column label="联系方式" prop="phone" :show-overflow-tooltip="true">
            </el-table-column>

            <el-table-column
              label="状态"
              prop="status"
              :show-overflow-tooltip="true"
              :formatter="formatStatus"
            >
            </el-table-column>
            <el-table-column label="操作" prop="" width="120px">
              <template slot-scope="scope">
                <span class="c-1890ff cur-pointer" @click="edit(scope.row)">修改</span>
                <span class="c-1890ff cur-pointer m-l-20" @click="deleteRow(scope)">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="m-t-20">
        <el-pagination
          class="text-center bgfff pd10 flex-shrink-0"
          layout="total, sizes, prev, pager, next, jumper"
          :current-page.sync="pageNum"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="pageSize"
          @size-change="handleSizeOrCurrentChange"
          @current-change="handleSizeOrCurrentChange"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <modify-message ref="modifyMessage" :isEdit="isEdit" :editInfo="editInfo"></modify-message>
  </div>
</template>
<script>
import modifyMessage from './comonent/modify-message.vue'
export default {
  components: {
    modifyMessage,
  },
  data() {
    return {
      showModify: false, // 新增编辑
      loading: false,
      statusOptions: [
        { dictValue: '1', dictLabel: '已注册' },
        { dictValue: '2', dictLabel: '未注册' },
      ],
      queryParams: {},
      tableData: [
        {
          supplyName: '上善国际有限公司',
          cerNo: '91110111756033566J',
          linkman: '贺知章',
          phone: '15390121451',
          status: '1',
        },
        {
          supplyName: '上善国际有限公司',
          cerNo: '91110111756033566J',
          linkman: '贺知章',
          phone: '15390121451',
          status: '1',
        },
        {
          supplyName: '上善国际有限公司',
          cerNo: '91110111756033566J',
          linkman: '贺知章',
          phone: '15390121451',
          status: '1',
        },
      ],
      editInfo: {},
      isEdit: false,
      pageSize: 10,
      pageNum: 1,
      total: 0,
    }
  },
  created() {
    this.total = this.tableData.length
  },
  computed: {},
  methods: {
    handleQuery() {},
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
    },
    formatStatus(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    handleSizeOrCurrentChange() {},
    // 新增
    addInfo() {
      this.isEdit = false
      this.editInfo = {}
      this.$refs.modifyMessage.show = true
    },
    // 编辑
    edit(row) {
      this.isEdit = true
      this.editInfo = row
      this.$refs.modifyMessage.show = true
    },
    // 删除
    deleteRow(scope) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
      })
        .then(() => {
          this.tableData.splice(scope.$index - 1, 1)
          this.total = this.tableData.length
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
  },
}
</script>
<style lang="scss" scoped>
.border {
  border: 1px solid #ccc;
  padding: 20px 40px 10px;
  border-radius: 5px;
}
</style>
