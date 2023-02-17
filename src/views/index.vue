<template>
  <div class="app-container home">
    <div class="index-info">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :span="12">
          <h1>欢迎您，{{ enterpriseName }}，今天是{{ currentDate }}</h1>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :span="12">
          <div class="company-info">
            <div class="info-item">
              <div class="label">公司名称:</div>
              <div class="value">{{ enterpriseName }}</div>
            </div>
            <div class="info-item">
              <div class="label">统一社会信用代码:</div>
              <div class="value">{{ enterpriseCertNo }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="data-info">
      <!-- <el-row :gutter="20" style="margin-bottom: 20px;">
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :span="12">
          <el-card>
            <div class="chart-item">
              <div class="chart-title">民商信统计</div>
              <div class="chart-content statistics-part">
                <div class="usable">
                  <div>可用民商信</div>
                  <div class="amount">{{ availableLimit || '0.00' }}元</div>
                </div>
                <div class="used">
                  <div class="paid">
                    <div>已支付</div>
                    <div>{{ paymentLimit || '0.00' }}元</div>
                  </div>
                  <div class="raised">
                    <div>已融资</div>
                    <div>{{ fnAmount || '0.00' }}元</div>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :span="12">
          <el-card>
            <div class="chart-item">
              <div class="chart-title">应收账款统计</div>
              <div class="chart-content statistics-part">
                <div class="usable">
                  <div>持有中</div>
                  <div class="amount">{{ billAmt || '0.00' }}元</div>
                </div>
                <div class="used">
                  <div class="raised">
                    <div>已融资</div>
                    <div>{{ transferAmt || '0.00' }}元</div>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-bottom: 20px;">
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :span="12">
          <el-card>
            <div class="chart-item">
              <div class="chart-title">民商信状态分布</div>
              <div ref="MSX-status" id="MSX-status" class="chart-content"></div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :span="12">
          <el-card>
            <div class="chart-item">
              <div class="chart-title">民商信持仓到期分布</div>
              <div ref="MSX-overdue" id="MSX-overdue" class="chart-content"></div>
            </div>
          </el-card>
        </el-col>
      </el-row> -->
      <el-row :gutter="20" style="margin-bottom: 20px;">
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :span="12">
          <el-card>
            <!-- 应收账款持有分布 -->
            <div class="chart-item">
              <div class="chart-title">应收账款持有分布</div>
              <div ref="MSX-receivable" id="MSX-receivable" class="chart-content"></div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :span="12">
          <el-card>
            <!-- 应收账款状态分布 -->
            <div class="chart-item">
              <div class="chart-title">应收账款状态分布</div>
              <div ref="MSX-payer" id="MSX-payer" class="chart-content"></div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { renderOptions } from '@/utils/chartsOptions'
import { enterpriseBasicInfoApi } from '@/api/enterprise-information-management'
import {
  getHoldSpreadApi,
  getSupplyGraphDataApi,
  getMsxSumApi,
  getEndStatisticsApi,
  getStatusStatisticsApi,
  getTextStatisticsApi,
} from '@/api/civil-commercial-credit/financing'
export default {
  name: 'index',
  data() {
    let formateDate = () => {
      let d = new Date()
      let years = d.getFullYear()
      let days = d.getDate()
      let months = d.getMonth() + 1
      let formate = function(d) {
        return d > 9 ? d : '0' + d
      }
      return `${years}-${formate(months)}-${formate(days)}`
    }
    return {
      currentDate: formateDate(),

      MSXreceivableLegendArr: ['1个月内', '1-3个月', '3-6个月', '6-12个月', '12个月以上'],
      enterpriseList: [], // 企业信息
      availableLimit: '',
      paymentLimit: '',
      fnAmount: '',
      enterprise: '',

      msxStatus: {},
      msxOverdue: {},
      msxReceivable: {},
      msxPayer: {},
      ownId: '',
      billAmt: '', // 持有应收账款
      transferAmt: '', // 已转让
    }
  },
  destroyed() {
    window.onresize = null
  },

  mounted() {
    if (this.enterpriseName) {
      this.getText()
      this.getEndList()
      this.getStatusList()
      let _this = this
      window.onresize = function() {
        // _this.msxOverdue.resize()
        // _this.msxStatus.resize()
        if (_this.msxReceivable) _this.msxReceivable.resize()
        if (_this.msxPayer) _this.msxPayer.resize()
      }
    }
    if (this.enterpriseId) {
      // this.getMsxSunFn()
      // this.getSupplyGraphData()
      // this.getHoldSpread()
    }
  },
  computed: {
    enterpriseName() {
      return this.$store.state.enterprise.enterpriseName
    },
    enterpriseCertNo() {
      return this.$store.state.enterprise.enterpriseCertNo
    },
    enterpriseId() {
      return this.$store.state.enterprise.enterpriseId
    },
  },
  methods: {
    // 民商信统计
    getMsxSunFn() {
      getMsxSumApi({ ownId: this.enterpriseId }).then(res => {
        if (res.code == 200) {
          this.availableLimit = res.data.availableLimit
          this.paymentLimit = res.data.paymentLimit
          this.fnAmount = res.data.fnAmount
        }
      })
    },
    // 民商信状态分布
    getSupplyGraphData() {
      getSupplyGraphDataApi({
        ownId: this.enterpriseId,
      }).then(res => {
        if (res.code == 200) {
          this.renderMSXstatusChart(res.data)
        }
      })
    },
    // 民商信持仓到期分布
    getHoldSpread() {
      getHoldSpreadApi({
        ownId: this.enterpriseId,
      }).then(res => {
        if (res.code == 200) {
          this.renderMSXoverdueChart(res.data)
        }
      })
    },
    // 应收账款统计
    getText() {
      getTextStatisticsApi({
        supplierName: this.enterpriseName,
      }).then(res => {
        if (res.code == 200) {
          this.billAmt = res.data.billAmt
          this.transferAmt = res.data.transferAmt
        }
      })
    },
    // 应收账款持有分布
    getEndList() {
      getEndStatisticsApi({
        supplierName: this.enterpriseName,
      }).then(res => {
        if (res.code == 200) {
          this.renderMSXReceivableChart(res.data)
        }
      })
    },
    // 应收账款状态分布
    getStatusList() {
      getStatusStatisticsApi({
        supplierName: this.enterpriseName,
      }).then(res => {
        if (res.code == 200) {
          this.renderMSXpayerChart(res.data)
        }
      })
    },
    renderMSXstatusChart(data) {
      let legendData = []
      let mapData = []
      data.forEach(item => {
        legendData.push(item.type)
        mapData.push({
          name: item.type,
          value: Number(item.amount) || 0,
        })
      })
      this.msxStatus = echarts.init(this.$refs['MSX-status'])
      this.msxStatus.setOption(renderOptions('民商信状态分布', legendData, mapData))
    },
    renderMSXoverdueChart(data) {
      let legendData = []
      let mapData = []
      data.forEach(item => {
        legendData.push(item.type)
        mapData.push({
          name: item.type,
          value: Number(item.rowCounts),
        })
      })
      this.msxOverdue = echarts.init(this.$refs['MSX-overdue'])
      this.msxOverdue.setOption(renderOptions('民商信持仓到期分布', legendData, mapData))
    },
    renderMSXReceivableChart(data) {
      let mapData = []
      mapData = [
        { value: data.bill1MonthAmt, name: '1个月内' },
        { value: data.bill3MonthAmt, name: '1-3个月' },
        { value: data.bill6MonthAmt, name: '3-6个月' },
        { value: data.bill12MonthAmt, name: '6-12个月' },
        { value: data.bill13MonthAmt, name: '12个月以上' },
      ]
      this.msxReceivable = echarts.init(this.$refs['MSX-receivable'])
      this.msxReceivable.setOption(
        renderOptions('应收账款持有分布', this.MSXreceivableLegendArr, mapData)
      )
    },
    renderMSXpayerChart(data) {
      let legendData = ['持有中', '已融资', '已还款', '已逾期']
      let mapData = [
        { value: data.holdingAmt, name: '持有中' },
        { value: data.financedAmt, name: '已融资' },
        { value: data.paidAmt, name: '已还款' },
        { value: data.overdueAmt, name: '已逾期' },
      ]
      this.msxPayer = echarts.init(this.$refs['MSX-payer'])
      this.msxPayer.setOption(renderOptions('应收账款状态分布', legendData, mapData))
    },
  },
}
</script>

<style scoped lang="scss">
.home {
  .company-info {
    display: flex;
    flex-direction: column;
    height: 60px;
    line-height: 30px;
    .info-item {
      display: flex;
      .label {
        width: 150px;
        text-align: right;
        margin-right: 20px;
      }
    }
  }
  .chart-item {
    .chart-title {
      margin: 20px;
    }
    .chart-content {
      width: 90%;
      height: 400px;
      margin: 0 auto;
      // border: 1px solid;
    }
  }
  .statistics-part {
    display: flex;
    padding: 80px 0;
    flex-direction: column;
    justify-content: space-around;
    .usable {
      height: 100px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      .amount {
        font-weight: bold;
        font-size: 30px;
      }
    }
    .used {
      display: flex;
      justify-content: space-around;
      .paid,
      .raised {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        height: 60px;
      }
    }
  }
}
</style>
