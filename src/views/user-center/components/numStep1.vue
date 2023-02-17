<template>
  <div class="card-info">
    <el-form ref="form" :model="user" :rules="rules" label-width="100px">
      <el-form-item label="姓名" prop="oldPassword">
        <span>{{ realName }}</span>
      </el-form-item>
      <el-form-item label="用户名" prop="mobile">
        <span>{{ realPhone }}</span>
      </el-form-item>
      <el-form-item label="密码" prop="passWord" class="codeBox">
        <el-input v-model.trim="user.passWord" type="password" placeholder="请输入密码" />
      </el-form-item>

      <div class="submit">
        <el-button type="primary" @click="next">下一步</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { checkPasswordApi } from '@/api/user-center/index'
import { userInfoMsg } from '@/api/enterprise-information-management/index'
import { Decrypt } from '@/utils/jsencrypt'
export default {
  data() {
    return {
      realName: '',
      realPhone: '',
      user: {
        passWord: undefined,
      },
      mobile: null,
      rules: {
        passWord: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
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
        this.realPhone = Decrypt(res.data.realPhone)
      })
    },

    next() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          checkPasswordApi({ password: this.user.passWord }).then(res => {
            if (res.code == 200) {
              this.$emit('activeChange', 2)
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
.codeBox {
  position: relative;
}
</style>
