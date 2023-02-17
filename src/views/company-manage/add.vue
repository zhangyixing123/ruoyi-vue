<template>
  <div>
    <el-button @click="back" size="small">返回</el-button>
    <div class="company-manage-add">
      <p>
        企业管理员将您添加为成员后，系统将自动发送6位邀请码,请将邀请码输入下方后点击提交即完成关联
      </p>
      <div class="flex align-center m-t-20">
        <span>邀请码:</span>
        <div class="w200 m-l-10">
          <el-input v-model.trim="inviteCode"></el-input>
        </div>
      </div>
      <div class="m-t-20 w280 text-center">
        <el-button type="primary" @click="submit">确认提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { joinEnterpriseByUserApi } from '@/api/user-center/index'
export default {
  name: 'company-manage-add',
  props: {
    showIndex: {
      type: Function,
    },
  },
  data() {
    return {
      inviteCode: '',
    }
  },
  methods: {
    submit() {
      if (this.inviteCode) {
        joinEnterpriseByUserApi({ recommendCode: this.inviteCode }).then(res => {
          console.log(res.data)
          // 这里需要提示用户加入成功
          if (res.code == 200) {
            this.$message({
              type: 'success',
              message: '邀请成功',
            })
            this.$emit('showIndex')
          }
        })
      } else {
        this.$message('请输入邀请码')
      }
    },
    back() {
      this.$emit('showIndex')
    },
  },
}
</script>

<style lang="scss">
.company-manage-add {
  padding-top: 50px;
  padding-left: 100px;
}
</style>
