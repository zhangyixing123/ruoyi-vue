<template>
  <div class="page-name app-container">
    <el-tabs v-model.trim="activeName">
      <el-tab-pane label="询价记录" name="1">
        <enquiryRecord v-if="activeName === '1'" />
      </el-tab-pane>
      <el-tab-pane label="申请中" name="2">
        <applying v-if="activeName === '2'" />
      </el-tab-pane>
      <el-tab-pane label="融资进度" name="3">
        <financeProgress v-if="activeName === '3'"></financeProgress>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { dictFilter } from '@/utils/filters/common.js'
import { utils } from '@/utils/utils.js'
import enquiryRecord from './components/enquiryRecord.vue'
import applying from './components/applying.vue'
import financeProgress from './components/financeProgress.vue'

export default {
  name: 'dataList',
  filters: { dictFilter },
  components: { enquiryRecord, applying, financeProgress },
  data() {
    return {
      loading: false,
      financingStatusList: [
        {
          dictValue: '1',
          dictLabel: '待报价',
        },
        {
          dictValue: '2',
          dictLabel: '已报价',
        },
        {
          dictValue: '3',
          dictLabel: '已关闭',
        },
        {
          dictValue: '4',
          dictLabel: '已取消',
        },
        {
          dictValue: '5',
          dictLabel: '已过期',
        },
      ],
      openCubeList: [
        {
          dictValue: '1',
          dictLabel: '万科',
        },
        {
          dictValue: '2',
          dictLabel: '万达',
        },
      ],
      payerList: [
        {
          dictValue: '1',
          dictLabel: '万科',
        },
        {
          dictValue: '2',
          dictLabel: '万达',
        },
      ],
      financingInterestPaymentModeList: [
        {
          dictValue: '1',
          dictLabel: '融资人付息',
        },
        {
          dictValue: '2',
          dictLabel: '买房付息',
        },
      ],
      tableData: [
        {
          lendingTime: '2021-10-20', //放款时间
          fundSide: '资金方', // 资金方
          applicationTime: '2021-10-10', // 申请时间
          financingNumber: '123', //融资编号
          msxId: 'MSX100000232323', //民商信编号
          openCube: '万科', //开立方
          payer: '万科', //支付方
          applicationDate: '2021-02-21', //申请日期
          inquiryNo: '1', // 询价编号
          msxAmount: '10000', // 民商信金额（元）
          financingAmount: '10000', // 融资金额(元)
          inquiryDate: '2021-10-10', // 询价日期
          quotationBank: '10000', // 报价银行
          estimatedFinancingInterestRate: '0.35', // 预计融资利率
          handlingRate: '0.35', // 手续费率
          handlingFeeAmount: '600', // 手续费金额
          financingStatus: '1', //融资状态
          availableBalance: '100000', //可用余额(元)
          frozenAmount: '60000.00', //冻结金额(元)
          netAvailable: '80000.00', //可用净额(元)
          committedPaymentDate: '2022-03-31', //承诺付款日
          financingInterestPaymentMode: '融资人付息', //融资付息模式
          dateReceived: '2021-11-01', //接收日期
          openingRemarks: 'XXXX项目付款', //开立备注
          receiver: '万科', //接收方
          yunxinBalance: '10000', //云信余额(元)
          paymentAmount: '2000', //支付金额(元)
          handler: '管理员', //经办人
          handlingDate: '2021-11-01', //经办日期
          paymentRemarks: 'XXXX项目付款', //支付备注
          state: '完成', //状态
          auditor: '', //审核人
          paymentDate: '2021-11-01', //支付日期
          handlingTime: '2021-11-01', //经办时间
          auditTime: '2021-11-01', //审核时间
          failureReason: '未知', //失败原因
          amountMoney: '10000', //金额(元)
          actualPaymentDate: '2021-11-02', //实际付款日
          repaymentStatus: '2021-11-01', //还款状态
          originalAmount: '10000', //原始金额(元)
        },
        {
          lendingTime: '2021-10-20', //放款时间
          fundSide: '资金方', // 资金方
          applicationTime: '2021-10-10', // 申请时间
          financingNumber: '123', //融资编号
          msxId: 'MSX100000232324', //民商信编号
          openCube: '万科', //开立方
          payer: '万科', //支付方
          applicationDate: '2021-02-21', //申请日期
          inquiryNo: '2', // 询价编号
          msxAmount: '10000', // 民商信金额（元）
          financingAmount: '10000', // 融资金额(元)
          inquiryDate: '2021-10-10', // 询价日期
          quotationBank: '10000', // 报价银行
          estimatedFinancingInterestRate: '0.35', // 预计融资利率
          handlingRate: '0.35', // 手续费率
          handlingFeeAmount: '600', // 手续费金额
          financingStatus: '1', //融资状态
          availableBalance: '100000', //可用余额(元)
          frozenAmount: '60000.00', //冻结金额(元)
          netAvailable: '80000.00', //可用净额(元)
          committedPaymentDate: '2022-03-31', //承诺付款日
          financingInterestPaymentMode: '融资人付息', //融资付息模式
          dateReceived: '2021-11-01', //接收日期
          openingRemarks: '万达项目付款', //开立备注
          receiver: '万科', //接收方
          yunxinBalance: '10000', //云信余额(元)
          paymentAmount: '2000', //支付金额(元)
          handler: '管理员', //经办人
          handlingDate: '2021-11-01', //经办日期
          paymentRemarks: 'XXXX项目付款', //支付备注
          state: '完成', //状态
          auditor: '', //审核人
          paymentDate: '2021-11-01', //支付日期
          handlingTime: '2021-11-01', //经办时间
          auditTime: '2021-11-01', //审核时间
          failureReason: '未知', //失败原因
          amountMoney: '10000', //金额(元)
          actualPaymentDate: '2021-11-02', //实际付款日
          repaymentStatus: '2021-11-01', //还款状态
          originalAmount: '10000', //原始金额(元)
        },
        {
          lendingTime: '2021-10-21', //放款时间
          fundSide: '资金方', // 资金方
          applicationTime: '2021-10-11', // 申请时间
          financingNumber: '456', //融资编号
          msxId: 'MSX100000232325', //民商信编号
          openCube: '万科', //开立方
          payer: '万科', //支付方
          applicationDate: '2021-02-21', //申请日期
          inquiryNo: '3', // 询价编号
          msxAmount: '20000', // 民商信金额（元）
          financingAmount: '10000', // 融资金额(元)
          inquiryDate: '2021-10-10', // 询价日期
          quotationBank: '10000', // 报价银行
          estimatedFinancingInterestRate: '0.35', // 预计融资利率
          handlingRate: '0.35', // 手续费率
          handlingFeeAmount: '600', // 手续费金额
          financingStatus: '1', //融资状态
          availableBalance: '100000', //可用余额(元)
          frozenAmount: '60000.00', //冻结金额(元)
          netAvailable: '80000.00', //可用净额(元)
          committedPaymentDate: '2022-03-31', //承诺付款日
          financingInterestPaymentMode: '融资人付息', //融资付息模式
          dateReceived: '2021-11-01', //接收日期
          openingRemarks: 'XXXX项目付款', //开立备注
          receiver: '万科', //接收方
          yunxinBalance: '10000', //云信余额(元)
          paymentAmount: '2000', //支付金额(元)
          handler: '管理员', //经办人
          handlingDate: '2021-11-01', //经办日期
          paymentRemarks: 'XXXX项目付款', //支付备注
          state: '完成', //状态
          auditor: '', //审核人
          paymentDate: '2021-11-01', //支付日期
          handlingTime: '2021-11-01', //经办时间
          auditTime: '2021-11-01', //审核时间
          failureReason: '未知', //失败原因
          amountMoney: '10000', //金额(元)
          actualPaymentDate: '2021-11-02', //实际付款日
          repaymentStatus: '2021-11-01', //还款状态
          originalAmount: '10000', //原始金额(元)
        },
        {
          lendingTime: '2021-10-20', //放款时间
          fundSide: '资金方', // 资金方
          applicationTime: '2021-10-10', // 申请时间
          financingNumber: '123', //融资编号
          msxId: 'MSX100000232326', //民商信编号
          openCube: '万科', //开立方
          payer: '万科', //支付方
          applicationDate: '2021-02-21', //申请日期
          inquiryNo: '4', // 询价编号
          msxAmount: '10000', // 民商信金额（元）
          financingAmount: '10000', // 融资金额(元)
          inquiryDate: '2021-10-10', // 询价日期
          quotationBank: '10000', // 报价银行
          estimatedFinancingInterestRate: '0.35', // 预计融资利率
          handlingRate: '0.35', // 手续费率
          handlingFeeAmount: '600', // 手续费金额
          financingStatus: '1', //融资状态
          availableBalance: '100000', //可用余额(元)
          frozenAmount: '60000.00', //冻结金额(元)
          netAvailable: '80000.00', //可用净额(元)
          committedPaymentDate: '2022-03-31', //承诺付款日
          financingInterestPaymentMode: '融资人付息', //融资付息模式
          dateReceived: '2021-11-01', //接收日期
          openingRemarks: 'XXXX项目付款', //开立备注
          receiver: '万科', //接收方
          yunxinBalance: '10000', //云信余额(元)
          paymentAmount: '2000', //支付金额(元)
          handler: '管理员', //经办人
          handlingDate: '2021-11-01', //经办日期
          paymentRemarks: 'XXXX项目付款', //支付备注
          state: '完成', //状态
          auditor: '', //审核人
          paymentDate: '2021-11-01', //支付日期
          handlingTime: '2021-11-01', //经办时间
          auditTime: '2021-11-01', //审核时间
          failureReason: '未知', //失败原因
          amountMoney: '10000', //金额(元)
          actualPaymentDate: '2021-11-02', //实际付款日
          repaymentStatus: '2021-11-01', //还款状态
          originalAmount: '10000', //原始金额(元)
        },
      ],
      total: 0,
      pageSize: 10,
      pageNum: 1,
      single: '',
      committedPaymentDate: [],
      applicationDate: [],
      queryParams: {
        msxId: '',
        payer: '',
        applicationDate: '',
        openCube: '',
        committedPaymentDate: '',
        financingStatus: '',
      },
      activeName: '1',
      selectionItem: {},
      // 表头
      tableHead: [
        {
          title: '融资进度',
          headName: [
            '询价编号',
            '融资编号',
            '民商信编号',
            '融资金额(元)',
            '申请时间',
            '审核时间',
            '资金方',
            '预计融资利率',
            '手续费率',
            '手续费金额',
            '融资付息模式',
            '放款时间',
            '状态',
            '失败原因',
          ],
          headField: [
            'inquiryNo',
            'financingNumber',
            'msxId',
            'financingAmount',
            'applicationTime',
            'auditTime',
            'fundSide',
            'estimatedFinancingInterestRate',
            'handlingRate',
            'handlingFeeAmount',
            'financingInterestPaymentMode',
            'lendingTime',
            'state',
            'failureReason',
          ],
        },
      ],
      applyQuery: {
        // 民商信编号
        commercialCreditNo: '',
      },
    }
  },
  created() {
    this.$route.query.activeName
      ? (this.activeName = this.$route.query.activeName)
      : (this.activeName = '1')
  },
  methods: {},
}
</script>

<style lang="scss">
/* style 建议使用, scoped 可以用可不用，如果不用 scoped，第一级必须是 本页面的独有的page-name */
/* 必须按规范，不然会对别人的页面造成样式干扰 */
.page-name {
  padding: 10px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.el-tabs {
  height: 100%;
  .el-tabs__content {
    height: calc(100% - 60px);
    .el-tab-pane {
      height: 100%;
    }
  }
}
</style>
