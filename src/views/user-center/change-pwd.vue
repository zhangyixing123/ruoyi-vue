<template>
  <div class="card-info">
    <el-form ref="form" :model="user" :rules="rules" label-width="100px">
      <el-form-item label="当前密码" prop="password">
        <el-input v-model.trim="user.password" placeholder="请输入旧密码" type="password" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model.trim="user.newPassword" placeholder="请输入新密码" type="password" />
      </el-form-item>
      <el-form-item label="重复新密码" prop="newPasswordConfirm">
        <el-input v-model.trim="user.newPasswordConfirm" placeholder="请确认密码" type="password" />
      </el-form-item>

      <div class="submit">
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { modifyPasswordApi } from '@/api/enterprise-information-management/index'
import { validPassword } from '@/utils/validate'
export default {
  data() {
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
        if (this.user.newPassword !== value) {
          callback('两次密码输入不一致！')
        } else {
          callback()
        }
      }
    }

    return {
      test: '1test',
      user: {
        password: undefined,
        newPassword: undefined,
        newPasswordConfirm: undefined,
      },
      // 表单校验
      rules: {
        password: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }],
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
      },
    }
  },

  methods: {
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          modifyPasswordApi(this.user).then(response => {
            if (response.code == 200) {
              this.$message({
                message: '修改成功，请重新登录 ',
                type: 'success',
              })
              setTimeout(() => {
                this.$store.dispatch('LogOut')
                this.$router.push(`/login`)
              }, 1000)
            }
          })
        }
      })
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
</style>
