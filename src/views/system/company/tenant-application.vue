<template>
  <div class="app-container flex1 flex-col over-hidden">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="130px"
    >
      <el-form-item label="合作租户" prop="tenantId">
        <el-select
          v-model="queryParams.tenantId"
          placeholder="请选择合作租户"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in tenantList"
            :key="dict.id"
            :label="dict.enterpriseName"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="应用名称" prop="applicationName">
        <el-input
          v-model="queryParams.applicationName"
          placeholder="请输入应用名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="AppID" prop="appId">
        <el-input
          v-model="queryParams.appId"
          placeholder="请输入AppID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="applicationState">
        <el-select
          v-model="queryParams.applicationState"
          placeholder="请选择状态"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in $staticData.application_status"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          :clearable="false"
          v-model="timeRange"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          size="small"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="flex1 over-hidden">
      <el-table
        v-loading="loading"
        :data="postList"
        @selection-change="handleSelectionChange"
        height="100%"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="平台" align="center" prop="platform" />
        <el-table-column label="合作租户" align="center" prop="enterpriseName" />
        <el-table-column label="应用名称" align="center" prop="applicationName" />
        <el-table-column label="APPID" align="center" prop="appId" />
        <el-table-column label="创建人" align="center" prop="createUserName" />
        <el-table-column label="创建时间" align="center" prop="createTime" />
        <el-table-column label="状态" align="center" prop="applicationState">
          <template slot-scope="scope">
            <span>{{
              scope.row.applicationState | dictFilter($staticData.application_status)
            }}</span>
            <el-tooltip class="item" effect="dark" content="存在待审批数据" placement="top">
              <span class="triangle-topright" v-if="scope.row.exsitAudit == 'Y'"></span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="修改人" align="center" prop="updateBy" />
        <el-table-column label="修改时间" align="center" prop="updateTime" />
      </el-table>
    </div>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { applicationList, tenantAllList } from '@/api/system/audit'
import { dictFilter } from '@/utils/filters/common'

export default {
  name: 'Post',
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
        applicationName: undefined,
        appId: undefined,
        applicationState: undefined,
        tenantId: undefined,
        isTenant: 2,
      },
      showModify: false,
      type: '',
      timeRange: [],
      tenantList: [],
    }
  },
  created() {
    this.getList()
    this.getTenantList()
  },
  methods: {
    /**查询合作租户 */
    getTenantList() {
      tenantAllList().then(res => {
        this.tenantList = res
      })
    },
    /** 查询岗位列表 */
    getList() {
      this.loading = true
      // let params = JSON.parse(JSON.stringify(this.queryParams))
      const [startTime, endTime] = this.timeRange || []
      const params = {
        ...this.queryParams,
        startTime,
        endTime,
      }
      applicationList(params)
        .then(response => {
          this.postList = response.rows
          this.total = response.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.timeRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
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
