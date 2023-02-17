<template>
  <div class="card-info">
    <el-form ref="form" :model="user" :rules="rules" label-width="100px">
      <el-form-item label="姓名" prop="oldPassword">
        <span>{{ realName }}</span>
      </el-form-item>
      <el-form-item label="新手机号" prop="mobile">
        <el-input v-model.trim="user.mobile" placeholder="请输入新手机号" />
      </el-form-item>
      <el-form-item label="验证码" prop="code" class="codeBox">
        <el-input v-model.trim="user.code" placeholder="请输入手机验证码" />

        <el-button type="primary" class="getCode pr10" v-show="flag" @click="getCode">
          {{ codeText }}
        </el-button>
        <el-button type="primary" class="getCode" v-show="!flag" @click="getCode"
          >{{ time }} S</el-button
        >
      </el-form-item>

      <div class="submit">
        <el-button type="primary" @click="next">下一步</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { utils } from '@/utils/utils'
import { Encrypt } from '@/utils/jsencrypt'
import { updateNewMobileApi, commonSendCode, isRegistPhoneApi } from '@/api/user-center/index'
import { userInfoMsg } from '@/api/enterprise-information-management/index'
export default {
  data() {
    return {
      flag: true,
      codeText: '获取验证码',
      time: 60,
      realName: '',
      user: {
        mobile: null,
        codeType: 'newMobile',
      },
      rules: {
        mobile: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur',
          },
        ],
        code: [{ required: true, message: '验证码不能为空', trigger: 'blur' }],
      },
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    // 用户基本信息
    getUserInfo() {
      userInfoMsg().then(res => {
        this.realName = res.data.realName
      })
    },
    next() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          updateNewMobileApi({
            mobile: Encrypt(this.user.mobile),
            code: this.user.code,
          }).then(res => {
            if (res.code == 200) {
              this.$emit('activeChange', 3)
            }
          })
        }
      })
    },

    getCode() {
      if (utils.isTel(this.user.mobile) && this.flag) {
        // 判断手机号是否注册
        isRegistPhoneApi({
          phone: Encrypt(this.user.mobile),
        }).then(res => {
          if (!res) {
            commonSendCode({
              mobile: Encrypt(this.user.mobile),
              codeType: 'newMobile',
              sign: 3,
            }).then(res => {
              if (res.code == 200) {
                this.flag = false
                let timer = setInterval(() => {
                  this.time -= 1
                  if (this.time === 0) {
                    clearInterval(timer)
                    this.flag = true
                    this.codeText = '重新获取'
                    this.time = 60
                  }
                }, 1000)
              }
            })
          } else {
            this.user = { mobile: null, codeType: 'newMobile' }
            this.$message({
              type: 'error',
              message: '该手机号已注册，请更换手机号',
            })
          }
        })
      }
    },
  },
}
</script>

<style scoped>
.card-info {
  width: 520px;
  margin: 50px auto;
}

.submit {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-top: 50px;
}
.codeBox {
  position: relative;
}
.getCode {
  width: 98px;
  text-align: center;
  position: absolute;
  right: 0;
  height: 100%;
}
.pr10 {
  width: 108px;
}
</style>
