<template>
  <div class="apply-detail">
    <!-- 贷款基本信息 -->
    <div class="item">
      <div class="title">贷款基本信息</div>
      <div class="content">
        <el-form :model="basicForm" ref="basicForm" inline label-width="100px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="贷款合同号" prop="loanNo">
                <el-input
                  disabled
                  v-model.trim="basicForm.loanNo"
                  placeholder="请输入贷款借据号"
                  size="small"
                  style="width: 240px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="贷款借据号" prop="origPrcp">
                <el-input
                  disabled
                  v-model.trim="basicForm.loanNo"
                  placeholder="请输入贷款借据号"
                  size="small"
                  style="width: 240px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="放款金额" prop="productCode">
                <el-input
                  disabled
                  v-model.trim="basicForm.origPrcp"
                  placeholder="请输入放款金额"
                  size="small"
                  style="width: 240px"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="贷款品种" prop="name">
                <el-input
                  disabled
                  v-model.trim="basicForm.productCode"
                  placeholder="请输入贷款品种"
                  size="small"
                  style="width: 240px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客户名称" prop="idNo">
                <el-input
                  disabled
                  v-model.trim="basicForm.name"
                  placeholder="请输入客户名称"
                  size="small"
                  style="width: 240px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="证件号码" prop="osPrcp">
                <el-input
                  disabled
                  v-model.trim="basicForm.maskIdNo"
                  placeholder="请输入证件号码"
                  size="small"
                  style="width: 240px"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="剩余本金" prop="discDIntRate">
                <el-input
                  disabled
                  v-model.trim="basicForm.osPrcp"
                  placeholder="请输入剩余本金"
                  size="small"
                  style="width: 240px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="执行利率" prop="intRate">
                <el-input
                  disabled
                  v-model.trim="basicForm.intRate"
                  placeholder="请输入执行利率"
                  size="small"
                  style="width: 240px"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="借款期限" prop="loanTTL">
                <el-input
                  disabled
                  v-model.trim="basicForm.loanTTL"
                  placeholder="请输入借款期限"
                  size="small"
                  style="width: 240px"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <!-- 主动还款信息 -->
    <div class="item" v-if="debtSts !== 'settled'">
      <div class="title">主动还款信息</div>
      <div class="content">
        <el-form :model="currentRefundForm" ref="currentRefundForm" inline label-width="120px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="还款本金" prop="setlPrcp">
                <el-input
                  v-model.trim="currentRefundForm.setlPrcp"
                  placeholder="请输入还款本金"
                  size="small"
                  style="width: 240px"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="还款利息" prop="setlNormInt">
                <el-input
                  v-model.trim="currentRefundForm.setlNormInt"
                  placeholder="请输入还款利息"
                  size="small"
                  style="width: 240px"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="还款费用" prop="setlFee">
                <el-input
                  v-model.trim="currentRefundForm.setlFee"
                  placeholder="请输入还款费用"
                  size="small"
                  style="width: 240px"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="还款罚息" prop="setlOdInt">
                <el-input
                  v-model.trim="currentRefundForm.setlOdInt"
                  placeholder="请输入还款罚息"
                  size="small"
                  style="width: 240px"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="提前还款手续费" prop="setlPreFee">
                <el-input
                  v-model.trim="currentRefundForm.setlPreFee"
                  placeholder="请输入提前还款手续费"
                  size="small"
                  style="width: 240px"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="还款总金额" prop="setlTotAmt">
                <el-input
                  v-model.trim="currentRefundForm.setlTotAmt"
                  placeholder="请输入还款总金额"
                  size="small"
                  style="width: 240px"
                  @change="
                    val => {
                      handleTotAmtInputChange(val)
                    }
                  "
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="opt-btn">
      <el-button
        type="primary"
        size="mini"
        @click="handleSubmit"
        :disabled="setDisable"
        v-hasPermi="['supplier:repay:save']"
      >
        提交还款
      </el-button>
      <el-button type="primary" size="mini" @click="handleClose"> 关闭 </el-button>
    </div>
    <el-dialog :modal-append-to-body="false" :visible.sync="dialogVisible" width="500px">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
import { voluntaryRepayDetail, repayTrial, saveApply } from '@/api/money-raise-management/index'
import { dictFilter } from '@/utils/filters/common'
export default {
  filters: {
    dictFilter,
  },
  props: {
    loanNo: {
      type: String,
      default: '',
    },
    hidePlan: {
      type: Function,
    },
  },
  data() {
    return {
      // 贷款基本信息
      basicForm: {
        // 贷款借据号
        loanNo: '',
        // 放款款额
        origPrcp: '',
        // 贷款品种
        productCode: '',
        //  客户名称
        name: '',
        // 证件号码
        maskIdNo: '',
        // 剩余本金
        osPrcp: '',
        // 执行利率
        intRate: '',
        // 借款期限
        loanTTL: '',
      },
      // 主动还款信息 -- 当前还款
      currentRefundForm: {
        // 还款本金
        setlPrcp: 0,
        // 还款利息
        setlNormInt: 0,
        // 还款费用
        setlFee: 0,
        // 还款罚息
        setlOdInt: 0,
        // 提前还款手续费
        setlPreFee: 0,
        // 还款总金额
        setlTotAmt: 0,
        setlType: 'overdue',
      },
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      uploadUrl: ``,
      headers: { Authorization: 'Bearer ' + getToken() },
      maxAmount: 0,
      // 申请保存时，需要保存的参数
      dueDt: '',
      releaseMerNo: '',
      userId: '',
      actvDt: '',
      idType: '',
      phoneNo: '',
      idNo: '',
      maskIdNo: '',
      maskPhoneNo: '',
      // 试算结果  应还金额  当输入的转账金额不等于应还金额时，不能进行保存
      actlRepayAmount: 0,
      //   借据待还到期日与系统日期的比较，大于0未到期，等于0到期，小于0已逾期
      billLoading: false,
      // 本次主动还款总金额
      curTransAmt: 0,
      // 第一次试算返回的还款总金额，用来做基准进行比较
      firstTotalAmount: null,
      canSubmit: true,
      // 借据状态
      debtSts: '',
      setlType: '',
      calType: '0',
      isReqRepayTrial: false,
      setDisable: true,
    }
  },
  created() {
    this.fileList = []
    this.getApplicationDetail()
  },
  methods: {
    async getApplicationDetail() {
      const {
        data: {
          //借据状态
          debtSts,
          // 贷款借据号
          loanNo,
          // 放款金额
          origPrcp,
          // 贷款品种
          productCode,
          // 客户名称
          name,
          // 证件号码
          maskIdNo,
          // 剩余本金
          osPrcp,
          // 执行利率
          intRate,
          // 贷款期数
          tnr,
          //  借款期限
          loanTTL,
          // 到期时间
          lmFeeConfigList,
          dIntRat,
          productSeq,
          // 放款日期
          dnDt,
          // 商户号
          releaseMerNo,
          // 到期时间
          lastDueDt,
          idNo,
          // id 类型
          idType,
          // 电话号码
          phoneNo,
          // 证件号码
          maskPhoneNo,
          // userID
          userId,
        },
      } = await voluntaryRepayDetail({ loanNo: this.loanNo })
      this.debtSts = debtSts
      this.basicForm = {
        loanNo,
        origPrcp,
        productCode,
        name,
        maskIdNo,
        osPrcp,
        intRate,
        loanTTL,
        dIntRat,
        tnr,
      }

      this.actvDt = dnDt
      this.releaseMerNo = releaseMerNo
      this.userId = userId
      this.dueDt = lastDueDt
      this.idNo = idNo
      // 证件类型
      this.idType = idType
      // 手机号
      this.phoneNo = phoneNo
      this.maskIdNo = maskIdNo
      this.maskPhoneNo = maskPhoneNo

      // 如果不是结清的借据，才进行试算
      if (this.debtSts !== 'settled') {
        let repayTrialParam = {
          setlType: '',
          calType: '0',
        }
        this.handleRepayTrial(repayTrialParam)
      }
    },
    // 调用试算接口
    async handleRepayTrial(repayTrialParam) {
      if (this.isReqRepayTrial) {
        return
      }
      this.isReqRepayTrial = this.setDisable = true
      try {
        const query = {
          ...repayTrialParam,
          loanNo: this.loanNo,
          setlOrg: 'BACKACTV',
        }
        const {
          data: { prcp, normInt, fee, odInt, preFee, repayAmount, currTnr, setlType },
        } = await repayTrial(query)

        this.setDisable = this.isReqRepayTrial = false

        this.currentRefundForm = {
          setlPrcp: prcp,
          setlNormInt: normInt,
          setlFee: fee,
          setlOdInt: odInt,
          setlPreFee: preFee,
          setlTotAmt: repayAmount,
          currTnr,
          setlType: setlType,
        }
        this.setlType = setlType
        // 只保存第一次试算结果的还款总金额
        if (this.firstTotalAmount === null) {
          this.firstTotalAmount = repayAmount
        }
      } catch (e) {
        this.setDisable = this.isReqRepayTrial = false
        this.firstTotalAmount = 10000000
      }
    },

    handleTotAmtInputChange(val) {
      let repayTrialParam = {
        setlType: this.setlType,
        calType: '1',
        repayAmount: this.currentRefundForm.setlTotAmt,
      }
      this.handleRepayTrial(repayTrialParam)
    },

    handleSubmit() {
      if (!this.canSubmit) {
        this.msgError('服务器异常，请重新填写本次还款金额！')
      } else {
        if (this.currentRefundForm.setlTotAmt > 0) {
          // 保存并提交
          const { origPrcp, osPrcp, dIntRat } = this.basicForm
          const query = {
            // 贷款基本信息
            ...this.basicForm,
            // 主动还款信息
            ...this.currentRefundForm,
            // 还款来源
            setlOrg: 'BACKACTV',
            // 客户主键
            userId: this.userId,
            // 证件类型
            idType: this.idType,
            // 到期时间
            dueDt: this.dueDt,
            // 还款主体/商户号
            releaseMerNo: this.releaseMerNo,
            // 手机号
            maskPhoneNo: this.phoneNo,
            // 放款日期
            actvDt: this.actvDt,
            // 当前还款期数
            pedrdNo: this.currentRefundForm.currTnr,
            currTnr: this.currentRefundForm.currTnr,
            idNo: this.idNo,
            phoneNo: this.phoneNo,
            maskIdNo: this.maskIdNo,
            maskPhoneNo: this.maskPhoneNo,
            custName: this.basicForm.name,
            dnAmt: origPrcp,
            psRemPrcp: osPrcp,
            dIntRat: dIntRat,
            setlTotAmt: this.currentRefundForm.setlTotAmt,
          }
          console.log(query)

          saveApply(query).then(res => {
            res.success &&
              this.$alert('还款申请成功，请及时通知复岗审批还款申请！', '提示', {
                confirmButtonText: '确定',
                callback: () => {
                  this.$emit('hidePlan')
                },
              })
          })
        } else {
          this.msgError('账单金额不能全为0！')
        }
      }
    },
    handleClose() {
      // 关闭页面
      this.$emit('hidePlan')
    },
  },
}
</script>
<style lang="scss" scoped>
.apply-detail {
  width: 100%;
  height: 100%;
  overflow: scroll;
  padding-left: 10px;
  .item {
    width: 100%;
    .title {
      padding: 8px;
      color: #00afff;
      font-size: 18px;
      font-weight: bold;
    }

    .content {
      overflow: hidden;
      padding: 8px;
    }
    .opt-btn {
      display: flex;
      justify-content: center;
    }
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .opt-btn {
    display: flex;
    justify-content: center;
  }
  .max-amount-text {
    color: #ff4949;
  }
}
::v-deep .el-table__row td:last-child {
  padding: 0;
  padding-top: 12px;
}
.warnText {
  color: #ff4949;
  font-size: 12px;
}
.nullLable {
  display: inline-block;
  height: 14px;
  width: 10px;
}
</style>
