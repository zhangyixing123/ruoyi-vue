<template>
  <div class="app-container flex1 over-hidden y-scroll">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="135px"
      class="demo-ruleForm"
      v-if="signProtocol == 1"
    >
      <span class="f-s-24 ">请完善您的审批资料</span>
      <div class="box m-t-10">
        <div class="title">企业信息</div>
        <el-row :gutter="20">
          <el-col :span="10" v-show="ruleForm.entInfo.imgUrl">
            <el-form-item label="" prop="entInfo.enterpriseCertFile">
              <img
                :src="ruleForm.entInfo.imgUrl"
                alt=""
                class="avatar"
                @click="viewImg(ruleForm.entInfo.imgUrl, '营业执照')"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="企业名称" prop="entInfo.enterpriseName">
              <el-input
                v-model.trim="ruleForm.entInfo.enterpriseName"
                disabled
                size="small"
                placeholder="请输入企业名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="统一社会信用代码" prop="entInfo.enterpriseCertNo">
              <el-input
                disabled
                v-model.trim="ruleForm.entInfo.enterpriseCertNo"
                size="small"
                placeholder="请输入统一社会信用代码"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证件有效期" required prop="entInfo.dataRange">
              <el-date-picker
                :clearable="false"
                disabled
                v-model.trim="ruleForm.entInfo.dataRange"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                size="small"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="通讯地址" prop="entInfo.address">
              <div class="flex">
                <el-input
                  size="small"
                  v-model.trim="ruleForm.entInfo.provinceName"
                  class="mr10"
                  disabled
                ></el-input>
                <el-input
                  size="small"
                  v-model.trim="ruleForm.entInfo.cityName"
                  class="mr10"
                  disabled
                ></el-input>
                <el-input
                  size="small"
                  v-model.trim="ruleForm.entInfo.areaName"
                  class="mr10"
                  disabled
                ></el-input>
                <el-input
                  v-model.trim="ruleForm.entInfo.address"
                  size="small"
                  placeholder="请输入街道地址"
                  disabled
                ></el-input>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="职工人数" prop="entInfo.staffNum">
              <el-input
                v-model.trim="ruleForm.entInfo.staffNum"
                size="small"
                placeholder="请输入职工人数"
                maxlength="20"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产总数(万元)" prop="entInfo.assetsAmt">
              <el-input
                v-model.trim="ruleForm.entInfo.assetsAmt"
                size="small"
                placeholder="请输入资产总数"
                maxlength="20"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="营收年收入(万元)" prop="entInfo.turnoverAmt">
              <el-input
                v-model.trim="ruleForm.entInfo.turnoverAmt"
                size="small"
                placeholder="请输入营收年收入"
                maxlength="20"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="box">
        <div class="title">法人信息</div>
        <el-row :gutter="20">
          <el-col>
            <div class="flex">
              <el-form-item
                label=""
                prop="legalInfo.idFrontFileId"
                v-if="ruleForm.legalInfo.frontImgUrl"
              >
                <img
                  :src="ruleForm.legalInfo.frontImgUrl"
                  alt=""
                  class="avatar"
                  @click="viewImg(ruleForm.legalInfo.frontImgUrl, '法人身份证')"
                />
              </el-form-item>

              <el-form-item
                label=""
                prop="legalInfo.idReverseFileId"
                v-if="ruleForm.legalInfo.reverseImgUrl"
              >
                <img
                  :src="ruleForm.legalInfo.reverseImgUrl"
                  alt=""
                  class="avatar"
                  @click="viewImg(ruleForm.legalInfo.reverseImgUrl, '法人身份证')"
                />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="法人姓名" prop="legalInfo.legalUserName">
              <el-input
                disabled
                v-model.trim="ruleForm.legalInfo.legalUserName"
                size="small"
                placeholder="请输入法人姓名"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="身份证号码" prop="legalInfo.idNo">
              <el-input
                disabled
                v-model.trim="ruleForm.legalInfo.idNo"
                size="small"
                placeholder="请输入身份证号码"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证件有效期" required prop="legalInfo.dataRange">
              <el-date-picker
                :clearable="false"
                disabled
                v-model.trim="ruleForm.legalInfo.dataRange"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                size="small"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="户籍地址" prop="legalInfo.address">
              <el-input
                disabled
                v-model.trim="ruleForm.legalInfo.address"
                size="small"
                placeholder="请完善户籍地址"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="法人婚姻状况" prop="legalInfo.maritalStatus">
              <el-select
                v-model.trim="ruleForm.legalInfo.maritalStatus"
                placeholder="请输入法人婚姻状况"
                size="small"
                clearable
                @change="maritalChange(ruleForm.legalInfo.maritalStatus)"
              >
                <el-option
                  v-for="dict in $staticData.marital_status"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="Number(dict.dictValue)"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮箱" prop="legalInfo.email">
              <el-input
                v-model.trim="ruleForm.legalInfo.email"
                size="small"
                placeholder="请输入邮箱"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="box" v-if="ruleForm.legalInfo.maritalStatus == 1">
        <div class="title">法人配偶信息</div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="" label-width="65px" class="labelTxt">
              <span
                >*
                <span class="txt">法人配偶身份证</span>
                请上传正本原件照片(支持png、jpg、jpeg格式)</span
              >
            </el-form-item>
            <div class="flex">
              <el-form-item label="" prop="legalSpouseInfo.idFrontFileId">
                <el-upload
                  action=" "
                  :auto-upload="false"
                  :on-change="
                    (file, frontfileList) => handleImgChange(file, frontfileList, 'idFrontFileId')
                  "
                  :on-remove="
                    (file, frontfileList) => handleRemove(file, frontfileList, 'idFrontFileId')
                  "
                  :file-list="frontList"
                  list-type="picture-card"
                  :limit="1"
                  :class="fronthide ? 'hide' : ''"
                >
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                  <div
                    class="el-upload__tip text-center"
                    slot="tip"
                    :class="fronthide ? 'hide' : ''"
                  >
                    人像面
                  </div>
                </el-upload>
              </el-form-item>
              <el-form-item label="" prop="legalSpouseInfo.idReverseFileId">
                <el-upload
                  action=" "
                  :auto-upload="false"
                  :on-change="
                    (file, fileList) => handleImgChange(file, fileList, 'idReverseFileId')
                  "
                  :on-remove="(file, fileList) => handleRemove(file, fileList, 'idReverseFileId')"
                  :file-list="reverseList"
                  list-type="picture-card"
                  :limit="1"
                  :class="reversehide ? 'hide' : ''"
                >
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                  <div
                    class="el-upload__tip text-center"
                    slot="tip"
                    :class="fronthide ? 'hide' : ''"
                  >
                    国徽面
                  </div>
                </el-upload>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" label-width="65px" class="labelTxt">
              <span
                >*
                <span class="txt">结婚证</span>
                请上传正本原件照片(支持png、jpg、jpeg格式)</span
              >
            </el-form-item>
            <el-form-item label="" prop="legalInfo.marriageCertificate">
              <el-upload
                action=" "
                :auto-upload="false"
                :on-change="
                  (file, fileList) => handleImgChange(file, fileList, 'marriageCertificate')
                "
                :on-remove="(file, fileList) => handleRemove(file, fileList, 'marriageCertificate')"
                :file-list="fileList"
                list-type="picture-card"
                :limit="1"
                :class="marriagehide ? 'hide' : ''"
              >
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="法人配偶姓名" prop="legalSpouseInfo.name">
              <el-input
                v-model.trim="ruleForm.legalSpouseInfo.name"
                size="small"
                placeholder="请输入法人配偶姓名"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="身份证号码" prop="legalSpouseInfo.idNo">
              <el-input
                v-model.trim="ruleForm.legalSpouseInfo.idNo"
                size="small"
                placeholder="请输入身份证号码"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证件有效期" required prop="legalSpouseInfo.dataRange">
              <el-date-picker
                :clearable="false"
                v-model.trim="ruleForm.legalSpouseInfo.dataRange"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                size="small"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="户籍地址" prop="legalSpouseInfo.address">
              <el-input
                v-model.trim="ruleForm.legalSpouseInfo.address"
                size="small"
                placeholder="请输入街道地址"
              ></el-input>
            </el-form-item>
          </el-col>
          <!-- :disabled="
                  !ruleForm.legalSpouseInfo.idFrontFileId ||
                    !ruleForm.legalSpouseInfo.idReverseFileId
                " -->
        </el-row>
      </div>
      <!-- 0 暂存 1 认证通过  2 认证失败 "-->
      <div class="box" v-if="ruleForm.legalCardInfo.status != 1">
        <div class="title">法人银行卡</div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="法人银行卡号" prop="legalCardInfo.bankAccNo">
              <el-input
                v-model.trim="ruleForm.legalCardInfo.bankAccNo"
                size="small"
                placeholder="请输入法人银行卡号"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属银行" prop="legalCardInfo.bankCode">
              <el-select
                v-model.trim="ruleForm.legalCardInfo.bankCode"
                placeholder="请输入所属银行"
                size="small"
                @change="bankcodeChange"
              >
                <el-option
                  v-for="item in bankList"
                  :key="item.bankCode"
                  :label="item.bankName"
                  :value="item.bankCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="银行卡预留手机号" prop="legalCardInfo.mobile">
              <el-input
                v-model.trim="ruleForm.legalCardInfo.mobile"
                size="small"
                placeholder="请输入银行卡预留手机号"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验证码" prop="legalCardInfo.smsCode">
              <el-input
                v-model.trim="ruleForm.legalCardInfo.smsCode"
                size="small"
                placeholder="请输入验证码"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="" label-width="0">
              <el-button
                type="primary"
                size="small"
                :disabled="codeTime > 0"
                @click="getCode"
                class="m-l-10"
                v-hasPermi="['enterprise:legal:card:bindCardSms']"
                >{{ codeTime > 0 ? codeTime + 's后再次发送' : '获取验证码' }}</el-button
              >

              <el-button
                type="primary"
                size="small"
                @click="verifySmsCode"
                :disabled="!smsSendId"
                v-hasPermi="['enterprise:legal:card:verifySmsCode']"
                >提交认证</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="box">
        <div class="title">法人刷脸</div>

        <div class="QRBox" v-if="faceUrl">
          <img :src="faceUrl" class="QRcodeimg" @click="reGetCode" />
          <div v-if="faceStatus == 0" class="f-s-14">
            请使用手机微信扫码完成认证
          </div>
          <div v-if="faceStatus == 2" class="f-s-14">
            认证失败，请重新扫描二维码
          </div>
        </div>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label-width="40px" prop="checked">
              <!-- <div><img src="@/" alt="" /></div> -->
              <el-checkbox v-model.trim="ruleForm.checked">我已阅读并同意</el-checkbox>
              <span v-for="item in contractList" 
              :key="item.tempCode" 
              @click="SeeCreditProto(item)"
              class="c-1890ff cur-pointer m-l-5">{{"《" + item.displayName + "》"}}</span>
              <span class="c-1890ff cur-pointer m-l-5">《个人征信授权书》《企业征信授权书》</span>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="text-center">
        <el-button size="small" type="primary" @click="submitForm">暂存</el-button>
        <el-button size="small" type="primary" @click="applyFn" :disabled="bindStatus"
          >提交</el-button
        >
        <el-button size="small" @click="backList">返回</el-button>
      </div>
    </el-form>
    <div v-if="signProtocol == 2 && outSts == 103" class="type3">
      <img :src="waitUrl" alt="" class="imgSize" />
      <div>处理中</div>
      <el-button size="small" type="primary" @click="backList">返回</el-button>
      <el-dialog
        title="融资提示"
        :visible.sync="centerDialogVisible"
        width="30%"
        :show-close="false"
      >
        <span>你存在未签署完成的协议，请前往完成签署！（{{ time }}）</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="toProtocol2">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div v-if="signProtocol == 3 && outSts == 102" class="type3">
      <!-- <i class="el-icon-circle-close"></i> -->
      <img :src="failUrl" alt="" class="imgSize" />
      <div>申请失败</div>
      <el-button size="small" type="primary" @click="backList">返回</el-button>
    </div>
    <el-dialog
      :modal-append-to-body="false"
      :title="currentImageTitle"
      :visible.sync="showPreviewDialog"
      width="600px"
    >
      <img width="100%" ref="previewImg" :src="dialogImageUrl" alt="" />
    </el-dialog>
    <!-- 预览合同 -->
    <viewContract
      v-if="showContract"
      @hideDialog="hideDialog"
      :contractFile="contractFile"
    ></viewContract>
  </div>
</template>
<script>
import {
  getBankListApi,
  verifySmsCodeApi,
  bindCardSmsApi,
} from '@/api/money-raise-management/index'
import {
  getLegalInfoApi,
  updateEntAndLegalInfoApi,
  creditInfoByFinanceNoApi,
  getZgcContractUrlApi,
  updateZgcCompleteStsApi,
  updateZgcSignContractApi,
  getTempByApplyInfoApi,
} from '@/api/civil-commercial-credit/financing'
import { imageNumberApi } from '@/api/image-management/index.js'
import { faceCallCheckApi, faceCallApi, getFaceTokenApi } from '@/api/user-center/index'
import { OcrIdCardNewApi } from '@/api/user-center/index'
import { uploadApi } from '@/api/image-management'
import { getUid } from '@/utils/auth'
import { getFileUrl } from '@/utils/ruoyi'
import { mapState } from 'vuex'
import { Encrypt, Decrypt } from '@/utils/jsencrypt'
import viewContract from '@/views/components/viewContract.vue'

export default {
  props: {
    financeNo: {
      type: String,
      default: '',
    },
    handleReturn: {
      type: Function,
    },
  },
  components: {
    viewContract,
  },

  data() {
    return {
      ruleForm: {
        // 企业信息
        entInfo: {
          enterpriseCertFile: '', // 营业执照
          enterpriseCertNo: '', // 社会信用代码
          enterpriseName: '', // 企业名称
          provinceName: '', // 企业省
          dataRange: [],
          cityName: '', // 企业市
          areaName: '', // 企业区
          address: '', // 街道地址
          staffNum: '', // 职工人数
          assetsAmt: '', // 资产总额
          turnoverAmt: '', // 经营年收入
          certStartTime: '', //营业执照开始日期
          certEndTime: '', //	营业执照结束日期
          imgUrl: '', // 显示图片
        },
        // 法人信息
        legalInfo: {
          idFrontFileId: '', // 身份证正面文件id
          idReverseFileId: '', // 	身份证反面文件id
          legalUserName: '', // 法人姓名
          idNo: '', // 法人身份证号
          certStartTime: '', //证件有效期
          certEndTime: '', // 证件有效期
          dataRange: [],
          address: '', // 户籍地址
          maritalStatus: '', // 法人婚姻状况
          email: '', // 邮箱

          address: '', // 通讯地址
          marriageCertificate: '', // 结婚证文件id
          frontImgUrl: '',
          reverseImgUrl: '',
        },
        // 法人配偶信息
        legalSpouseInfo: {
          idFrontFileId: '', //	身份证正面文件id
          idReverseFileId: '', //	身份证反面文件id
          name: '', // 姓名
          idNo: '', // 身份证
          dataRange: [],
          certStartTime: '', // 证件有效开始日期
          certEndTime: '', // 证件有效结束日期
          address: '', // 户籍地址
          frontImgUrl: '',
          reverseImgUrl: '',
        },
        // 法人卡信息
        legalCardInfo: {
          bankAccNo: '', //	开户行卡号
          bankName: '', // 开户银行
          mobile: '', // 银行卡预留手机号
          smsCode: '', // 验证码
          bankCode: '', //银行编码
        },
        checked: '',

        contractList:[],// 合同列表
      },
      rules: {
        'entInfo.enterpriseCertFile': [
          { required: true, message: '营业执照不存在', trigger: 'change' },
        ],
        'entInfo.enterpriseName': [{ required: true, message: '企业名称不存在', trigger: 'blur' }],
        'entInfo.enterpriseName': [
          { required: true, message: '社会信用代码不存在', trigger: 'blur' },
        ],
        'entInfo.dataRange': [{ required: true, message: '证件有效期不存在', trigger: 'change' }],
        'entInfo.address': [{ required: true, message: '街道地址不存在', trigger: 'blur' }],
        'entInfo.staffNum': [
          { required: true, message: '请输入职工人数', trigger: 'blur' },
          {
            pattern: /^[1-9]\d*$/,
            message: '请输入正整数',
          },
        ],
        'entInfo.assetsAmt': [
          { required: true, message: '请输入资产总额', trigger: 'blur' },
          {
            pattern: /^[-]?((([1-9]{1}\d*)|([0]{1}))(\.(\d){1,2})?)$/,
            message: '资产总额格式为保留两位小数',
          },
        ],
        'entInfo.turnoverAmt': [
          { required: true, message: '请输入经营年收入', trigger: 'blur' },
          {
            pattern: /^[-]?((([1-9]{1}\d*)|([0]{1}))(\.(\d){1,2})?)$/,
            message: '经营年收入格式为保留两位小数',
          },
        ],
        // 'legalInfo.idFrontFileId': [
        //   { required: true, message: '身份证正面文件不存在', trigger: 'blur' },
        // ],
        // 'legalInfo.idReverseFileId': [
        //   { required: true, message: '身份证反面文件不存在', trigger: 'blur' },
        // ],
        'legalInfo.legalUserName': [{ required: true, message: '法人姓名不存在', trigger: 'blur' }],
        'legalInfo.idNo': [{ required: true, message: '身份证号码不存在', trigger: 'blur' }],
        'legalInfo.dataRange': [{ required: true, message: '证件有效期不存在', trigger: 'change' }],
        'legalInfo.address': [{ required: true, message: '户籍地址不存在', trigger: 'blur' }],
        'legalInfo.maritalStatus': [
          { required: true, message: '请选择法人婚姻状况', trigger: 'submit' },
        ],
        'legalInfo.email': [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur'],
          },
        ],
        'legalSpouseInfo.idFrontFileId': [
          { required: true, message: '请上传身份证人像面', trigger: ['change', 'blur'] },
        ],
        'legalSpouseInfo.idReverseFileId': [
          { required: true, message: '请上传身份证国徽面', trigger: ['change', 'blur'] },
        ],
        'legalInfo.marriageCertificate': [
          { required: true, message: '请上传结婚证', trigger: ['change', 'blur'] },
        ],
        'legalSpouseInfo.name': [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        'legalSpouseInfo.dataRange': [
          { required: true, message: '请选择证件有效期', trigger: 'change' },
        ],
        'legalSpouseInfo.idNo': [
          { required: true, message: '请输入身份证号码', trigger: 'blur' },
          {
            pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
            message: '请输入正确的身份证',
            trigger: ['blur', 'submit'],
          },
        ],
        'legalSpouseInfo.address': [{ required: true, message: '请输入户籍地址', trigger: 'blur' }],
        'legalCardInfo.bankAccNo': [
          { required: true, message: '请输入法人银行卡号', trigger: 'blur' },

          {
            pattern: /^([1-9]{1})(\d{15}|\d{16}|\d{18})$/,
            message: '请输入正确的银行卡号',
            trigger: 'blur',
          },
        ],
        'legalCardInfo.bankCode': [
          { required: true, message: '请选择所属银行', trigger: 'change' },
        ],
        'legalCardInfo.mobile': [
          { required: true, message: '请输入银行卡预留手机号', trigger: 'blur' },
          {
            pattern: /^1[3,4,5,6,7,8,9][0-9]{9}$/,
            message: '请输入正确的手机号',
            trigger: 'blur',
          },
        ],
        'legalCardInfo.smsCode': [{ required: true, message: '请输入验证码', trigger: 'blur' }],
        checked: [{ required: true, message: '请阅读协议', trigger: 'change' }],
      },
      imageUrl: '',
      fileList: [], // 结婚证
      frontList: [], // 配偶身份证正面
      reverseList: [], // 配偶身份证反面
      fronthide: false,
      reversehide: false,
      marriagehide: false,
      status: '',
      signProtocol: 0, // 当前页面显示
      time: 3,
      timer: null,
      centerDialogVisible: false,

      certFileImg: '', //营业执照图片
      codeTime: '',
      codeTimer: null,
      bankList: [], // 银行卡列表
      faceUrl: '', // 刷脸二维码
      faceStatus: 0, //刷脸结果
      smsSendId: '', // 短信id
      faceToken: '', // 刷脸token
      outSts: '', // 外部状态
      failUrl: require('@/assets/images/approvel-fail.png'),
      waitUrl: require('@/assets/images/step-three.png'),
      companyCode: 'zgc_bank',
      businessCode: 'yszk',
      creditApplySeq: '', // 授信申请记录主键
      // 预览图片
      showPreviewDialog: false,
      currentImageTitle: '',
      dialogImageUrl: '',
      bindStatus: true,
      // 协议信息
      showContract: false,
      contractFile: {},
    }
  },
  created() {
    this.getCreditInfo() // 查询授信信息
  },
  beforeDestroy() {
    clearInterval(this.codeTimer)
  },
  computed: {
    ...mapState({
      enterpriseId: state => state.enterprise.enterpriseId,
    }),
  },
  methods: {
    // 判断授信流程下一步做啥
    async getCreditInfo() {
      let params = {
        financeNo: this.financeNo,
      }
      let res = await creditInfoByFinanceNoApi(params)
      if (res.code == 200) {
        this.outSts = res.data.outSts
        this.creditApplySeq = res.data.creditApplySeq
        /**
         * 外部状态101-授信通过，102-授信拒绝，103-授信处理中
         * 内部状态5001000需要调用getZgcContractUrl获取中关村协议签署链接
         * 内部状态8000000则需要完善信息
         */
        if (this.outSts == 103) {
          if (res.data.inSts == 5001000) {
            this.signProtocol = 2
            this.showWarn()
          } else if (res.data.inSts == 8000000) {
            this.signProtocol = 1
            this.getBankList() // 获取银行卡列表
            this.getLegalInfo() // 回显信息
            this.faceCheck() // 获取刷脸url
          } else {
            this.signProtocol = 2
          }
        } else if (this.outSts == 102) {
          this.signProtocol = 3
        }
        // 获取合同列表
        this.getCreditProto();
      }

      
    },
    // 预览图片
    viewImg(url, name) {
      this.dialogImageUrl = url
      this.currentImageTitle = name
      this.showPreviewDialog = true
    },
    // 获取合同列表
    async getCreditProto() {
      let res = await getTempByApplyInfoApi({
        creditApplySeq: this.creditApplySeq,
      })
      if (res.code == 200) {
        let data = res.data || []
        if (data.length > 0) {
          this.contractList = data; 
        }
      }
    },
     
    //查看单个合同
    SeeCreditProto(data){
      this.contractFile = data;
      this.showContract = true;
    },
    // 关闭合同
    hideDialog() {
      this.showContract = false
    },
    // 查询中关村协议签署链接
    async getPrototal() {
      let res = await getZgcContractUrlApi({ financeNo: this.financeNo })
      if (res.code == 200) {
        if (res.data.url) {
          let jumpUrl = window.btoa(
            `${window.location.origin}${window.location.pathname}?from=thirdChannel&merSignSeq=${res.data.merSignSeq}&financeNo=${this.financeNo}`
          )
          window.location.href = `${res.data.url}&appType=webPage&callback=${jumpUrl}`
        }
      }
    },
    // 查询法人信息
    async getLegalInfo() {
      let res = await getLegalInfoApi({ seqNo: this.enterpriseId })
      if (res.code == 200) {
        // 企业信息
        this.ruleForm.entInfo = res.data.entInfo
        this.ruleForm.entInfo.imgUrl = ''
        this.ruleForm.entInfo.dataRange = [
          res.data.entInfo.certStartTime,
          res.data.entInfo.certEndTime,
        ]
        if (this.ruleForm.entInfo.staffNum == 0) this.ruleForm.entInfo.staffNum = ''
        // 法人信息
        this.ruleForm.legalInfo = res.data.legalInfo
        this.ruleForm.legalInfo.idNo = this.ruleForm.legalInfo.idNo
          ? Decrypt(this.ruleForm.legalInfo.idNo)
          : ''
        this.ruleForm.legalInfo.dataRange = [
          res.data.legalInfo.certStartTime,
          res.data.legalInfo.certEndTime,
        ]
        this.ruleForm.entInfo.turnoverAmt = this.ruleForm.entInfo.turnoverAmt
          ? this.ruleForm.entInfo.turnoverAmt / 10000
          : ''
        this.ruleForm.entInfo.assetsAmt = this.ruleForm.entInfo.assetsAmt
          ? this.ruleForm.entInfo.assetsAmt / 10000
          : ''
        // 法人配偶信息
        if (res.data.legalSpouseInfo) {
          this.ruleForm.legalSpouseInfo = res.data.legalSpouseInfo
          this.$set(this.ruleForm.legalSpouseInfo, 'dataRange', [
            res.data.legalSpouseInfo.certStartTime,
            res.data.legalSpouseInfo.certEndTime,
          ])
          this.ruleForm.legalSpouseInfo.idNo = this.ruleForm.legalSpouseInfo.idNo
            ? Decrypt(this.ruleForm.legalSpouseInfo.idNo)
            : ''
        }
        this.getFileImg()
        // 卡信息
        this.bindStatus = res.data.legalCardInfo
          ? res.data.legalCardInfo.status == 1
            ? false
            : true
          : true
        if (res.data.legalCardInfo) {
          this.ruleForm.legalCardInfo = res.data.legalCardInfo
          this.ruleForm.legalCardInfo.bankAccNo = this.ruleForm.legalCardInfo.bankAccNo
            ? Decrypt(this.ruleForm.legalCardInfo.bankAccNo)
            : ''
          this.ruleForm.legalCardInfo.mobile = this.ruleForm.legalCardInfo.mobile
            ? Decrypt(this.ruleForm.legalCardInfo.mobile)
            : ''
        }
      }
    },
    // 查询图片
    async getFileImg(type) {
      let fileIdArr = []
      let entInfo = this.ruleForm.entInfo
      let legalInfo = this.ruleForm.legalInfo
      let legalSpouseInfo = this.ruleForm.legalSpouseInfo
      fileIdArr = [
        { fileId: entInfo.enterpriseCertFile, url: 'enterpriseCertFile' },
        { fileId: legalInfo.legalReversenImg, url: 'legalFrontImg' },
        { fileId: legalInfo.legalFrontImg, url: 'legalReversenImg' },
        { fileId: legalSpouseInfo.idReverseFileId, url: 'idFrontFileId' },
        { fileId: legalSpouseInfo.idFrontFileId, url: 'idReverseFileId' },
        { fileId: legalInfo.marriageCertificate, url: 'marriageCertificate' },
      ]
      if (type == 'legalSpouseInfo') {
        fileIdArr = fileIdArr.slice(3)
      }
      let requestArr = []
      fileIdArr.forEach(v => {
        if (v.fileId) {
          requestArr.push(
            imageNumberApi({
              imageNumber: v.fileId,
              type: 1,
            }).then(res => {
              switch (v.url) {
                // 营业执照
                case 'enterpriseCertFile':
                  this.ruleForm.entInfo.imgUrl = window.URL.createObjectURL(res)
                  break
                // 法人身份证
                case 'legalFrontImg':
                  this.ruleForm.legalInfo.frontImgUrl = window.URL.createObjectURL(res)
                  break
                case 'legalReversenImg':
                  this.ruleForm.legalInfo.reverseImgUrl = window.URL.createObjectURL(res)
                  break
                // 配偶身份证
                case 'idFrontFileId':
                  this.frontList = []
                  this.frontList.push({ url: window.URL.createObjectURL(res) })
                  this.fronthide = true
                  break
                case 'idReverseFileId':
                  this.reverseList = []
                  this.reverseList.push({ url: window.URL.createObjectURL(res) })
                  this.reversehide = true
                  break
                // 结婚证
                case 'marriageCertificate':
                  this.fileList = []
                  this.fileList.push({ url: window.URL.createObjectURL(res) })
                  this.marriagehide = true
                  break
                default:
                  break
              }
              this.$forceUpdate()
            })
          )
        }
      })
      Promise.all(requestArr)
    },

    // 获取银行卡列表
    async getBankList() {
      let res = await getBankListApi({
        businessCode: this.businessCode,
        bindType: this.companyCode,
      })
      if (res.code == 200) {
        this.bankList = res.data
      }
    },
    // 银行卡code改变
    bankcodeChange(code) {
      this.ruleForm.legalCardInfo.bankName = ''
      let bankName = this.bankList.filter(v => v.bankCode == code)
      this.ruleForm.legalCardInfo.bankName = bankName[0].bankName
    },
    // 返回列表页
    backList() {
      this.$emit('handleReturn')
    },
    // 重新申请
    reApply() {
      this.signProtocol = 1
      this.getBankList() // 获取银行卡列表
      this.getLegalInfo() // 回显信息
      this.faceCheck() // 获取刷脸url
    },
    // 获取刷脸图片
    getFileUrl(fileId) {
      this.fileList = []
      imageNumberApi({
        imageNumber: fileId,
        type: 1,
      }).then(res => {
        this.fileList.push({ url: window.URL.createObjectURL(res) })
        this.imageUrl = window.URL.createObjectURL(res)
        this.hide = true
      })
    },
    // 移除图片
    handleRemove(file, fileList, fields) {
      switch (fields) {
        case 'idFrontFileId':
          this.fronthide = false
          this.ruleForm.legalSpouseInfo[fields] = ''
          break
        case 'idReverseFileId':
          this.reversehide = false
          this.ruleForm.legalSpouseInfo[fields] = ''
          break
        case 'marriageCertificate':
          this.marriagehide = false
          this.ruleForm.legalInfo[fields] = ''
          break
        default:
          break
      }
    },
    // 上传图片
    handleImgChange(file, fileList, fields) {
      const allowType = ['image/jpeg', 'image/png']
      const isAllow = allowType.includes(file.raw.type)
      const isLteM = file.size / 1024 / 1024 < 3

      if (!isAllow) {
        this.$message.error('上传文件格式只能是jpg、png、jpeg格式!')
        this.fileList = []
        return false
      }
      if (!isLteM) {
        this.$message.error('上传文件大小不能超过 3MB!')
        this.fileList = []
        return false
      }
      let formData = new FormData()
      formData.append('file', file.raw)
      formData.append('imageTypeNumber', 1)
      uploadApi(formData).then(res => {
        if (res.code == 200) {
          switch (fields) {
            case 'idFrontFileId':
              this.fronthide = true
              this.ruleForm.legalSpouseInfo[fields] = res.data.imageNumber
              this.$refs.ruleForm.clearValidate(`legalSpouseInfo.idFrontFileId`)
              break
            case 'idReverseFileId':
              this.reversehide = true
              this.ruleForm.legalSpouseInfo[fields] = res.data.imageNumber
              this.$refs.ruleForm.clearValidate(`legalSpouseInfo.idReverseFileId`)
              break
            case 'marriageCertificate':
              this.marriagehide = true
              this.ruleForm.legalInfo[fields] = res.data.imageNumber
              this.$refs.ruleForm.clearValidate(`legalInfo.marriageCertificate`)
              break
            default:
              break
          }
        }
        if (
          this.ruleForm.legalSpouseInfo.idFrontFileId &&
          this.ruleForm.legalSpouseInfo.idReverseFileId
        ) {
          this.legalSpouseOcr(
            this.ruleForm.legalSpouseInfo.idFrontFileId,
            this.ruleForm.legalSpouseInfo.idReverseFileId
          )
        }
      })
    },
    // 法人配偶信息ocr
    async legalSpouseOcr(frontImgId, reverseImgId) {
      let res = await OcrIdCardNewApi({
        frontImgId,
        reverseImgId,
      })
      if (res.code == 200) {
        let { name, idNo, address, validityPeriod } = { ...res.data }
        this.ruleForm.legalSpouseInfo.name = name
        this.ruleForm.legalSpouseInfo.idNo = idNo ? Decrypt(idNo) : ''
        this.ruleForm.legalSpouseInfo.address = address
        validityPeriod = validityPeriod.replaceAll('.', '-')

        if (validityPeriod.indexOf('长期') != -1) {
          this.$set(this.ruleForm.legalSpouseInfo, 'dataRange', [
            validityPeriod.substr(0, 10),
            '2099-12-31',
          ])
        } else {
          this.$set(this.ruleForm.legalSpouseInfo, 'dataRange', [
            validityPeriod.substr(0, 10),
            validityPeriod.substr(11),
          ])
        }
        this.$forceUpdate()
      }
    },
    // 获取验证码
    getCode() {
      if (
        !this.ruleForm.legalCardInfo.mobile ||
        !this.ruleForm.legalCardInfo.bankAccNo ||
        !this.ruleForm.legalCardInfo.bankName
      ) {
        this.$message.warning('请完善卡信息')
        return
      }
      let reg = /^1[3,4,5,6,7,8,9][0-9]{9}$/
      let bankReg = /^([1-9]{1})(\d{15}|\d{16}|\d{18})$/
      if (!reg.test(this.ruleForm.legalCardInfo.mobile)) {
        this.$message.warning('手机号格式不正确')
        return
      }
      if (!bankReg.test(this.ruleForm.legalCardInfo.bankAccNo)) {
        this.$message.warning('银行卡格式不正确')
        return
      }
      this.bindStatus = false
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
        }
      }, 1000)
      this.bindCardSms()
    },
    // 获取验证码
    async bindCardSms() {
      let params = JSON.parse(JSON.stringify(this.ruleForm.legalCardInfo))
      params.bankAccNo = Encrypt(params.bankAccNo)
      params.mobile = Encrypt(params.mobile)
      params.adminAuthId = this.ruleForm.legalInfo.seqNo
      params.companyCode = this.companyCode
      params.businessCode = this.businessCode

      let res = await bindCardSmsApi(params)
      this.smsSendId = res.data.smsSendId
    },
    // 刷脸操作
    faceCheck() {
      let params = {
        faceType: 1,
        userId: getUid(),
      }
      // 人脸识别
      faceCallCheckApi(params).then(res => {
        if (res.code == '400') {
          this.type = 'fail'
        } else if (res.code == 200) {
          this.getFaceToken()
        }
      })
    },
    // 获取刷脸token
    async getFaceToken() {
      let params = {
        faceType: 1,
        userId: getUid(),
        callbackUrl: 'http://10.4.1.38:8080/user-center/certification-info',
      }
      let res = await getFaceTokenApi(params)
      if (res.code == 200) {
        this.faceToken = res.data
        this.getFaceUrl(params, res.data)
      }
    },

    // 获取刷脸url
    async getFaceUrl(params, faceId) {
      let urlParams = {
        ...params,
        faceId,
      }
      let res = await faceCallApi(urlParams)
      getFileUrl(res).then(url => {
        this.faceUrl = url
      })
    },
    // 重新获取刷脸二维码
    reGetCode() {
      this.faceCheck()
    },
    // 婚姻状态改变
    async maritalChange(val) {
      if (val != 1) {
        this.ruleForm.legalSpouseInfo = {
          idFrontFileId: '', //	身份证正面文件id
          idReverseFileId: '', //	身份证反面文件id
          name: '', // 姓名
          idNo: '', // 身份证
          dataRange: [],
          certStartTime: '', // 证件有效开始日期
          certEndTime: '', // 证件有效结束日期
          address: '', // 户籍地址
          frontImgUrl: '',
          reverseImgUrl: '',
        }
        this.frontList = this.reverseList = this.fileList = []
      } else {
        let res = await getLegalInfoApi({ seqNo: this.enterpriseId })
        // 法人配偶信息
        if (res.data.legalSpouseInfo) {
          this.ruleForm.legalSpouseInfo = res.data.legalSpouseInfo
          this.$set(this.ruleForm.legalSpouseInfo, 'dataRange', [
            res.data.legalSpouseInfo.certStartTime,
            res.data.legalSpouseInfo.certEndTime,
          ])
          this.ruleForm.legalSpouseInfo.idNo = this.ruleForm.legalSpouseInfo.idNo
            ? Decrypt(this.ruleForm.legalSpouseInfo.idNo)
            : ''
          this.getFileImg('legalSpouseInfo')
        }
      }
    },
    // 提交认证
    async verifySmsCode() {
      if (
        !this.ruleForm.legalCardInfo.mobile ||
        !this.ruleForm.legalCardInfo.bankAccNo ||
        !this.ruleForm.legalCardInfo.smsCode ||
        !this.ruleForm.legalCardInfo.bankName
      ) {
        this.$message.warning('请完善卡信息')
        return
      }
      let reg = /^1[3,4,5,6,7,8,9][0-9]{9}$/
      let bankReg = /^([1-9]{1})(\d{15}|\d{16}|\d{18})$/
      if (!reg.test(this.ruleForm.legalCardInfo.mobile)) {
        this.$message.warning('手机号格式不正确')
        return
      }
      if (!bankReg.test(this.ruleForm.legalCardInfo.bankAccNo)) {
        this.$message.warning('银行卡格式不正确')
        return
      }
      let params = JSON.parse(JSON.stringify(this.ruleForm.legalCardInfo))
      params.bankAccNo = Encrypt(params.bankAccNo)
      params.mobile = Encrypt(params.mobile)
      params.adminAuthId = this.ruleForm.legalInfo.seqNo
      params.companyCode = this.companyCode
      params.businessCode = this.businessCode
      params.smsSendId = this.smsSendId
      let res = await verifySmsCodeApi(params)
      if (res.code == 200) {
        this.bindStatus = false
        this.$message.success('绑卡成功')
      }
    },
    //提交--更新中关村补充信息状态
    applyFn() {
      this.rules.checked = [{ required: true, message: '请阅读协议', trigger: 'change' }]
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          updateZgcCompleteStsApi({
            financeNo: this.financeNo,
            faceToken: this.faceToken,
          }).then(res => {
            if (res.code == 200) {
              this.submitForm('submit')
              /**
               * 外部状态101-授信通过，102-授信拒绝，103-授信处理中
               * 内部状态5001000需要调用getZgcContractUrl获取中关村协议签署链接
               * 内部状态8000000则需要完善信息
               */
              this.outSts = res.data.outSts
              if (this.outSts == 103) {
                if (res.data.inSts == 5001000) {
                  this.signProtocol = 2
                  this.showWarn()
                } else if (res.data.inSts == 8000000) {
                  this.signProtocol = 1
                  this.getBankList() // 获取银行卡列表
                  this.getLegalInfo() // 回显信息
                  this.faceCheck() // 获取刷脸url
                } else {
                  this.signProtocol = 2
                }
              } else if (this.outSts == 102) {
                this.signProtocol = 3
              }
            }
          })
        }
      })
    },
    // 暂存
    submitForm(type) {
      this.rules.checked = []
      let params = JSON.parse(JSON.stringify(this.ruleForm))
      if (params.legalInfo) {
        params.legalInfo.mobile = params.legalInfo.mobile ? Encrypt(params.legalInfo.mobile) : ''
        params.legalInfo.idNo = params.legalInfo.idNo ? Encrypt(params.legalInfo.idNo) : ''
      }
      if (params.legalCardInfo) {
        params.legalCardInfo.bankAccNo = params.legalCardInfo.bankAccNo
          ? Encrypt(params.legalCardInfo.bankAccNo)
          : ''
        params.legalCardInfo.mobile = params.legalCardInfo.mobile
          ? Encrypt(params.legalCardInfo.mobile)
          : ''
      }
      if (params.legalSpouseInfo) {
        params.legalSpouseInfo.idFrontFileId = this.ruleForm.legalSpouseInfo.idReverseFileId
        params.legalSpouseInfo.idReverseFileId = this.ruleForm.legalSpouseInfo.idFrontFileId
        params.legalSpouseInfo.idNo = params.legalSpouseInfo.idNo
          ? Encrypt(params.legalSpouseInfo.idNo)
          : ''
        params.legalSpouseInfo.certStartTime = params.legalSpouseInfo.dataRange[0]
        params.legalSpouseInfo.certEndTime = params.legalSpouseInfo.dataRange[1]
        delete params.legalSpouseInfo.dataRange
      }
      let { assetsAmt, staffNum, turnoverAmt } = params.entInfo
      turnoverAmt = turnoverAmt * 10000
      assetsAmt = assetsAmt * 10000
      let { email, maritalStatus, marriageCertificate } = params.legalInfo
      let {
        bankAccNo,
        bankCode,
        bankName,
        legalUserId,
        mobile,
        smsCode,
        status,
      } = params.legalCardInfo
      let submitParams = {
        entInfo: {
          assetsAmt,
          seqNo: params.entInfo.seqNo,
          staffNum,
          turnoverAmt,
        },
        legalInfo: { email, maritalStatus, marriageCertificate, seqNo: params.legalInfo.seqNo },
        legalCardInfo: {
          bankAccNo,
          bankCode,
          bankName,
          legalUserId,
          mobile,
          seqNo: params.legalCardInfo.seqNo,
          smsCode,
          status,
        },
        legalSpouseInfo: params.legalSpouseInfo,
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          updateEntAndLegalInfoApi(submitParams).then(res => {
            if (res.code == 200) {
              if (type != 'submit') {
                this.$message.success('暂存成功')
              }
            }
          })
        }
      })
    },
    // 协议未签署弹框
    showWarn() {
      this.centerDialogVisible = true
      this.timer = setInterval(() => {
        if (this.time < 2) {
          clearTimeout(this.timer)
          this.signProtocol = 2
          this.centerDialogVisible = false
          this.getPrototal()
        }
        this.time -= 1
      }, 1000)
    },
    // 前往三方签署协议
    toProtocol2() {
      clearTimeout(this.timer)
      this.signProtocol = 2
      this.centerDialogVisible = false
      this.getPrototal()
    },
  },
}
</script>
<style lang="scss" scoped>
.box {
  border: 1px solid #ddd;
  margin-bottom: 30px;
  border-radius: 10px;
  .title {
    font-size: 16px;
    padding: 15px 20px;
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;
  }
}
.default-pwd {
  color: #ff4949;
  width: 200px;
}
.hide {
  ::v-deep .el-upload--picture-card {
    display: none;
  }
  // width: 146px !important;
  // height: 146px !important;
  // line-height: 146px !important;
}
::v-deep .el-upload--picture-card,
::v-deep .el-upload-list__item {
  width: 146px !important;
  height: 146px !important;
  line-height: 146px !important;
}
.avatar {
  width: 146px;
  height: 146px;
  display: block;
  border-radius: 5px;
}
.labelTxt {
  color: #ff4949;
  .txt {
    color: #606266;
  }
}
::v-deep .el-checkbox__inner {
  border-radius: 50%;
}
.type3 {
  text-align: center;
  padding: 80px 0;
  i {
    font-size: 60px;
    color: #606266;
  }
  div {
    color: #333;
    margin: 20px 0 100px;
    font-size: 24px;
  }
  ::v-deep .el-dialog__body,
  ::v-deep .el-dialog__header {
    text-align: left;
  }
  ::v-deep .el-dialog__footer {
    text-align: center;
  }
}
.QRcodeimg {
  width: 200px;
  height: 200px;
}
.QRBox {
  background: #e5f4f8;
  width: 240px;
  height: 260px;
  text-align: center;
  padding: 20px 0;
  margin-left: 40px;
  border-radius: 5px;
  .f-s-14 {
    color: #aaa;
    margin-top: 5px;
  }
}
.imgSize {
  width: 80px;
}
::v-deep .el-upload-list__item .el-icon-close-tip,
::v-deep .el-upload-list__item.is-success .el-upload-list__item-status-label {
  display: none;
}
</style>
