<template>
  <!-- 余额变动记录列表 -->
  <div class="record-container">
    <el-dialog
      :modal-append-to-body="false"
      :title="``"
      :visible.sync="showRecord"
      @close="cancel"
      :close-on-click-modal="false"
    >
      <div class="table-container">
        <el-form
          class="el-form-noValid flex-shrink-0"
          :model="queryParams"
          ref="queryForm"
          label-width="100px"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item label="业务类型" prop="tradeType">
                <el-select
                  v-model.trim="queryParams.tradeType"
                  size="small"
                  placeholder="请选择业务类型"
                >
                  <el-option
                    v-for="item in tradeTypeList"
                    :key="item.dictValue"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="交易时间" prop="tradeTime">
                <el-date-picker
                  :clearable="false"
                  v-model.trim="queryParams.tradeTime"
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
            <el-col :span="8">
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
        <div class="flex1 over-hidden">
          <el-table v-loading="loading" :data="tableData" height="100%">
            <el-table-column label="流水号" align="center" prop="businessId"></el-table-column>
            <el-table-column label="民商信编号" align="center" prop="creditCode"></el-table-column>
            <el-table-column
              label="交易金额(元)"
              align="center"
              prop="tradeAmount"
            ></el-table-column>
            <el-table-column label="交付对象" align="center" prop="ownName"></el-table-column>
            <el-table-column label="业务类型" align="center" prop="tradeType">
              <template slot-scope="scope">
                <span> {{ scope.row.tradeType | dictFilter(tradeTypeList) }} </span>
              </template>
            </el-table-column>
            <el-table-column label="交易时间" align="center" prop="createTime"></el-table-column>
            <el-table-column
              label="可用余额(元)"
              align="center"
              prop="afterBalance"
            ></el-table-column>
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
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listMoneyRecordPage } from '@/api/civil-commercial-credit/revenueExpenditureApi'
import { dictFilter } from '@/utils/filters/common.js'
export default {
  props: {
    creditCode: {
      type: String,
      default: '',
    },
  },
  components: {},
  filters: { dictFilter },
  data() {
    return {
      showRecord: true,
      loading: false,
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      queryParams: {
        tradeTime: ['', ''],
      },
    }
  },
  computed: {
    tradeTypeList() {
      return this.$staticData.money_record_type
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
      this.loading = true
      const {
        tradeType,
        tradeTime: [createTimeStart, createTimeEnd],
      } = this.queryParams
      const query = {
        creditCode: this.creditCode,
        tradeType,
        createTimeStart,
        createTimeEnd,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        ownId: this.ownId,
      }
      listMoneyRecordPage(query).then(res => {
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
      this.getList()
    },
    // pageSize 变化回调
    handleSizeChange(size) {
      this.pageSize = size
      this.getList()
    },
    // pageNum 变化回调
    handleCurrentChange(current) {
      this.pageNum = current
      this.getList()
    },
    cancel() {
      this.$emit('cancel')
    },
  },
}
</script>

<style scoped lang="scss">
.record-container {
  padding: 10px;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .table-container {
    height: 600px;
    display: flex;
    flex-direction: column;
  }
}
</style>
