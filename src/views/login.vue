<template>
  <div class="login">
    <div class="login-info">
      <div class="login-title-name">供应链金融服务平台</div>
      <div class="decorate-line"></div>
      <div class="login-desc">
        深度融合供应链交易场景特征，构建合作、共享、共赢的开放协同供应链生态圈体系
      </div>
    </div>
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <div class="logo">
        <img src="../assets/logo/logo.png" alt="" />
      </div>
      <el-tabs v-model.trim="activeName" @tab-click="handleClick" v-if="hj == 'development'">
        <el-tab-pane label="密码登录" name="first">
          <el-form-item prop="mobile">
            <el-input
              v-model.trim="loginForm.mobile"
              type="text"
              auto-complete="off"
              placeholder="手机号"
            >
              <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model.trim="loginForm.password"
              type="password"
              auto-complete="off"
              placeholder="密码"
              @keyup.enter.native="handleLogin"
            >
              <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
            </el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="验证码登录" name="second">
          <el-form-item prop="mobile">
            <el-input
              v-model.trim="loginForm.mobile"
              type="text"
              auto-complete="off"
              placeholder="手机号"
            >
              <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
            </el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input
              v-model.trim="loginForm.code"
              type="text"
              auto-complete="off"
              placeholder="手机验证码"
            >
              <div slot="append">
                <el-button type="text" size="small" @click="handlePhoneCode">{{
                  codeTitle
                }}</el-button>
              </div>
            </el-input>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
      <div v-else>
        <div class="text-center m-b-10 c-606266">
          验证码登录
        </div>
        <el-form-item prop="mobile">
          <el-input
            v-model.trim="loginForm.mobile"
            type="text"
            auto-complete="off"
            placeholder="手机号"
          >
            <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            v-model.trim="loginForm.code"
            type="text"
            auto-complete="off"
            placeholder="手机验证码"
          >
            <div slot="append">
              <el-button type="text" size="small" @click="handlePhoneCode">{{
                codeTitle
              }}</el-button>
            </div>
          </el-input>
        </el-form-item>
      </div>
      <el-form-item style="width: 100%">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width: 100%"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
      <!-- <el-form-item>
        <div class="flex-content">
          <div class="register">
            没有账号？<el-button type="text" @click="handleRegister">去注册</el-button>
          </div>
          <div class="reset">
            <el-button type="text" @click="handleReset">忘记密码？</el-button>
          </div>
        </div>
      </el-form-item> -->
    </el-form>
    <!--  底部  -->
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
  </div>
</template>

<script>
// import { getCodeImg } from "@/api/login";
import Cookies from 'js-cookie'
import { utils } from '@/utils/utils.js'
import GeneratorVerifyCode from 'components/GeneratorVerifyCode'
import * as Api from '@/api/user-center/index'
import { mapState } from 'vuex'
import { Encrypt, Decrypt } from '@/utils/jsencrypt'

export default {
  name: 'Login',
  components: {
    'generator-verify-code': GeneratorVerifyCode,
  },
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
      codeUrl: '',
      cookiePassword: '',
      loginForm: {
        mobile: undefined,
        password: undefined,
        rememberMe: false,
        code: '',
      },
      loginRules: {
        mobile: [
          {
            required: true,
            validator: validatePhone,
            trigger: ['blur'],
          },
        ],
        password: [],
        code: [],
      },
      loading: false,
      redirect: undefined,
      identifyCode: '',
      identifyCodes: '0123456789abcdwerwshdjeJKDHRJHKOOPLMKQ', //绘制的随机数
      activeName: 'second',
      codeTitle: '获取验证码',
      verfyCodeDialog: false,
      verfyForm: {
        verfyCode: '',
      },
      verfyCodeImg: '',
      hj: '',
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true,
    },
  },
  created() {
    this.hj = process.env.NODE_ENV
    // 联登逻辑处理
    if (this.$route.query.code) {
      let relevanceLoginCode = this.$route.query.code
      let userLoginByThirdReqParam = {
        code: relevanceLoginCode,
      }
      this.$store.dispatch('UserLoginByThird', userLoginByThirdReqParam).then(res => {
        if (res.data.register) {
          //已注册
          this.$store.commit('SET_TOKEN', '')
          this.$store.commit('SET_ENTERPRISE_NAME', '')
          this.$store.commit('SET_ENTERPRISE_CERNO', '')
          this.$store.commit('SET_ENTERPRISE_ID', '')
          this.$store.commit('SET_ISREALNAME', '')
          this.$store.dispatch('isRealName')
          this.$store.dispatch('isEnterprice')
          this.$router.push({ path: this.redirect || '/' }).catch(() => {})
        } else {
          //未注册，跳转到完善信息
          this.$router.push({
            path: `/registerPerfectMsg`,
            query: { thirdPersonName: res.data.thirdPersonName, thirdUserId: res.data.thirdUserId },
          })
        }
      })
    }

    this.initData()
  },
  computed: {},
  methods: {
    handleClick() {
      if (this.activeName == 'first') {
        this.loginRules.code = []
        this.loginRules.password = [{ required: true, trigger: 'blur', message: '密码不能为空' }]
        this.loginForm.code = ''
      } else {
        this.loginRules.password = []
        this.loginRules.code = [{ required: true, trigger: 'change', message: '验证码不能为空' }]
        this.loginForm.password = ''
      }
      this.$refs.loginForm.clearValidate()
    },
    initData() {
      this.code = ''
      this.activeName = 'second'
      this.loginRules.password = [{ required: true, trigger: 'blur', message: '密码不能为空' }]
    },
    //原有逻辑
    // getCode() {
    //   getCodeImg().then(res => {
    //     this.codeUrl = "data:image/gif;base64," + res.img;
    //     this.loginForm.uuid = res.uuid;
    //   });
    // },

    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(this.loginForm))
          params.mobile = Encrypt(params.mobile)
          params.password = Encrypt(params.password)
          params.type = this.activeName
          params.smsVerifyCode = params.code
          delete params.rememberMe
          delete params.code
          //原本逻辑
          this.$store.dispatch('Login', params).then(() => {
            this.$store.commit('SET_TOKEN', '')
            this.$store.commit('SET_ENTERPRISE_NAME', '')
            this.$store.commit('SET_ENTERPRISE_CERNO', '')
            this.$store.commit('SET_ENTERPRISE_ID', '')
            this.$store.commit('SET_ISREALNAME', '')
            this.$store.dispatch('isRealName')
            this.$store.dispatch('isEnterprice')
            this.$router.push({ path: this.redirect || '/' }).catch(() => {})
          })
        }
      })
    },
    handleRegister() {
      this.$router.push({ path: `/register` })
    },
    handleReset() {
      this.$router.push({ path: `/reset` })
    },
    /**获取验证码 */
    handlePhoneCode() {
      if (this.codeTitle !== '获取验证码') {
        return
      }
      if (!this.loginForm.mobile) {
        this.$message({
          type: 'warning',
          message: '请输入手机号',
        })
        return
      }
      if (!utils.isTel(this.loginForm.mobile)) {
        this.$message({
          type: 'warning',
          message: '请输入正确的手机号！',
        })
        return
      }
      Api.garphVerfyCode({
        mobile: Encrypt(this.loginForm.mobile),
        sign: 1,
      }).then(res => {
        this.verfyCodeImg = window.URL.createObjectURL(res)
        this.verfyCodeDialog = true
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
        mobile: Encrypt(this.loginForm.mobile),
        verfyCode: this.verfyForm.verfyCode,
        sign: 1,
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
    // handlePhoneCode: utils.debounce(function() {
    //   if (this.codeTitle !== '获取验证码') {
    //     return
    //   }
    //   if (!this.loginForm.mobile) {
    //     this.$message({
    //       type: 'warning',
    //       message: '请输入手机号！',
    //     })
    //     return
    //   }
    //   let data = {
    //     mobile: Encrypt(this.loginForm.mobile),
    //   }
    //   Api.loginAndRegisterSendCode(data).then(res => {
    //     if (res.code == 200) {
    //       this.$message({
    //         message: res.msg,
    //         type: 'success',
    //       })
    //       let count = 60
    //       this.codeTitle = count + 's后可再次发送 '
    //       let interval = setInterval(() => {
    //         if (count > 1) {
    //           this.codeTitle = --count + 's后可再次发送 '
    //         } else {
    //           clearInterval(interval)
    //           this.codeTitle = '获取验证码'
    //         }
    //       }, 1000)
    //     } else {
    //       this.$message({
    //         message: res.msg,
    //         type: 'error',
    //       })
    //     }
    //   })
    // }, 500),
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.login {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 200px;
  height: 100%;
  background-image: url('../assets/images/login-background.jpg');
  background-size: cover;
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.decorate-line {
  width: 35%;
  margin: 0 auto;
  height: 2px;
  background-color: #fff;
}

.logo {
  margin: 0 auto;
  text-align: center;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  min-width: 400px;
  padding: 30px 25px 40px;
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}

.login-info {
  padding: 0 150px;
  margin-bottom: 50px;
  color: #fff;
  .login-title-name {
    font-size: 40px;
    margin-bottom: 5px;
    text-align: center;
  }
  .login-desc {
    margin-top: 30px;
    font-size: 24px;
  }
}
@media screen and (max-width: 1500px) {
  .login-info {
    padding: 0 50px;
  }
  .login {
    padding: 0 50px;
  }
}
@media screen and (max-width: 1600px) {
  .login-info {
    padding: 0 80px;
  }
  .login {
    padding: 0 80px;
  }
}
.flex-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .register {
    font-size: 14px;
  }
}
::v-deep .el-tabs__nav {
  width: 100%;
  display: flex;
  justify-content: space-around;
}
::v-deep .el-tabs__active-bar {
  display: none;
}
::v-deep .el-tabs__item {
  padding: 0;
}
::v-deep .el-tabs__item.is-active {
  border-bottom: 2px solid;
}
.verfyCodeImg {
  width: 72px;
  height: 26px;
}
</style>
