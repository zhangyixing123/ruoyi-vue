<template>
  <div class="out-account-step-three">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="1.填写银行账号"></el-step>
      <el-step title="2.账号实名验证"></el-step>
      <el-step title="3.签署绑定协议"></el-step>
      <el-step title="4.绑定成功"></el-step>
    </el-steps>
    <div ref="editor" id="editor"></div>
    <div class="agree-btn">
      <el-checkbox v-model.trim="agreement">勾选代表您同意上述协议</el-checkbox>
      <el-button :disabled="!agreement" @click="handleSubmit" type="primary">
        下一步
      </el-button>
    </div>
  </div>
</template>

<script>
import {
  contractSignMq,
  accountGetDataDict,
  previewContractByTemplateCodeApi,
} from '@/api/amount-management/index'
import E from 'wangeditor'
import { Encrypt } from '@/utils/jsencrypt'
export default {
  props: {},
  data() {
    return {
      active: 2,
      editor: null,
      agreement: '',
    }
  },
  computed: {
    accountRecordId() {
      return this.$store.state.bankInfo.accountRecordId
    },
    enterpriseInfo() {
      return this.$store.state.enterprise
    },
    accountNo() {
      return this.$store.state.bankInfo.accountNo
    },
  },
  created() {
    this.init()
  },
  mounted() {},
  watch: {},
  methods: {
    init() {
      accountGetDataDict({ ictType: 'ACCOUNT_AGREEMENT', dictCode: 'OUT' }).then(res => {
        console.log('agreement', res)
        // this.agreementCode = "SQ000001";
        const currentAgreementCode = res.data.find(item => item.dictCode === 'OUT').dictValue
        previewContractByTemplateCodeApi({ templateCode: currentAgreementCode }).then(res => {
          let html = res
          let str = html.substr(0, html.indexOf('<style>')) + html.substr(html.indexOf('</style>'))
          const editorNode = this.$refs.editor
          this.editor = new E(editorNode)
          this.editor.create()
          this.editor.txt.html(str)
          this.editor.$textElem.attr('contenteditable', false)
        })
      })
    },
    handleSubmit() {
      const query = {
        ...this.enterpriseInfo,
        plantform: '1',
        accountNo: Encrypt(this.accountNo),
        confirmAccountNo: Encrypt(this.accountNo),
        accountRecordId: this.accountRecordId,
      }
      const toast = this.$message({
        message: '协议签署中...',
        duration: 0,
      })
      contractSignMq(query).then(res => {
        console.log(res)
        this.$emit('nextStep', 3)
        toast.close()
        this.$message({
          message: '签署成功',
          type: 'success',
          duration: 1500,
        })
      })
    },
  },
}
</script>

<style lang="scss">
.out-account-step-three {
  .w-e-text-container {
    height: 600px !important; /*!important是重点，因为原div是行内样式设置的高度300px*/
  }
  .agree-btn {
    margin-top: 40px;
    height: 60px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
