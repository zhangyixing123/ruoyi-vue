<template>
  <div class="enterprise-information">
    <div class="enterprise-header">
      <span> {{ enterpriseName }} </span>
      <el-button type="primary" @click="handleEditInformation">编辑</el-button>
    </div>
    <div class="enterprise-content">
      <el-form :model="informationForm" ref="informationForm" label-width="150px">
        <el-form-item label="企业名称" prop="name">
          <el-input
            :disabled="!editInformationFlag"
            size="small"
            style="width: 380px"
            v-model.trim="informationForm.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="统一社会信用代码" prop="societyCode">
          <el-input
            :disabled="!editInformationFlag"
            size="small"
            style="width: 380px"
            v-model.trim="informationForm.societyCode"
          ></el-input>
        </el-form-item>
        <el-form-item label="证件照片">
          <el-image class="info-image" :src="informationForm.src">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </el-form-item>
        <el-form-item label="证件有效期" prop="validity">
          <el-input
            :disabled="!editInformationFlag"
            size="small"
            style="width: 160px"
            v-model.trim="informationForm.validityStart"
          ></el-input>
          <span style="display: inline-block; width: 60px; text-align: center">
            --
          </span>
          <el-input
            :disabled="!editInformationFlag"
            size="small"
            style="width: 160px"
            v-model.trim="informationForm.validityEnd"
          ></el-input>
        </el-form-item>
        <el-form-item label="注册地址" prop="address">
          <el-input
            :disabled="!editInformationFlag"
            style="width: 380px"
            size="small"
            v-model.trim="informationForm.address"
          ></el-input>
        </el-form-item>
        <el-form-item label="通讯地址" prop="postalAddress">
          <el-select
            v-model.trim="informationForm.province"
            @change="handleProvinceSelect"
            :disabled="!editInformationFlag"
            style="width: 120px"
          >
            <el-option
              v-for="(province, index) in cityList"
              :key="index"
              :label="province.v"
              :value="province.v"
            ></el-option>
          </el-select>
          <el-select
            v-model.trim="informationForm.city"
            :disabled="!editInformationFlag || !informationForm.province"
            style="width: 120px; margin-left: 10px"
          >
            <el-option
              v-for="(province, index) in cityArr"
              :key="index"
              :label="province.v"
              :value="province.v"
            ></el-option>
          </el-select>
          <el-select
            v-model.trim="informationForm.area"
            :disabled="!editInformationFlag || !informationForm.city || !informationForm.province"
            style="width: 120px; margin-left: 10px"
          >
            <el-option
              v-for="(province, index) in areaArr"
              :key="index"
              :label="province.v"
              :value="province.v"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="法人姓名" prop="legalName">
          <el-input
            :disabled="!editInformationFlag"
            v-model.trim="informationForm.legalName"
            style="width: 380px"
          ></el-input>
        </el-form-item>
        <el-form-item label="法人证件号" prop="legalName">
          <el-select
            :disabled="!editInformationFlag"
            style="width: 150px"
            v-model.trim="informationForm.legalIdType"
          >
            <el-option
              v-for="(idType, index) in idTypeArr"
              :key="index"
              :label="idType.dictLabel"
              :value="idType.dictValue"
            ></el-option>
          </el-select>
          <el-input
            v-model.trim="informationForm.legalIdNo"
            :disabled="!editInformationFlag"
            style="width: 220px; margin-left: 10px"
          ></el-input>
        </el-form-item>
        <el-form-item label="法定代表人证件">
          <div class="legal-id-pic">
            <el-upload
              v-if="editInformationFlag"
              class="reload-btn"
              :action="uploadUrl"
              :show-file-list="false"
              :on-success="handleUploadFrontPic"
              :before-upload="beforeUpload"
            >
              <el-button type="primary"> 重新上传 </el-button>
            </el-upload>
            <el-image class="info-image" :src="informationForm.frontPic">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </div>
          <div class="legal-id-pic" style="margin-left: 20px">
            <el-upload
              v-if="editInformationFlag"
              class="reload-btn"
              :action="uploadUrl"
              :show-file-list="false"
              :on-success="handleUploadBackPic"
              :before-upload="beforeUpload"
            >
              <el-button type="primary"> 重新上传 </el-button>
            </el-upload>
            <el-image class="info-image" :src="informationForm.backPic">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="enterprise-footer" v-if="editInformationFlag">
      <el-button type="primary" size="small" @click="handleConfirm">
        确认提交
      </el-button>
      <el-button type="warning" size="small" @click="handleCancel">
        取消
      </el-button>
    </div>
  </div>
</template>
<script>
import { cityList } from '@/assets/js/city.js'

export default {
  data() {
    return {
      enterpriseName: '一飞冲天股份有限公司',
      // headers: { Authorization: "Bearer " + getToken() },
      uploadUrl: 'https://jsonplaceholder.typicode.com/posts/',
      informationForm: {
        name: '一飞冲天股份有限公司',
        societyCode: '91120145222547859',
        src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
        validityStart: '2021-12-31',
        validityEnd: '2021-12-31',
        address: '',
        province: '广东',
        city: '深圳',
        area: '南山区',
        legalName: '李白',
        legalIdType: '0',
        legalIdNo: '51370119970620xxxx',
        frontPic: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        backPic: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      },
      fileList: [],
      editInformationFlag: false,
      cityList,
    }
  },
  created() {},
  methods: {
    handleEditInformation() {
      this.editInformationFlag = true
    },
    handleProvinceSelect() {
      this.informationForm.city = ''
      this.informationForm.area = ''
    },
    // 重新上传 身份证人像面
    handleUploadFrontPic(res, file) {
      this.informationForm.frontPic = URL.createObjectURL(file.raw)
    },
    // 重新上传 身份证国徽面
    handleUploadBackPic(res, file) {
      this.informationForm.backPic = URL.createObjectURL(file.raw)
    },
    beforeUpload(file) {
      // const isJPG = file.type === "image/jpeg";
      // const isLt2M = file.size / 1024 / 1024 < 2;
      // if (!isJPG) {
      //   this.$message.error("上传头像图片只能是 JPG 格式!");
      // }
      // if (!isLt2M) {
      //   this.$message.error("上传头像图片大小不能超过 2MB!");
      // }
      // return isJPG && isLt2M;
      return true
    },
    // 确认提交
    handleConfirm() {
      const loading = this.$loading({
        lock: true,
        text: '接口请求中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.65)',
      })
      setTimeout(() => {
        loading.close()
        this.editInformationFlag = false
        this.msgSuccess('提交成功！')
      }, 1000)
    },
    // 取消
    handleCancel() {},
  },
  computed: {
    cityArr() {
      return this.cityList.find(item => item.v === this.informationForm.province)?.c || []
    },
    areaArr() {
      return this.cityArr.find(item => item.v === this.informationForm.city)?.c || []
    },
    idTypeArr() {
      return [
        { dictValue: '0', dictLabel: '居民身份证' },
        { dictValue: '1', dictLabel: '军官证' },
        { dictValue: '2', dictLabel: '其他' },
      ]
    },
  },
}
</script>
<style lang="scss" scoped>
.enterprise-information {
  .enterprise-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid;
    padding: 10px 20px;
    margin-bottom: 40px;
  }
  .enterprise-content {
    display: flex;
    justify-content: center;
    width: 800px;
    margin: 0 auto;
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
    .reload-btn {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
    }
  }
  .enterprise-footer {
    width: 300px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
  }
}
</style>
