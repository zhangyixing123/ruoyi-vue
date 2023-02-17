<template>
  <div class="origin-container">
    <el-form
      class="el-form-noValid flex-shrink-0"
      :model="queryParams"
      ref="queryForm"
      label-width="100px"
    >
      <el-row>
        <el-col :span="6">
          <el-form-item :label="`民商信编号`" prop="creditCode">
            <el-input
              v-model.trim="queryParams.creditCode"
              :placeholder="`请输入民商信编号`"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="`开立方`" prop="openerCode">
            <el-select
              v-model.trim="queryParams.openerCode"
              :placeholder="`请选择开立方`"
              size="small"
            >
              <el-option
                v-for="status in openCubeList"
                :key="status.dictValue"
                :label="status.dictLabel"
                :value="status.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item :label="`承诺付款日`" prop="payTime">
            <el-date-picker
              :clearable="false"
              v-model.trim="queryParams.payTime"
              size="small"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              :start-placeholder="`开始时间`"
              :end-placeholder="`结束时间`"
              :default-time="['00:00:00', '23:59:59']"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="`接收日期`" prop="createdTime">
            <el-date-picker
              :clearable="false"
              v-model.trim="queryParams.createdTime"
              size="small"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              :start-placeholder="`开始时间`"
              :end-placeholder="`结束时间`"
              :default-time="['00:00:00', '23:59:59']"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item>
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
    <div class="flex-shrink-0">
      <el-row :gutter="10" class="mb8 flex-shrink-0">
        <el-col :span="1.5">
          <el-button type="warning" plain size="mini" @click="exportFun">导出</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            :disabled="!single"
            type="primary"
            plain
            icon="el-icon-add"
            size="mini"
            @click="downVoucher"
          >
            下载凭证
          </el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 剩余空间通过 flex1 全部分给表格，over-hidden 必须使用 -->
    <div class="flex1 over-hidden">
      <!-- el-table 配置 height 属性 100%，起到自动撑开，且表格标题固定的效果； -->
      <el-table
        height="100%"
        v-loading="loading"
        :data="tableData"
        ref="data7"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="80" align="center" />
        <el-table-column label="民商信编号" align="center" prop="creditCode" />
        <el-table-column label="开立方" align="center" prop="openerName"> </el-table-column>
        <el-table-column label="原始金额(元)" align="center" prop="creditLimit" />
        <el-table-column label="承诺付款日" align="center" prop="payTime" />
        <el-table-column label="接收日期" align="center" prop="openDate" />
        <el-table-column label="融资付息模式" align="center">
          <template slot-scope="scope">
            <span>
              {{ scope.row.interestType | dictFilter(financeModeList) }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页必须加 flex-shrink-0 样式不一定用我的，好看就行 -->
    <!-- size-change 和 current-change 统一用一个时间处理就行了，无非是再去获取列表数据 -->
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
</template>

<script>
import { dictFilter } from '@/utils/filters/common.js'
import {
  originalList,
  exportOriginalList,
} from '@/api/civil-commercial-credit/revenueExpenditureApi'

export default {
  props: {},
  filters: { dictFilter },
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      loading: false,
      tableData: [],
      total: 0,
      selectedData: [],
      queryParams: {
        payTime: ['', ''],
        createdTime: ['', ''],
      },
    }
  },
  components: {},
  computed: {
    financeModeList() {
      return this.$store.state.msx.financeModeList
    },
    single() {
      return this.selectedData.length === 1
    },
    openCubeList() {
      return this.$staticData.core_enterprise
    },
    ownId() {
      return this.$store.state.enterprise.enterpriseId
    },
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      const {
        payTime: [payTimeStart, payTimeEnd],
        createdTime: [transDateStart, transDateEnd],
        creditCode,
        payer,
      } = this.queryParams
      const query = {
        payTimeStart,
        payTimeEnd,
        transDateStart,
        transDateEnd,
        creditCode,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        ownId: this.ownId,
        payer,
        status: '7',
      }
      this.loading = true
      originalList(query).then(res => {
        this.tableData = res.data.rows
        this.total = res.data.total
        this.loading = false
      })
    },
    handleQuery() {
      this.pageNum = 1
      this.pageSize = 10
      this.getList()
    },
    resetQuery() {
      this.$refs.queryForm.resetFields()
    },
    // 导出
    exportFun() {
      const {
        payTime: [payTimeStart, payTimeEnd],
        createdTime: [transDateStart, transDateEnd],
        creditCode,
        payer,
      } = this.queryParams
      const query = {
        payTimeStart,
        payTimeEnd,
        transDateStart,
        transDateEnd,
        creditCode,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        ownId: this.ownId,
        payer,
        status: '7',
      }
      exportOriginalList(query).then(res => {
        downloadWord(res, '原始列表.xlsx')
      })
    },
    // 下载凭证
    downVoucher() {
      //跳转下载中心
      const { creditCode } = this.selectedData[0]
      this.$router.push({
        name: 'DownloadCenter/index',
        query: { creditCode },
      })
    },
    handleSelectionChange(selection) {
      this.selectedData = selection
    },
    handleSizeOrSizePageChange(page) {
      this.queryParams.pageSize = page
      this.getList()
    },
    handleSizeOrCurrentChange(page) {
      this.queryParams.pageNum = page
      this.getList()
    },
  },
}
</script>

<style scoped lang="scss">
.origin-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
