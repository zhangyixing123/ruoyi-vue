<template>
  <div class="app-container flex1 over-hidden y-scroll">
    <el-form
      :rules="rules"
      :model="ruleForm"
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
                :file-list="fileList"
                list-type="picture-card"
                :limit="1"
                :class="hide ? 'hide' : ''"
              >
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <div class="imageBox">
                <img v-if="type == 'view' && imageUrl" :src="imageUrl" alt="" class="avatar" />
                <div class="imgChangeBox" v-if="changeimageUrl">
                  <span class="imgtitle">原图片:</span>
                  <img :src="changeimageUrl" alt="" class="avatar" />
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="企业名称" prop="enterpriseName">
              <div class="flex">
                <el-input
                  v-model="ruleForm.enterpriseName"
                  size="small"
                  placeholder="请输入企业名称"
                  disabled
                ></el-input>
                <div v-show="changeData.enterpriseName" class="default-pwd">
                  原始值：{{ changeData.enterpriseName }}
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="统一社会信用代码" prop="enterpriseCode">
              <div class="flex">
                <el-input
                  v-model="ruleForm.enterpriseCode"
                  size="small"
                  placeholder="请输入统一社会信用代码"
                  disabled
                ></el-input>
                <div v-show="changeData.enterpriseCode" class="default-pwd">
                  原始值：{{ changeData.enterpriseCode }}
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证件有效期" required prop="dataRange">
              <div class="flex">
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
                  disabled
                >
                </el-date-picker>
                <div v-show="oldData.dataRange" class="default-pwd">
                  原始值：{{ oldData.dataRange }}
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="通讯地址">
              <div class="flex">
                <el-select size="small" v-model="ruleForm.provice" class="mr10" clearable disabled>
                  <el-option
                    v-for="item in provinceArr"
                    :key="item.areaCode"
                    :label="item.name"
                    :value="item.areaCode"
                  >
                  </el-option>
                </el-select>
                <el-select size="small" v-model="ruleForm.city" class="mr10" clearable disabled>
                  <el-option
                    v-for="item in cityArr"
                    :key="item.areaCode"
                    :label="item.name"
                    :value="item.areaCode"
                  >
                  </el-option>
                </el-select>

                <el-select size="small" disabled v-model="ruleForm.area" clearable class="mr10">
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
                  disabled
                ></el-input>
              </div>
              <div v-if="showAddress" v-show="oldData.address" class="default-pwd">
                原始值：{{ oldData.address }}
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="法人姓名" prop="legalName">
              <div class="flex">
                <el-input
                  v-model="ruleForm.legalName"
                  size="small"
                  placeholder="请输入法人姓名"
                  maxlength="20"
                  disabled
                ></el-input>
                <div v-show="changeData.legalName" class="default-pwd">
                  原始值：{{ changeData.legalName }}
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="box">
        <div class="title">租户系统信息</div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="租户编号" prop="tenantCode">
              <div class="flex">
                <el-input
                  v-model="ruleForm.tenantCode"
                  size="small"
                  placeholder="请输入租户编号"
                  disabled
                ></el-input>
                <div v-show="changeData.tenantCode" class="default-pwd">
                  原始值：{{ changeData.tenantCode }}
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="租户套餐" prop="packageId">
              <div class="flex">
                <el-select
                  disabled
                  size="small"
                  v-model="ruleForm.packageId"
                  placeholder="请选择租户套餐"
                >
                  <el-option
                    v-for="item in simpList"
                    :key="item.id"
                    :label="item.packageName"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
                <div v-show="changeData.packageId" class="default-pwd">
                  原始值：{{ changeData.packageId }}
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="过期时间" prop="expireTime">
              <div class="flex">
                <el-date-picker
                  :clearable="false"
                  v-model="ruleForm.expireTime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择选择过期时间"
                  size="small"
                  disabled
                >
                </el-date-picker>
                <div v-show="changeData.expireTime" class="default-pwd">
                  原始值：{{ changeData.expireTime ? changeData.expireTime.substr(0, 10) : '' }}
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="初始企管账号" prop="userName">
              <div class="flex">
                <el-input
                  v-model="ruleForm.userName"
                  size="small"
                  placeholder="请输入初始企管账号"
                  disabled
                ></el-input>
                <div v-if="changeData.userName" class="default-pwd">
                  原始值：{{ changeData.userName }}
                </div>
                <div v-else class="default-pwd">初始密码：123456</div>
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
              <div class="flex">
                <el-input
                  v-model="ruleForm.contactName"
                  size="small"
                  placeholder="请输入联系人姓名"
                  disabled
                ></el-input>
                <div v-show="changeData.contactName" class="default-pwd">
                  原始值：{{ changeData.contactName }}
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人电话" prop="contactMobile">
              <div class="flex">
                <el-input
                  v-model="ruleForm.contactMobile"
                  size="small"
                  placeholder="请输入联系人电话"
                  disabled
                ></el-input>
                <div v-show="changeData.contactMobile" class="default-pwd">
                  原始值：{{ changeData.contactMobile }}
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="box">
        <div class="title">银行账号信息</div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="开户银行名称" prop="bankName">
              <div class="flex">
                <el-input
                  v-model="ruleForm.bankName"
                  size="small"
                  placeholder="请输入开户银行名称"
                  disabled
                ></el-input>
                <div v-show="changeData.bankName" class="default-pwd">
                  原始值：{{ changeData.bankName }}7
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户银行省市">
              <div class="flex">
                <el-select
                  size="small"
                  v-model="ruleForm.bankProvice"
                  class="mr10"
                  clearable
                  disabled
                >
                  <el-option
                    v-for="item in provinceArr"
                    :key="item.areaCode"
                    :label="item.name"
                    :value="item.areaCode"
                  >
                  </el-option>
                </el-select>

                <el-select disabled size="small" v-model="ruleForm.bankCity" clearable>
                  <el-option
                    v-for="item in bankCityArr"
                    :key="item.areaCode"
                    :label="item.name"
                    :value="item.areaCode"
                  >
                  </el-option>
                </el-select>
              </div>
              <div v-if="showBankAddress" v-show="oldData.provicecity" class="default-pwd">
                原始值：{{ oldData.provicecity }}
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="开户行账号名称" prop="cardName">
              <div class="flex">
                <el-input
                  v-model="ruleForm.cardName"
                  size="small"
                  placeholder="请输入开户行账号名称"
                  disabled
                ></el-input>
                <div v-show="changeData.cardName" class="default-pwd">
                  原始值：{{ changeData.cardName }}
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开户行账号" prop="cardNo">
              <div class="flex">
                <el-input
                  v-model="ruleForm.cardNo"
                  size="small"
                  placeholder="请输入开户行账号"
                  disabled
                ></el-input>
                <div v-show="changeData.cardNo" class="default-pwd">
                  原始值：{{ changeData.cardNo }}
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <div class="box" v-show="type == 'audit'">
        <div class="title">审批核验</div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="审核结果" prop="examineState">
              <el-radio-group v-model="ruleForm.examineState">
                <el-radio label="1">审核通过</el-radio>
                <el-radio label="2">审核拒绝</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="审核意见" prop="examineRemark">
              <div class="flex">
                <el-input
                  v-model="ruleForm.examineRemark"
                  size="small"
                  type="textarea"
                  placeholder="请输入审核意见"
                ></el-input>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="text-center">
        <el-button size="small" type="primary" @click="submitForm" v-if="type == 'audit'"
          >提交</el-button
        >
        <el-button size="small" @click="resetForm">关闭</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { imageNumberApi } from '@/api/image-management'
import { callbackApi, getSimpleList } from '@/api/system/audit'
import { passportUserGetAreaApi } from '@/api/loan-management/index'
export default {
  props: {
    closeModify: {
      type: Function,
    },
    allData: {
      type: Object,
      default: {},
    },
    type: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      examineState: '',
      examineRemark: '',
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
        examineState: [{ required: true, message: '请选择审核结果', trigger: 'blur' }],
        examineRemark: [{ required: true, message: '请输入审核意见', trigger: 'blur' }],
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
      oldFormdata: {},
      newFormdata: {},
      changeData: {},
      oldData: {}, //红色提示处理后的老信息
      oldcityArr: [],
      simpList: [],
      changeimageUrl: null,
      showAddress: false,
      showBankAddress: false,
    }
  },
  created() {
    getSimpleList().then(res => {
      this.simpList = res.data
    })
    if (this.allData.newDataJson) {
      this.oldFormdata = JSON.parse(this.allData.oldDataJson)
      this.newFormdata = JSON.parse(this.allData.newDataJson)
      this.ruleForm = this.newFormdata
      this.getDetails()
      this.isObjectValueEqual(this.oldFormdata, this.newFormdata)
    } else {
      this.ruleForm = JSON.parse(this.allData.oldDataJson)
      this.getDetails()
    }
  },
  computed: {},
  methods: {
    getDetails() {
      this.status = this.ruleForm.status
      this.$set(this.ruleForm, 'dataRange', [this.ruleForm.startTime, this.ruleForm.endTime])

      // 反显文件
      this.getFileUrl(this.ruleForm.fileId)
      // 反显新数据省市区
      passportUserGetAreaApi('').then(res => {
        this.provinceArr = res.data
      })
      if (this.ruleForm.bankProvice || this.ruleForm.provice || this.ruleForm.city) {
        Promise.all([
          passportUserGetAreaApi(this.ruleForm.bankProvice),
          passportUserGetAreaApi(this.ruleForm.provice),
          passportUserGetAreaApi(this.ruleForm.city),
        ]).then(res => {
          this.bankCityArr = res[0].data
          this.cityArr = res[1].data
          this.areaArr = res[2].data
        })
      }
    },
    // 比较两个对象修改的值
    isObjectValueEqual(a, b) {
      var aProps = Object.getOwnPropertyNames(a)
      var bProps = Object.getOwnPropertyNames(b)
      // if (aProps.length == bProps.length) {
      aProps.forEach(e => {
        if (a[e] != b[e]) {
          this.changeData[e] = a[e] //有变化的老数据
        }
      })
      // 反显旧数据省市区
      if (
        this.changeData.provice ||
        this.changeData.city ||
        this.changeData.area ||
        this.changeData.address
      ) {
        Promise.all([
          passportUserGetAreaApi(''),
          passportUserGetAreaApi(this.changeData.provice),
          passportUserGetAreaApi(this.changeData.city),
        ]).then(res => {
          if (res[0].data.length > 0 && this.changeData.provice) {
            this.oldData.address = res[0].data.filter(
              v => v.areaCode == this.changeData.provice
            )[0].name
          }
          if (res[1].data.length > 0 && this.changeData.city) {
            this.oldData.address += res[1].data.filter(
              v => v.areaCode == this.changeData.city
            )[0].name
          }
          if (res[2].data.length > 0 && this.changeData.area) {
            this.oldData.address += res[2].data.filter(
              v => v.areaCode == this.changeData.area
            )[0].name
          }
          if (this.changeData.address) this.oldData.address += this.changeData.address
          this.showAddress = true
        })
      }

      // 证件有效期
      if (this.changeData.startTime || this.changeData.endTime) {
        this.oldData.dataRange = ''
        this.oldData.dataRange =
          this.oldFormdata.startTime.substr(0, 10) + '至' + this.changeData.endTime.substr(0, 10)
      }

      // 旧开户银行省市反显
      if (this.changeData.bankProvice || this.changeData.bankProvice) {
        Promise.all([
          passportUserGetAreaApi(''),
          passportUserGetAreaApi(this.changeData.bankProvice),
        ]).then(res => {
          if (res[0].data.length > 0 && this.changeData.bankProvice) {
            this.oldData.provicecity = res[0].data.filter(
              v => v.areaCode == this.changeData.bankProvice
            )[0].name
          }
          if (res[1].data.length > 0 && this.changeData.bankCity) {
            this.oldData.provicecity += res[1].data.filter(
              v => v.areaCode == this.changeData.bankCity
            )[0].name
          }
          this.showBankAddress = true
        })
      }

      // 图片返显
      if (this.changeData.fileId) {
        imageNumberApi({
          imageNumber: this.changeData.fileId,
          type: 1,
        }).then(res => {
          this.changeimageUrl = window.URL.createObjectURL(res)
        })
      }
      // }
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

    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const params = {
            examineSeqNo: this.allData.seqNo,
            examineState: this.ruleForm.examineState,
            jsonContent: this.allData.newDataJson,
            examineRemark: this.ruleForm.examineRemark,
            tenantId: this.allData.relationSeq,
            type: this.allData.examineType,
          }
          callbackApi(params).then(res => {
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
  color: red;
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
  margin-right: 70px;
}
.labelTxt {
  color: #ff4949;
  .txt {
    color: #606266;
  }
}
.imageBox {
  display: flex;
}

.imgChangeBox {
  position: relative;
}

.imgtitle {
  position: absolute;
  left: -40px;
  color: #ff4949;
}
</style>
