<template>
  <div class="register">
    <div class="register-banner">
      <img class="logo" src="../assets/logo/logo.png" alt="" />
      <h3 class="title">完善信息</h3>
    </div>
    <el-form
      ref="registerForm"
      :model="registerForm"
      :rules="registerRules"
      label-width="100px"
      class="register-form"
    >
      <el-row>
        <el-form-item prop="mobile" label="手机号">
          <el-input
            v-model.trim="registerForm.mobile"
            type="text"
            auto-complete="off"
            placeholder="手机号"
          >
          </el-input>
        </el-form-item>
      </el-row>
      <el-row class="code">
        <el-form-item prop="code" label="手机验证码">
          <el-input
            v-model.trim="registerForm.code"
            type="text"
            auto-complete="off"
            placeholder="验证码"
            id="c1"
          >
            <div slot="append">
              <el-button type="text" size="small" @click="handlePhoneCode">{{
                codeTitle
              }}</el-button>
            </div>
          </el-input>
        </el-form-item>
      </el-row>

      <el-row style="text-align: center">
        <el-checkbox
          v-model.trim="registerForm.rememberMe"
          style="margin: 0px auto 25px; text-align: center"
          >我已阅读
          <el-button type="text" @click="getFileShow('REGISTER', 'REGISTER_PROTOCOL')"
            >《用户注册协议》</el-button
          >
        </el-checkbox>
      </el-row>

      <el-form-item label-width="0px" style="width: 100%; text-align: center">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width: 60%"
          @click.native.prevent="handleRegister"
        >
          <span v-if="!loading">注册</span>
          <span v-else>注 册 中...</span>
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="text" @click="handleLogin">去登录</el-button>
      </el-form-item>
    </el-form>
    <div class="el-login-footer">
      <span>Copyright © 2018-2021 msokd.com All Rights Reserved.</span>
    </div>

    <el-dialog
      :modal-append-to-body="false"
      title="图形验证码"
      :visible.sync="verfyCodeDialog"
      width="30%"
      center
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      append-to-body
      @close="closeDialog"
    >
      <el-form ref="verfyForm" :model="verfyForm" label-width="100px">
        <el-form-item prop="verfyCode" label="图形验证码">
          <el-input
            v-model.trim="verfyForm.verfyCode"
            type="text"
            auto-complete="off"
            placeholder="验证码"
          >
            <div slot="append">
              <img class="verfyCodeImg" @click="handlePhoneCode" :src="verfyCodeImg" alt="" />
            </div>
          </el-input>
        </el-form-item>
      </el-form>
      <span style="float: right">图片不清晰？点击图片刷新一下</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="checkVerfyCode">立即提交</el-button>
      </span>
    </el-dialog>

    <!-- 查看合同弹框 -->
    <el-dialog
      :modal-append-to-body="false"
      class="text-center"
      :visible.sync="fileShow"
      width="720px"
      append-to-body
    >
      <span v-html="msg" class="template-preview"></span>
    </el-dialog>
  </div>
</template>

<script>
// FIXME:引入顺序，先引入npm包，再是绝对路径，最后是相对路径
import * as Api from '@/api/user-center/index'
import { utils } from '@/utils/utils.js'
import { Encrypt, Decrypt } from '@/utils/jsencrypt'
import {
  getDataDictApi,
  previewContractByTemplateCodeApi,
  previewLoginContractByTemplateCodeApi,
} from '@/api/amount-management/index'
export default {
  name: 'registerPerfectMsg',
  components: {},
  mixins: [],
  props: [],
  data() {
    /**校验手机号 */
    var validatePhone = (rule, value, callback) => {
      if (!value) {
        callback('请输入手机号！')
      } else {
        if (!utils.isTel(value)) {
          callback('请输入正确的手机号！')
        } else {
          callback()
        }
      }
    }
    return {
      fileShow: false,
      msg: '',
      registerForm: {
        mobile: undefined,
        code: undefined,
        rememberMe: false,
        verfyCode: undefined,
      },
      verfyForm: {
        verfyCode: undefined,
      },
      loading: false,
      codeTitle: '获取验证码',
      registerRules: {
        mobile: [
          {
            required: true,
            validator: validatePhone,
            trigger: ['blur'],
          },
        ],
        code: [],
      },
      verfyCodeImg: '',
      showVerfyCode: false,
      verfyCodeDialog: false,
      isSendSuccess: false, // 是否已发送短信
    }
  },
  computed: {},
  watch: {},
  filters: {},
  created() {},
  mounted() {},
  destroyed() {},
  methods: {
    // 查看文件
    getFileShow(type, code) {
      this.fileShow = true
      getDataDictApi({ dictType: type, dictCode: code }).then(res => {
        if (res.code == 200) {
          const dictValue = res.data.find(item => item.dictCode == code).dictValue
          // previewContractByTemplateCodeApi({ templateCode: dictValue }).then((res) => {
          previewLoginContractByTemplateCodeApi({ templateCode: dictValue }).then(res => {
            let str = res.substr(0, res.indexOf('<style>')) + res.substr(res.indexOf('</style>'))
            this.msg = str
            document.close()
            this.fileShow = true
          })
        }
      })
    },
    handleRegister() {
      this.registerRules.code = [
        {
          required: true,
          message: '请输入验证码！',
          trigger: ['change', 'blur'],
        },
      ]
      this.$refs.registerForm.validate(validate => {
        if (validate) {
          if (this.registerForm.rememberMe) {
            this.loading = true
            this.register()
          } else {
            this.$alert('请先阅读并勾选协议！', '提示', {
              type: 'warning',
            })
          }
        }
      })
    },
    register() {
      this.loading = false
      let params = JSON.parse(JSON.stringify(this.registerForm))
      params.mobile = Encrypt(params.mobile)
      //完善信息这里固定写死
      params.password = Encrypt('123456qwe')
      params.comfirmPassword = Encrypt('123456qwe')
      params.thirdPersonName = this.$route.query.thirdPersonName
      params.thirdUserId = this.$route.query.thirdUserId

      console.log('params', params)
      Api.registUserApi(params).then(res => {
        if (res.code === 200) {
          this.registerCallback(res)
        }
      })
    },
    handleLogin() {
      this.$router.push({ path: '/login' })
    },
    //注册成功后续模拟反馈
    registerCallback(res) {
      this.loading = false
      this.$store.dispatch('UserLoginByThirdPerfectMsgSuccess', res).then(() => {
        this.$store.commit('SET_TOKEN', '')
        this.$store.commit('SET_ENTERPRISE_NAME', '')
        this.$store.commit('SET_ENTERPRISE_CERNO', '')
        this.$store.commit('SET_ENTERPRISE_ID', '')
        this.$store.commit('SET_ISREALNAME', '')
        this.$store.dispatch('isRealName')
        this.$store.dispatch('isEnterprice')
        this.$router.push({ path: this.redirect || '/' }).catch(() => {})
      })
    },
    /**获取图形验证码 */
    handlePhoneCode() {
      // var myCaptcha = _dx.Captcha(document.getElementById('c1'), {
      //   appId: '9f7501750785dc6fc5141a2', //appId，在控制台中“应用管理”或“应用配置”模块获取
      //   success: function(token) {
      //     console.log('token:', token)
      //   },
      //   fail: function(msg) {
      //     console.log(msg)
      //   },
      // })

      if (this.codeTitle !== '获取验证码') {
        return
      }
      Api.isRegistPhoneApi({
        phone: Encrypt(this.registerForm.mobile),
      }).then(res => {
        if (!res) {
          this.$refs.registerForm.clearValidate()
          this.registerRules.code = []
          this.$refs.registerForm.validate(validate => {
            if (validate) {
              Api.garphVerfyCode({ mobile: Encrypt(this.registerForm.mobile) }).then(res => {
                this.verfyCodeImg = window.URL.createObjectURL(res)
                this.verfyCodeDialog = true
              })
            }
          })
        } else {
          this.$message({
            type: 'error',
            message: '该手机号已注册，请更换手机号',
          })
        }
      })
    },
    closeDialog() {
      this.verfyForm.verfyCode = undefined
      this.$refs.verfyForm.clearValidate()
    },
    checkVerfyCode: utils.debounce(function() {
      if (!this.verfyForm.verfyCode) {
        this.$message({
          type: 'warning',
          message: '请输入图形验证码！',
        })
        return
      }
      let data = {
        mobile: Encrypt(this.registerForm.mobile),
        verfyCode: this.verfyForm.verfyCode,
        sign: 0,
      }
      Api.sendRegisterCodeApi(data)
        .then(res => {
          if (res.code == 200) {
            this.$message({
              message: res.msg,
              type: 'success',
            })
            let count = 60
            this.codeTitle = count + 's后可再次发送 '
            let interval = setInterval(() => {
              if (count > 1) {
                this.codeTitle = --count + 's后可再次发送 '
              } else {
                clearInterval(interval)
                this.codeTitle = '获取验证码'
              }
            }, 1000)
          } else {
            this.$message({
              message: res.msg,
              type: 'error',
            })
          }
          this.verfyCodeDialog = false
        })
        .catch(() => {
          this.verfyForm.verfyCode = ''
          this.handlePhoneCode()
        })
    }, 500),
  },
}
</script>

<style lang="scss" scoped>
.register {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 200px;
  height: 100%;
  // background-image: url("../assets/images/login-background.jpg");
  background-size: cover;
}

.register-banner {
  background: #1890ff;
  width: 80%;
  height: 64px;
  left: 10%;
  top: 20px;
  display: flex;
  position: absolute;
}

.logo {
  margin-left: 20%;
}
.title {
  color: #fff;
  padding-left: 10px;
  margin-left: 10px;
  border-left: 1px solid #fff;
}

.register-form {
  border-radius: 6px;
  background: #ffffff;
  width: 800px;
  padding: 25px 25px 5px 25px;
  // .el-input {
  //   height: 38px;
  //   input {
  //     height: 38px;
  //   }
  // }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #232323;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.verfyCodeImg {
  width: 72px;
  height: 26px;
}
.code ::v-deep .el-form-item__label::before {
  content: '*';
  color: #ff4949;
  margin-right: 4px;
}
</style>
