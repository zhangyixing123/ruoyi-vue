<template>
  <div class="applying">
    <el-form
      class="el-form-noValid flex-shrink-0"
      :model="queryParams"
      ref="queryForm"
      label-width="100px"
    >
      <el-row>
        <el-col :span="6">
          <el-form-item :label="`民商信编号`" prop="commercialCreditNo">
            <el-input
              v-model.trim="queryParams.commercialCreditNo"
              :placeholder="`请输入民商信编号`"
              clearable
              size="small"
            />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item :label="`申请日期`" prop="applyDate">
            <el-date-picker
              :clearable="false"
              v-model.trim="queryParams.applyDate"
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
          <el-form-item :label="`开立方`" prop="openerName">
            <el-input
              v-model.trim="queryParams.openerName"
              :placeholder="`请输入开立方`"
              clearable
              size="small"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="`承诺付款日`" prop="payDate">
            <el-date-picker
              :clearable="false"
              v-model.trim="queryParams.payDate"
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
          <el-form-item :label="`融资状态`" prop="fnStatus">
            <el-select
              v-model.trim="queryParams.fnStatus"
              :placeholder="`请选择融资状态`"
              size="small"
            >
              <el-option
                v-for="status in fnStatusList"
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
            icon="el-icon-edit"
            size="mini"
            :disabled="!single"
            @click="audit"
          >
            审核
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-edit"
            size="mini"
            :disabled="!single"
            @click="withdrawal"
          >
            发起提款
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div class="flex1 over-hidden">
      <el-table
        height="100%"
        v-loading="loading"
        :data="tableData"
        ref="data1"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="询价编号" align="center" prop="inquiryNo" />
        <el-table-column label="融资编号" align="center" prop="fnNo" />
        <el-table-column label="民商信编号" align="center" prop="commercialCreditNo" />
        <el-table-column label="融资金额(元)" align="center" prop="fnAmt" />
        <el-table-column label="申请时间" align="center" prop="fnApplyDate" />
        <el-table-column label="资金方" align="center" prop="fundSide" />
        <el-table-column label="预计融资利率" align="center" prop="financingFeeRate">
          <template slot-scope="scope">
            <span> {{ formatRate(scope.row.financingFeeRate) }} </span>
          </template>
        </el-table-column>
        <el-table-column label="手续费率" align="center">
          <template slot-scope="scope">
            <span> {{ formatRate(scope.row.handlingFeeRate) }} </span>
          </template>
        </el-table-column>
        <el-table-column label="手续费金额" align="center" prop="handlingFee" />
        <el-table-column label="融资付息模式" align="center">
          <template slot-scope="scope">
            <span>
              {{ scope.row.fnInterestModel | dictFilter(financeModeList) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="融资状态" align="center" prop="fnStatus">
          <template slot-scope="scope">
            <span>
              {{ scope.row.fnStatus | dictFilter(fnStatusList) }}
            </span>
          </template>
        </el-table-column>
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
    <el-dialog
      :modal-append-to-body="false"
      title="审核"
      :visible.sync="showAuditDialog"
      width="600px"
      append-to-body
      :close-on-click-modal="false"
      @close="cancel"
    >
      <el-form ref="auditForm" :model="auditForm" :rules="auditFormRules" label-width="120px">
        <el-row class="p-t-10">
          <el-col>
            <el-form-item :label="`审批结果`" prop="verifyType" class="is-required">
              <el-radio-group v-model.trim="auditForm.verifyType">
                <el-radio :label="1">通过</el-radio>
                <el-radio :label="0">不通过</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item :label="`审批备注`" prop="supplierAuditOpinion" class="is-required">
              <el-input type="textarea" v-model.trim="auditForm.supplierAuditOpinion"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer text-center">
        <el-button type="primary" @click="submitForm">确定</el-button>
        <el-button type="warning" @click="cancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listFnApplPageType,
  startWithdraw,
  financingCheck,
} from '@/api/civil-commercial-credit/financingApplicationRecord'
import { dictFilter } from '@/utils/filters/common.js'

export default {
  props: {},
  components: {},
  filters: { dictFilter },
  data() {
    return {
      loading: false,
      queryParams: {
        // 开立方
        openerName: '',
        // 民商信编号
        commercialCreditNo: '',
        // 申请日期
        applyDate: ['', ''],
        // 承诺付款日
        payDate: ['', ''],
        // 融资状态
        fnStatus: '',
      },
      pageNum: 1,
      pageSize: 10,
      tableData: [],
      total: 0,
      selectedData: [],
      showAuditDialog: false,
      auditForm: {},
      auditFormRules: {
        verifyType: [{ required: true, trigger: 'change', message: '请选择审批结果' }],
        supplierAuditOpinion: [
          {
            required: true,
            trigger: 'change',
            message: '请输入审批备注',
          },
        ],
      },
      inquiryNo: '',
    }
  },
  computed: {
    single() {
      return this.selectedData.length === 1
    },
    financeModeList() {
      return this.$store.state.msx.financeModeList
    },
    openCubeList() {
      return this.$staticData.core_enterprise
    },
    fnStatusList() {
      return this.$staticData.civil_commercial_letter_status
    },
    ownId() {
      return this.$store.state.enterprise.enterpriseId
    },
  },
  created() {
    if (this.$route.query.fnNo) {
      this.fnNo = this.$route.query.fnNo
    }
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      const {
        commercialCreditNo,
        fnStatus,
        openerName,
        createUser,
        payDate: [payDateStart, payDateEnd],
        applyDate: [fnApplyDateStart, fnApplyDateEnd],
      } = this.queryParams
      const query = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        commercialCreditNo,
        fnStatus,
        openerName,
        createUser,
        fnApplyDateStart,
        fnApplyDateEnd,
        payDateStart,
        payDateEnd,
        fnNo: this.fnNo,
        ownId: this.ownId,
      }
      listFnApplPageType({ query, queryType: '1' }).then(res => {
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
      this.handleQuery()
    },
    // 审核
    audit() {
      const { inquiryNo, fnStatus } = this.selectedData[0]
      if (fnStatus === '02') {
        this.inquiryNo = inquiryNo
        this.showAuditDialog = true
      } else {
        this.msgError('只有待审批的记录才可进行审批！')
      }
    },
    // 发起提款
    withdrawal() {
      const { fnStatus } = this.selectedData[0]
      if (fnStatus === '04') {
        this.$confirm('是否确认发起提款?', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            const { inquiryNo } = this.selectedData[0]
            const query = {
              inquiryNo,
            }
            startWithdraw(query).then(res => {
              res.success &&
                this.$message({
                  type: 'success',
                  message: '发起提款成功！',
                })
            })
          })
          .catch(() => {})
      } else {
        this.msgError('只有审批通过的记录才可进行发起提款操作！')
      }
    },
    submitForm() {
      this.$refs.auditForm.validate((val, obj) => {
        if (val) {
          const { verifyType, supplierAuditOpinion } = this.auditForm
          const query = {
            verifyType,
            supplierAuditOpinion,
            // 	询价编号
            inquiryNo: this.inquiryNo,
          }
          financingCheck(query).then(res => {
            res.success && this.msgSuccess('操作成功！')
            this.showAuditDialog = false
            this.getList()
          })
        }
      })
    },
    cancel() {
      this.auditForm = {}
      this.$refs.auditForm.resetFields()
      this.showAuditDialog = false
    },
    handleSelectionChange(selection) {
      this.selectedData = selection
    },
    handleSizeOrSizePageChange(page) {
      this.pageSize = page
      this.getList()
    },
    handleSizeOrCurrentChange(page) {
      this.pageNum = page
      this.getList()
    },
    formatRate(rate) {
      const val = Number(rate) * 100
      return `${val.toFixed(2)}%`
    },
  },
}
</script>

<style scoped lang="scss">
.applying {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
