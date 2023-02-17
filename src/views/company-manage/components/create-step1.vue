<template>
  <el-form
    class="create-step1 m-b-20"
    ref="formData"
    :model="formData"
    :rules="formDataRules"
    label-width="180px"
  >
    <el-row>
      <el-col :span="12">
        <el-form-item label="企业营业执照:" prop="enterpriseCertFiles">
          <el-upload
            class="upload-demo"
            action=""
            :on-change="(file, fileList) => handleImgChange(file, fileList, 'enterpriseCertFiles')"
            :on-remove="(file, fileList) => handleRemove(file, fileList, 'enterpriseCertFiles')"
            multiple
            :auto-upload="false"
            :limit="1"
            :file-list="formData.enterpriseCertFiles"
            list-type="picture-card"
            :class="{ hide: uploadArea }"
          >
            <!-- <el-button :disabled="uploadArea" size="small" type="primary">点击上传</el-button> -->
            <i class="el-icon-plus"></i>
            <div class="el-upload__tip" slot="tip">
              <span>请上传原件或者加盖公章的复印件</span><br />
              <span>支持pdf、jpg、png格式，大小不超过5M</span>
            </div>
          </el-upload>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="企业名称:" prop="enterpriseName">
          <el-input
            placeholder=""
            v-model.trim="formData.enterpriseName"
            :disabled="!ocrFinish"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <el-form-item label="统一社会信用代码:" prop="enterpriseCertNo">
          <el-input
            placeholder=""
            v-model.trim="formData.enterpriseCertNo"
            maxlength="20"
            :disabled="!ocrFinish"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="有效期:" prop="validDate">
          <el-date-picker
            :clearable="false"
            v-model.trim="formData.validDate"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :disabled="!ocrFinish"
          >
          </el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="法人代表姓名:" prop="legalPersonName">
          <el-input
            placeholder=""
            disabled
            v-model.trim="formData.legalPersonName"
            maxlength="20"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="法人代表身份证号:" prop="idNo">
          <el-input placeholder="" disabled v-model.trim="formData.idNo"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="注册地址:" prop="enterpriseAddress">
          <el-input
            placeholder=""
            v-model.trim="formData.enterpriseAddress"
            :disabled="!ocrFinish"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="通讯地址:" prop="region">
          <el-cascader
            ref="region_cascader"
            class="w280"
            v-model.trim="formData.region"
            placeholder="请选择省/市/区"
            :props="{
              value: 'areaCode',
              label: 'name',
              lazy: true,
              lazyLoad: lazyLoad,
            }"
            clearable
          >
          </el-cascader>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="" prop="address">
          <el-input placeholder="" v-model.trim="formData.address"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <!-- <div class="pd10 f-s-12 bgf5f5f5">
      <div>注意事项：</div>
      <div>
        1、企业证照：若您企业的机构类型为非法人企业，且有独立的证照，请上传其独立证照，若无独立的证照，请上传上级单位相关证照
      </div>
      <div>
        2、非法人企业授权委托书：若您的企业的机构类型为非法人企业，请根据企业性质（分公司、项目部）选择《非法人企业授权委托书》模板，填写信息后加盖上级法人单位公章及法定代表人签字（或签章），同时加盖指挥部或项目部公章及项目负责人签字（或签章）
      </div>
    </div> -->
    <div class="text-center m-t-10">
      <el-button type="primary" @click="next">提交</el-button>
    </div>
  </el-form>
</template>

<script>
// import { cityList } from '@/assets/js/city.js';
// import { imgToBase64 } from '@/common/js/utils.js';
import { uploadAndGetUrlApi, uploadApi } from '@/api/image-management/index.js'
import { getAreaApi } from '@/api/common.js'
import {
  createEnterpriseApi,
  parseLicenseInfoApi,
  getUserFrontMsgApi,
} from '@/api/enterprise-information-management/create-enterprise.js'

import { Encrypt, Decrypt } from '@/utils/jsencrypt'
import { isEnterpriseNo, checkCardNo } from '@/utils/validate'
export default {
  data() {
    var validateCoCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入统一社会信用代码'))
      } else {
        if (!isEnterpriseNo(value)) {
          callback(new Error('统一社会信用代码格式不正确'))
        }
        callback()
      }
    }
    var validateIdNo = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入法人代表身份证号'))
      } else {
        if (!checkCardNo(value)) {
          callback(new Error('法人代表身份证号格式不正确'))
        }
        callback()
      }
    }
    return {
      formData: {
        imageNumber: null, //营业执照文件ID
        file: null, //营业执照文件
        enterpriseName: '',
        certType: '1',
        enterpriseCertFiles: [],
        enterpriseCertNo: '',
        validDate: [],
        legalPersonName: '',
        idNo: '',
        enterpriseAddress: '',
        region: [],
        address: '',
      },
      uploadArea: false, // 是否隐藏上传按钮
      ocrFinish: false,
      formDataRules: {
        enterpriseName: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入企业名称',
          },
        ],
        enterpriseCertFiles: [
          {
            required: true,
            trigger: ['blur', 'change'],
            validator: (rule, value, callback) => {
              if (!value.length) {
                callback('请上传企业营业执照！')
              } else if (!value[0].imageNumber) {
                callback('请等待企业营业执照上传完成！')
              } else {
                callback()
              }
            },
          },
        ],
        enterpriseCertNo: [
          {
            required: true,
            trigger: ['blur', 'change'],
            validator: validateCoCode,
          },
        ],
        validDate: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请选择有效期',
          },
        ],
        legalPersonName: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入法人代表姓名',
          },
        ],
        idNo: [
          {
            required: true,
            trigger: ['blur', 'change'],
            validator: validateIdNo,
          },
        ],
        enterpriseAddress: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入注册地址',
          },
        ],
        region: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请选择通讯地址',
          },
        ],
        address: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请完善地址信息',
          },
        ],
      },
    }
  },
  props: {
    enterpriseId: {
      type: [String, Number],
    },
  },
  created() {
    this.uploadArea = false
    // this.init();
    this.getEntAndLegalInfo()
  },
  methods: {
    // 获取法人信息
    getEntAndLegalInfo() {
      getUserFrontMsgApi().then(res => {
        if (res.code == 200) {
          this.formData.legalPersonName = res.data.realName
          this.formData.idNo = Decrypt(res.data.idCard)
        }
      })
    },
    init() {
      getAreaApi({ parentCode: '' }).then(res => {
        this.cityList = res.data
      })
    },
    lazyLoad(node, resolve) {
      const { level } = node
      getAreaApi({ parentCode: node.value }).then(res => {
        let arr = res.data.map(item => {
          return {
            ...item,
            leaf: level >= 2,
          }
        })
        resolve(arr)
      })
    },
    handleRemove() {
      this.uploadArea = false
      this.formData.enterpriseCertNo = ''
      this.formData.enterpriseName = ''
      this.formData.enterpriseAddress = ''
      this.formData.enterpriseCertFiles = []
      this.formData.validDate = []
    },
    async handleImgChange(file, fileList, key) {
      const isJPG =
        file.raw.type === 'image/jpeg' ||
        file.raw.type === 'image/png' ||
        file.raw.type === 'application/pdf'
      const isLt10M = file.raw.size / 1024 / 1024 < 5

      if (!isJPG) {
        this.formData[key] = []
        this.$message.error('请上传pdf、jpg、png类型的文件')
        return false
      }
      if (!isLt10M) {
        this.formData[key] = []
        this.$message.error('请上传小于5M的文件')
        return false
      }
      this.ocrFinish = false
      let files = []
      for (let item of fileList) {
        if (item.raw) {
          try {
            let formData = new FormData()
            formData.append('file', item.raw)
            formData.append('imageTypeNumber', '1')
            let res = await uploadAndGetUrlApi({
              file: item.raw,
              imageTypeNumber: '1',
              showType: '0',
            })
            files.push({
              uid: item.uid,
              name: item.name,
              url: item.url,
              imageNumber: res.imageNumber,
            })

            this.imageNumber = res.imageNumber
            this.file = item.raw
            this.uploadArea = true
          } catch (error) {
            this.uploadArea = false
          }
        } else {
          files.push(item)
        }
      }

      this.formData[key] = files
      this.$refs.formData.validateField([key])
      this.ocrEnterprise(files)
    },
    ocrEnterprise(files) {
      parseLicenseInfoApi({
        fileId: files[0].imageNumber,
        seqNo: 3,
      })
        .then(res => {
          if (res.code == 200) {
            this.formData.enterpriseCertNo = res.data.certNo
            this.formData.enterpriseName = res.data.name
            this.formData.enterpriseAddress = res.data.address
            if (res.data.time.length == 2 && res.data.establishDate) {
              let start = res.data.establishDate
                .substr(0, 10)
                .replace('年', '-')
                .replace('月', '-')
                .replace('日', '')
              this.formData.validDate = [start, '2099-12-31']
            } else if (res.data.time.length > 0 && res.data.time.indexOf('长期') != -1) {
              let start = res.data.time
                .substr(0, 10)
                .replace('年', '-')
                .replace('月', '-')
                .replace('日', '')
              this.formData.validDate = [start, '2099-12-31']
            } else if (
              res.data.time.length > 0 &&
              res.data.time.indexOf('至') != -1 &&
              res.data.time.indexOf('长期') == -1
            ) {
              let timer = res.data.time
                .replaceAll('年', '-')
                .replaceAll('月', '-')
                .replaceAll('日', '')
              let time = timer.split('至')
              this.formData.validDate = time || []
            }
          }
          this.ocrFinish = true
        })
        .catch(() => {
          this.ocrFinish = true
        })
    },
    next() {
      this.$refs.formData.validate((valid, obj) => {
        if (valid) {
          let params = {
            address: this.formData.address,
            certType: '1',
            enterpriseAddress: this.formData.enterpriseAddress,
            enterpriseCertFile: this.formData.enterpriseCertFiles[0].imageNumber,
            enterpriseCertNo: this.formData.enterpriseCertNo,
            enterpriseName: this.formData.enterpriseName,
            idNo: Encrypt(this.formData.idNo),
            legalPersonName: this.formData.legalPersonName,
            certStartTime: this.formData.validDate[0],
            certEndTime: this.formData.validDate[1],
          }
          if (this.formData.region.length == 3) {
            ;(params.provinceCode = this.formData.region[0]),
              (params.cityCode = this.formData.region[1]),
              (params.areaCode = this.formData.region[2])
            let checkNodes = this.$refs.region_cascader.getCheckedNodes()
            params.areaName = checkNodes[0].label
            params.cityName = checkNodes[0].parent.label
            params.provinceName = checkNodes[0].parent.parent.label
          }
          createEnterpriseApi(params).then(res => {
            if (res.code == 200) {
              this.$emit('enterpriseIdChange', res.data)
              this.$emit('activeChange', 1)
              this.$store.commit('SET_ENTERPRISE_CERNO', this.formData.enterpriseCertNo) //存储统一社会信用代码

              // 更新企业营业执照图片文件
              let formData = new FormData()
              formData.append('file', this.file)
              formData.append('imageTypeNumber', '1')
              formData.append('businessId', this.$store.state.enterprise.enterpriseCertNo)
              formData.append('businessCode', '001')
              formData.append('imageNumber', this.imageNumber)

              uploadApi(formData).then(res => {})
            }
          })
        }
      })
    },
  },
}
</script>

<style lang="scss">
.create-step1 {
  padding-left: 60px;
  padding-right: 30px;
}
.hide {
  .el-upload--picture-card {
    display: none;
  }
}
</style>
