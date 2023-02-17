<template>
  <div class="page-name app-container">
    <el-dialog
      :modal-append-to-body="false"
      :title="title"
      :visible.sync="open"
      width="600px"
      append-to-body
      :close-on-click-modal="false"
      @close="cancel"
    >
      <el-form ref="formData" :model="formData" :rules="formDataRules" label-width="120px">
        <el-row class="p-t-10">
          <el-col
            ><el-form-item :label="`审批结果`" prop="result" class="is-required">
              <el-radio-group v-model.trim="formData.result">
                <el-radio :label="1">通过</el-radio>
                <el-radio :label="0">不通过</el-radio>
              </el-radio-group></el-form-item
            >
          </el-col>
          <el-col
            ><el-form-item :label="`审批备注`" prop="remarks" class="is-required">
              <el-input type="textarea" v-model.trim="formData.remarks"></el-input> </el-form-item
          ></el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer text-center">
        <el-button type="primary" @click="submitForm">确定</el-button>
        <el-button type="warning" @click="cancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'Ukey',
  data() {
    return {
      title: '审批',
      open: true,
      formData: {
        result: '',
        remarks: '',
      },
      formDataRules: {
        result: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '此项必填',
          },
        ],
        remarks: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '此项必填',
          },
        ],
      },
    }
  },
  mounted: function() {},
  methods: {
    submitForm() {
      this.$refs.formData.validate((val, obj) => {
        if (val) {
          this.$emit('sure', this.formData)
        }
      })
    },
    cancel() {
      this.open = false
      this.formData = {}
      this.$emit('cancel')
    },
  },
}
</script>

<style lang="scss" scoped>
.page-name {
  padding: 10px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
