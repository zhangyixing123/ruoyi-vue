<template>
  <div class="">
    <el-dialog
      :modal-append-to-body="false"
      :title="title"
      :visible.sync="open"
      width="600px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="formData" :model="formData" :rules="formDataRules" label-width="120px">
        <el-row class="p-t-10">
          <el-col
            ><el-form-item :label="`请输入用户口令`" prop="ukey" class="is-required">
              <el-input v-model.trim="formData.ukey"></el-input> </el-form-item
          ></el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer text-center">
        <el-button type="primary" @click="submitForm">确定</el-button>
        <el-button type="warning" @click="close">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'Ukey',
  props: {
    sure: {
      type: Function,
    },
    cancel: {
      type: Function,
    },
  },
  data() {
    return {
      title: '验证USBKey用户口令',
      open: false,
      formData: {
        ukey: '',
        reasonRejection: '',
      },
      formDataRules: {
        ukey: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '此项必填',
          },
        ],
      },
    }
  },
  watch: {
    open() {
      this.$nextTick(() => {
        this.$refs.formData.clearValidate()
      })
    },
  },
  methods: {
    submitForm() {
      this.$refs.formData.validate((val, obj) => {
        if (val) {
          this.$emit('sure')
          this.close()
        }
      })
    },
    close() {
      this.formData = {}
      this.$emit('cancel')
    },
  },
}
</script>

<style lang="scss" scoped></style>
