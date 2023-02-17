<template>
  <div class="paying-container">
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
          <el-form-item label="状态" prop="status">
            <el-select v-model.trim="queryParams.status" :placeholder="`请选择状态`" size="small">
              <el-option label="待审批" value="1"></el-option>
              <el-option label="待签收" value="3"></el-option>
            </el-select>
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
          <el-button
            type="primary"
            plain
            icon="el-icon-add"
            size="mini"
            @click="sureAuditor"
            :disabled="single"
          >
            审核人确认
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
        ref="multipleTable"
        show-summary
        :summary-method="getSummaries"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
      >
        <el-table-column type="selection" width="80" align="center" />
        <el-table-column label="民商信编号" align="center" prop="rootCreditCode" />
        <el-table-column label="支付方" align="center" prop="firstOwnName"> </el-table-column>
        <el-table-column label="接收方" align="center" prop="ownName"> </el-table-column>
        <el-table-column
          label="民商信余额(元)"
          align="center"
          prop="availableLimit"
        ></el-table-column>
        <el-table-column label="支付金额(元)" align="center" prop="creditLimit" />
        <el-table-column label="承诺付款日" align="center" prop="payTime" />
        <el-table-column label="融资付息模式" align="center">
          <template slot-scope="scope">
            <span>
              {{ scope.row.interestType | dictFilter(financeModeList) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="经办人" align="center" prop="createUser" />
        <el-table-column label="经办日期" align="center" prop="createTime" />
        <el-table-column label="支付备注" align="center" prop="remark" />
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span>
              {{ scope.row.status | dictFilter(statusList) }}
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
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :total="total"
    >
    </el-pagination>

    <!-- 审核人确认弹框 -->
    <el-dialog
      :modal-append-to-body="false"
      title="支付"
      :visible.sync="showDialog"
      width="850px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form
        ref="payInformation"
        :model="payInformation"
        :rules="payInformationRules"
        label-width="140px"
      >
        <div>支付方信息</div>
        <el-row class="p-t-10">
          <el-col :span="12">
            <el-form-item :label="`支付方`" prop="firstOwnId" class="is-required">
              <el-input disabled :value="payInformation.firstOwnName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`民商信编号`" prop="rootCreditCode" class="is-required">
              <el-input disabled v-model.trim="payInformation.rootCreditCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div>接收方信息</div>
        <el-row class="p-t-10">
          <el-col :span="12">
            <el-form-item :label="`接收方`" prop="ownName" class="is-required">
              <el-input disabled v-model.trim="payInformation.ownName"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`接收方税务登记号`" prop="ownCertNo" class="is-required">
              <el-input disabled v-model.trim="payInformation.ownCertNo"></el-input>
            </el-form-item> </el-col
        ></el-row>
        <div>交易信息</div>
        <el-row class="p-t-10">
          <el-col :span="12">
            <el-form-item :label="`支付额度(元)`" prop="creditLimit" class="is-required">
              <el-input disabled v-model.trim="payInformation.creditLimit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`大写金额`" prop="amountInWords" class="is-required">
              <el-input disabled v-model.trim="payInformation.amountInWords"> </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="p-t-10">
          <el-col :span="12">
            <el-form-item :label="`附言`" prop="remark" class="is-required">
              <el-input disabled type="textarea" v-model.trim="payInformation.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 审核确认 -->
      <div slot="footer" class="dialog-footer text-center">
        <el-button type="primary" @click="handleAgree">同意|审核Ukey</el-button>
        <el-button type="warning" @click="handleDisagree">不同意|审核Ukey</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :modal-append-to-body="false"
      title="验证USBKey用户口令"
      :visible.sync="confirmDialog"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        :model="confirmForm"
        ref="confirmForm"
        :rules="confirmFormRules"
        inline
        label-width="100px"
      >
        <el-form-item label="用户口令" prop="ukeyCode">
          <el-input
            v-model.trim="confirmForm.ukeyCode"
            placeholder="请输入用户口令"
            style="width: 240px;"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item label="附言" v-if="!agree" prop="remark">
          <el-input
            style="width: 240px;"
            type="textarea"
            v-model.trim="confirmForm.remark"
          ></el-input>
        </el-form-item>
      </el-form>
      <template slot="footer" style="text-align:center">
        <el-button size="small" type="primary" @click="confirm">确认</el-button>
        <el-button size="small" type="warning" @click="cancel">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  listPayingRecordPage,
  transferAudit,
} from '@/api/civil-commercial-credit/revenueExpenditureApi'
import { dictFilter } from '@/utils/filters/common.js'
import { utils } from '@/utils/utils'
export default {
  props: {},
  filters: { dictFilter },
  data() {
    const ukeyValidator = (rules, value, callback) => {
      if (!value) {
        callback('请输入ukey口令！')
      }
      callback()
    }
    const remarkValidator = (rules, value, callback) => {
      if (!value && !this.agree) {
        callback('请输入附言！')
      }
      callback()
    }
    return {
      loading: false,
      pageNum: 1,
      pageSize: 10,
      tableData: [],
      total: 0,
      selectedData: [],
      queryParams: {
        // 民商信编号
        creditCode: '',
        // 开立方
        openerCode: '',
        // 支付方
        firstOwnId: '',
        // 承诺付款日
        payTime: [],
        // 状态
        status: '',
      },
      showDialog: false,
      payInformation: {},
      payInformationRules: {
        remark: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请填写附言',
          },
        ],
      },
      confirmDialog: false,
      confirmForm: {
        ukeyCode: '',
        remark: '',
      },
      confirmFormRules: {
        ukeyCode: [{ required: true, validator: ukeyValidator, trigger: 'change' }],
        remark: [{ required: true, validator: remarkValidator, trigger: 'change' }],
      },
      agree: false,
    }
  },
  computed: {
    financeModeList() {
      return this.$store.state.msx.financeModeList
    },
    statusList() {
      return this.$staticData.open_credit_status
    },
    single() {
      return this.selectedData.length !== 1
    },
    openCubeList() {
      return this.$staticData.core_enterprise
    },
    ownId() {
      return this.$store.state.enterprise.enterpriseId
    },
  },
  components: {},
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      const {
        payTime: [payTimeStart, payTimeEnd],
        firstOwnName,
        creditCode,
        openerCode,
        status,
      } = this.queryParams
      const query = {
        creditCode,
        openerCode,
        status,
        firstOwnName,
        payTimeStart,
        payTimeEnd,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        ownId: this.ownId,
      }
      listPayingRecordPage(query).then(res => {
        this.tableData = res.data.rows
        this.total = res.data.total
        this.loading = false
      })
    },
    resetQuery() {
      this.$refs.queryForm.resetFields()
      this.handleQuery()
    },
    // 审核人确认
    sureAuditor() {
      const {
        firstOwnName,
        ownName,
        rootCreditCode,
        ownCertNo,
        creditLimit,
        status,
        remark,
      } = this.selectedData[0]
      const amountInWords = utils.digitUppercase(creditLimit)
      this.payInformation = {
        // 支付方
        firstOwnName,
        // 接收方 / 持有方
        ownName,
        // 接收方税务号
        ownCertNo,
        // 民商信编号
        rootCreditCode,
        // 支付金额
        creditLimit,
        // 大写金额
        amountInWords,
        remark,
      }
      if (status === 1) {
        this.showDialog = true
      } else {
        this.msgError('只能审核待审核的数据！')
      }
    },
    handleAgree() {
      this.$refs.payInformation.validate(val => {
        if (val) {
          this.agree = true
          this.confirmDialog = true
          this.$refs.confirmForm && this.$refs.confirmForm.clearValidate()
        }
      })
    },
    handleDisagree() {
      this.$refs.payInformation.validate(val => {
        if (val) {
          this.agree = false
          this.confirmDialog = true
          this.$refs.confirmForm && this.$refs.confirmForm.clearValidate()
        }
      })
    },
    confirm() {
      // 调用同意/不同意审核接口
      const { seqNo } = this.selectedData[0]
      // 同意传 3   不同意  传2
      const status = this.agree ? '3' : '2'
      const { remark } = this.confirmForm
      const query = { remark, seqNo, status }
      this.$refs.confirmForm.validate(val => {
        if (val) {
          transferAudit(query).then(res => {
            res.success && this.msgSuccess('操作成功！')
            this.showDialog = false
            this.confirmForm = {}
            this.confirmDialog = false
            this.getList()
          })
        }
      })
    },
    cancel() {
      this.confirmForm = {}
      this.confirmDialog = false
    },
    handleQuery() {
      this.pageNum = 1
      this.pageSize = 10
      this.getList()
    },
    // 获得合计行
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      const sumColumns = ['creditLimit', 'limit']
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => {
          return {
            value: item[column.property],
            code: item.rootCreditCode,
          }
        })
        if (sumColumns.indexOf(column.property) !== -1) {
          let total = 0
          if (column.property === 'limit') {
            // 对象数组去重
            let newArr = values.filter((item, index) => {
              return values.findIndex(item1 => item1.code === item.code) === index
            })
            for (let i = 0; i < newArr.length; i++) {
              total += Number(newArr[i].value)
            }
          } else {
            for (let i = 0; i < values.length; i++) {
              total += Number(values[i].value)
            }
          }
          sums[index] = total + '元'
        } else {
          sums[index] = ''
        }
      })
      for (let i = 0; i < sums.length; i++) {
        if (sums[i] !== '合计' && sums[i] !== '') {
          sums[i] = parseFloat(sums[i]).toFixed(2) + '元'
        }
      }
      this.$nextTick(() => {
        this.$refs.multipleTable.doLayout()
      })
      return sums
    },
    // 更新选中表单内容
    handleSelectionChange(select) {
      this.selectedData = select
    },
    //点击行触发，选中或不选中复选框
    handleRowClick(row, column, event) {
      this.$refs.multipleTable.toggleRowSelection(row)
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
  },
}
</script>

<style lang="scss">
.paying-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  .el-dialog__footer {
    text-align: center !important;
  }
}
</style>
