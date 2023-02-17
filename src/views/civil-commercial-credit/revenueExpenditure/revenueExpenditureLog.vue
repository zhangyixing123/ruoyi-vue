<template>
  <div class="page-container">
    <el-tabs v-model.trim="activeName">
      <el-tab-pane label="可用" name="usable">
        <div class="tab-content">
          <usable v-if="activeName === 'usable'"></usable>
        </div>
      </el-tab-pane>
      <el-tab-pane label="支付中" name="paying">
        <div class="tab-content">
          <paying v-if="activeName === 'paying'"></paying>
        </div>
      </el-tab-pane>
      <el-tab-pane label="已融资" name="raised">
        <div class="tab-content">
          <raised :receiverList="receiverList" v-if="activeName === 'raised'"></raised>
        </div>
      </el-tab-pane>
      <el-tab-pane label="已支付" name="paid">
        <div class="tab-content">
          <paid :receiverList="receiverList" v-if="activeName === 'paid'"></paid>
        </div>
      </el-tab-pane>
      <el-tab-pane label="支付失败" name="payFailed">
        <div class="tab-content">
          <payFailed :receiverList="receiverList" v-if="activeName === 'payFailed'"></payFailed>
        </div>
      </el-tab-pane>
      <el-tab-pane label="已到期" name="isExpire">
        <div class="tab-content">
          <expired v-if="activeName === 'isExpire'"></expired>
        </div>
      </el-tab-pane>
      <el-tab-pane label="原始" name="original">
        <div class="tab-content">
          <origin v-if="activeName === 'original'"></origin>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {
  // 接收方列表接口
  acceptorList,
} from '@/api/civil-commercial-credit/revenueExpenditureApi'
import usable from './components/usable.vue'
import paying from './components/paying.vue'
import raised from './components/raised.vue'
import paid from './components/paid.vue'
import payFailed from './components/payFailed.vue'
import expired from './components/expired.vue'
import origin from './components/origin.vue'

export default {
  name: 'dataList',
  components: {
    usable,
    paying,
    raised,
    paid,
    payFailed,
    expired,
    origin,
  },
  data() {
    return {
      activeName: 'usable',
      receiverList: [],
    }
  },
  computed: {},
  created() {
    const query = {
      pageNum: 1,
      pageSize: 20,
      relationStatus: [1],
    }
    acceptorList(query).then(res => {
      this.receiverList = res.data.rows
    })
  },

  methods: {},
}
</script>

<style lang="scss">
/* style 建议使用, scoped 可以用可不用，如果不用 scoped，第一级必须是 本页面的独有的page-name */
/* 必须按规范，不然会对别人的页面造成样式干扰 */
.page-container {
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
    // .el-table__footer-wrapper {
    //   margin-top: -50px !important;
    // }
  }
}
.tab-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
