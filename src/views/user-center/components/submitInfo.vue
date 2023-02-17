<template>
  <div class="card-info">
    <el-form :model="informationForm" ref="informationForm" :rules="rules" label-width="150px">
      <el-form-item label="证件类型" prop="type">
        <el-input
          :disabled="!editInformationFlag"
          size="small"
          style="width: 380px"
          v-model.trim="type"
        ></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input
          :disabled="editInformationFlag"
          size="small"
          style="width: 380px"
          v-model.trim="informationForm.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="身份证" prop="idNo">
        <el-input
          :disabled="editInformationFlag"
          size="small"
          style="width: 380px"
          v-model.trim="informationForm.idNo"
        ></el-input>
      </el-form-item>
      <el-form-item label="民族" prop="nation">
        <el-input
          :disabled="editInformationFlag"
          size="small"
          style="width: 380px"
          v-model.trim="informationForm.nation"
        ></el-input>
      </el-form-item>
      <el-form-item label="住址" prop="address">
        <el-input
          :disabled="editInformationFlag"
          size="small"
          style="width: 380px"
          v-model.trim="informationForm.address"
        ></el-input>
      </el-form-item>
      <el-form-item label="签发机关" prop="issuedBy">
        <el-input
          :disabled="editInformationFlag"
          size="small"
          style="width: 380px"
          v-model.trim="informationForm.issuedBy"
        ></el-input>
      </el-form-item>
      <el-form-item label="有效期" prop="validityPeriod">
        <el-date-picker
          :clearable="false"
          style="width: 380px"
          :disabled="editInformationFlag"
          v-model.trim="informationForm.validityPeriod"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="身份证影像" prop="cardImg">
        <div class="legal-id-pic" style="margin-right: 20px">
          <el-image class="info-image" :src="frontPic">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <div class="el-upload__tip text-center" slot="tip">人像面</div>
        </div>
        <div class="legal-id-pic">
          <el-image class="info-image" :src="backPic">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <div class="el-upload__tip text-center" slot="tip">国徽面</div>
        </div>
      </el-form-item>
      <el-form-item prop="checked">
        <!-- <div><img src="@/" alt="" /></div> -->
        <el-checkbox v-model.trim="informationForm.checked">我已阅读并同意</el-checkbox>
        <span class="c-1890ff cur-pointer m-l-5" @click="getCreditProto">《个人授权书》</span>
      </el-form-item>
      <div class="text-center m-t-10">
        <el-button @click="prev">上一步</el-button>
        <el-button type="primary" @click="next">下一步</el-button>
      </div>
    </el-form>
    <viewContract
      v-if="showContract"
      @hideDialog="hideDialog"
      :contractFile="contractFile"
    ></viewContract>
  </div>
</template>

<script>
import { twoBasicAuthApi, signContractApi } from '@/api/user-center/index'
import { previewContractApi } from '@/api/civil-commercial-credit/financing'
import { imageNumberApi } from '@/api/image-management/index.js'
import { Decrypt, Encrypt } from '@/utils/jsencrypt'
import { getUid } from '@/utils/auth'
import viewContract from '@/views/components/viewContract.vue'
export default {
  props: ['hide', 'nextStep', 'idCardInfo'],
  components: {
    viewContract,
  },
  data() {
    return {
      idNoShow: null, //页面展示的身份证
      frontPic: null,
      backPic: null,
      type: '身份证',
      informationForm: {
        idtype: 1,
        type: null,
        name: null,
        idNo: null,
        nation: null,
        address: null,
        issuedBy: null,
        frontImgUrl: null,
        reverseImgUrl: null,
        validityPeriod: [], //页面展示的时间
        checked: '',
      },
      editInformationFlag: false,
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: ['blur', 'submit'] }],
        idNo: [
          { required: true, message: '请输入身份证', trigger: ['blur', 'submit'] },
          {
            pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
            message: '请输入正确的身份证',
            trigger: ['blur', 'submit'],
          },
        ],
        nation: [{ required: true, message: '请输入名族', trigger: ['blur', 'submit'] }],
        address: [{ required: true, message: '请输入住址', trigger: ['blur', 'submit'] }],
        issuedBy: [{ required: true, message: '请输入签发机关', trigger: ['blur', 'submit'] }],
        validityPeriod: [{ required: true, message: '请选择有效期', trigger: ['blur', 'submit'] }],
        checked: [{ required: true, message: '请阅读协议', trigger: ['change', 'submit'] }],
      },
      showContract: false,
      contractFile: {},
    }
  },
  watch: {},
  created() {
    if (this.idCardInfo.frontImgId) {
      imageNumberApi({ imageNumber: this.idCardInfo.frontImgId, type: 1 }).then(res => {
        this.frontPic = window.URL.createObjectURL(res)
      })
    }
    if (this.idCardInfo.reverImgId) {
      imageNumberApi({ imageNumber: this.idCardInfo.reverImgId, type: 1 }).then(res => {
        this.backPic = window.URL.createObjectURL(res)
      })
    }
    this.showInfo()
  },
  methods: {
    // 反显信息
    showInfo() {
      const {
        name,
        idNo,
        nation,
        address,
        issuedBy,
        frontImgUrl,
        reverseImgUrl,
        frontImgId,
        gender,
      } = this.idCardInfo
      const reverseImgId = this.idCardInfo.reverImgId
      this.informationForm = {
        name,
        idNo,
        nation,
        address,
        issuedBy,
        frontImgUrl,
        reverseImgUrl,
        frontImgId,
        reverseImgId,
        gender,
      }

      if (this.idCardInfo.validityPeriod) {
        this.idCardInfo.validityPeriod = this.idCardInfo.validityPeriod.replaceAll('.', '-')
        if (this.idCardInfo.validityPeriod.indexOf('长期') != -1) {
          this.$set(this.informationForm, 'validityPeriod', [
            this.idCardInfo.validityPeriod.substr(0, 10),
            '2099-12-31',
          ])
        } else {
          this.$set(this.informationForm, 'validityPeriod', [
            this.idCardInfo.validityPeriod.substr(0, 10),
            this.idCardInfo.validityPeriod.substr(11),
          ])
        }
      }
      this.informationForm.idNo = Decrypt(this.informationForm.idNo) //页面展示的身份证
    },
    // 上一步
    prev() {
      this.$emit('hide')
    },
    // 下一步
    next() {
      this.$refs.informationForm.validate(valid => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(this.informationForm))
          const [beginValidityPeriod, endValidityPeriod] = this.informationForm.validityPeriod
          params.idNo = Encrypt(params.idNo)
          params.idtype = params.type = 1
          params.frontImgId = this.informationForm.reverseImgId
          params.reverseImgId = this.informationForm.frontImgId
          params = {
            ...params,
            beginValidityPeriod,
            endValidityPeriod,
          }
          delete params.validityPeriod
          twoBasicAuthApi(params).then(res => {
            if (res.code == 200) {
              signContractApi({ userId: getUid() }).then(() => {
                this.$refs.informationForm.resetFields()
                this.$emit('hide')
                this.$emit('nextStep')
              })
            }
          })
        }
      })
    },
    // 获取个人授权书
    async getCreditProto() {
      let res = await signContractApi({ userId: getUid() })
      if (res.code == 200) {
        this.showContract = true
        this.contractFile = {
          tempCode: 'SQ000010',
        }
      }
    },
    hideDialog() {
      this.showContract = false
    },
  },
}
</script>

<style scoped>
.card-info {
  display: flex;
  justify-content: center;
  width: 800px;
  margin: 0 auto;
}

.info-image {
  width: 180px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
}

.legal-id-pic {
  display: inline-block;
  position: relative;
}
::v-deep .el-checkbox__inner {
  border-radius: 50%;
}
</style>
