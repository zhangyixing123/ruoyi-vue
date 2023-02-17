<template>
  <div class="app-container flex1 flex-col over-hidden">
    <div class="flex1 flex-col over-hidden" v-if="!showModify">
      <el-form
        class="flex-shrink-0"
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        v-show="showSearch"
        label-width="120px"
      >
        <el-form-item label="所属业务模块" prop="examineBusinessMode">
          <el-select
            v-model="queryParams.examineBusinessMode"
            placeholder="请选择所属业务模块"
            clearable
            size="small"
          >
            <el-option
              v-for="dict in examineBusinessMode"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="操作类型" prop="examineType">
          <el-select
            v-model="queryParams.examineType"
            :placeholder="请选择操作类型"
            clearable
            size="small"
          >
            <el-option
              v-for="dict in examineType"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态" prop="examineState">
          <el-select
            v-model="queryParams.examineState"
            placeholder="请选择审核状态"
            clearable
            size="small"
          >
            <el-option
              v-for="dict in examineState"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="提交时间">
          <el-date-picker
            :clearable="false"
            v-model="submitTime"
            size="small"
            style="width: 240px"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="daterange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :default-time="['00:00:00', '23:59:59']"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery"
            >查询</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <div class="flex1 over-hidden">
        <el-table height="100%" v-loading="loading" :data="dataList">
          <el-table-column
            label="审核编码"
            align="center"
            prop="seqNo"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="所属业务模块"
            align="center"
            prop="examineBusinessMode"
            :show-overflow-tooltip="true"
            :formatter="examineBusinessModeFormatter"
          />
          <el-table-column
            label="操作类型"
            align="center"
            prop="examineType"
            :show-overflow-tooltip="true"
            :formatter="examineTypeFormatter"
          />
          <el-table-column label="提交人" align="center" prop="submitter" />
          <el-table-column
            label="提交时间"
            align="center"
            prop="submitTime"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="审核状态"
            align="center"
            prop="examineState"
            :formatter="examineStateFormatter"
          />
          <el-table-column label="审批人" align="center" prop="reviewer" />
          <el-table-column label="审批时间" align="center" prop="examineTime" />
          <el-table-column label="审批备注" align="center" prop="examineRemark" />

          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                v-show="scope.row.loginUserFlag && scope.row.examineState == '0'"
                v-hasPermi="['system:examine:revoke']"
                @click="cancelFn(scope.row)"
                >撤销</el-button
              >
              <el-button size="mini" type="text" @click="checkFn(scope.row)">查看</el-button>
              <el-button
                size="mini"
                type="text"
                v-show="!scope.row.loginUserFlag && scope.row.examineState == 0"
                v-hasPermi="['system:tenant:callback']"
                @click="auditFn(scope.row)"
                >审核</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-pagination
        class="text-center bgfff pd10 flex-shrink-0"
        layout="total, sizes, prev, pager, next, jumper"
        :current-page.sync="queryParams.pageNum"
        :page-sizes="[10, 20, 30, 50]"
        :page-size.sync="queryParams.pageSize"
        @size-change="getList"
        @current-change="getList"
        :total="total"
      >
      </el-pagination>
    </div>

    <audit-modify
      v-if="showModify"
      @closeModify="closeModify"
      :type="type"
      :allData="allData"
    ></audit-modify>
  </div>
</template>

<script>
import { examineList, typeQuery, examineRevoke } from '@/api/system/audit'
import auditModify from '../../component/audit-modify.vue'

export default {
  name: 'Config',
  components: {
    'audit-modify': auditModify,
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,

      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      submitTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {},
      dataList: [],
      typeOptions: [],
      examineState: [], //审核状态
      examineType: [], //操作类型
      examineBusinessMode: [],
      showModify: false,
      type: '',
      // 选中数组
      ids: null,
    }
  },
  created() {
    // 查询条件字典值
    typeQuery().then(res => {
      this.examineBusinessMode = res[0]
      this.examineState = res[2]
      this.examineType = res[1]
    })
    this.getList()
  },
  methods: {
    // 字典翻译
    examineBusinessModeFormatter(row, column) {
      return this.selectDictLabel(this.examineBusinessMode, row.examineBusinessMode)
    },
    examineStateFormatter(row, column) {
      return this.selectDictLabel(this.examineState, row.examineState)
    },
    examineTypeFormatter(row, column) {
      return this.selectDictLabel(this.examineType, row.examineType)
    },

    /**关闭新增 */
    closeModify() {
      this.showModify = false
      this.type = ''
      this.getList()
    },
    // 查看
    checkFn(row) {
      this.showModify = true
      this.type = 'view'
      this.allData = row
    },
    // 审核
    auditFn(row) {
      this.showModify = true
      this.type = 'audit'
      this.allData = row
    },
    /** 查询参数列表 */
    getList() {
      this.loading = false
      if (this.submitTime) {
        this.queryParams.startTime = this.submitTime[0]
        this.queryParams.endTime = this.submitTime[1]
      }
      examineList(this.queryParams).then(response => {
        this.total = response.total
        this.dataList = response.rows
        this.loading = false
      })
    },

    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },

    // 撤销
    cancelFn(row) {
      this.$confirm(`撤销后可重新发起申请，确定撤销本次申请吗？`, `撤销提示}`, {
        confirmButtonText: `确定`,
        cancelButtonText: `取消`,
        type: 'warning',
      })
        .then(function() {
          return examineRevoke({ seqNo: row.seqNo })
        })
        .then(() => {
          this.getList()
          this.msgSuccess(`撤销成功`)
        })
    },
    // 表单重置
    reset() {
      this.form = {}
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.submitTime = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
  },
}
</script>
