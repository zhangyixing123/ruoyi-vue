<template>
  <div class="bank-account-manage">
    <div class="account" v-if="fictitiousList.length > 0">
      <span class="title">企业电子账户</span>
      <div class="flex just-start m-t-20 flex-wrap" v-if="showFlag">
        <div v-for="(item, index) in fictitiousList" :key="index" class="bankCard">
          <div class="flex align-center just-between">
            <div class="header1 flex align-center">
              <div v-if="item.thirdChannel != 'zgc'">
                <img :src="getBankImgUrl(item.bankCode)" alt="" />
              </div>
              <div v-else><img :src="img1" alt="" /></div>
              <div class="bankName">
                <div v-if="item.bankName">
                  <span v-if="item.thirdChannel != 'zgc'">{{ item.bankName }}</span>
                  <span v-else>北京中关村银行电子户</span>
                </div>
                <div v-else>-----</div>
                <div v-if="item.fictitiousAccountNo">{{ item.fictitiousAccountNo }}</div>
                <div v-else>-----</div>
              </div>
            </div>
            <span>电子账户</span>
          </div>
          <div class="flex align-center just-between text-center m-t-20 c-606266">
            <div>
              <p>余额(元)</p>
              <p class="m-t-10" v-if="item.totalAmt">{{ item.totalAmt }}</p>
              <p v-else>---</p>
            </div>
            <div>
              <p>账户状态</p>
              <p class="m-t-10" v-if="item.accSts">{{ item.accSts | dictFilter(accountStatus) }}</p>
              <p v-else>---</p>
            </div>

            <el-button
              type="primary"
              size="small "
              @click="accountDetail(item)"
              :disabled="!item.bankName"
              v-hasPermi="['account:account:accountBalanceQuery']"
              >查看账户</el-button
            >
          </div>
        </div>
      </div>
    </div>
    <div class="m-t-20 account">
      <span class="title">企业对公账户</span>
      <div class="flex just-start m-t-20 flex-wrap">
        <div v-for="(item, index) in listCapital" :key="index" class="bankCard">
          <div class="flex align-center just-between">
            <div class="header1 flex align-center">
              <div><img :src="getBankImgUrl(item.bankCode)" alt="" /></div>
              <div class="bankName">
                <div>{{ item.bankName }}</div>
                <div>{{ item.maskAccountNo }}</div>
              </div>
            </div>
            <span>对公账户</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  listCapitalAccountApi,
  getFictitiousAccountListApi,
  accountBalanceQueryApi,
} from '@/api/amount-management/index'
import { dictFilter } from '@/utils/filters/common.js'
import { Decrypt } from '@/utils/jsencrypt'
export default {
  props: {},
  filters: { dictFilter },
  data() {
    return {
      showBalance: false,
      showAccountBalance: false,
      showOutAccountBalance: false,
      account: {},
      outAccount: {},
      accountTypeArr: [
        { dictValue: 1, dictLabel: '一般结算户' },
        { dictValue: 2, dictLabel: '还款专户' },
      ],
      bankList: [
        { dictValue: '01', dictLabel: '中信银行' },
        { dictValue: '02', dictLabel: '民生银行' },
        { dictValue: '03', dictLabel: '中国银行' },
        { dictValue: '04', dictLabel: '工商银行' },
      ],
      accountInfo: {
        accountName: '',
        accountNo: '',
        amountBalance: '',
        balance: '',
        enterpriseName: '',
      },
      outAccountList: [],
      img1: require('@/assets/bankCard/zgc.png'),
      listCapital: [], // 对公账户
      fictitiousList: [], // 电子账户
      showFlag: false,
    }
  },
  computed: {
    accountStatus() {
      return this.$staticData.bank_account_status
    },
  },
  created() {
    this.getInfo()
    this.getFictitiouList()
  },
  mounted() {},
  watch: {},
  methods: {
    // 查询对公账户信息
    getInfo() {
      listCapitalAccountApi({}).then(res => {
        if (res.code == 200) {
          this.listCapital = res.data
        }
      })
    },
    // 查询电子账户
    getFictitiouList() {
      getFictitiousAccountListApi({ thirdChannel: 'zgc' }).then(res => {
        this.fictitiousList = res.data || []
        if (this.fictitiousList.length > 0) this.getDetails()
      })
    },
    // 查询电子户详情
    getDetails() {
      // fictitiousAccountNo
      this.showFlag = false
      let requestArr = []
      this.fictitiousList.forEach(item => {
        item.fictitiousAccountNo = item.fictitiousAccountNo ? Decrypt(item.fictitiousAccountNo) : ''
        requestArr.push(
          accountBalanceQueryApi({
            seqNo: item.seqNo,
            thirdChannel: 'zgc',
          }).then(res => {
            if (res.code == 200) {
              item.accSts = res.data.accSts
              item.totalAmt = res.data.totalAmt
            }
          })
        )
      })
      Promise.all(requestArr)
        .then(() => {
          this.showFlag = true
        })
        .catch(() => {
          this.showFlag = true
        })
    },
    handleToOpenAccount() {
      this.$router.push({ name: 'Open-account' })
    },
    handleToOutAccount() {
      this.$router.push({ name: 'Out-account' })
    },
    getBankImgUrl(bankCode) {
      try {
        return require(`../../assets/bankCard/0${bankCode}0000.png`)
      } catch (e) {
        return require(`../../assets/bankCard/zgc.png`)
      }
    },
    accountDetail(item) {
      this.$router.push({
        name: 'Account-detail',
        query: { item: JSON.stringify(item), banlenceShow: true },
      })
    },
    accountListDetail(item) {
      this.$router.push({
        name: 'Account-detail',
        query: { item: JSON.stringify(item), banlenceShow: false },
      })
    },
  },
}
</script>

<style scoped lang="scss">
.bank-account-manage {
  padding: 20px;
  .account {
    border: 1px solid #bbb;
    padding: 20px;
    border-radius: 10px;
  }
  .title {
    font-size: 18px;
    font-weight: bold;
  }
  .bankCard {
    padding: 30px 30px 0 !important;
    border: 1px solid #bbb;
    border-radius: 10px;
    box-shadow: 7px 7px 7px #ddd;
    width: 30% !important;
    height: 180px;
    margin-right: 20px;
    margin-bottom: 20px;
  }
  .header1 {
    img {
      width: 30px;
    }
    .bankName {
      margin-left: 10px;
      & > div:first-child {
        font-size: 16px;
        font-weight: bold;
      }
      & > div:last-child {
        margin-top: 5px;
        font-size: 14px;
      }
    }
  }
  p {
    margin: 0;
  }
  .m-t-10 {
    margin-top: 10px;
  }
}
.just-start {
  justify-content: flex-start;
}
</style>
