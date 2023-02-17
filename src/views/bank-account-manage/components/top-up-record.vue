<template>
  <div class="page-name flex-col flex1">
    <el-form
      class="el-form-noValid flex-shrink-0"
      :model="queryParams"
      ref="queryForm"
      label-width="100px"
    >
      <el-row>
        <el-col :span="6">
          <el-form-item :label="`创建时间`" prop="creatTime">
            <el-date-picker
              :clearable="false"
              v-model.trim="creatTime"
              size="small"
              value-format="yyyy-MM-dd HH-mm-ss"
              type="daterange"
              range-separator="-"
              :start-placeholder="`开始时间`"
              :end-placeholder="`结束时间`"
              :default-time="['00:00:00', '23:59:59']"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="`审核时间`" prop="approvelTime">
            <el-date-picker
              :clearable="false"
              v-model.trim="approvelTime"
              size="small"
              value-format="yyyy-MM-dd HH-mm-ss"
              type="daterange"
              range-separator="-"
              :start-placeholder="`开始时间`"
              :end-placeholder="`结束时间`"
              :default-time="['00:00:00', '23:59:59']"
            ></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item :label="`交易状态`" prop="tradeStatus">
            <el-select
              v-model.trim="queryParams.tradeStatus"
              :placeholder="`请选择交易状态`"
              size="small"
            >
              <el-option
                v-for="status in $staticData.trade_status"
                :key="status.dictValue"
                :label="status.dictLabel"
                :value="status.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">
              查询
            </el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"> 重置 </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 中间有其他按钮或者展示区，也可以加 -->
    <div class="flex-shrink-0"></div>
    <!-- 剩余空间通过 flex1 全部分给表格，over-hidden 必须使用 -->
    <div class="flex1 over-hidden">
      <!-- el-table 配置 height 属性 100%，起到自动撑开，且表格标题固定的效果； -->
      <el-table height="100%" v-loading="loading" :data="tableData">
        <el-table-column label="交易流水号" align="center" prop="tradeFlowNum" />
        <el-table-column
          label="充值金额"
          align="center"
          prop="tradeAmount"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="交易状态"
          align="center"
          prop="tradeStatus"
          :formatter="tradeStatusFormatter"
        />
        <el-table-column label="创建时间" align="center" prop="createTime" />
        <el-table-column label="提交人" align="center" prop="createUser" />
        <el-table-column label="说明" align="center" prop="tradeExplain" />
        <el-table-column label="审核时间" align="center" prop="approveTime" />
        <el-table-column label="审核人" align="center" prop="approveUser" />
        <el-table-column label="审核说明" align="center" prop="approveExplain" />
        <el-table-column label="操作" align="center" prop="dictId">
          <template slot-scope="scope">
            <el-button @click="downLoadDetails(scope.row)" type="text"> 下载凭证 </el-button>
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
      @size-change="handleSizeOrSizePageChange"
      @current-change="handleSizeOrCurrentChange"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import { rechargeRecordApi } from '@/api/amount-management/index'
import { downloadWord } from '@/utils/ruoyi'
import { downloadImageApi } from '@/api/image-management'
import { utils } from '@/utils/utils'
import $bus from '@/utils/eventBus'

export default {
  // name 属性，如果需要使用 keep-alive 缓存页面，name必须配置
  name: 'dataList',
  // 这里不说了 data(){return {}}模式；
  data() {
    return {
      loading: false,
      tableData: [],
      total: 0,
      pageSize: 10,
      pageNum: 1,
      creatTime: [],
      approvelTime: [],
      queryParams: {
        pageSize: 10,
        pageNum: 1,
        enterpriseCertNo: this.$store.state.enterprise.enterpriseCertNo,
        startCreateTime: null,
        endCreateTime: null,
        startApproveTime: null,
        endApproveTime: null,
        startCreateTime: null,
        platform: 1, //平台 1:供应商 2:核心企业 3:资金方
        tradeStatus: null, //交易状态
      },
      single: false,
      rows: [],
    }
  },
  mounted: function() {
    this.getList()
    $bus.$on('top-up-record', () => {
      this.getList()
    })
  },
  destroyed() {
    $bus.$off('top-up-record')
  },
  methods: {
    getList() {
      if (this.creatTime) {
        this.queryParams.startCreateTime = this.creatTime[0]
        this.queryParams.endCreateTime = this.creatTime[1]
      }
      if (this.approvelTime) {
        this.queryParams.startApproveTime = this.approvelTime[0]
        this.queryParams.endApproveTime = this.approvelTime[1]
      }
      rechargeRecordApi(this.queryParams).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.rows
          this.total = res.data.total
        }
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.creatTime = []
      this.approvelTime = []
      this.queryParams = {
        pageSize: 10,
        pageNum: 1,
        enterpriseCertNo: this.$store.state.enterprise.enterpriseCertNo,
        startCreateTime: null,
        endCreateTime: null,
        startApproveTime: null,
        endApproveTime: null,
        startCreateTime: null,
        platform: 1, //平台 1:供应商 2:核心企业 3:资金方
        tradeStatus: null, //交易状态
      }
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.rows = selection
      this.ids = selection.map(item => item.seqNo)
      this.single = selection.length != 1
    },
    handleSizeOrSizePageChange(page) {
      this.queryParams.pageSize = page
      this.getList()
    },
    handleSizeOrCurrentChange(page) {
      this.queryParams.pageNum = page
      this.getList()
    },
    // downLoadDetails(row) {
    //   console.log(row.tradeFile)
    // },

    // 下载
    async downLoadDetails(item) {
      let res = await downloadImageApi({
        imageNumber: item.tradeFile,
        type: 1,
      })

      console.log(res, item)
      downloadWord(res, utils.sessionStorageGet('fileName'))
    },

    // 交易状态翻译
    tradeStatusFormatter(row) {
      return this.selectDictLabel(this.$staticData.trade_status, row.tradeStatus)
    },
  },
}
</script>

<style lang="scss" scoped>
/* style 建议使用, scoped 可以用可不用，如果不用 scoped，第一级必须是 本页面的独有的page-name */
/* 必须按规范，不然会对别人的页面造成样式干扰 */
// .page-name {
//   padding: 10px;
//   overflow-y: scroll;
// }

.page-name {
  padding: 10px;
  height: 100%;
  overflow: hidden;
}
</style>
