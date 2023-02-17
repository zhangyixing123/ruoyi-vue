<template>
  <div>
    <el-form
      class="create-step1 m-b-20"
      ref="formData"
      :model="formData"
      :rules="formDataRules"
      label-width="180px"
      v-show="!showInfo"
    >
      <el-row style="margin-bottom: 30px">
        <el-col :span="12">
          <el-form-item label="证件类型:" prop="documentType">
            <el-select v-model.trim="formData.documentType">
              <el-option label="身份证" value="IDcard"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="5">
          <el-form-item label="身份证影像:" prop="certificate2">
            <div class="flex">
              <el-form-item label="" label-width="0px" prop="idCardFront">
                <el-upload
                  :class="{ hide: renxianghideUploadEdit }"
                  action=" "
                  :auto-upload="false"
                  list-type="picture-card"
                  accept=".jpg,.jpeg,.png"
                  :limit="1"
                  :file-list="formData.idCardFront"
                  :on-change="(file, fileList) => handleImgChange(file, fileList, 'idCardFront')"
                  :on-remove="(file, fileList) => handleImgChange(file, fileList, 'idCardFront')"
                >
                  <i class="el-icon-plus"></i>
                  <div class="el-upload__tip text-center" slot="tip">人像面</div>
                </el-upload>
              </el-form-item>
              <el-form-item class="m-l-10" label="" label-width="0px" prop="idCardBack">
                <el-upload
                  :class="{ hide: guohuihideUploadEdit }"
                  action=" "
                  :auto-upload="false"
                  list-type="picture-card"
                  accept=".jpg,.jpeg,.png"
                  :limit="1"
                  :file-list="formData.idCardBack"
                  :on-change="(file, fileList) => handleImgChange(file, fileList, 'idCardBack')"
                  :on-remove="(file, fileList) => handleImgChange(file, fileList, 'idCardBack')"
                >
                  <i class="el-icon-plus"></i>
                  <div class="el-upload__tip text-center" slot="tip">国徽面</div>
                </el-upload>
              </el-form-item>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="text-center m-t-10">
        <el-button
          type="primary"
          @click="next"
          :loading="!loading"
          :disabled="!reverseImgId || !frontImgId"
          >下一步</el-button
        >
      </div>
    </el-form>
    <submitInfo
      v-if="showInfo"
      @hide="hide"
      @nextStep="nextStep"
      :idCardInfo="idCardInfo"
    ></submitInfo>
  </div>
</template>

<script>
import { imgToBase64 } from '@/common/js/utils'
import { utils } from '@/utils/utils'
import { uploadApi } from '@/api/image-management/index.js'
import {
  authOrIdentidentCardApi,
  twoBasicAuthApi,
  uploadFileApi,
  OcrIdCardNewApi,
} from '@/api/user-center/index'
import submitInfo from './submitInfo.vue'
export default {
  components: {
    submitInfo,
  },
  data() {
    return {
      loading: true,
      reverseImgId: null,
      frontImgId: null,
      guohuihideUploadEdit: false, // 是否隐藏上传按钮
      renxianghideUploadEdit: false, // 是否隐藏上传按钮
      formData: {
        documentType: 'IDcard',
        idCardFront: [],
        idCardBack: [],
      },
      formDataRules: {
        idCardFront: [
          {
            required: true,
            message: '请上传人像面',
            trigger: ['change', 'blur'],
          },
        ],
        idCardBack: {
          required: true,
          message: '请上传国徽面',
          trigger: ['change', 'blur'],
        },
      },
      canNext: false,
      showInfo: false,
      idCardInfo: {},
    }
  },
  created() {},
  methods: {
    next() {
      this.$refs.formData.validate(valid => {
        if (valid) {
          this.loading = false
          const { idCardFront, idCardBack } = this.formData
          Promise.all([imgToBase64(idCardFront[0].raw), imgToBase64(idCardBack[0].raw)]).then(
            res => {
              utils.localStorageSet('idCardFront', res[0])
              utils.localStorageSet('idCardBack', res[1])
            }
          )
          OcrIdCardNewApi({
            frontImgId: this.frontImgId,
            reverseImgId: this.reverseImgId,
          })
            .then(res => {
              this.idCardInfo = res.data
              this.idCardInfo = {
                ...this.idCardInfo,
              }
              this.loading = this.showInfo = true
            })
            .catch(() => {
              this.loading = true
            })
        }
      })
    },
    hide() {
      this.showInfo = false
    },
    nextStep() {
      this.$emit('activeChange', 1)
    },
    handleImgChange(file, fileList, key) {
      const isJPG = file.raw.type === 'image/jpeg' || file.raw.type === 'image/png'

      const fileSize = parseFloat(parseInt(file.size) / 1024 / 1024).toFixed(2)
      if (!isJPG) {
        this.formData[key] = []
        this.$message.error('请上传jpg、png类型的文件')
        return false
      }
      if (Number(fileSize) > 1) {
        this.formData[key] = []
        this.$message.error('上传图片太大，请重新拍照上传。')
        return
      }
      if (key === 'idCardBack') {
        fileList.length === 1
          ? (this.guohuihideUploadEdit = true)
          : (this.guohuihideUploadEdit = false)
        let formData = new FormData()
        formData.append('file', file.raw)
        formData.append('imageTypeNumber', '8')
        formData.append('businessId', this.$store.state.enterprise.enterpriseCertNo)

        formData.append('businessCode', '001')
        this.loading = false
        uploadApi(formData).then(res => {
          if (res.code === 200 && res.success) {
            this.reverseImgId = res.data.imageNumber
            this.loading = true
          }
        })
      } else {
        fileList.length === 1
          ? (this.renxianghideUploadEdit = true)
          : (this.renxianghideUploadEdit = false)
        let formData = new FormData()
        formData.append('file', file.raw)
        formData.append('imageTypeNumber', '7')
        formData.append('businessId', this.$store.state.enterprise.enterpriseCertNo)

        formData.append('businessCode', '001')
        this.loading = false
        uploadApi(formData).then(res => {
          if (res.code === 200 && res.success) {
            this.frontImgId = res.data.imageNumber
            this.loading = true
          }
        })
      }

      this.formData[key] = fileList.length == 0 ? [] : fileList.map(item => item)
      this.$refs.formData.validateField([key])
    },
  },
}
</script>

<style scoped>
.create-step1 {
  padding-left: 60px;
  padding-right: 30px;
}
.el-form-item__content {
  display: flex;
  justify-content: space-between;
}
.guohui {
  margin: 0 160px 0 50px;
}

.hide::v-deep .el-upload--picture-card {
  display: none;
}
</style>
