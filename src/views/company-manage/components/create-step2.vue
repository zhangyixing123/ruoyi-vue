<template>
  <el-form
    class="create-step2 m-b-20"
    ref="formData"
    :model="formData"
    :rules="formDataRules"
    label-width="180px"
  >
    <el-row>
      <el-col :span="12">
        <el-form-item label="企业管理员身份:" prop="companyAdminIdentity">
          <el-radio-group
            class="w100p p-0-20"
            v-model.trim="formData.companyAdminIdentity"
            @change="radioChange"
          >
            <div class="flex just-between">
              <div>
                <el-radio label="企业法定代表人" :disabled="!isAdmin">企业法定代表人</el-radio>
              </div>
              <!-- <div class="m-l-10">
                <el-radio label="企业授权代表人" :disabled="isAdmin">企业授权代表人</el-radio>
              </div> -->
            </div>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="formData.companyAdminIdentity == '企业法定代表人'">
      <el-col :span="12">
        <el-form-item :label="codeUrl ? '' : ''">
          <div class="text-center">
            <div>
              请使用微信扫描二维码，完成人脸识别
            </div>
            <div><img :src="codeUrl" /></div>
            <div class="f-s-14" v-if="codeUrl">
              如果二维码签名失效，点击<span class="c-1890ff cur-pointer" @click="getFaceToken"
                >重新获取</span
              >
            </div>
            <el-button type="primary" @click="getFaceResult" class="m-t-20">完成</el-button>
          </div>
        </el-form-item>
      </el-col>
    </el-row>
    <template v-if="formData.companyAdminIdentity == '企业授权代表人'">
      <el-row>
        <el-col :span="12">
          <el-form-item label="法人授权方式:" prop="authorizationWay">
            <el-radio-group
              class="w100p p-0-20"
              v-model.trim="formData.authorizationWay"
              @change="radioChange"
            >
              <div class="flex just-between">
                <div>
                  <el-radio label="法人人脸识别">法人人脸识别</el-radio>
                </div>
                <div class="m-l-10">
                  <el-radio label="上传法人授权书" :disabled="appletsResult"
                    >上传法人授权书</el-radio
                  >
                </div>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="formData.authorizationWay == '法人人脸识别'" key="法人人脸识别">
        <el-col :span="12">
          <el-form-item label="法人手机号码:" prop="mobile">
            <el-input
              v-model.trim="formData.mobile"
              placeholder=""
              :disabled="appletsResult"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="formData.authorizationWay == '上传法人授权书'" key="上传法人授权书">
        <el-col :span="24">
          <el-form-item label="上传法人身份证:" class="is-required">
            <div class="flex">
              <el-form-item label="" label-width="0px" prop="idCardFront">
                <el-upload
                  :class="{ hide: idCardFrontArea }"
                  action=" "
                  :auto-upload="false"
                  list-type="picture-card"
                  :limit="1"
                  accept=".jpg,.jpeg,.png"
                  :file-list="formData.idCardFront"
                  :on-change="
                    (file, fileList) =>
                      handleImgChange(file, fileList, 'idCardFront', 'idCardFrontArea', 'upload')
                  "
                  :on-remove="
                    (file, fileList) =>
                      handleImgChange(file, fileList, 'idCardFront', 'idCardFrontArea')
                  "
                >
                  <i class="el-icon-plus"></i>
                  <div class="el-upload__tip text-center" slot="tip">人像面</div>
                </el-upload>
              </el-form-item>
              <el-form-item class="m-l-10" label="" label-width="0px" prop="idCardBack">
                <el-upload
                  :class="{ hide: idCardBackArea }"
                  action=" "
                  :auto-upload="false"
                  list-type="picture-card"
                  accept=".jpg,.jpeg,.png"
                  :limit="1"
                  :file-list="formData.idCardBack"
                  :on-change="
                    (file, fileList) =>
                      handleImgChange(file, fileList, 'idCardBack', 'idCardBackArea', 'upload')
                  "
                  :on-remove="
                    (file, fileList) =>
                      handleImgChange(file, fileList, 'idCardBack', 'idCardBackArea')
                  "
                >
                  <i class="el-icon-plus"></i>
                  <div class="el-upload__tip text-center" slot="tip">国徽面</div>
                </el-upload>
              </el-form-item>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="上传授权书:">
            <div class="flex">
              <el-form-item label="" label-width="0px" prop="authorization">
                <el-upload
                  :class="{ hide: authorizationArea }"
                  action=" "
                  :auto-upload="false"
                  :limit="1"
                  :file-list="formData.authorization"
                  :on-change="
                    (file, fileList) =>
                      handleImgChange(
                        file,
                        fileList,
                        'authorization',
                        'authorizationArea',
                        'upload'
                      )
                  "
                  :on-remove="
                    (file, fileList) =>
                      handleImgChange(file, fileList, 'authorization', 'authorizationArea')
                  "
                  :disabled="authorizationArea"
                >
                  <el-button :disabled="authorizationArea" size="small" type="primary"
                    >点击上传</el-button
                  >
                  <div class="el-upload__tip " slot="tip">
                    <span>请上传原件或者加盖公章的复印件</span><br />
                    <span>支持word,pdf,png,jpg格式</span>
                  </div>
                </el-upload>
              </el-form-item>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="m-t-10" v-if="statusBtn && formData.authorizationWay == '法人人脸识别'">
        <el-col :span="12">
          <el-form-item label="">
            <span
              >法人授权信息已经通过短信方式，发送至{{
                formData.mobile
              }}的手机上，请按照短信提示进行授权操作，您也可以<el-button
                type="text"
                @click="getCode"
                >查看二维码</el-button
              >,法人通过微信扫描二维码完成授权操作</span
            >
            <div v-if="codeUrl" class="text-center">
              <img :src="codeUrl" />
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="m-t-10">
        <el-col :span="12">
          <el-form-item label="">
            <div class="text-center">
              <el-button
                v-if="!statusBtn"
                type="primary"
                @click="submit"
                :disabled="btnDisable"
                :loading="btnLoading"
                >确认提交</el-button
              >
              <el-button
                v-if="statusBtn && formData.authorizationWay == '法人人脸识别'"
                @click="getStatus"
                :loading="btnLoading"
                >查询状态</el-button
              >
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </template>
    <!-- <el-row class="m-t-20">
      <el-col :span="12">
        <el-form-item label="">
          <div class="text-center">
            <el-button
              type="primary"
              @click="next"
              :disabled="statusBtn && formData.authorizationWay == '法人人脸识别'"
              >下一步</el-button
            >
          </div>
        </el-form-item>
      </el-col>
    </el-row> -->
  </el-form>
</template>

<script>
// import { imgToBase64 } from '@/common/js/utils.js';
import { uploadAndGetUrlApi } from '@/api/image-management/index.js'
import { utils } from '@/utils/utils'
import {
  enterpriseAdminAuthApi,
  getFaceResultApi,
  faceCallApi,
  createCodeApi,
} from '@/api/enterprise-information-management/create-enterprise.js'
import { getFaceTokenApi } from '@/api/user-center/index'
import {
  enterpriseAdminCheckApi,
  getAuthStatusApi,
} from '@/api/enterprise-information-management/index'
import { getUid } from '@/utils/auth'
import { Encrypt, Decrypt } from '@/utils/jsencrypt'
export default {
  data() {
    /**校验手机号 */
    var validatePhone = (rule, value, callback) => {
      if (!value) {
        callback('请输入法人手机号！')
      } else {
        if (!utils.isTel(value)) {
          callback('请输入正确的手机号！')
        } else {
          callback()
        }
      }
    }
    return {
      canNext: false,
      formData: {
        companyAdminIdentity: '企业法定代表人',
        authorizationWay: '',
        mobile: '', // 法人手机号
        idCardFront: [],
        idCardBack: [],
        authorization: [],
      },
      idCardFrontArea: false, // 身份证人像面
      idCardBackArea: false, // 身份证国徽面
      authorizationArea: false, // 法人授权书
      formDataRules: {
        companyAdminIdentity: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请补充完整',
          },
        ],
        authorizationWay: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请补充完整',
          },
        ],
        mobile: [
          {
            required: true,
            validator: validatePhone,
            trigger: ['blur'],
          },
        ],
        idCardFront: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请上传人像面',
          },
        ],
        idCardBack: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请上传国徽面',
          },
        ],
        authorization: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请上传授权书',
          },
        ],
      },
      codeUrl: '',
      faceStatus: '1',
      btnDisable: false,
      btnLoading: false,
      isAdmin: false, // true是法人代表认证      false是授权代表人认证
      statusBtn: false, // 查看状态按钮
      appletsResult: false, // 小程序认证结果
      imageType: '1',
      faceId: '',
    }
  },
  props: {
    enterpriseId: {
      type: [String, Number],
    },
    status: {
      type: [Number, String],
      default: '',
    },
    legelPhone: {
      type: [Number, String],
      default: '',
    },
  },
  computed: {},
  created() {
    if (this.legelPhone) {
      this.formData.mobile = this.legelPhone
      // 中建项目仅支持企业法定代表人
      // this.formData.companyAdminIdentity = '企业授权代表人'
      this.formData.authorizationWay = '法人人脸识别'
      this.statusBtn = true
      this.appletsResult = true
    }
    this.btnDisable = this.authorizationArea = this.idCardFrontArea = this.idCardBackArea = false
    this.checkAdmin()
    this.getFaceToken()
  },
  methods: {
    // 法人校验
    checkAdmin() {
      enterpriseAdminCheckApi({
        enterpriseId: this.enterpriseId,
      }).then(res => {
        if (res.code == 200) {
          this.isAdmin = res.data
          // 中建项目仅支持企业法定代表人
          // this.formData.companyAdminIdentity = this.isAdmin ? '企业法定代表人' : '企业授权代表人'
        }
      })
    },
    // 获取小程序刷脸状态
    getStatus() {
      getAuthStatusApi({
        seqNo: this.enterpriseId,
      }).then(res => {
        if (res.code == 200) {
          this.statusBtn = false
          if (res.data.status == 0) {
            this.statusBtn = true
            this.msgSuccess('授权中')
          } else if (res.data.status == 2) {
            this.appletsResult = true
            this.btnDisable = true
            this.msgSuccess('授权成功，可点击下一步')
          } else {
            this.btnDisable = this.appletsResult = false
            this.formData.mobile = ''
            this.formData.companyAdminIdentity = '企业授权代表人'
            this.msgError('授权失败')
          }
        }
      })
    },

    async handleImgChange(file, fileList, key, type, method) {
      if (key == 'authorization' && method == 'upload') {
        const isJPG =
          file.raw.type === 'image/jpeg' ||
          file.raw.type === 'application/msword' ||
          file.raw.type === 'image/png' ||
          file.raw.type === 'application/pdf' ||
          file.raw.type ===
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

        if (!isJPG) {
          this.formData[key] = []
          this.$message.error('请上传word,pdf,png,jpg类型的文件')
          return false
        }
      }
      if ((key == 'idCardBack' || key == 'idCardFront') && method == 'upload') {
        const isJPG =
          file.raw.type === 'image/jpeg' ||
          file.raw.type === 'image/png' ||
          file.raw.type === 'image/bmp'
        if (!isJPG) {
          this.formData[key] = []
          this.$message.error('请上传png,jpg,bmp类型的文件')
          return false
        }
      }
      if (key == 'idCardBack') {
        this.imageType = '8'
      } else if (key == 'idCardFront') {
        this.imageType = '7'
      } else if (key == 'authorization') {
        this.imageType = '2'
      }
      console.log(this.imageType)
      let files = []
      for (let item of fileList) {
        if (item.raw) {
          try {
            let formData = new FormData()
            formData.append('file', item.raw)
            formData.append('imageTypeNumber', this.imageType)

            let res = await uploadAndGetUrlApi({
              file: item.raw,
              imageTypeNumber: this.imageType,
              showType: '0',
            })
            files.push({
              uid: item.uid,
              name: item.name,
              url: item.url,
              imageNumber: res.imageNumber,
            })
          } catch (error) {}
        } else {
          files.push(item)
        }
      }
      this.formData[key] = files
      this[type] = this.formData[key].length > 0
      this.$refs.formData.validateField([key])
    },
    // 获取法人授权方式二维码
    getCode() {
      createCodeApi({ enterpriseId: this.enterpriseId }).then(res => {
        this.codeUrl = window.URL.createObjectURL(res)
      })
    },
    // 选项切换
    radioChange(val) {
      // if (this.formData.companyAdminIdentity == '企业法定代表人') this.getFaceCall()
      this.formData.idCardFront = []
      this.formData.idCardBack = []
      this.formData.authorization = []
      this.statusBtn = this.authorizationArea = this.idCardFrontArea = this.idCardBackArea = false
      this.formData.mobile = ''
    },
    // 获取刷脸token
    async getFaceToken() {
      let params = {
        faceType: 2,
        userId: getUid(),
        callbackUrl: 'http://10.4.1.38:8080/user-center/certification-info',
      }
      let res = await getFaceTokenApi(params)
      if (res.code == 200) {
        this.faceId = res.data
        this.getFaceCall(params, res.data)
      }
    },
    // 获取刷脸二维码
    getFaceCall(params, faceId) {
      let urlParams = {
        ...params,
        faceId,
        enterpriseId: this.enterpriseId,
      }
      faceCallApi(urlParams).then(res => {
        this.codeUrl = window.URL.createObjectURL(res)
        // if (this.codeUrl) this.getFaceResult(urlParams)
      })
    },
    // 获取刷脸结果
    getFaceResult() {
      let that = this
      getFaceResultApi({
        faceId: this.faceId,
        enterpriseId: this.enterpriseId,
        faceType: 2,
        userId: getUid(),
        callbackUrl: 'http://10.4.1.38:8080/user-center/certification-info',
      })
        .then(res => {
          if (res.code == 200) {
            // that.next()	0- 待认证 1-认证通过 2-认证失败
            that.faceStatus = res.data.status
            if (that.faceStatus == 1) {
              that.msgSuccess('授权通过')
              that.next()
            } else {
              that.msgError('授权失败')
            }
          }
        })
        .catch(() => {
          that.clearInter(that.timer)
        })
    },
    submit() {
      this.$refs.formData.validate((valid, obj) => {
        if (valid) {
          this.btnLoading = this.btnDisable = true
          let params = {
            mobile: Encrypt(this.formData.mobile),
            enterpriseId: this.enterpriseId,
            authType:
              this.formData.companyAdminIdentity == '企业法定代表人'
                ? '1'
                : this.formData.authorizationWay == '法人人脸识别'
                ? '2'
                : '3',
          }
          if (params.authType == 3) {
            params.legalFrontImg = this.formData.idCardFront[0].imageNumber
            params.legalReversenImg = this.formData.idCardBack[0].imageNumber
            params.legalAuthFile = this.formData.authorization[0].imageNumber
          }
          enterpriseAdminAuthApi(params)
            .then(res => {
              if (res.code == 200) {
                this.btnLoading = false
                this.canNext = true
                this.msgSuccess('保存提交成功')
                if (params.mobile) this.$store.commit('SET_LEGEL_PHONE', params.mobile)
              }
              this.statusBtn = true
              this.appletsResult = true
            })
            .catch(() => {
              this.btnLoading = false
            })
        }
      })
    },
    next() {
      if (this.formData.companyAdminIdentity == '企业法定代表人') {
        if (this.faceStatus != 1) {
          this.$message({
            type: 'warning',
            message: '企业法定代表人授权未成功！',
          })
          return
        }
        let params = {
          enterpriseId: this.enterpriseId,
          authType: 1,
        }
        enterpriseAdminAuthApi(params).then(res => {
          if (res.code == 200) {
            this.status == 3 ? this.$emit('activeChange', 3) : this.$emit('activeChange', 2)
            if (this.status == 3) this.$store.commit('SET_CHECK_STATUS', 1)
          }
        })
      } else {
        if (this.canNext || (this.legelPhone && this.appletsResult)) {
          this.$store.commit('SET_LEGEL_PHONE', '')
          if (this.status == 3) {
            this.$emit('activeChange', 3)
            this.formData.authorizationWay == '法人人脸识别'
              ? this.$store.commit('SET_CHECK_STATUS', 1)
              : this.$store.commit('SET_CHECK_STATUS', 2)
          } else {
            this.$emit('activeChange', 2)
          }
        } else {
          this.msgInfo('请先提交！')
        }
      }
    },
  },
}
</script>

<style lang="scss">
.create-step2 {
  padding-left: 120px;
  padding-right: 30px;
}
.hide {
  .el-upload--picture-card {
    display: none;
  }
}
</style>
