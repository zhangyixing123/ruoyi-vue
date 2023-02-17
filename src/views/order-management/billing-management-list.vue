<template>
  <div class="app-container">
    <div
      v-if="
        !showDetails &&
          !showRenewBills &&
          !showFinance &&
          !showUpload &&
          !showBillTrace &&
          !showAuthoriateProtocol
      "
    >
      <el-form :model="queryParams" ref="queryForm" class="flex-shrink-0" label-width="120px">
        <el-row :gutter="20">
          <!--<el-col :span="6">
             <el-form-item label="采购合同编号" prop="contractCode">
              <el-input
                v-model.trim="queryParams.contractCode"
                placeholder="请输入结算单编号"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </el-col> -->
          <el-col :span="6">
            <el-form-item label="账单统计日期">
              <el-date-picker
                :clearable="false"
                v-model.trim="dateRange"
                size="small"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="融资状态" prop="financingStatus">
              <el-select
                v-model.trim="queryParams.financingStatus"
                placeholder="请选择融资状态"
                clearable
                size="small"
              >
                <el-option
                  v-for="dict in financingStatusList"
                  :key="dict.comCode"
                  :label="dict.comCodeDesc"
                  :value="dict.comCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button
                type="primary"
                v-hasPermi="['supplier:bill:list']"
                icon="el-icon-search"
                size="mini"
                @click="handleQuery"
                >搜索</el-button
              >
              <el-button
                v-hasPermi="['supplier:bill:list']"
                icon="el-icon-refresh"
                size="mini"
                @click="resetQuery"
                >重置</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="m-b-20 flex">
        <el-button type="primary" size="mini" :disabled="selectArr.length == 0" @click="sendFinice"
          >应收账款融资</el-button
        >
        <el-button
          v-if="isShowDataAuthBtn"
          class="m-l-10"
          size="mini"
          type="primary"
          @click="authoriateAccountData"
          >授权账单数据</el-button
        >
        <!-- :disabled="uploadDisable" -->
        <el-button type="primary" size="mini" @click="uploadBillFn">上传凭证</el-button>
        <!-- <el-button type="success" size="mini" @click="renewBill">同步账单</el-button> -->
        <!-- <el-upload
          class="m-l-5"
          :show-file-list="false"
          ref="uploadImage"
          :multiple="false"
          :auto-upload="false"
          :on-change="uploadFile"
          action=""
          v-hasPermi="['supplier:bills:import']"
        >
          <el-button class="m-l-10" size="mini" type="primary">同步账单</el-button>
        </el-upload> -->
        <el-button
          type="primary "
          size="mini"
          class="m-l-10"
          :disabled="single"
          @click="traceList"
          v-hasPermi="['supplier:billsTrace:list']"
          >账单轨迹</el-button
        >
      </div>
      <div class="flex1 over-hidden">
        <el-table :data="tableData" v-loading="loading" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column
            label="供应商名称"
            prop="supplierName"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <!-- <el-table-column label="采购合同编号" prop="contractCode" :show-overflow-tooltip="true">
          </el-table-column> -->
          <el-table-column label="平台名称" prop="vendorName" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            label="账单统计日期"
            prop="billCheckYearmonth"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            label="账单金额(元)"
            prop="billCheckAmount"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            label="结算状态"
            prop="billStatus"
            :show-overflow-tooltip="true"
            :formatter="formatBillStatus"
          >
          </el-table-column>
          <el-table-column label="订单总数量" prop="orderNum" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            label="退货货金额(元)"
            prop="billCancellAmount"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            label="已结算金额(元)"
            prop="settlementTotalAmount"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            label="未结算金额(元)"
            prop="unsettledTotalAmount"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column label="商品SKU数量" prop="skuAmount" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            label="最晚应付款日期"
            prop="billPaymentDate"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            label="融资状态"
            prop="financingStatus"
            :show-overflow-tooltip="true"
            :formatter="formatfinancingStatus"
          >
          </el-table-column>
          <el-table-column label="操作" prop="" width="80px">
            <template slot-scope="scope">
              <span
                class="c-1890ff cur-pointer"
                v-hasPermi="['supplier:bill:detail']"
                @click="seeDetails(scope.row)"
                >详情</span
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="m-t-20">
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
    </div>
    <bill-details
      v-if="showDetails"
      @hideDetails="hideDetails"
      :seqNo="seqNo"
      :billStatusList="billStatusList"
      :orderStatusList="orderStatusList"
    ></bill-details>
    <renew-bill
      v-if="showRenewBills"
      @hideDetails="hideDetails"
      :billStatus="billStatus"
    ></renew-bill>
    <finance-step
      v-if="showFinance"
      @return="hideDetails"
      :selectArr="selectArr"
      :billStatusList="billStatusList"
      :orderStatusList="orderStatusList"
      :active="0"
    >
    </finance-step>
    <!-- <initiate-finance
      v-if="showFinance"
      @hideDetails="hideDetails"
      :selectArr="selectArr"
      :billStatusList="billStatusList"
      :orderStatusList="orderStatusList"
    ></initiate-finance> -->
    <authoriate-protocol
      v-if="showAuthoriateProtocol"
      @hideDetails="hideDetails"
    ></authoriate-protocol>
    <upload-bill v-if="showUpload" @hideDetails="hideDetails" :selected="selectArr"></upload-bill>
    <bill-trace v-if="showBillTrace" @hideDetails="hideDetails" :selectArr="selectArr"></bill-trace>
  </div>
</template>
<script>
import billDetails from './component/bill-details.vue' // 账单详情
import renewBill from './component/renew-bill.vue' // 结果
import authoriateProtocol from './component/authoriate-protocol.vue' // 授权协议页
import uploadBill from './component/upload-bill.vue' // 上传凭证
import billTrace from './component/bill-trace.vue' // 账单列表
import financeStep from '@/views/money-raise-management/components/financing-step.vue'
import { voucherList } from '@/api/order-management/index'

import {
  getBillListApi,
  querySComCodeApi,
  importBillsApi,
  dataAuthResult,
} from '@/api/money-raise-management'
export default {
  // name: 'billing-management-list',
  components: {
    billDetails,
    renewBill,
    authoriateProtocol,
    uploadBill,
    billTrace,
    financeStep,
  },
  data() {
    return {
      queryParams: {
        pageSize: 10,
        pageNum: 1,

        contractCode: undefined,
        financingStatus: undefined,
        billCreateTime: undefined,
        billEndTime: undefined,
      },
      pageSize: 10,
      pageNum: 1,
      total: 4,
      companyNameList: [], // 核心企业
      dateRange: [],
      tableData: [],
      loading: false,
      billStatusList: [], // 结算状态
      financingStatusList: [], // 融资状态
      showDetails: false, // 显示详情
      showRenewBills: false, // 同步账单
      showFinance: false, // 发起融资
      showAuthoriateProtocol: false, // 授权协议页
      showUpload: false, // 上传凭证
      showBillTrace: false, // 账单轨迹
      isShowDataAuthBtn: false, // 授权账单数据按钮
      single: true,
      billStatus: '1', // 结算状态
      orderStatusList: [], // 订单状态
      selectArr: [],
      seqNo: '',
      uploadDisable: true, //上传凭证限制
    }
  },
  created() {
    this.getDictData()
    const {
      query: { billNo },
    } = this.$route
    if (billNo) {
      this.seqNo = billNo
      this.showDetails = true
    }

    this.checkDataAuthResult()
  },
  computed: {},
  methods: {
    // 查询字典
    getDictData() {
      // 结算状态
      querySComCodeApi('BILL_STATUS').then(res => {
        this.billStatusList = res.data
      })
      // 融资状态
      querySComCodeApi('FINANCING_STATUS').then(res => {
        this.financingStatusList = res.data
      })
      // 订单状态
      // querySComCodeApi('ORDER_STATUS').then((res) => {
      //   this.orderStatusList = res.data
      // })
      this.getList()
    },
    getList() {
      let params = JSON.parse(JSON.stringify(this.queryParams))
      // params.companyCode = this.$store.state.enterprise.enterpriseCertNo
      if (this.dateRange.length > 0) {
        params.billCreateTime = this.dateRange[0]
        params.billEndTime = this.dateRange[1]
      }
      getBillListApi(params).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.rows
          this.total = res.data.total
        }
      })
    },
    //查看是否授权
    checkDataAuthResult() {
      let param = new FormData()
      param.append('supplierName', '')

      dataAuthResult(param).then(res => {
        if (res.code == 200 && ('3' === res.data.status || '4' === res.data.status)) {
          // 数据授权状态,1已授权,2授权处理中,3授权失败,4未授权
          this.isShowDataAuthBtn = true
        } else {
          this.isShowDataAuthBtn = false
        }
      })
    },
    handleQuery() {
      this.queryParams.pageNum = 1
      this.queryParams.pageSize = 10
      this.getDictData()
    },
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 分页
    handleSizeChange(size) {
      this.queryParams.pageSize = size
      this.getDictData()
    },
    handleCurrentChange(cur) {
      this.queryParams.pageNum = cur
      this.getDictData()
    },
    handleSelectionChange(select) {
      this.single = select.length != 1
      this.selectArr = select
      if (select.length > 0) this.billStatus = select[0].billStatus
      if (select.length > 1) {
        this.uploadDisable = true
      } else if (select.length == 1) {
        this.uploadDisable = select[0].financingStatus != 1
      }
    },
    formatBillStatus(row) {
      return this.selectComLabel(this.billStatusList, row.billStatus)
    },
    formatfinancingStatus(row) {
      return this.selectComLabel(this.financingStatusList, row.financingStatus)
    },
    // 详情
    seeDetails(row) {
      this.seqNo = row.seqNo
      this.showDetails = true
    },
    // 隐藏详情
    hideDetails(data) {
      this.checkDataAuthResult()
      if (data) {
        this.getList()
        this.billStatus = data.result
        this.showRenewBills = true
        this.single = false
        this.showFinance = false
        return
      }
      this.single = true
      this.showDetails = false
      this.showRenewBills = false
      this.showFinance = false
      this.showAuthoriateProtocol = false
      this.showUpload = false
      this.showBillTrace = false
      this.selectArr = []
    },
    // 同步账单
    uploadFile(file) {
      let formData = new FormData()
      formData.append('file', file.raw)
      formData.append('companyCode', this.$store.state.enterprise.enterpriseCertNo)
      importBillsApi(formData).then(res => {
        if (res.code === 200) {
          this.getDictData()
        }
      })
    },
    // 发起账款融资
    sendFinice() {
      let requestArr = []
      for (let i = 0; i < this.selectArr.length; i++) {
        if (
          this.selectArr[i].financingStatus == 2 ||
          this.selectArr[i].financingStatus == 3 ||
          this.selectArr[i].comCode == 2 ||
          Number(this.selectArr[i].unsettledTotalAmount) == 0
        ) {
          this.$message({
            type: 'warning',
            message: '您选择的账单中包含不可发起应收账款融资的账单，请重新选择！',
          })
          return
        }
        // 获取文件
        this.selectArr[i].fileData = []
        requestArr.push(
          voucherList({
            attachNo: this.selectArr[i].seqNo,
            pageSize: 100,
            pageNum: 1,
          }).then(res => {
            if (res.code == 200) {
              this.selectArr[i].fileData = res.data.rows
            }
          })
        )
      }
      Promise.all(requestArr).then(() => {
        this.showFinance = true
      })
    },
    // 授权账单数据
    authoriateAccountData() {
      this.showAuthoriateProtocol = true
      // this.showUpload = true
      // this.showDetails = true
    },
    // 上传凭证
    uploadBillFn() {
      this.showUpload = true
    },
    // 账单轨迹
    traceList() {
      this.showBillTrace = true
    },
  },
}
</script>
<style lang="scss" scoped></style>
