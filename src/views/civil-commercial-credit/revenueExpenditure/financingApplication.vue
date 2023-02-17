<template>
  <div class="financingApplication">
    <el-dialog
      :modal-append-to-body="false"
      :title="title"
      :visible.sync="open"
      width="900px"
      append-to-body
      :close-on-click-modal="false"
      @close="cancel"
    >
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if="!fromShow">
        <el-form-item label="预借金额">
          <el-input v-model.trim="preApplyAmt" placeholder="预借金额"></el-input>
          <!-- <span>请输入0-{{ canUsed }}</span> -->
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit" :disabled="!preApplyAmt">确定</el-button>
        </el-form-item>
      </el-form>
      <div class="list" v-if="!fromShow">
        <div class="item" v-for="(item, index) in fundSideList" :key="index">
          <div class="left">
            <img :src="item.merLogo" alt="" />
          </div>
          <div class="middle">
            <p class="title">{{ item.merName }}</p>
            <p>
              <span class="d1" v-for="(v, k) in item.merTags" :key="k">{{ v }}</span>
            </p>
            <p class="red">
              <span class="d2">{{ item.preMultiApplRate }}%</span>
              <span class="d3">--预计综合融资息费率</span>
            </p>
          </div>
          <div class="right">
            <el-button
              :disabled="inquiryAllow"
              type="danger"
              size="mini"
              @click="inquiryApplication(item)"
            >
              询价申请
            </el-button>
          </div>
        </div>
      </div>
      <div v-if="fromShow">
        <el-form ref="formData" :model="formData" label-width="140px">
          <el-row>
            <el-col :span="12"
              ><el-form-item :label="`民商信编号`" prop="commercialCreditNo" class="is-required">
                <el-input
                  v-model.trim="formData.commercialCreditNo"
                  :disabled="disableds"
                ></el-input> </el-form-item
            ></el-col>
            <el-col :span="12"
              ><el-form-item :label="`开立方`" prop="" class="is-required">
                <el-input
                  v-model.trim="sonData.openerName"
                  :disabled="disableds"
                ></el-input> </el-form-item
            ></el-col>
          </el-row>
          <el-row>
            <el-col :span="12"
              ><el-form-item :label="`民商信金额`" prop="commercialCreditAmt" class="is-required">
                <el-input v-model.trim="formData.commercialCreditAmt" :disabled="disableds">
                  <el-button slot="append">元</el-button>
                </el-input>
              </el-form-item></el-col
            >
            <el-col :span="12"
              ><el-form-item :label="`资金方`" prop="fundSide" class="is-required">
                <el-input
                  v-model.trim="formData.fundSide"
                  :disabled="disableds"
                ></el-input> </el-form-item
            ></el-col>
          </el-row>
          <el-row>
            <el-col :span="12"
              ><el-form-item :label="`可用金额`" prop="canUsed" class="is-required">
                <el-input v-model.trim="canUsed" :disabled="disableds"
                  ><el-button slot="append">元</el-button></el-input
                >
              </el-form-item></el-col
            >
            <el-col :span="12"
              ><el-form-item :label="`承诺付款日`" prop="payDay" class="is-required">
                <el-input
                  v-model.trim="formData.payDay"
                  :disabled="disableds"
                ></el-input> </el-form-item
            ></el-col>
          </el-row>
          <el-row>
            <el-col :span="12"
              ><el-form-item :label="`到期天数`" prop="openDate" class="is-required">
                <el-input
                  v-model.trim="formData.openDate"
                  :disabled="disableds"
                ></el-input> </el-form-item
            ></el-col>
            <el-col :span="12"
              ><el-form-item :label="`融资付息模式`" prop="fnInterestModel" class="is-required">
                <el-select
                  v-model.trim="formData.fnInterestModel"
                  :disabled="disableds"
                  :placeholder="`请选择融资付息模式`"
                  size="small"
                >
                  <el-option
                    v-for="status in $staticData.msx_interet_type"
                    :key="status.dictValue"
                    :label="status.dictLabel"
                    :value="status.dictValue"
                  ></el-option>
                </el-select> </el-form-item
            ></el-col>
          </el-row>
          <el-row>
            <el-col :span="12"
              ><el-form-item :label="`拟融资金额`" prop="fnAmt" class="is-required">
                <el-input disabled v-model.trim="formData.fnAmt"
                  ><el-button slot="append">元</el-button></el-input
                >
              </el-form-item></el-col
            >
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer text-center">
          <el-button type="primary" @click="submitForm">下一步</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </div>
    </el-dialog>
    <application ref="application" :formData="formData"></application>
  </div>
</template>
<script>
import {
  getMerListApi,
  chooseMerApi,
  getAvailableLimitApi,
  inquiryApi,
} from '@/api/civil-commercial-credit/financing'
import application from './dialog/application.vue'
import { imageNumberApi } from '@/api/image-management'
import { validInteger } from '@/utils/validate'
export default {
  name: 'financingApplicationRecord',
  props: {
    sonData: {
      type: Object,
    },
  },
  components: {
    application,
  },
  // 164014961009111
  data() {
    return {
      formInline: { user: '' },
      advanceAmount: undefined,
      title: '民商信融资申请',
      open: false,
      companyShow: false,
      fromShow: false,
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
      formData: {
        commercialCreditNo: '',
        openCube: '',
        commercialCreditAmt: '',
        fundSide: '',
        availableAmount: '',
        payDay: '',
        dueDays: '',
        fnInterestModel: '',
        fnAmt: '',
        openDate: '',
      },

      disableds: true,
      fundSideList: [], // 所有资金方
      preApplyAmt: '',
      canUsed: '', // 可用金额
      inquiryAllow: true,
    }
  },
  watch: {
    open(val) {
      if (val) {
        this.inquiryAllow = true
        this.fromShow = false
        this.preApplyAmt = ''
        this.getList()
        this.getAvailableLimit()
      }
    },
  },
  mounted: function() {},
  methods: {
    // 查询所有资金方
    getList() {
      getMerListApi().then(res => {
        if (res.code == 200) {
          res.data.forEach(item => {
            imageNumberApi({
              imageNumber: item.merLogo,
              type: 1,
            }).then(res => {
              item.merLogo = window.URL.createObjectURL(res)
            })
          })
          this.fundSideList = res.data
        }
      })
    },
    // 民商信的可用金额
    getAvailableLimit() {
      let params = {
        creditCode: this.sonData.creditCode,
        ownId: this.sonData.ownId,
      }
      getAvailableLimitApi(params).then(res => {
        if (res.code === 200) {
          this.canUsed = Number(res.data)
        }
      })
    },
    // 输入金额路由匹配
    onSubmit() {
      this.inquiryAllow = true
      if (!validInteger(this.preApplyAmt)) {
        this.$message({
          type: 'warning',
          message: '请输入大于0的正整数！',
        })
        return
      }
      if (this.canUsed < this.preApplyAmt) {
        this.$message({
          type: 'warning',
          message: '预借金额大于用借金额，请重新输入！',
        })
        return
      }

      this.fundSideList = []
      chooseMerApi({
        preApplyAmt: this.preApplyAmt,
      }).then(res => {
        if (res.code == 200) {
          if (res.data.merName || res.data.merNo) {
            imageNumberApi({
              imageNumber: res.data.merLogo,
              type: 1,
            }).then(result => {
              this.fundSideList.push(res.data)
              this.fundSideList[0].merLogo = window.URL.createObjectURL(result)
            })
          } else {
            this.$message({
              type: 'warning',
              message: res.msg,
            })
            this.fundSideList = []
          }
          this.inquiryAllow = false
        }
      })
    },
    // 询价申请
    inquiryApplication(item) {
      let params = {
        merName: item.merName,
        merNo: item.merNo,
        preApplyAmt: this.preApplyAmt,
        seqNo: this.sonData.seqNo,
        productCode: '',
        loanCompanyCode: this.fundSideList[0].loanCompanyCode,
        loanCompanySeqNo: this.fundSideList[0].loanCompanySeqNo,
      }
      inquiryApi(params).then(res => {
        if (res.code == 200) {
          this.formData = res.data
          let openDate = this.moment()
            .locale('zh-cn')
            .format('YYYY-MM-DD')
          this.formData.openDate = this.moment(this.formData.payDay).diff(
            this.moment(openDate),
            'days'
          )
          this.fromShow = true
        }
      })
    },
    submitForm() {
      this.fromShow = false
      this.$refs.application.open = true
    },
    cancel() {
      this.open = false
      this.formData = {}
      this.$emit('cancel')
    },
  },
}
</script>

<style lang="scss" scoped>
.list {
  display: flex;
  flex-direction: column;
  .item {
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-radius: 5px;
    border: 1px solid #f0f2f5;
    margin-bottom: 20px;
    .left {
      img {
        width: 80px;
        height: 50px;
      }
    }
    .middle {
      p {
        margin: 10px;
      }
      .title {
        font-size: 20px;
        font-weight: 600;
        color: #000;
      }
      .d1 {
        display: inline-block;
        background-color: #d5e6f4;
        border-radius: 5px;
        color: #4482b6;
        padding: 0px 8px;
        margin-right: 5px;
        height: 30px;
        line-height: 30px;
        font-weight: 600;
      }
      .red {
        .d2 {
          color: #ef2d21;
          font-size: 30px;
          font-weight: 600;
          font-style: italic;
          display: inline-block;
          margin-right: 5px;
        }
        .d3 {
          font-size: 15px;
          color: #ef2d21;
        }
      }
    }
  }
}
</style>
