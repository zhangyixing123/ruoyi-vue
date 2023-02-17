<template>
  <div class="app-container flex1 over-hidden y-scroll">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="140px"
      class="demo-ruleForm"
    >
      <div class="box">
        <div class="title">企业基本信息</div>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="" label-width="65px" class="labelTxt">
              <span
                >*
                <span class="txt">营业执照</span> 请上传正本原件照片(支持png、jpg、jpeg格式)</span
              >
            </el-form-item>
            <el-form-item label="" prop="fileId">
              <el-upload
                v-if="type != 'view'"
                action=" "
                :auto-upload="false"
                :on-change="(file, fileList) => handleImgChange(file, fileList)"
                :on-remove="(file, fileList) => handleRemove(file, fileList)"
                :file-list="fileList"
                list-type="picture-card"
                :limit="1"
                :class="hide ? 'hide' : ''"
              >
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <img v-if="type == 'view' && imageUrl" :src="imageUrl" alt="" class="avatar" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="企业名称" prop="enterpriseName">
              <el-input
                v-model="ruleForm.enterpriseName"
                size="small"
                placeholder="请输入企业名称"
                :disabled="type == 'view' || status == 1"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="统一社会信用代码" prop="enterpriseCode">
              <el-input
                v-model="ruleForm.enterpriseCode"
                size="small"
                placeholder="请输入统一社会信用代码"
                :disabled="type == 'view' || status == 1"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证件有效期" required prop="dataRange">
              <el-date-picker
                :clearable="false"
                v-model="ruleForm.dataRange"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                size="small"
                :disabled="type == 'view'"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="showAddress">
            <el-form-item label="通讯地址">
              <div class="flex">
                <el-select
                  size="small"
                  v-model="ruleForm.provice"
                  class="mr10"
                  @change="provinceChange(ruleForm.provice)"
                  clearable
                  :disabled="type == 'view'"
                >
                  <el-option
                    v-for="item in provinceArr"
                    :key="item.areaCode"
                    :label="item.name"
                    :value="item.areaCode"
                  >
                  </el-option>
                </el-select>
                <el-select
                  size="small"
                  v-model="ruleForm.city"
                  class="mr10"
                  @change="cityChange(ruleForm.city)"
                  clearable
                  :disabled="type == 'view'"
                >
                  <el-option
                    v-for="item in cityArr"
                    :key="item.areaCode"
                    :label="item.name"
                    :value="item.areaCode"
                  >
                  </el-option>
                </el-select>

                <el-select
                  size="small"
                  :disabled="type == 'view'"
                  v-model="ruleForm.area"
                  clearable
                  class="mr10"
                >
                  <el-option
                    v-for="item in areaArr"
                    :key="item.areaCode"
                    :label="item.name"
                    :value="item.areaCode"
                  >
                  </el-option>
                </el-select>
                <el-input
                  v-model="ruleForm.address"
                  size="small"
                  placeholder="请输入街道地址"
                  :disabled="type == 'view'"
                ></el-input>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="法人姓名" prop="legalName">
              <el-input
                v-model="ruleForm.legalName"
                size="small"
                placeholder="请输入法人姓名"
                maxlength="20"
                :disabled="type == 'view'"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="box">
        <div class="title">租户系统信息</div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="租户编号" prop="tenantCode">
              <el-input
                v-model="ruleForm.tenantCode"
                size="small"
                placeholder="请输入租户编号"
                :disabled="type == 'view' || status == 1"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="租户套餐" prop="packageId">
              <el-select
                :disabled="type == 'view'"
                size="small"
                v-model="ruleForm.packageId"
                placeholder="请选择租户套餐"
              >
                <el-option
                  v-for="item in simpleList"
                  :key="item.id"
                  :label="item.packageName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="过期时间" prop="expireTime">
              <el-date-picker
                :clearable="false"
                v-model="ruleForm.expireTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择选择过期时间"
                size="small"
                :disabled="type == 'view'"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="初始企管账号" prop="userName">
              <div class="flex">
                <el-input
                  v-model="ruleForm.userName"
                  size="small"
                  placeholder="请输入初始企管账号"
                  :disabled="type == 'view' || status == 1"
                ></el-input>
                <div class="default-pwd">默认初始密码123456</div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="box">
        <div class="title">联系人信息</div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="联系人姓名" prop="contactName">
              <el-input
                v-model="ruleForm.contactName"
                size="small"
                placeholder="请输入联系人姓名"
                :disabled="type == 'view'"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人电话" prop="contactMobile">
              <el-input
                v-model="ruleForm.contactMobile"
                size="small"
                placeholder="请输入联系人电话"
                :disabled="type == 'view'"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="box">
        <div class="title">银行账号信息</div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="开户银行名称" prop="bankName">
              <el-input
                v-model="ruleForm.bankName"
                size="small"
                placeholder="请输入开户银行名称"
                :disabled="type == 'view'"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开户银行省市">
              <div class="flex">
                <el-select
                  size="small"
                  v-model="ruleForm.bankProvice"
                  class="mr10"
                  @change="bankProviceChange(ruleForm.bankProvice)"
                  clearable
                  :disabled="type == 'view'"
                >
                  <el-option
                    v-for="item in provinceArr"
                    :key="item.areaCode"
                    :label="item.name"
                    :value="item.areaCode"
                  >
                  </el-option>
                </el-select>

                <el-select
                  :disabled="type == 'view'"
                  size="small"
                  v-model="ruleForm.bankCity"
                  clearable
                >
                  <el-option
                    v-for="item in bankCityArr"
                    :key="item.areaCode"
                    :label="item.name"
                    :value="item.areaCode"
                  >
                  </el-option>
                </el-select>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="开户行账号名称" prop="cardName">
              <el-input
                v-model="ruleForm.cardName"
                size="small"
                placeholder="请输入开户行账号名称"
                :disabled="type == 'view'"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开户行账号" prop="cardNo">
              <el-input
                v-model="ruleForm.cardNo"
                size="small"
                placeholder="请输入开户行账号"
                :disabled="type == 'view'"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="text-center">
        <el-button size="small" type="primary" @click="submitForm" v-if="type == 'add'"
          >保存</el-button
        >
        <el-button size="small" type="primary" @click="submitForm" v-if="type == 'update'"
          >提交</el-button
        >
        <el-button size="small" @click="resetForm">关闭</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { uploadApi, imageNumberApi } from '@/api/image-management'
import {
  tenantAddApi,
  tenantDetailsApi,
  tenantEditApi,
  tenantSimpleList,
} from '@/api/tenant-management'
import { passportUserGetAreaApi } from '@/api/loan-management/index'
export default {
  props: {
    closeModify: {
      type: Function,
    },
    ids: {
      type: Array,
      default: [],
    },
    type: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      ruleForm: {
        fileId: '',
        enterpriseName: '',
        enterpriseCode: '',
        dataRange: [],
        userName: '',
        contactName: '',
        contactMobile: '',
        provice: '',
        city: '',
        area: '',
        address: '',
        legalName: '',
        expireTime: '',
        bankName: '',
        bankProvice: '',
        bankCity: '',
        cardName: '',
        cardNo: '',
        packageId: '',
        tenantCode: '',
      },
      rules: {
        fileId: [{ required: true, message: '请上传营业执照', trigger: 'change' }],
        enterpriseName: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
        enterpriseCode: [
          { required: true, message: '请输入社会信用代码', trigger: 'blur' },
          {
            pattern: /[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}/,
            message: '请输入正确的社会信用代码',
          },
        ],
        dataRange: [{ required: true, message: '请选择证件有效期', trigger: 'change' }],
        //
        userName: [
          { required: true, message: '请输入初始企管账号', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]+$/, message: '账号可包含英文大小写和数字' },
        ],
        contactName: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
        contactMobile: [
          { required: true, message: '请输入联系人电话', trigger: 'blur' },
          { pattern: /^1[3,4,5,6,7,8,9][0-9]{9}$/, message: '请输入正确的电话号码' },
        ],
        tenantCode: [
          { required: true, message: '请输入租户编号', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9]+$/,
            message: '租户编号可包含英文大小写和数字',
          },
        ],
        packageId: [{ required: true, message: '请选择租户套餐', trigger: 'blur' }],
      },
      imageUrl: '',
      provinceArr: [],
      cityArr: [],
      areaArr: [],
      bankCityArr: [],
      fileList: [],
      hide: false,
      tenantId: '',
      status: '',
      simpleList: [],
      showAddress: false,
    }
  },
  created() {
    this.tenantId = this.ids.length > 0 ? this.ids[0] : ''
    if (this.type == 'add') this.showAddress = true
    this.getSimpleList()
    this.getAreaList()
  },
  computed: {},
  methods: {
    getDetails() {
      tenantDetailsApi(this.tenantId).then(res => {
        this.ruleForm = res.data
        this.status = res.data.status
        this.$set(this.ruleForm, 'dataRange', [res.data.startTime, res.data.endTime])
        // 反显文件
        this.getFileUrl(res.data.fileId)
        // 反显省市区
        Promise.all([
          passportUserGetAreaApi(this.ruleForm.bankProvice),
          passportUserGetAreaApi(this.ruleForm.provice),
          passportUserGetAreaApi(this.ruleForm.city),
        ]).then(res => {
          this.bankCityArr = res[0].data
          this.cityArr = res[1].data
          this.areaArr = res[2].data
          this.showAddress = true
        })
      })
    },
    getSimpleList() {
      tenantSimpleList().then(res => {
        if (res.code == 200) {
          this.simpleList = res.data
          if (this.tenantId) this.getDetails()
        }
      })
    },
    getAreaList() {
      passportUserGetAreaApi('').then(res => {
        this.provinceArr = res.data
      })
    },
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
    handleRemove() {
      this.fileList = []
      this.ruleForm.fileId = ''
      this.hide = false
    },
    handleImgChange(file) {
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
          this.ruleForm.fileId = res.data.imageNumber
          this.hide = true
          this.$refs.ruleForm.validateField('fileId')
        }
      })
    },
    provinceChange(val) {
      passportUserGetAreaApi(val).then(res => {
        this.cityArr = res.data
      })
      if (!val) this.cityArr = []
      this.ruleForm.city = ''
      this.ruleForm.area = ''
    },
    cityChange(val) {
      passportUserGetAreaApi(val).then(res => {
        this.areaArr = res.data
      })
      if (!val) this.areaArr = []
      this.ruleForm.area = ''
    },
    bankProviceChange(val) {
      passportUserGetAreaApi(val).then(res => {
        this.bankCityArr = res.data
      })
      if (!val) this.bankCityArr = []
      this.ruleForm.bankCity = ''
    },
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(this.ruleForm))
          const [startTime, endTime] = params.dataRange
          params = {
            ...params,
            startTime,
            endTime,
          }
          params.startTime = params.startTime.substr(0, 10)
          params.endTime = params.endTime.substr(0, 10)
          if (params.expireTime) params.expireTime = params.expireTime.substr(0, 10)
          delete params.dataRange
          let requestFn = this.type == 'update' ? tenantEditApi : tenantAddApi
          requestFn(params).then(res => {
            if (res.code == 200) {
              this.$message.success('操作成功')
              this.resetForm()
            }
          })
        }
      })
    },
    resetForm(formName) {
      this.$emit('closeModify')
      this.$refs.ruleForm.resetFields()
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
    font-size: 20px;
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
</style>
