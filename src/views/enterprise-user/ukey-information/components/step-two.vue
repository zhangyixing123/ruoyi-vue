<template>
  <div class="step-two app-container flex1 flex-col over-hidden">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="绑定UKey"></el-step>
      <el-step title="上传《数字证书使用承诺函》"></el-step>
      <!-- <el-step title="平台审核"></el-step> -->
    </el-steps>
    <div class="opt-step">
      <div class="step-one">
        <div class="step-title">第一步</div>
        <div>
          <img src="" alt="" />
          <span class="model" @click="downPdf">获取《数字证书使用承诺书》模板</span>
        </div>
        <div class="next"></div>
      </div>
      <div class="step-two">
        <div class="step-title">第二步</div>
        <div>
          <span>
            加盖 <span style="color:#f00"> 红色公章 </span> 并由
            <span style="color:#f00">
              法人企业的法定代表人(或非法人企业的负责人)
            </span>
            签字
          </span>
        </div>
        <div class="next"></div>
      </div>
      <div class="step-three">
        <div class="step-title">第三步</div>
        <div>
          <el-upload
            action=" "
            :auto-upload="false"
            class="upload-demo"
            :limit="1"
            :on-change="handleImgChange"
          >
            <el-button size="small" type="primary">
              上传签字、盖章《数字证书使用承诺函》图片
            </el-button>
            <div slot="tip" class="el-upload__tip">
              扩展名支持.jpg .jpeg .png .pdf,大小不超过10M
            </div>
          </el-upload>
        </div>
      </div>
      <div class="next-btn">
        <el-button type="primary" @click="handleSubmit"> 提交 </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { uploadApi } from '@/api/image-management/index'
import { compareAdd } from '@/api/enterprise-information-management/ukeyIndex'
import { getContractPDFUrlApi } from '@/api/enterprise-information-management/index'
import { getDataDictApi } from '@/api/amount-management/index'
import { downloadWord } from '@/utils/ruoyi'
export default {
  props: {
    newUkeyId: {
      type: Array,
    },
    back: {
      type: Function,
    },
  },
  data() {
    return {
      active: 1,
      fileList: [],
      commitmentId: '',
    }
  },
  created() {
    this.commitmentId = ''
  },
  mounted() {},
  watch: {},
  methods: {
    handleImgChange({ raw }, fileList) {
      this.fileList.push(raw)
      const formData = new FormData()
      formData.append('file', raw)
      formData.append('imageTypeNumber', '3')
      formData.append('businessId', this.$store.state.enterprise.enterpriseCertNo)

      formData.append('businessCode', '001')
      uploadApi(formData).then(res => {
        if (res.code == 200) {
          this.commitmentId = res.data.imageNumber
          this.$message({
            type: 'success',
            message: '上传成功',
          })
        }
      })
    },
    handleSubmit() {
      if (!this.commitmentId) {
        return this.$message.error(`必须上传《数字证书使用承诺函》！`)
      } else {
        // localStorage.getItem('newUkeyId')
        const query = []
        this.newUkeyId.forEach(v => {
          query.push({
            seqNo: v,
            commitmentId: this.commitmentId,
          })
        })
        compareAdd(query).then(res => {
          if (res.code == 200) {
            this.msgSuccess('新增成功！')
            this.$emit('back')
          }
        })
      }
    },
    downPdf() {
      getDataDictApi({ dictType: 'UKEY', dictCode: 'UKEY_COMMITMENT' }).then(res => {
        if (res.code == 200) {
          const dictValue = res.data.find(item => item.dictCode == 'UKEY_COMMITMENT').dictValue
          getContractPDFUrlApi(dictValue).then(res => {
            downloadWord(res, '数字证书使用承诺函.pdf')
          })
        }
      })
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制上传 1 个文件 !`)
    },
    handleSuccess(res, file, fileList) {
      this.fileList.push(file)
    },
    handleRemove(file, fileList) {
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },
  },
}
</script>

<style scoped lang="scss">
.step-two {
  .opt-step {
    position: absolute;
    top: 200px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .step-one,
    .step-two {
      display: flex;
      position: relative;
      margin-bottom: 50px;
      .step-title {
        margin-right: 20px;
      }
      .next {
        position: absolute;
        bottom: -30px;
        left: 20px;
        width: 0;
        height: 0;
        border: 5px solid transparent;
        border-top-color: #000;
      }
    }
    .step-three {
      display: flex;
      .step-title {
        margin-right: 20px;
      }
    }
  }
  .next-btn {
    width: 200px;
    margin: 80px auto;
    display: flex;
    justify-content: center;
  }
}
.model {
  color: #1890ff;
  cursor: pointer;
}
</style>
