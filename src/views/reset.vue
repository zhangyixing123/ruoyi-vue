<template>
  <div class="reset">
    <div class="register-banner">
      <img class="logo" src="../assets/logo/logo.png" alt="" />
      <h3 class="title">找回密码</h3>
    </div>
    <el-form
      ref="resetForm"
      :model="resetForm"
      :rules="registerRules"
      label-width="100px"
      class="register-form"
    >
      <el-row>
        <el-form-item prop="mobile" label="手机号">
          <el-input
            v-model.trim="resetForm.mobile"
            type="text"
            auto-complete="off"
            placeholder="请输入手机号"
          >
          </el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="graphyVerifyCode" label="图形验证码">
          <div class="flex">
            <el-input
              v-model.trim="resetForm.graphyVerifyCode"
              auto-complete="off"
              placeholder="请输入图形验证码"
            >
              <div slot="append">
                <span class="verfyCodeImg cur-pointer" v-if="!showVerfyCode" @click="getVerfyCode"
                  >图形验证码</span
                >
                <img
                  class="verfyCodeImg cur-pointer"
                  :src="verfyCodeImg"
                  alt=""
                  v-else
                  @click="getVerfyCode"
                />
              </div>
            </el-input>
          </div>
        </el-form-item>
      </el-row>
      <el-row>
        <span style="float:right" class="f-s-12" v-show="showVerfyCode"
          >图片不清晰？点击图片刷新一下</span
        >
      </el-row>
      <el-row :class="showVerfyCode ? 'smsVerifyCode' : ''">
        <el-form-item prop="smsVerifyCode" label="手机验证码">
          <el-input
            v-model.trim="resetForm.smsVerifyCode"
            type="text"
            auto-complete="off"
            placeholder="请输入手机验证码"
          >
            <div slot="append">
              <el-button type="text" @click="handleCode">
                <span>{{ codeTitle }}</span>
              </el-button>
            </div>
          </el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="newPassword" label="设置密码">
          <el-input
            v-model.trim="resetForm.newPassword"
            type="password"
            auto-complete="off"
            placeholder="密码"
          >
          </el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="newPasswordConfirm" label="确认密码">
          <el-input
            v-model.trim="resetForm.newPasswordConfirm"
            type="password"
            auto-complete="off"
            placeholder="确认密码"
          >
          </el-input>
        </el-form-item>
      </el-row>

      <el-form-item label-width="0px" style="width:100%; text-align:center;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:60%"
          @click.native.prevent="handleRegister"
        >
          <span v-if="!loading">提交</span>
          <span v-else>提 交 中...</span>
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="text" @click="handleLogin">去登录</el-button>
      </el-form-item>
    </el-form>
    <div class="el-login-footer">
      <span>Copyright © 2018-2021 msokd.com All Rights Reserved.</span>
    </div>
  </div>
</template>

<script>
import { utils } from '@/utils/utils.js'
import { Encrypt, Decrypt } from '@/utils/jsencrypt'

import GeneratorVerifyCode from 'components/GeneratorVerifyCode'
import * as Api from '@/api/user-center/index'
import { validPassword } from '@/utils/validate'
import { mapState } from 'vuex'
export default {
  name: 'reset',
  components: {
    'generator-verify-code': GeneratorVerifyCode,
  },
  mixins: [],
  props: [],
  data() {
    /**校验手机号 */
    var validatemobile = (rule, value, callback) => {
      if (!value) {
        callback('请输入手机号！')
      } else {
        if (!utils.isTel(value)) {
          callback('请输入正确的手机号！')
        } else {
          Api.isRegistPhoneApi({
            phone: Encrypt(value),
          }).then(res => {
            if (!res) {
              this.isRegister = false
              callback('该手机号未注册')
            } else {
              this.isRegister = true
              callback()
            }
          })
        }
      }
    }
    /**校验密码 validatePwd*/
    var validatePwd = (rule, value, callback) => {
      if (!value) {
        callback('请输入密码！')
      } else {
        if (!validPassword(value)) {
          callback('密码格式不正确，需要最低8位数字和字母组成!')
        } else {
          callback()
        }
      }
    }
    /**校验重复密码 */
    var validateRePwd = (rule, value, callback) => {
      if (!value) {
        callback('请再次输入密码！')
      } else {
        if (this.resetForm.newPassword !== value) {
          callback('两次密码输入不一致！')
        } else {
          callback()
        }
      }
    }
    return {
      resetForm: {
        mobile: undefined,
        newPassword: undefined,
        newPasswordConfirm: undefined,
        graphyVerifyCode: undefined,
        smsVerifyCode: undefined,
        rememberMe: false,
      },
      codeTitle: '获取验证码',
      loading: false,
      codeUrl: '',
      registerRules: {
        mobile: [
          {
            required: true,
            validator: validatemobile,
            trigger: ['blur'],
          },
        ],
        newPassword: [
          {
            required: true,
            validator: validatePwd,
            trigger: ['change', 'blur'],
          },
        ],
        newPasswordConfirm: [
          {
            required: true,
            validator: validateRePwd,
            trigger: ['change', 'blur'],
          },
        ],
        smsVerifyCode: [
          {
            required: true,
            message: '请输入手机验证码！',
            trigger: ['change', 'blur'],
          },
        ],
        graphyVerifyCode: [
          {
            required: true,
            message: '请输入图形验证码！',
            trigger: ['blur'],
          },
        ],
      },
      verfyCodeImg: '',
      showVerfyCode: false,
      isRegister: false,
    }
  },
  computed: {},
  watch: {},
  filters: {},
  created() {},
  mounted() {},
  destroyed() {},
  methods: {
    /**获取图形验证码 */
    getVerfyCode() {
      if (!this.resetForm.mobile) {
        this.$message({
          type: 'warning',
          message: '请输入手机号',
        })
        return
      }
      if (!utils.isTel(this.resetForm.mobile)) {
        this.$message({
          type: 'warning',
          message: '请输入正确的手机号！',
        })
        return
      }
      if (!this.isRegister) {
        this.$message({
          type: 'warning',
          message: '该手机号未注册！',
        })
        return
      }
      this.graphyVerifyCode()
    },
    graphyVerifyCode() {
      this.resetForm.graphyVerifyCode = ''
      Api.garphVerfyCode({
        mobile: Encrypt(this.resetForm.mobile),
        sign: 1,
      }).then(res => {
        this.verfyCodeImg = window.URL.createObjectURL(res)
        this.showVerfyCode = true
      })
    },
    handleRegister() {
      this.$refs.resetForm.validate(validate => {
        if (validate) {
          this.loading = true
          let params = JSON.parse(JSON.stringify(this.resetForm))
          params.mobile = Encrypt(params.mobile)
          params.newPassword = Encrypt(params.newPassword)
          params.newPasswordConfirm = Encrypt(params.newPasswordConfirm)
          Api.modifyPasswordByPassApi(params)
            .then(res => {
              if (res.code === 200) {
                this.resetCallback()
              }
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },

    handleLogin() {
      this.$router.push({ path: `/login` })
    },

    //注册成功后续模拟反馈
    resetCallback() {
      this.loading = false
      this.$confirm('密码重置成功', '提示', {
        type: 'success',
        confirmButtonText: '去登录',
        cancelButtonText: '关闭',
      }).then(() => {
        this.handleLogin()
      })
    },
    /**获取验证码 */
    handleCode: utils.debounce(function() {
      if (this.codeTitle !== '获取验证码') {
        return
      }
      if (!this.resetForm.graphyVerifyCode) {
        this.$message({
          type: 'warning',
          message: '请先获取图形验证码！',
        })
        return
      }
      let data = {
        mobile: Encrypt(this.resetForm.mobile),
        verfyCode: this.resetForm.graphyVerifyCode,
        sign: 2,
      }
      Api.sendRegisterCodeApi(data)
        .then(res => {
          if (res.code === 200) {
            let count = 60
            this.codeTitle = count + 's后可再次发送'
            let interval = setInterval(() => {
              if (count > 1) {
                this.codeTitle = --count + 's后可再次发送'
              } else {
                clearInterval(interval)
                this.codeTitle = '获取验证码'
              }
            }, 1000)
          } else {
            this.$message({
              type: 'warning',
              message: res.data.msg,
            })
          }
        })
        .catch(() => {
          this.resetForm.graphyVerifyCode = ''
          this.graphyVerifyCode()
        })
    }, 500),
  },
}
</script>

<style lang="scss" scoped>
.reset {
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
  left: 10%;
  height: 64px;
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

.login-code {
  width: 120px;
  height: 38px;
  margin-left: 10px;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.verfyCodeImg {
  width: 72px;
  height: 26px;
}
::v-deep .el-form-item {
  margin-bottom: 0;
  margin-top: 22px;
}
.smsVerifyCode ::v-deep .el-form-item {
  margin-top: 6px;
}
</style>
