<template>
  <div class="page-name app-container flex1 flex-col over-hidden">
    <!-- 如果设置page-name,必须和其他页面不一样,flex-col 使页面为flex布局 flex1获取父级剩余高度，全部占满 -->
    <!-- 顶部搜索框 flex-shrink-0 是为了防止dom被挤压-->
    <!-- el-form 不建议用inline属性，如需一排显示，使用el-row+el-span -->

    <div class="header">
      <!-- 每张卡 -->
      <div class="bank">
        <div class="top">
          <div class="bank-content">
            <img v-if="banlenceShow" src="../../assets/images/unSign.png" alt="" />
            <img v-else :src="getBankImgUrl(item.accountCode)" alt="" />
            <div class="bank-info">
              <div class="bank-name" v-if="banlenceShow">{{ item.accountName }}</div>
              <div class="bank-name" v-else>
                <span>{{ item.accountName }}</span>
                <div class="auth-icon">
                  <img style="width: 20px;height: 20px" src="../../assets/images/vips.png" alt="" />
                  <span>已认证</span>
                </div>
              </div>
              <div class="bank-code">{{ item.fictitiousAccountNo }}</div>
            </div>
          </div>
          <!-- <div class="bank-type" v-if="banlenceShow">平台分户账簿</div> -->
        </div>
        <div class="bottom">
          <div class="balance-box">
            <div>余额(元)</div>
            <div class="balance">{{ item.totalAmt }}</div>
          </div>
          <div class="balance-box">
            <div>账户状态</div>
            <div class="balance">{{ item.accSts | dictFilter(accountStatus) }}</div>
          </div>
          <!-- <div class="balance-box" v-if="banlenceShow">
            <div>可用余额(元)</div>
            <div class="balance">{{ showBalance ? `${item.amountBalance}` : '*****' }}</div>
          </div>
          <div class="balance-box" v-if="banlenceShow">
            <div>冻结余额(元)</div>
            <div class="balance">{{ showBalance ? `${item.frozenAmount}` : '*****' }}</div>
          </div> -->
          <el-button @click="fictitiousFn" type="primary" size="mini">
            查看绑定卡
          </el-button>
        </div>
      </div>
      <!-- <div class="btnBox">
        <el-button
          type="primary"
          plain
          size="mini"
          v-show="transferOrTupUpShowBtn"
          @click="rollOutFn"
          >转出</el-button
        >

        <el-button type="success" plain size="mini" v-show="transferOrTupUpShowBtn" @click="topUpFn"
          >充值</el-button
        >

        <el-button
          type="warning"
          plain
          size="mini"
          v-show="defaultCardShowBtn"
          @click="defaultCardFn"
          >设置为默认收款卡</el-button
        >
      </div> -->
    </div>
    <el-divider />
    <!-- 剩余空间通过 flex1 全部分给表格，over-hidden 必须使用 -->
    <div class="flex1 over-hidden">
      <!-- <el-tabs v-model.trim="activeName" @tab-click="handleClick">
       <el-tab-pane label="转出记录" name="1" v-if="banlenceShow">
          <transfer-record v-if="activeName === '1'" :amountList="amountList" />
        </el-tab-pane>
        <el-tab-pane label="转出审批" name="2" v-if="banlenceShow">
          <transfer-approval
            v-if="activeName === '2'"
            :amountInfo="amountInfo"
            :amountList="amountList"
          />
        </el-tab-pane>
        <el-tab-pane label="充值记录" name="3" v-if="banlenceShow">
          <top-up-record v-if="activeName === '3'" />
        </el-tab-pane> 
        <el-tab-pane label="交易明细" name="4">
          <trade-detail v-if="activeName === '4'" :amountList="amountList" />
        </el-tab-pane>
      </el-tabs>-->
      <trade-detail v-if="activeName === '4'" :amountList="amountList" :item="item" />
    </div>
    <!-- 电子账户绑定卡 -->
    <el-dialog :modal-append-to-body="false" :visible.sync="fictitiousShow" width="500px" center>
      <div class="header">电子账户绑定卡</div>
      <el-form :model="fictitiousForm" :inline="true" label-width="140px" class="m-t-20">
        <el-row>
          <el-form-item label="银行账户类型：">
            <el-input size="small" disabled v-model.trim="fictitiousForm.type"></el-input>
          </el-form-item>
          <el-form-item label="银行开户名：">
            <el-input size="small" disabled v-model.trim="fictitiousForm.accountName"></el-input>
          </el-form-item>
          <el-form-item label="银行账号：">
            <el-input size="small" disabled v-model.trim="fictitiousForm.maskAccountNo"></el-input>
          </el-form-item>
          <el-form-item label="开户行行号：">
            <el-input
              size="small"
              disabled
              v-model.trim="fictitiousForm.accountBankCode"
            ></el-input>
          </el-form-item>
          <el-form-item label="开户行名称：">
            <el-input size="small" disabled v-model.trim="fictitiousForm.bankName"></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="m-t-20">
        <el-button @click="fictitiousShow = false" size="small">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 默认收款卡弹框 -->
    <el-dialog :modal-append-to-body="false" :visible.sync="defaultCardShow" width="30%" center>
      <div class="header">默认收款卡变更提示</div>
      <span class="text-container"
        >默认收款卡只能有一张，确认将该卡变更为默认收款卡吗？变更后，原卡将不再为默认收款卡！</span
      >
      <span slot="footer" class="m-t-20">
        <el-button type="primary" size="small" @click="submitForm">确定变更</el-button>
        <el-button @click="back" size="small">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 转出弹窗 -->
    <transfer-dialog
      :transferShow="transferShow"
      :amountInfo="amountInfo"
      :amountList="amountList"
      @hideTransferDialog="hideTransferDialog"
    ></transfer-dialog>
    <!-- 充值提交凭证弹窗 -->
    <top-up-dialog
      :amountInfo="amountInfo"
      :topupDialogShow="topupDialogShow"
      @hidetopupDialog="hidetopupDialog"
      @showPayInfoClose="showPayInfoClose"
    ></top-up-dialog>
    <!-- 充值弹窗 -->
    <el-dialog
      :modal-append-to-body="false"
      title="充值"
      :visible.sync="showPayInfo"
      class="form-row"
      :center="true"
      width="40%"
    >
      <el-form :model="payInfoForm" :inline="true" label-width="100px">
        <span class="fontSize">充值</span>
        <hr />
        <div style="color:#1890ff; margin:15px 0;">
          请将充值金额转账到以下账户
        </div>

        <el-row>
          <el-form-item label="账户名称：">
            <div class="flex">
              <div class="flex-item">{{ payInfoForm.enterpriseName }}</div>
              <el-button type="text" @click="handleCopy(payInfoForm.enterpriseName, $event)"
                >复制</el-button
              >
            </div>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="账号：">
            <div class="flex">
              <div class="flex-item">{{ payInfoForm.code }}</div>
              <el-button type="text" @click="handleCopy(payInfoForm.code, $event)">复制</el-button>
            </div>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="开户行：">
            <div class="flex">
              <div class="flex-item">{{ payInfoForm.bank }}</div>
              <el-button type="text" @click="handleCopy(payInfoForm.bank, $event)">复制</el-button>
            </div>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="开户行支行：">
            <div class="flex">
              <div class="flex-item">{{ payInfoForm.branch }}</div>
              <el-button type="text" @click="handleCopy(payInfoForm.branch, $event)"
                >复制</el-button
              >
            </div>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="转账备注：">
            <div class="flex">
              <div class="flex-item">{{ payInfoForm.remark }}</div>
              <el-button type="text" @click="handleCopy(payInfoForm.remark, $event)"
                >复制</el-button
              >
            </div>
          </el-form-item>
        </el-row>
      </el-form>
      <div class="remark">
        <p>转账说明：</p>
        <p>1、请使用网银、柜台进行转账</p>
        <p>2、请务必填写转账备注信息，如您忘记填写，请致电人工客服查账</p>
        <p>
          3、转账成功后，请上传转账凭证，平台会在3个工作日内完成核对，并入账到平台分户，完成充值。
        </p>
      </div>
      <span slot="footer" style="text-align:center;">
        <el-button type="primary" @click="uploadFile">已转账，上传凭证</el-button>
        <el-button type="primary" @click="showPayInfoClose()">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import transferRecord from './components/transfer-record.vue'
import transferApproval from './components/transfer-approval.vue'
import topUpRecord from './components/top-up-record.vue'
import tradeDetail from './components/trade-detail.vue'
import transferDialog from './components/transfer-dialog.vue'
import topUpDialog from './components/top-up-dialog.vue'
import { Encrypt, Decrypt } from '@/utils/jsencrypt'
import copyText from '@/utils/copy'
import { dictFilter } from '@/utils/filters/common.js'
import {
  enterpriseAccountListApi,
  setDefaultAccountApi,
  getTransferAccountApi,
  getFictitiousAccountDetailApi,
} from '@/api/amount-management/index'
export default {
  // name 属性，如果需要使用 keep-alive 缓存页面，name必须配置
  name: 'dataList',
  filters: { dictFilter },
  components: {
    'transfer-record': transferRecord,
    'transfer-approval': transferApproval,
    'top-up-record': topUpRecord,
    'trade-detail': tradeDetail,
    'transfer-dialog': transferDialog,
    'top-up-dialog': topUpDialog,
  },
  // 这里不说了 data(){return {}}模式；
  data() {
    return {
      transferShow: false,
      loading: false,
      tableData: [],
      total: 1000,
      pageSize: 10,
      pageNum: 1,
      showAccountBalance: false,
      showBalance: true,
      activeName: '4',
      defaultCardShow: false,
      topupDialogShow: false,
      amountInfo: [],
      amountList: [],
      payInfoForm: {},
      showPayInfo: false,
      defaultCardShowBtn: null,
      transferOrTupUpShowBtn: null,
      item: {},
      banlenceShow: false,
      fictitiousShow: false,
      fictitiousForm: {},
    }
  },
  created() {
    // this.getInfo()
    // this.getAmountList()
    this.item = JSON.parse(this.$route.query.item)
    this.banlenceShow = this.$route.query.banlenceShow
    this.amountInfo.push(this.item)
    // 转账，充值按钮显示，是否是平台账户
    this.transferOrTupUpShowBtn = this.amountInfo[0].type == '0' ? true : false
    if (!this.banlenceShow) {
      //是否是收款卡
      this.defaultCardShowBtn = this.amountInfo[0].isCollection == '0' ? true : false
    }
  },
  computed: {
    accountStatus() {
      return this.$staticData.bank_account_status
    },
  },
  watch: {
    showPayInfo(val) {
      if (val) {
        console.log(val)
        getTransferAccountApi().then(res => {
          if (res.code == 200) {
            this.payInfoForm = res.data
          }
        })
      }
    },
  },
  mounted: function() {},
  methods: {
    // 查看电子账户绑定卡
    fictitiousFn() {
      this.fictitiousForm = {}
      getFictitiousAccountDetailApi({ seqNo: this.item.seqNo }).then(res => {
        if (res.code == 200) {
          this.fictitiousForm = res.data
          this.fictitiousForm.type = '对公银行账户'
          this.fictitiousShow = true
        }
      })
    },
    /**复制 */
    handleCopy(text, ev) {
      copyText(text, ev)
    },
    getBankImgUrl(bankCode) {
      try {
        return require(`../../assets/bankCard/bk_${bankCode}.png`)
      } catch (e) {
        return require(`../../assets/bankCard/bk_510.png`)
      }
    },
    showPayInfoClose() {
      this.showPayInfo = false
    },
    // 查询收款账号
    getAmountList() {
      enterpriseAccountListApi({
        enterpriseCertNo: this.$store.state.enterprise.enterpriseCertNo,
        type: 0,
      }).then(res => {
        if (res.code == 200) {
          this.amountList = res.data
        }
      })
    },
    // 转出
    rollOutFn() {
      this.transferShow = true
    },
    // 上传凭证
    uploadFile() {
      this.topupDialogShow = true
    },
    // 充值
    topUpFn() {
      this.showPayInfo = true
    },
    defaultCardFn() {
      this.defaultCardShow = true
    },
    handleClick() {},
    submitForm() {
      const dataInfo = {
        enterpriseCertNo: this.$store.state.enterprise.enterpriseCertNo,
        platform: 1,
        seqNo: this.amountInfo[0].seqNo,
      }
      setDefaultAccountApi(dataInfo).then(res => {
        if (res.code == 200) {
          this.$message.success('成功')
          this.defaultCardShowBtn = false
        } else {
          this.$message.error('失败')
        }
      })
      this.defaultCardShow = false
    },
    back() {
      this.defaultCardShow = false
    },
    hideTransferDialog() {
      this.transferShow = false
    },
    hidetopupDialog() {
      this.topupDialogShow = false
    },
  },
}
</script>

<style lang="scss" scoped>
/* style 建议使用, scoped 可以用可不用，如果不用 scoped，第一级必须是 本页面的独有的page-name */
/* 必须按规范，不然会对别人的页面造成样式干扰 */
.fontSize {
  display: block;
  font-size: 18px;
  font-weight: 700;
  padding-top: 20px;
}
.tabContaiber {
  height: 100%;
}
.flex-item {
  width: 260px;
}
.page-name {
  padding: 10px;
  height: 100%;
  overflow: hidden;
}
::v-deep .el-tabs {
  height: 100%;
}
::v-deep .el-tabs__content {
  display: flex;
}
.header {
  display: flex;
}

.btnBox {
  padding-top: 155px;
}
.col-item {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
.bank {
  width: 450px;
  padding: 30px;
  border: 1px solid #ccc;
  margin: 10px;

  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    .bank-name {
      display: flex;
      align-items: center;
      .auth-icon {
        display: flex;
        color: #e57731;
        font-size: 14px;
        margin-left: 10px;
      }
    }

    img {
      width: 50px;
      height: 50px;
    }
    .bank-content {
      display: flex;
      .bank-info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 50px;
        margin-left: 10px;
      }
    }
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    .balance-box {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .balance {
      margin-top: 5px;
    }
  }
}
.header {
  background: #f2f2f2;
  padding: 10px;
  color: #000;
  font-weight: 600;
  font-size: 16px;
}
::v-deep .el-dialog__body {
  padding: 0;
}
::v-deep .el-dialog__header {
  display: none;
}
.text-container {
  display: block;
  padding: 20px;
  font-size: 16px;
}

.flex1 ::v-deep .el-tabs {
  display: flex;
  flex-direction: column;
}
.flex1 ::v-deep .el-tabs__content {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.flex1 ::v-deep .el-tab-pane {
  flex: 1;
}

.form-row ::v-deep .el-row > .el-form-item {
  margin-bottom: 10px;
}

.form-row ::v-deep .el-dialog__body {
  padding: 0 30px;
}
</style>
