<template>
  <div class="usable-container">
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
          <el-form-item :label="`开立方`" prop="openerName ">
            <el-input
              v-model.trim="queryParams.openerName"
              :placeholder="`请输入开立方`"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="6">
          <el-form-item :label="`开立方`" prop="openerCode">
            <el-select v-model.trim="queryParams.openerCode" :placeholder="`请选择开立方`" size="small">
              <el-option
                v-for="status in openCubeList"
                :key="status.dictValue"
                :label="status.dictLabel"
                :value="status.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
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
          <el-form-item :label="`接收日期`" prop="receiveTime">
            <el-date-picker
              :clearable="false"
              v-model.trim="queryParams.receiveTime"
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
          <el-button
            type="primary"
            plain
            icon="el-icon-add"
            size="mini"
            @click="pay"
            :disabled="single"
          >
            支付
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="financing"
          >
            融资
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" plain size="mini" @click="exportFun">导出</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            :disabled="single"
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
        v-loading="loading"
        :data="tableData"
        height="100%"
        ref="multipleTable"
        show-summary
        :summary-method="getSummaries"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="80" align="center" />
        <el-table-column label="民商信编号" align="center" prop="creditCode" />
        <el-table-column label="开立方" align="center">
          <template slot-scope="scope">
            <span>
              {{ scope.row.openerName | dictFilter(openCubeList) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="可用余额(元)" align="center" prop="availableLimit" />
        <el-table-column label="冻结金额(元)" align="center" prop="frozenLimit" />
        <el-table-column label="承诺付款日" align="center" prop="payTime" />
        <el-table-column label="融资付息模式" align="center">
          <template slot-scope="scope">
            <span>
              {{ scope.row.interestType | dictFilter(financeModeList) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="接收日期" align="center" prop="receiveDate" />
        <el-table-column label="开立备注" align="center" prop="addition" />
        <el-table-column label="余额变动记录" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="viewDetail(scope.row)">详情</el-button>
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
            <el-form-item :label="`支付方`" prop="firstOwnName" class="is-required">
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
              <el-input disabled v-model.trim="payInformation.ownName">
                <el-button @click="getCompany" slot="append" icon="el-icon-search"></el-button>
              </el-input>
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
            <el-form-item :label="`支付金额(元)`" prop="creditLimit" class="is-required">
              <el-input
                v-model.trim="payInformation.creditLimit"
                @input="handleAmountChange"
                @blur="amountCheck"
              ></el-input>
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
              <el-input type="textarea" v-model.trim="payInformation.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 审核确认 -->
      <div slot="footer" class="dialog-footer text-center">
        <el-button type="primary" @click="confirmPay">确认</el-button>
        <el-button type="warning" @click="cancelPay">取消</el-button>
      </div>
    </el-dialog>
    <!-- 接收方弹框 -->
    <Receiver v-if="companyShow" @sure="getCompanyInfo" @cancel="companyCancel"></Receiver>

    <financingApplication ref="financingApplication" :sonData="sonData"></financingApplication>
    <!-- 余额变动详情列表弹框 -->
    <amount-change-record
      :creditCode="currentCreditCode"
      v-if="showRecord"
      @cancel="showRecord = false"
    ></amount-change-record>
  </div>
</template>

<script>
import {
  listBalanceRecordPage,
  transferMsx,
  exportUsableList,
} from '@/api/civil-commercial-credit/revenueExpenditureApi'
import { dictFilter } from '@/utils/filters/common.js'
import { isFinacingApi } from '@/api/civil-commercial-credit/financing'
import { utils } from '@/utils/utils.js'
import Receiver from '@/views/components/receiver.vue'
import financingApplication from '../financingApplication.vue'

import AmountChangeRecord from './amountChangeRecord.vue'
import { downloadWord } from '@/utils/ruoyi'

export default {
  props: {},
  components: { Receiver, financingApplication, AmountChangeRecord },
  filters: { dictFilter },
  data() {
    const amountValidator = (rules, value, callback) => {
      // /^\d+(\.\d{1,2})?(?!\.)$/
      const reg = /^([1-9][0-9]*)+(.[0-9]{1,2})?$/
      if (!value) {
        return callback('请输入支付金额！')
      }
      if (!reg.test(value)) {
        return callback('最多输入两位小数！')
      }
      callback()
    }
    const acceptValidator = (rules, value, callback) => {
      if (!this.payInformation.ownName) {
        return callback('请选择接收方！')
      }
      callback()
    }
    const acceptCertNoValidator = (rules, value, callback) => {
      if (!this.payInformation.ownCertNo) {
        return callback('请选择接收方！')
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
      committedPaymentDate: [],
      dateReceived: [], // 接收日期
      queryParams: {
        // 民商信编号
        creditCode: '',
        // 开立方
        openerCode: '',
        // 承诺付款日
        payTime: ['', ''],
        // 接收日期
        receiveTime: ['', ''],
        type: '1',
      },
      // 支付弹窗信息
      showDialog: false,
      payInformation: {},
      payInformationRules: {
        creditLimit: [{ required: true, validator: amountValidator, trigger: 'change' }],
        ownName: [{ required: true, validator: acceptValidator, trigger: 'change' }],
        ownCertNo: [{ required: true, validator: acceptCertNoValidator, trigger: 'change' }],
        amountInWords: [{ required: true, message: '请填写金额', trigger: 'change' }],
        remark: [{ required: true, message: '请填写附言', trigger: 'change' }],
      },
      // 展示接收方列表
      companyShow: false,
      financingShow: '', // 融资
      // 传到子组件
      sonData: {},
      // 展示余额变动列表
      showRecord: false,
      currentCreditCode: '',
      canSubmit: true,
    }
  },
  created() {
    this.getList()
  },
  computed: {
    financeModeList() {
      return this.$store.state.msx.financeModeList
    },
    statusList() {
      return this.$store.state.msx.statusList
    },
    single() {
      return this.selectedData.length !== 1
    },
    payerList() {
      return []
    },
    openCubeList() {
      return this.$staticData.core_enterprise
    },
    ownId() {
      return this.$store.state.enterprise.enterpriseId
    },
  },

  methods: {
    getList() {
      this.loading = true
      const {
        payTime: [payDateStart, payDateEnd],
        receiveTime: [receiveDateStart, receiveDateEnd],
        creditCode,
        openerCode,
        type,
        openerName,
      } = this.queryParams
      const query = {
        creditCode,
        openerCode,
        type,
        openerName,
        payDateStart,
        payDateEnd,
        receiveDateStart,
        receiveDateEnd,
        ownId: this.ownId,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
      }
      listBalanceRecordPage(query).then(res => {
        this.tableData = res.data.rows
        this.total = res.data.total
        this.loading = false
      })
    },
    resetQuery() {
      this.$refs.queryForm.resetFields()
      this.getList()
    },
    handleQuery() {
      this.pageNum = 1
      this.pageSize = 10
      this.getList()
    },
    confirmPay() {
      this.$refs.payInformation.validate(val => {
        if (val) {
          if (this.canSubmit) {
            transferMsx({ ...this.payInformation }).then(res => {
              res.success && this.msgSuccess('操作成功！')
              this.getList()
              this.cancelPay()
            })
          } else {
            this.msgError('超过可用金额，请重新输入！')
          }
        }
      })
    },
    cancelPay() {
      this.showDialog = false
      this.payInformation = {}
    },
    getCompanyInfo(companyInfo) {
      this.payInformation.ownName = companyInfo.enterpriseName
      this.payInformation.ownId = companyInfo.seqNo
      this.payInformation.ownCertNo = companyInfo.enterpriseCertNo
      this.companyCancel()
    },
    companyCancel() {
      this.companyShow = false
    },
    handleAmountChange(val) {
      this.payInformation.amountInWords = utils.digitUppercase(val)
      this.$set(this.payInformation, 'remark', val)
    },
    amountCheck() {
      const amount = Number(this.payInformation.creditLimit)
      const availableAmount = Number(this.selectedData[0].availableLimit)
      if (amount > availableAmount) {
        this.msgError('超过可用金额，请重新输入！')
        this.canSubmit = false
      } else {
        this.canSubmit = true
      }
    },
    viewDetail({ creditCode }) {
      this.showRecord = true
      this.currentCreditCode = creditCode
    },
    // 更新选中表单内容
    handleSelectionChange(select) {
      this.selectedData = select
      const { creditCode, ownId, seqNo, openerName } = this.selectedData[0]
      this.sonData = { creditCode, ownId, seqNo, openerName }
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
    //  打开支付弹窗
    pay() {
      this.$refs.payInformation && this.$refs.payInformation.clearValidate()
      const {
        //民商信编号
        creditCode: rootCreditCode,
        // 支付方 / 持有者
        ownName: firstOwnName,
        ownId: firstOwnId,
        seqNo,
      } = this.selectedData[0] || {}
      this.payInformation = { rootCreditCode, firstOwnName, firstOwnId, seqNo }
      this.showDialog = true
    },
    getCompany() {
      this.companyShow = true
    },
    // 融资
    financing() {
      let params = {
        creditNo: this.selectedData[0].creditCode,
        ownId: this.selectedData[0].ownId,
      }
      isFinacingApi(params).then(res => {
        if (res.data.isFund == 1) {
          this.$refs.financingApplication.open = true
        }
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
    // 导出
    exportFun() {
      const {
        payTime: [payDateStart, payDateEnd],
        receiveTime: [receiveDateStart, receiveDateEnd],
        creditCode,
        openerCode,
        type,
        openerName,
      } = this.queryParams
      const query = {
        creditCode,
        openerCode,
        type,
        openerName,
        payDateStart,
        payDateEnd,
        receiveDateStart,
        receiveDateEnd,
        ownId: this.ownId,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
      }
      exportUsableList(query).then(res => {
        downloadWord(res, '可用列表.xlsx')
      })
    },
    // 获得合计行
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      const sumColumns = ['availableLimit', 'frozenLimit']
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }

        const values = data.map(item => Number(item[column.property]))
        if (sumColumns.indexOf(column.property) !== -1 && !values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] += ' 元'
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
  },
}
</script>

<style scoped lang="scss">
.usable-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
