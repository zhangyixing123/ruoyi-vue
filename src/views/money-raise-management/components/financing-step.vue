<template>
  <div class="finacing-step">
    <div v-show="!showRepayment && !showResult && !showOpen">
      <div class="step-container">
        <el-steps :active="myActive" align-center finish-status="success" v-if="!hideStepFlag">
          <el-step title="融资申请"> </el-step>
          <el-step title="资质审批"> </el-step>
          <el-step title="放款申请"> </el-step>
          <el-step title="确认提款"> </el-step>
          <el-step title="放款审批"> </el-step>
          <el-step title="银行放款" :status="setStatus"> </el-step>
        </el-steps>
      </div>
      <div class="container" :class="hideStepFlag ? 'clearPadding' : ''">
        <!--融资申请  -->
        <template v-if="myActive === 0">
          <initiate-finance
            :billStatusList="billStatusList"
            :orderStatusList="orderStatusList"
            :selectArr="selectArr"
            @hideDetails="handleReturn"
            @setActive="setActive"
            @hideStep="hideStep"
          ></initiate-finance>
        </template>
        <!--额度审批  -->
        <template v-else-if="myActive === 1">
          <qua-approvel :financeNo="myFinanceNo" @handleReturn="handleReturn"></qua-approvel>
        </template>
        <!--放款申请 -->
        <template v-else-if="myActive === 2">
          <div v-if="!showProtocol">
            <finance-details
              :financeDetails="financeDetails"
              class="m-b-20"
              @btnFlag="btnFlag"
            ></finance-details>
            <div class="btn-group" v-if="!hideButton">
              <el-button
                type="primary"
                v-show="!view"
                @click="handleRayApl"
                v-hasPermi="['supplier:preApplyLoanConfirm:confirm']"
                >放款申请</el-button
              >
              <el-button type="warning" @click="handleReturn">返回</el-button>
            </div>
          </div>
          <div v-else class="protocal">
            <div class="">授权协议确认</div>
            <div class="m-t-20">
              请仔细阅读以下协议，并确认身份完成签署，协议在供应商和核心企业双方签署完成后生效。
            </div>
            <div class="m-t-20">
              <div v-for="item in protopcolList" :key="item.seqNo">
                <el-button
                  v-hasPermi="['supplier:bills:dataAuth:viewContract']"
                  @click="viewProtocalFn(item)"
                  type="text"
                  >《{{ item.comCodeDesc }}》</el-button
                >
              </div>
            </div>
            <div class="flex m-t-20">
              身份确认手机号:{{ protocalPhone
              }}<el-input
                style="width:200px;margin:0 10px"
                size="mini"
                v-model="codeNum"
              ></el-input>
              <el-button
                type="primary"
                size="small"
                :disabled="codeTime > 0"
                @click="getCode"
                class="m-l-10"
                v-hasPermi="['supplier:bills:dataAuth:sendAxqCheckCode']"
                >{{ codeTime > 0 ? codeTime + 's后再次发送' : '获取验证码' }}</el-button
              >
            </div>

            <el-button
              type="primary"
              class="m-t-20"
              v-hasPermi="['supplier:bills:dataAuth:confirmAxqCheckCode']"
              @click="signProtocal"
              :disabled="!codeNum || signBtn"
              >确认并签署</el-button
            >
            <el-button type="warning" @click="handleReturn">返回</el-button>
          </div>
        </template>
        <!-- 确认提款 -->
        <template v-else-if="myActive === 3">
          <finance-details :financeDetails="financeDetails" class="m-b-20"></finance-details>
          <div class="text-center m-t-20">
            <el-button
              type="primary"
              v-show="!view"
              @click="handlePay"
              v-hasPermi="['supplier:preLoanConfirm:confirm']"
              >确认提款</el-button
            >
            <el-button type="warning" @click="handleReturn">返回</el-button>
          </div>
        </template>
        <!-- 供应商放款审批 -->
        <template v-else-if="myActive === 4">
          <div class="btn-group">
            <div v-if="otherView == 10">
              <img :src="waitUrl" alt="" class="imgSize" />
              <div style="margin:40px 0">处理中</div>
            </div>
            <div v-else-if="otherView == 11 || otherView == 15">
              <img :src="failUrl" alt="" class="imgSize" />
              <div style="margin:40px 0">审批退回</div>
            </div>
            <el-button type="warning" @click="handleReturn">返回</el-button>
          </div>
        </template>
        <!-- 银行放款 -->
        <template v-else-if="myActive === 5">
          <div v-if="otherView == 14" class="btn-group">
            <img :src="failUrl" alt="" class="imgSize" />
            <div style="margin:40px 0" class="msg-info">已取消</div>
          </div>
          <finance-details v-else :financeDetails="financeDetails" class="m-b-20"></finance-details>
          <div class="btn-group">
            <el-button type="warning" @click="handleReturn">返回</el-button>
          </div>
        </template>
        <!-- 银行放款 -->
        <!-- <template v-else>
          <div class="msg-container">
            <template v-if="myActive === -1">
              <div class="msg-info" v-if="otherView == '1'">未发起融资</div>
              <div class="msg-info" v-else-if="otherView == '11'">融资已结清</div>
              <div class="msg-info" v-else>融资已取消</div>
              <el-button type="primary" @click="handleReturn">返回</el-button>
            </template>
            <template v-if="myActive === 5">
              <div v-if="otherView == 8">
                <i class="el-icon-time"></i>
                <div class="msg-info">系统放款中，放款成功后，会短信通知您</div>
              </div>
              <div v-if="otherView == 9">
                <i class="el-icon-error"></i>
                <div class="msg-info error-text">
                  放款审批退回
                </div>
              </div>
              <div v-if="otherView == 13">
                <i class="el-icon-error"></i>
                <div class="msg-info error-text">
                  放款失败
                </div>
              </div>
              <el-button type="primary" @click="handleReturn">返回</el-button>
            </template>
            <template v-if="myActive === 6">
              <i class="el-icon-time"></i>
              <div class="msg-info">还款中</div>
              <el-button type="primary" @click="handleReturn">返回</el-button>
            </template>
          </div>
        </template> -->
      </div>

      <!-- dialog公用  active参数区分当前step -->
      <el-dialog
        :modal-append-to-body="false"
        :title="titleList[myActive]"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
        @close="cancalApply"
      >
        <!-- 放款申请 -->
        <template v-if="myActive === 2">
          <el-form
            :model="applyForm"
            class="form-row"
            ref="applyForm"
            :rules="applyRules"
            :inline="true"
          >
            <el-row>
              <el-form-item label="融资编号：">
                <div>{{ applyForm.financeNo }}</div>
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="融资主体：">
                <div>{{ applyForm.companyName }}</div>
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="应收账款金额：">
                <div>{{ '￥' + applyForm.billsAmount + '元' }}</div>
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="可用额度：">
                <div style="color:#5A5ADF">
                  {{ '￥' + applyForm.financeAmount + '元' }}
                </div>
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="放款金额：" prop="repayAmt">
                <el-input
                  type="small"
                  v-model.trim="applyForm.repayAmt"
                  @blur="trialFeeFn"
                ></el-input>
              </el-form-item>
            </el-row>

            <el-row v-if="showFee">
              <el-form-item label="融资期限：">
                <div v-if="applyForm.financeTerm">
                  {{ applyForm.financeTerm + '天' }}
                </div>
              </el-form-item>
            </el-row>

            <el-row v-if="showFee">
              <el-form-item label="到期日：">
                <div>
                  {{ applyForm.dueTime }}
                </div>
              </el-form-item>
            </el-row>

            <el-row v-if="showFee">
              <el-form-item label="单利：">
                <div>
                  {{ interestRate + '%' }}
                </div>
              </el-form-item>
            </el-row>

            <el-row v-if="showFee">
              <el-form-item label="手续费：">
                <div v-if="showFee && applyForm.fee">
                  {{ '￥' + applyForm.fee + '元' }}
                </div>
                <div v-else>
                  {{ '￥0元' }}
                </div>
              </el-form-item>
            </el-row>
            <el-row v-if="showFee">
              <el-form-item label="放款机构：">
                <div>{{ applyForm.loanCompanyFullName }}</div>
              </el-form-item>
            </el-row>
            <el-row v-if="showFee">
              <el-form-item label="还款方式：">
                <div>
                  {{ applyForm.repayMode }}
                  <span class="m-l-20 c-1890ff cur-pointer" @click="repaymentPlayList"
                    >还款计划</span
                  >
                </div>
              </el-form-item>
            </el-row>
            <el-row v-if="applyForm.repayMode != '利随本清' && !applyForm.repayMode && showFee">
              <el-form-item label="还款日：">
                <div>
                  {{ applyForm.repayDay }}
                </div>
              </el-form-item>
            </el-row>

            <el-row v-if="showFee">
              <el-form-item label="收款账户：" class="flex align-center">
                <div v-if="applyForm.accountNo">
                  {{ applyForm.bankName }}({{ applyForm.accountNo }})
                </div>
                <div v-else class="addBtn" @click="addAccount"><span>+</span></div>
              </el-form-item>
            </el-row>

            <!-- <el-row>
              <el-form-item label-width="0px" prop="check">
                <el-checkbox v-model.trim="applyForm.check">我已阅读并同意</el-checkbox>
                <span
                  class="c-1890ff cur-pointer m-l-5"
                  @click="viewPdfFn(item)"
                  v-for="(item, index) in contractList"
                  :key="index"
                  >{{ item.displayName }}</span
                >
              </el-form-item>
            </el-row> -->
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button
              type="primary"
              @click="handleRepay"
              :disabled="!trialFee && !showFee"
              v-hasPermi="['supplier:applyLoan:apply']"
              :loading="loading"
              >申请放款</el-button
            >
            <el-button type="warning" @click="cancalApply">取 消</el-button>
          </span>
        </template>
        <!-- 确认提款 -->
        <template v-else-if="myActive === 3">
          <el-form
            :model="applyForm"
            class="form-row"
            ref="applyForm"
            :rules="applyRules"
            :inline="true"
          >
            <el-row>
              <el-form-item label="融资编号：">
                <div>{{ applyForm.financeNo }}</div>
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="融资主体：">
                <div>{{ applyForm.companyName }}</div>
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="应收账款金额：">
                <div>{{ '￥' + applyForm.billAmount + '元' }}</div>
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="可用金额：">
                <div style="color:#5A5ADF">
                  {{ '￥' + applyForm.financeAmount + '元' }}
                </div>
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="放款金额：" prop="repayAmt">
                <div style="color:#5A5ADF">
                  {{ '￥' + applyForm.financeApplyAmount + '元' }}
                </div>
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="融资期限：">
                <div>
                  {{ applyForm.financeTerm + '天' }}
                </div>
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="到期日：">
                <div>
                  {{ applyForm.dueTime }}
                </div>
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="单利：">
                <div>
                  {{ interestRate + '%' }}
                </div>
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="手续费：">
                <div class="flex">
                  <div>
                    {{ '￥' + applyForm.fee + '元' }}
                  </div>
                  <el-button
                    type="text"
                    class="m-l-20"
                    @click="handlePayAmt"
                    v-hasPermi="['supplier:shoukuanAccount:detail']"
                    v-if="Number(applyForm.fee) != 0"
                    >查看收款账户信息</el-button
                  >
                  <el-button type="text" @click="uploadPz" v-if="Number(applyForm.fee) != 0"
                    >上传缴费凭证</el-button
                  >
                </div>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="放款机构：">
                <div>{{ applyForm.loanCompanyFullName }}</div>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="还款方式：">
                <div>
                  {{ applyForm.repayMode }}
                  <span class="m-l-20 c-1890ff cur-pointer" @click="repaymentPlayList"
                    >还款计划</span
                  >
                </div>
              </el-form-item>
            </el-row>

            <el-row v-if="applyForm.repayMode != '利随本清' && applyForm.repayMode">
              <el-form-item label="还款日：">
                <div>
                  {{ applyForm.repayDay }}
                </div>
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="收款账户：">
                <div>{{ applyForm.bankName }}({{ applyForm.accountNo }})</div>
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label-width="0px" prop="check">
                <el-checkbox v-model.trim="applyForm.check">我已阅读并同意</el-checkbox>
                <span
                  class="c-1890ff cur-pointer m-l-5"
                  @click="viewPdfFn(item)"
                  v-for="(item, index) in contractList"
                  :key="index"
                  >《{{ item.displayName }}》</span
                >
              </el-form-item>
            </el-row>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button
              type="primary"
              @click="handleConfirm"
              v-hasPermi="['supplier:loanDown:confirm']"
              :loading="loading"
              >确认放款</el-button
            >
            <el-button type="warning" @click="cancalApply">取 消</el-button>
          </span>
        </template>
        <!-- 放款审批 -->
        <!-- <template v-else-if="myActive === 4">
          <el-form :model="auditForm" :rules="auditRules" ref="auditForm" label-width="80px">
            <el-row>
              <el-form-item label="审批结果" prop="auditRes">
                <el-radio-group v-model.trim="auditForm.auditRes">
                  <el-radio :label="1">通过</el-radio>
                  <el-radio :label="0">不通过</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="审批备注" prop="remark">
                <el-input
                  type="textarea"
                  show-word-limit
                  maxlength="200"
                  resize="none"
                  v-model.trim="auditForm.remark"
                >
                </el-input>
              </el-form-item>
            </el-row>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleAudit">确 认</el-button>
            <el-button type="warning" @click="handleClose">取 消</el-button>
          </span>
        </template> -->
      </el-dialog>

      <!-- 缴费弹层 -->
      <el-dialog
        :modal-append-to-body="false"
        title="放款申请"
        :visible.sync="showPayInfo"
        class="form-row"
        :center="true"
        width="40%"
      >
        <el-form :model="payInfoForm" :inline="true" label-width="100px">
          <el-row>
            <el-form-item label="手续费：">
              {{ '￥' + applyForm.fee + '元' }}
            </el-form-item>
          </el-row>
          <hr />
          <div style="color:#1890ff; margin:15px 0;">
            请将手续费转账到以下账户
          </div>
          <el-row>
            <el-form-item label="账户名称：">
              <div class="flex">
                <div class="flex-item">{{ payInfoForm.accountName }}</div>
                <el-button type="text" @click="handleCopy(payInfoForm.accountName, $event)"
                  >复制</el-button
                >
              </div>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="账号：">
              <div class="flex">
                <div class="flex-item">{{ payInfoForm.accountNo }}</div>
                <el-button type="text" @click="handleCopy(payInfoForm.accountNo, $event)"
                  >复制</el-button
                >
              </div>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="开户行：">
              <div class="flex">
                <div class="flex-item">{{ payInfoForm.bankName }}</div>
                <el-button type="text" @click="handleCopy(payInfoForm.bankName, $event)"
                  >复制</el-button
                >
              </div>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="开户行支行：">
              <div class="flex">
                <div class="flex-item">{{ payInfoForm.bankRealName }}</div>
                <el-button type="text" @click="handleCopy(payInfoForm.bankRealName, $event)"
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
            3、转账成功后，系统会自动查账，大约等待15分钟。缴费成功后，系统会短信通知您。
          </p>
        </div>
        <span slot="footer" style="text-align:center;">
          <el-button type="primary" @click="showPayInfo = false">返回</el-button>
        </span>
      </el-dialog>
      <!-- 上传缴费凭证弹层 -->
      <el-dialog
        :modal-append-to-body="false"
        title="上传缴费凭证"
        :visible.sync="showUpload"
        class="form-row"
        :center="true"
        width="32%"
      >
        <el-upload
          class="m-l-5"
          ref="uploadImage"
          :multiple="false"
          :auto-upload="false"
          :on-change="uploadFile"
          :on-remove="handleRemove"
          :file-list="fileList"
          list-type="picture-card"
          action=""
          :limit="10"
          v-if="confimFinish"
        >
          <i class="el-icon-plus"></i>
          <div slot="file" slot-scope="{ file }">
            <img :src="file.url" alt="" class="setImg" />
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
        </el-upload>
        <div>
          <ul>
            <li>温馨提示：</li>
            <li>1.请确保上传的文件清晰、可识别；</li>
            <li>2.支持上传pdf、jpg、png、bmp等格式的文件；</li>
            <li>3.单个文件大小不超过10M，最多上传10张；</li>
          </ul>
        </div>
        <span slot="footer" style="text-align:center;">
          <el-button
            type="primary"
            @click="saveAndBack"
            :disabled="isUploading"
            v-hasPermi="['supplier:voucher:batchInsert']"
            >保存并返回</el-button
          >
        </span>
      </el-dialog>
      <input id="copyNode" type="hidden" />
    </div>
    <!-- 还款计划 -->
    <repayment-plan v-if="showRepayment" :playList="playList" @hidePlan="hidePlan"></repayment-plan>
    <!-- 结果页 -->
    <result v-if="showResult" :resultType="resultType" @hideResult="hideResult"></result>
    <!-- 预览合同 -->
    <viewContract
      v-if="showContract"
      @hideDialog="hideDialog"
      :contractFile="contractFile"
      :lessTime="lessTime"
      :fileType="fileType"
      :mySeqno="mySeqno"
    ></viewContract>
    <!-- 开通电子户 -->
    <openDzh v-if="showOpen" @hideAccount="hideAccount"></openDzh>
    <!-- 放款申请协议 -->
    <el-dialog
      :modal-append-to-body="false"
      class="text-center"
      :visible.sync="viewVisible"
      width="1200px"
      top="5vh"
    >
      <iframe :src="pdfSrc" frameborder="0" width="100%" height="700px"></iframe>
    </el-dialog>
    <!-- 确认放款协议签署 -->
    <div class="type3">
      <el-dialog title="融资提示" :visible.sync="tikuanDialog" width="30%" :show-close="false">
        <span
          >根据放款机构-北京中关村银行要求，您需要独立完成签署以下合同协议，请确认前往完成签署！</span
        >
        <dir v-for="(item, index) in signFileList" :key="index">
          <span style="color:#222">《{{ item.eapplyTypeName }}》- {{ item.eapplyStateName }}</span>
        </dir>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="toSignPrototal">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// FIXME:引入顺序，先引入npm包，再是绝对路径，最后是相对路径
import copyText from '@/utils/copy'
import financingInfo from './financing-info.vue'
import financingProcess from './financing-process.vue'
import { validInteger } from '@/utils/validate'
import repaymentPlan from './repayment-plan.vue'
import result from './result.vue'
import {
  getFinanceDetailsApi,
  feeTrialApi,
  applyLoanApi,
  preLoanConfirmApi,
  loanDowmApi,
  billDetailsAttachApi,
  batchInsertApi,
  deleteFileApi,
  shoukuanAccountApi,
  getTempCodeApi,
  querySComCodeApi,
  getPhoneNumber,
  apporveDialogSendAxqCheckCode,
  viewContractApi,
  confirmAxqCheckCodeApi,
  checkAxqUserIdApi,
  checkSignPowerApi,
} from '@/api/money-raise-management'
import { voucherList } from '@/api/order-management/index'
import { uploadAndGetUrlApi, imageNumberApi } from '@/api/image-management'

import viewContract from '../../components/viewContract.vue'
import financeDetails from './finance-details.vue'
import quaApprovel from '@/views/order-management/component/qua-approvel.vue'
import openDzh from '@/views/bank-account-manage/open-dzh.vue'
import initiateFinance from '@/views/order-management/component/finance.vue'
import pdf from 'vue-pdf'
export default {
  name: 'finacing-step',
  components: {
    'financing-info': financingInfo,
    'financing-process': financingProcess,
    'repayment-plan': repaymentPlan,
    result: result,
    viewContract,
    financeDetails,
    quaApprovel,
    openDzh,
    'initiate-finance': initiateFinance,
    pdf,
  },
  mixins: [],
  props: {
    active: {
      type: Number,
      default: 1,
    },
    view: {
      type: Boolean,
      default: false,
    },
    seqNo: {
      type: String,
      default: '',
    },
    otherView: {
      type: String,
      default: '',
    },
    financeNo: {
      type: String,
      default: '',
    },
    loanNo: {
      type: String,
      default: '',
    },
    selectArr: {
      type: Array,
    },
    billStatusList: {
      type: Array,
    },
    orderStatusList: {
      type: Array,
    },
  },
  data() {
    var validateRepayAmt = (rule, value, callback) => {
      if (!value) {
        callback('放款金额不能为空！')
      } else {
        if (value <= 0) {
          callback('金额必须大于0！')
        } else if (Number(value) > Number(this.applyForm.auditAmt)) {
          callback('放款金额不能大于审批金额！')
        } else {
          callback()
        }
      }
    }

    var validateCheck = (rule, value, callback) => {
      if (!value) {
        callback('后续操作需勾选协议！')
      } else {
        callback()
      }
    }
    return {
      status: 'waiting',
      titleList: {
        2: '放款申请',
        3: '确认放款',
        4: '审批',
      },
      applyForm: {
        check: '',
      },
      applyRules: {
        repayAmt: [
          {
            validator: validateRepayAmt,
            trigger: ['blur', 'change'],
          },
        ],
        check: [
          {
            validator: validateCheck,
            trigger: ['change'],
          },
        ],
      },
      dialogVisible: false,
      /**审批 */
      auditForm: {
        auditRes: '',
        remark: '',
      },
      auditRules: {
        auditRes: [
          {
            required: true,
            message: '请选择审批操作！',
            trigger: ['blur', 'change'],
          },
        ],
        remark: [
          {
            required: true,
            message: '请填写审批备注！',
            trigger: ['blur', 'change'],
          },
        ],
      },

      /**缴费 */
      payInfoForm: {},

      showPayInfo: false,
      showUpload: false, // 上传缴费凭证
      fileList: [], // 文件展示
      diyFileList: [], // 提交的文件数据
      financeDetails: {}, // 融资详情
      trialFee: false,
      showFee: false, // 授信费字段
      submitParams: [],
      isUploading: false, // 上传中
      showRepayment: false, // 是否展示还款计划
      playList: [], // 还款计划
      resultType: '', // 结果类型
      showResult: false, // 显示结果页
      uploaderFile: [], // 查看是否有时间啊描绘出件的文件
      confimFinish: true, // 操作文件是否结束
      pdfImg: require('@/assets/images/pdf.png'),
      waitUrl: require('@/assets/images/step-three.png'),
      failUrl: require('@/assets/images/approvel-fail.png'),
      imgUrl11: '',
      /**确认提款合同 */
      contractList: [], //合同列表
      contractFile: {},
      showContract: false,
      lessTime: 0,
      isReadFinish: false,
      showProtocol: false, //放款申请 协议
      hideButton: false, // 放款申请按钮
      showOpen: false, //开通电子户
      protopcolList: [], // 申请放款协议内容
      protocalPhone: '', // 协议手机号
      codeTime: '', // 定时器
      codeTimer: null, // 定时器
      viewVisible: false, // 放款申请协议弹层
      pdfSrc: '', // 放款申请协议src
      numPages: 0, // 放款申请协议num
      codeNum: '', // 验证码
      signBtn: false, // 签署按钮
      hideStepFlag: false, // 隐藏步骤条
      myActive: '',
      mySeqno: '',
      myFinanceNo: '',
      tikuanDialog: false, // 确认提款亲属合同弹框
      timer: null, // 三方协议定时器
      time: 3,
      protopcolUrl: '', // 三方协议url
      setStatus: '', // 步骤条最后的状态
      showIrr: '',
      interestRate:'',
      loading: false,
      signFileList: [], // 确认借款合同
    }
  },
  computed: {},
  watch: {
    showUpload() {
      this.submitParams = []
    },
    dialogVisible() {
      this.trialFee = false
    },
  },

  filters: {},
  created() {
    this.myActive = this.active
    this.mySeqno = this.seqNo
    this.myFinanceNo = this.financeNo
    if (this.myActive == 3) {
      this.viewContract()
    }
    if (this.myActive != 0) this.getDetails()
    if (this.otherView == 5) {
      this.checkSignPower()
    }
    if (this.otherView == 12 || this.otherView == 13) this.setStatus = 'success'
  },
  beforeDestroy() {
    clearInterval(this.codeTimer)
  },
  methods: {
    /**添加账户 */
    addAccount() {
      this.showOpen = true
    },
    /**异常添加账户 */
    hideAccount() {
      this.showOpen = false
      this.dialogVisible = true
      this.trialFeeFn()
    },
    /**放款申请 */
    handleRayApl() {
      let { financeNo, companyName, billsAmount, financeAmount } = this.financeDetails
      this.applyForm = {
        financeNo,
        companyName,
        billsAmount,
        financeAmount,
      }
      this.myFinanceNo = financeNo
      this.dialogVisible = true
    },
    /**根据放款金额试算手续费 */
    trialFeeFn() {
      this.showFee = this.trialFee = false
      if (!validInteger(this.applyForm.repayAmt)) {
        this.$message({
          type: 'error',
          message: '请输入正整数！',
        })
        return
      }
      let minNum = Math.min(
        Number(this.applyForm.billsAmount),
        Number(this.applyForm.financeAmount)
      )
      if (Number(this.applyForm.repayAmt) > minNum) {
        this.$message({
          type: 'error',
          message: '放款金额不能大于可用额度和账单金额！',
        })
        return
      }
      feeTrialApi({
        financeApplyAmount: this.applyForm.repayAmt,
        seqNo: this.mySeqno,
        deptId: '',
      }).then(res => {
        if (res.code === 200) {
          let {
            financeTerm,
            dueTime,
            accountNo,
            bankName,
            repayMode,
            shdList,
            loanCompanyName,
            fee,
            accountType,
            irryearRate,
            interestRate,
            feeRate,
            loanCompanyFullName
          } = res.data
          this.applyForm = {
            ...this.applyForm,
            financeTerm,
            dueTime,
            irryearRate,
            interestRate,
            accountNo,
            bankName,
            repayMode,
            loanCompanyName,
            fee,
            accountType,
            feeRate,
            loanCompanyFullName
          }
          this.showIrr = this.percentage(this.applyForm.irryearRate)
          this.interestRate = this.percentage(this.applyForm.interestRate)
          this.playList = shdList
          this.showFee = this.trialFee = true
        }
      })
    },
    /**百分数精度计算 */
    percentage(val) {
      const strVal = val.toString()
      const index = strVal.indexOf('.')
      let num = 0
      if (index > -1) {
        num = strVal.length - 1 - index
      }
      if (num > 2) {
        return Math.round(val * Math.pow(10, num)) / Math.pow(10, num - 2)
      } else {
        return Math.round(val * 100)
      }
    },

    /**显示隐藏放款申请按钮 */
    btnFlag(data) {
      this.hideButton = data
    },
    /** 获取审批弹框协议*/
    async getProtopcolList() {
      let res = await querySComCodeApi('ACCOUNT_CHANGE_AGREEMENT')
      this.protopcolList = res.data
    },
    /**获取协议手机号getPhoneNumber */
    async getProtopcolPhone() {
      let res = await getPhoneNumber({
        financingOrderSeq: this.myFinanceNo,
        userType: 1,
      })
      if (res.code == 200) {
        this.protocalPhone = res.data
      }
    },
    /**判断是否需要签署协议 */
    async checkSignPower() {
      let res = await checkSignPowerApi({
        financingOrderSeq: this.myFinanceNo,
        userType: 1,
      })
      if (!res.data) {
        this.showProtocol = true // 合同待签署
        this.getProtopcolList()
        this.getProtopcolPhone()
      } else {
        this.showProtocol = false // 合同待签署
      }
    },
    /**获取验证码 */
    getCode() {
      this.codeTime = 60
      if (this.codeTimer) {
        clearInterval(this.codeTimer)
        this.codeTimer = null
      }
      this.codeTimer = setInterval(() => {
        this.codeTime--
        if (this.codeTime <= 0) {
          clearInterval(this.codeTimer)
          this.codeTimer = null
          this.codeTime = ''
        }
      }, 1000)
      apporveDialogSendAxqCheckCode({
        financingOrderSeq: this.myFinanceNo,
        userType: 1,
      }).then(res => {
        if (res.code == 200) {
          this.$message.success('发送成功')
        }
      })
    },
    /**签署协议 */
    signProtocal() {
      this.signBtn = true
      confirmAxqCheckCodeApi({
        financingOrderSeq: this.myFinanceNo,
        userType: 1,
        checkCode: this.codeNum,
      })
        .then(res => {
          if (res.code == 200) {
            this.$message.success('操作成功')
            this.$emit('return', false)
          }
          this.signBtn = false
        })
        .catch(() => {
          this.signBtn = false
        })
    },
    /**预览申请放款合同 viewContractApi*/
    async viewProtocalFn(item) {
      let res = await viewContractApi({
        financingOrderSeq: this.myFinanceNo,
        templateId: item.comCode,
      })
      this.viewVisible = true
      const href = window.URL.createObjectURL(res)
      this.pdfSrc = href
    },
    getObjectURL(file) {
      let url = null
      if (window.createObjectURL !== undefined) {
        // basic
        url = window.createObjectURL(file)
      } else if (window.webkitURL !== undefined) {
        // webkit or chrome
        try {
          url = window.webkitURL.createObjectURL(file)
        } catch (error) {
          console.log(error)
        }
      } else if (window.URL !== undefined) {
        // mozilla(firefox)
        try {
          url = window.URL.createObjectURL(file)
        } catch (error) {
          console.log(error)
        }
      }
      return url
    },
    // 申请放款
    handleRepay() {
      // this.$message.warning('您好，您暂时没有签署权限，请到交建中台完成实名认证。')
      this.$refs.applyForm.validate(valid => {
        this.loading = true
        if (valid) {
          checkAxqUserIdApi()
            .then(res => {
              if (res.code == 200) {
                this.applyLoan()
              }
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    /**申请放款 */
    applyLoan() {
      applyLoanApi({
        financeApplyAmount: this.applyForm.repayAmt,
        seqNo: this.mySeqno,
        deptId: '',
        fee: this.applyForm.fee || '',
        accountType: this.applyForm.accountType || '',
        dueTime: this.applyForm.dueTime || '',
        financeTerm: this.applyForm.financeTerm || '',
        irryearRate: this.applyForm.irryearRate || '',
        feeRate: this.applyForm.feeRate || '',
      })
        .then(res => {
          if (res.code == 200) {
            this.showProtocol = true
            this.dialogVisible = false
            this.getProtopcolList()
            this.getProtopcolPhone()
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 查看详情
    getDetails() {
      getFinanceDetailsApi(this.mySeqno).then(res => {
        if (res.code === 200) {
          this.financeDetails = res.data
          // 判断放款是否签了合同
          if (
            res.data.econtractURLQueryRes &&
            JSON.stringify(res.data.econtractURLQueryRes) != '{}'
          ) {
            if (res.data.econtractURLQueryRes.url) {
              this.protopcolUrl = res.data.econtractURLQueryRes.url
              this.signFileList = res.data.econtractURLQueryRes.zgcContractSignRecordList || []
              this.tikuanDialog = true
            }
          }
        }
      })
    },
    // 上传
    uploadPz() {
      this.fileList = []
      this.showUpload = true
      this.getUploaderFile()
    },
    // 查看已上传的文件
    getUploaderFile() {
      this.confimFinish = false
      let params = {
        attachType: '3',
        attachNo: this.mySeqno,
        pageSize: 10,
        pageNum: 1,
      }
      billDetailsAttachApi(params).then(res => {
        if (res.code == 200) {
          this.fileList = this.diyFileList = this.uploaderFile = res.data.rows || []
          if (this.showUpload) {
            var requestArr = []
            this.fileList.forEach(item => {
              if (item.fileSuffix === 'pdf') {
                item.url = this.pdfImg
              } else {
                requestArr.push(
                  imageNumberApi({
                    imageNumber: item.fileNo,
                    type: 1,
                  }).then(res => {
                    item.url = window.URL.createObjectURL(res)
                  })
                )
              }
            })
            Promise.all(requestArr).then(() => {
              this.confimFinish = true
            })
          }
        }
      })
    },
    // 展示还款计划
    repaymentPlayList() {
      this.showRepayment = true
    },
    // 隐藏还款计划
    hidePlan(data) {
      this.showRepayment = false
    },
    // 隐藏结果页
    hideResult() {
      this.$emit('return', false)
    },

    // 取消申请放款
    cancalApply() {
      this.showFee = this.applyForm.check = this.dialogVisible = false
      this.$refs.applyForm.resetFields()
    },
    /**上传 */
    async uploadFile(file) {
      this.diyFileList.push(file)
      const isJPG =
        file.raw.type === 'image/jpeg' ||
        file.raw.type === 'image/png' ||
        file.raw.type === 'image/bmp' ||
        file.raw.type === 'application/pdf'
      const isLt10M = file.raw.size / 1024 / 1024 < 10

      if (!isJPG) {
        this.diyFileList.pop()
        this.$message.error('请上传jpg、png、pdf、bmp类型的文件')
        return false
      }
      if (!isLt10M) {
        this.diyFileList.pop()
        this.$message.error('请上传小于10M的文件')
        return false
      }
      if (file.raw.type == 'application/pdf') {
        file.url = this.pdfImg
      }
      this.isUploading = true
      let pointIndex = file.name.lastIndexOf('.')
      let fileSuffix = file.name.substr(pointIndex + 1)
      let formData = new FormData()
      formData.append('file', file.raw)
      formData.append('imageTypeNumber', '6')

      let res = await uploadAndGetUrlApi({
        file: file.raw,
        imageTypeNumber: '1',
        showType: '0',
      })
      this.submitParams.push({
        attachType: '3',
        attachNo: this.mySeqno,
        fileType: '6',
        fileNo: res.imageNumber,
        fileName: file.name,
        fileSize: file.size,
        fileSuffix: fileSuffix,
        remark: '',
        uploader: '',
        uid: file.uid,
      })
      this.isUploading = false

      // this.fileList = this.diyFileList
    },
    handleRemove(file, fileList) {
      if (file.seqNo) {
        deleteFileApi(file.seqNo).then(res => {
          if (res.code === 200) {
            this.getUploaderFile()
          }
        })
      } else {
        this.diyFileList.forEach((item, index) => {
          if (item.uid == file.uid) {
            this.diyFileList.splice(index, 1)
          }
        })
      }
      this.submitParams.forEach((item, index) => {
        if (item.uid == file.uid) {
          this.submitParams.splice(index, 1)
        }
      })
    },
    // 保存并返回  上传凭证
    saveAndBack() {
      if (this.submitParams.length > 0) {
        batchInsertApi(this.submitParams).then(res => {
          if (res.code === 200) {
            this.showUpload = false
            this.fileList = []
          }
        })
      } else {
        this.showUpload = false
        this.fileList = []
      }
    },
    // 计算最小阅读时间
    countLessTime() {
      let timeArr = []
      let lessTimeArr = []
      timeArr = this.contractList.filter(v => {
        return v.forceReadTime > 0
      })
      if (timeArr.length > 0) {
        timeArr.forEach(item => {
          lessTimeArr.push(item.forceReadTime)
        })
        this.lessTime = Math.min(...lessTimeArr)
      }
    },
    // 查看确认提款合同
    viewContract() {
      getTempCodeApi({
        loanNo: this.loanNo,
      }).then(res => {
        if (res.code == 200) {
          this.contractList = res.data
          // this.countLessTime(this.contractList)
        }
      })
    },
    viewPdfFn(item) {
      this.isReadFinish = false
      this.contractFile = item
      this.fileType = 'loan'
      this.showContract = true
    },
    hideDialog(data) {
      this.contractFile = {}
      this.showContract = false
      if (data) this.isReadFinish = true
    },
    // 确认放款
    handleConfirm() {
      this.$refs.applyForm.validate(valid => {
        this.loading = true
        if (valid) {
          // if (!this.isReadFinish) {
          //   this.$message({
          //     type: 'warning',
          //     message: '阅读协议时间不足',
          //   })
          //   return false
          // }
          if (this.uploaderFile.length == 0 && Number(this.applyForm.fee) != 0) {
            this.$message({
              type: 'warning',
              message: '请先上传缴费凭证!',
            })
            this.loading = false
          } else {
            loanDowmApi(this.mySeqno)
              .then(res => {
                if (res.code == 200) {
                  this.dialogVisible = false
                  this.getDetails()
                  // if (res.data.url) {
                  //   let jumpUrl = window.btoa(
                  //     `${window.location.origin}${window.location.pathname}`
                  //   )
                  //   window.location.href = `${res.data.url}&appType=webPage&callback=${jumpUrl}`
                  // }
                }
                this.loading = false
              })
              .catch(() => {
                this.loading = false
              })
          }
        }
      })
    },
    /**确认提款签署协议 */
    toSignPrototal() {
      let jumpUrl = window.btoa(`${window.location.origin}${window.location.pathname}`)
      window.location.href = `${this.protopcolUrl}&appType=webPage&callback=${jumpUrl}`
    },
    /**审批 打开审批弹窗 */
    handleOpenAudit() {
      this.dialogVisible = true
    },

    handleAudit() {
      this.$refs.auditForm.validate(valid => {
        if (valid) {
          this.$prompt('输入ukey密码', '输入ukey密码', {
            inputType: 'password',
            inputValidator: value => {
              return value ? true : false
            },
            inputErrorMessage: 'ukey密码不能为空',
            confirmButtonText: '确定',
            closeOnClickModal: false,
          }).then(({ value }) => {
            this.$message({
              message: '审批完成',
              duration: 1500,
              type: 'success',
              onClose: () => {
                this.dialogVisible = false
                this.$refs.auditForm.resetFields()
                this.handleReturn()
              },
            })
          })
        }
      })
    },
    preLoanConfirm() {},
    /**确认提款 */
    handlePay() {
      preLoanConfirmApi(this.mySeqno).then(res => {
        this.applyForm = res.data
        this.showIrr = this.percentage(this.applyForm.irryearRate)
        this.interestRate = this.percentage(this.applyForm.interestRate)
        this.playList = res.data.shdList //还款计划
        this.applyForm.repayAmt = res.data.financeAmount
        this.dialogVisible = true
        this.$set(this.applyForm, 'check', false)
      })
      this.getUploaderFile()

      // this.applyForm.repayAmt = '50000000'
    },

    /**查看收款账户信息 */
    handlePayAmt() {
      shoukuanAccountApi(this.myFinanceNo).then(res => {
        if (res.code === 200) {
          this.payInfoForm = res.data
          this.showPayInfo = true
        }
      })
    },

    /**复制 */
    handleCopy(text, ev) {
      copyText(text, ev)
    },

    handleClose() {
      this.close()
    },

    close() {
      this.dialogVisible = false
      if (this.$refs.auditForm) this.$refs.auditForm.resetFields()
      if (this.$refs.applyForm) this.$refs.applyForm.resetFields()
    },

    /**返回列表页 */
    handleReturn() {
      this.$emit('return', false)
    },
    /**设置激活页 */
    setActive(data) {
      this.myActive = data.active
      this.mySeqno = data.seqNo
      this.myFinanceNo = data.financeNo
      this.getDetails()
    },
    /**异常步骤条 */
    hideStep(data) {
      this.hideStepFlag = data
    },
  },
}
</script>

<style lang="scss" scoped>
.step-container {
  margin: 10px 30px 0;
  border-radius: 8px;
  background: #fff;
  padding: 10px;
}

.container {
  margin: 30px;
  background: #fff;
  border-radius: 20px;
  padding: 20px;
  .btn-group {
    margin: 0 auto;
    text-align: center;
  }
}
.msg-container {
  min-height: 70vh;
  padding-top: 100px;
  text-align: center;
  .msg-info {
    margin: 50px 0;
  }

  .error-text {
    color: #d9001b;
  }
}

.el-icon-error {
  color: #d9001b;
  font-size: 80px;
}

.el-icon-time {
  color: #1899dc;
  font-size: 80px;
}

.form-row ::v-deep .el-row > .el-form-item {
  margin-bottom: 10px;
}

.flex-item {
  width: 260px;
}
li {
  list-style-type: none;
}
::v-deep .el-upload--picture-card,
::v-deep .el-upload-list--picture-card .el-upload-list__item {
  width: 100px;
  height: 100px;
  line-height: 100px;
}
::v-deep .el-upload-list--picture-card .el-upload-list__item-actions .el-upload-list__item-preview {
  display: none;
}
::v-deep .el-upload-list--picture-card .el-upload-list__item-actions .el-upload-list__item-delete {
  margin-left: 0px;
}
::v-deep .el-upload--picture-card i {
  font-size: 20px;
}
::v-deep .el-upload-list--picture-card .el-upload-list__item .el-icon-check {
  display: none;
}
.setImg {
  width: 100px;
  height: 100px;
  line-height: 100px;
}
::v-deep .el-form-item__error {
  width: 200px;
}
::v-deep .el-dialog__footer {
  text-align: center;
}
.protocal {
  padding: 20px 10%;
  & > div:first-child {
    font-weight: bold;
    font-size: 20px;
  }
}
.addBtn {
  width: 20px;
  height: 20px;
  color: #fff;
  background: #1899dc;
  border-radius: 50%;
  line-height: 20px;
  text-align: center;
  font-size: 20px;
  margin-top: 7px;
  cursor: pointer;
}
.clearPadding {
  padding: 0px !important;
  margin: 0 !important;
}
::v-deep .el-checkbox__inner {
  border-radius: 50%;
}
.imgSize {
  width: 80px;
}
</style>
