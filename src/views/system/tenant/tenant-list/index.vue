<template>
  <div class="app-container flex1 flex-col over-hidden">
    <div class="flex1 flex-col over-hidden" v-if="!showModify">
      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        v-show="showSearch"
        label-width="130px"
      >
        <el-form-item label="租户名称" prop="enterpriseName">
          <el-input
            v-model="queryParams.enterpriseName"
            placeholder="请输入租户名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="统一社会信用代码" prop="enterpriseCode">
          <el-input
            v-model="queryParams.enterpriseCode"
            placeholder="请输入统一社会信用代码"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
            <el-option
              v-for="dict in $staticData.tenant_status"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            size="mini"
            @click="handleModify('add')"
            v-hasPermi="['system:tenant:add']"
            >新增</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            size="mini"
            :disabled="single"
            @click="handleModify('update')"
            v-hasPermi="['system:tenant:edit']"
            >修改</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            size="mini"
            :disabled="single"
            @click="handleModify('view')"
            v-hasPermi="['system:tenant:query']"
            >查看</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            plain
            size="mini"
            @click="handleEnable('生效')"
            type="primary"
            :disabled="single"
            v-hasPermi="['system:tenant:valid']"
            >生效</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            plain
            size="mini"
            @click="handleEnable('失效')"
            type="primary"
            :disabled="single"
            v-hasPermi="['system:tenant:invalid']"
            >失效</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            plain
            size="mini"
            @click="handleDelete"
            type="primary"
            :disabled="single"
            v-hasPermi="['system:tenant:remove']"
            >删除</el-button
          >
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
      <div class="flex1 over-hidden">
        <el-table
          v-loading="loading"
          :data="postList"
          @selection-change="handleSelectionChange"
          border
          height="100%"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="租户编号" align="center" prop="tenantCode" />
          <el-table-column label="租户名称" align="center" prop="enterpriseName" />
          <el-table-column label="统一社会信用代码" align="center" prop="enterpriseCode" />
          <el-table-column label="创建人" align="center" prop="createUser" />
          <el-table-column label="创建时间" align="center" prop="createTime" />
          <el-table-column label="状态" align="center" prop="status">
            <template slot-scope="scope">
              <span>{{ scope.row.status | dictFilter($staticData.tenant_status) }}</span>
              <el-tooltip class="item" effect="dark" content="存在待审批数据" placement="top">
                <span class="triangle-topright" v-show="scope.row.exsitAudit == 'Y'"></span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label='操作'
            align="center"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleAudit(scope.row)"
                v-hasPermi="['system:tenant:getAuditList']"
                >变更记录</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />

      <!-- 添加或修改岗位对话框 -->
      <el-dialog
        :modal-append-to-body="false"
        title="变更记录"
        :visible.sync="open"
        width="700px"
        append-to-body
      >
        <el-table :data="auditRecords">
          <el-table-column label="提交时间" align="center" prop="submitTime" />
          <el-table-column label="提交人" align="center" prop="submitter" />
          <el-table-column label="操作类型" align="center" prop="examineType" />
          <el-table-column label="审核状态" align="center" prop="examineState" />
        </el-table>
      </el-dialog>
    </div>
    <tenant-modify
      v-if="showModify"
      @closeModify="closeModify"
      :type="type"
      :ids="ids"
    ></tenant-modify>
  </div>
</template>

<script>
import {
  tenantListApi,
  tenantInvalidApi,
  tenantValidApi,
  tenantAuditListApi,
  tenantDeleteApi,
} from '@/api/tenant-management/index'
import tenantModify from '../../component/tenant-modify.vue'
import { dictFilter } from '@/utils/filters/common'

export default {
  name: 'Post',
  components: {
    'tenant-modify': tenantModify,
  },
  filters: { dictFilter },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 岗位表格数据
      postList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        enterpriseName: undefined,
        enterpriseCode: undefined,
        status: undefined,
      },
      showModify: false,
      type: '',
      auditRecords: [],
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询岗位列表 */
    getList() {
      this.loading = true
      tenantListApi(this.queryParams).then((response) => {
        this.postList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        enterpriseName: undefined,
        enterpriseCode: undefined,
        status: undefined,
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.single = selection.length != 1
    },
    /** 新增、修改、查看按钮操作 */
    handleModify(type) {
      this.showModify = true
      this.type = type
    },
    /**获取变更记录 */
    handleAudit(row) {
      this.auditRecords = []
      tenantAuditListApi(row.id).then((res) => {
        if (res.code == 200) {
          this.auditRecords = res.rows
          this.open = true
        }
      })
    },
    /**关闭新增 */
    closeModify() {
      this.showModify = false
      this.ids = []
      this.single = true
      this.type = ''
      this.getList()
    },
    /** 删除按钮操作 */
    handleDelete() {
      let that = this
      that
        .$confirm(
          '确定删除本数据吗?只有待生效且无审批的数据才可以删除,删除后无法恢复!',
          '删除提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }
        )
        .then(() => {
          tenantDeleteApi(this.ids[0]).then((res) => {
            if (res.code == 200) {
              that.$message.success('操作成功')
              that.getList()
            }
          })
        })
        .catch(() => {
          that.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    /**生效失效按钮操作 */
    handleEnable(type) {
      let requestFn = type == '生效' ? tenantValidApi : tenantInvalidApi
      requestFn(this.ids[0]).then((res) => {
        if (res.code == 200) {
          this.$confirm(`操作成功, 请联系人员审批,需要审批后才能${type}!`, '操作提示', {
            showCancelButton: false,
            showConfirmButton: false,
          })
          this.getList()
        }
      })
    },
  },
}
</script>
<style scoped>
.triangle-topright {
  display: block;
  width: 0;
  height: 0;
  border-top: 20px solid #ff4949;
  border-left: 20px solid transparent;
  position: absolute;
  right: 0;
  top: 0;
}
</style>
