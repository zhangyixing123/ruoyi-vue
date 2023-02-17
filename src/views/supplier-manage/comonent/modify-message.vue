<template>
  <div>
    <el-dialog :modal-append-to-body="false" :visible.sync="show" width="30%" center>
      <div class="header">
        信息修改
      </div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="150px"
        class="demo-ruleForm"
      >
        <el-form-item label="供应商名称:" prop="supplyName">
          <el-input v-model.trim="ruleForm.supplyName"></el-input>
        </el-form-item>
        <el-form-item label="统一社会信用代码:" prop="cerNo">
          <el-input v-model.trim="ruleForm.cerNo"></el-input>
        </el-form-item>
        <el-form-item label="联系人:" prop="linkman">
          <el-input v-model.trim="ruleForm.linkman"></el-input>
        </el-form-item>
        <el-form-item label="联系方式:" prop="phone">
          <el-input v-model.trim="ruleForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="m-t-20">
        <el-button type="primary" size="small" @click="submitForm('ruleForm')">确认提交</el-button>
        <el-button @click="resetForm('ruleForm')" size="small">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
    editInfo: {
      type: Object,
    },
  },
  data() {
    return {
      show: false,
      ruleForm: {
        supplyName: '',
        cerNo: '',
        linkman: '',
        phone: '',
      },
      rules: {
        supplyName: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
        cerNo: [{ required: true, message: '请输入统一社会信用代码', trigger: 'blur' }],
        linkman: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
      },
    }
  },
  watch: {
    show(change) {
      if (change) {
        this.ruleForm = {
          supplyName: '',
          cerNo: '',
          linkman: '',
          phone: '',
        }
        if (this.isEdit) {
          this.ruleForm = this.editInfo
        }
      }
    },
  },
  computed: {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.show = false
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.show = false
    },
  },
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 0;
}
::v-deep .el-dialog__header {
  display: none;
}
::v-deep .el-checkbox__inner {
  border-radius: 50%;
}
.header {
  background: #f2f2f2;
  padding: 10px;
  color: #000;
  font-weight: 600;
  font-size: 16px;
}
.demo-ruleForm {
  padding: 20px 40px 20px 20px;
}
</style>
