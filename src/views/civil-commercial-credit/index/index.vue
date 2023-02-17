<template>
  <div class="chart-container">
    <el-row :gutter="20" style="margin-bottom: 20px;">
      <el-col :xs="24" :sm="24" :md="24" :lg="12" :span="12">
        <el-card>
          <!-- 民商信状态分布 -->
          <div class="chart-item">
            <div class="chart-title">民商信状态分布</div>
            <div ref="MSX-status" id="MSX-status" class="chart-content"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="12" :span="12" class="top">
        <el-card>
          <!-- 民商信持仓到期分布 -->
          <div class="chart-item">
            <div class="chart-title">民商信持仓到期分布</div>
            <div ref="MSX-overdue" id="MSX-overdue" class="chart-content"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="24" :lg="12" :span="12">
        <el-card>
          <!-- 开立方分布 -->
          <div class="chart-item">
            <div class="chart-title">开立方分布</div>
            <div ref="MSX-open" id="MSX-open" class="chart-content"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="12" :span="12" class="top">
        <el-card>
          <!-- 民商信统计 -->
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
    </el-row>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import { renderOptions } from '@/utils/chartsOptions'
import {
  getHoldSpreadApi,
  getSupplyGraphDataApi,
  getMsxSumApi,
  msxKailfApi,
} from '@/api/civil-commercial-credit/financing'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      availableLimit: '',
      paymentLimit: '',
      fnAmount: '',
      msxStatus: {},
      msxOverdue: {},
      msxOpen: {},
    }
  },
  created() {},
  computed: {
    ...mapState({
      enterpriseId: state => state.enterprise.enterpriseId,
    }),
  },
  mounted() {
    this.getSupplyGraphData()
    this.getHoldSpread()
    this.msxKailf()
    this.getMsxSunFn()
    let _this = this
    window.onresize = function() {
      _this.msxStatus.resize()
      _this.msxOverdue.resize()
      _this.msxOpen.resize()
    }
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
    // 开立方分布
    msxKailf() {
      msxKailfApi({
        ownId: this.enterpriseId,
      }).then(res => {
        if (res.code == 200) {
          this.renderMSXopenChart(res.data)
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
      console.log(123)
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
    renderMSXopenChart(data) {
      let legendData = []
      let mapData = []
      data.forEach(item => {
        legendData.push(item.opener_name)
        mapData.push({
          name: item.opener_name,
          value: Number(item.creditLimit),
        })
      })
      this.msxOpen = echarts.init(this.$refs['MSX-open'])
      this.msxOpen.setOption(renderOptions('开立方分布', legendData, mapData))
    },
  },
}
</script>

<style lang="scss">
.chart-container {
  padding: 20px;
  .chart-title {
    margin: 20px;
  }
  .chart-item {
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
@media screen and (max-width: 1200px) {
  .top {
    margin-top: 20px;
  }
}
</style>
