<template>
  <div class="app-container flex1 flex-col over-hidden enterprise-info">
    <!-- 基本信息 -->
    <div><el-button size="mini" @click="back">返回</el-button></div>
    <div class="basic-info m-t-10">
      <div class="info-title">基本信息</div>
      <el-form :model="basicInfo" ref="companyInfoForm" inline label-width="180px">
        <el-row :gutter="50">
          <el-col :span="9">
            <el-form-item label="企业名称">
              <span>{{ basicInfo.enterpriseName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="统一社会信用代码">
              <span>{{ basicInfo.enterpriseCertNo }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="9">
            <el-form-item label="法人代表姓名">
              <span>{{ basicInfo.legalPersonName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="法人代表身份证号">
              <span>{{ basicInfo.maskIdNo }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="9">
            <el-form-item label="注册地址">
              <span>{{ basicInfo.enterpriseAddress }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="通讯地址">
              <span>{{ basicInfo.address }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="9">
            <el-form-item label="营业执照">
              <img
                :src="basicInfo.certFileUrl"
                class="imgSize"
                @click="handlePreviewBasic(basicInfo.certFileUrl)"
              />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="9">
            <el-form-item label="法人代表授权书">
              <span class="fileName" @click="downloadFile" v-if="showImg">{{
                basicInfo.authFileUrl.fileName
              }}</span>
              <img
                v-else
                :src="basicInfo.authFileUrl"
                class="imgSize"
                @click="handlePreviewBasic(basicInfo.authFileUrl)"
              />
            </el-form-item>
          </el-col> -->
        </el-row>
      </el-form>
    </div>
    <!-- 开票信息 -->
    <!-- <div class="bill-info">
      <div class="info-title">开票信息</div>
      <div class="info-content">
        <bill-info></bill-info>
      </div>
    </div> -->
    <!-- 融资必填信息 -->
    <!-- <div class="finance-info">
      <div class="info-title">融资必填信息</div>
      <div class="info-content">
        <financeInfoForm @handlePreviewBillInfo="handlePreviewBillInfo"></financeInfoForm>
      </div>
    </div> -->
    <!-- 补全企业信息 -->
    <!-- <div class="company-info">
      <div class="info-title">补全企业信息</div>
      <div class="info-content">
        <company-info></company-info>
      </div>
    </div> -->

    <el-dialog
      :modal-append-to-body="false"
      :title="currentImageTitle"
      :visible.sync="showPreviewDialog"
      width="600px"
    >
      <img width="100%" ref="previewImg" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import financeInfoForm from './components/finance-info.vue'
import CompanyInfo from './components/company-info.vue'
import BillInfo from './components/bill-info.vue'
import { getEnterpriseMsgApi } from '@/api/enterprise-information-management/index'
import { Decrypt } from '@/utils/jsencrypt'
import { queryApi, permissionsViewApi, downloadImageApi } from '@/api/image-management'
import { downloadWord } from '@/utils/ruoyi'

export default {
  props: {
    seqNo: {
      type: String,
      default: '',
    },
    showIndex: {
      type: Function,
    },
  },
  components: { financeInfoForm, 'company-info': CompanyInfo, BillInfo },
  data() {
    return {
      basicInfo: {},

      showPreviewDialog: false,
      dialogImageUrl: '',
      currentImageTitle: '',
      showImg: false,
    }
  },
  computed: {},
  created() {
    this.getDetails()
  },
  mounted() {},
  watch: {},
  methods: {
    getDetails() {
      getEnterpriseMsgApi({
        seqNo: this.seqNo,
      }).then(res => {
        if (res.code == 200) {
          this.basicInfo = res.data
          if (this.basicInfo.idNo) this.basicInfo.idNo = Decrypt(this.basicInfo.idNo)
          if (this.basicInfo.enterpriseCertFile)
            this.viewImg(this.basicInfo.enterpriseCertFile, 'certFileUrl')
          // if (this.basicInfo.legalAuthFile)
          //   this.viewImg(this.basicInfo.legalAuthFile, 'authFileUrl')
        }
      })
    },
    // 查看图片
    viewImg(val, type) {
      queryApi({
        imageNumber: val,
        type: 1,
      }).then(res => {
        if (
          res.data.fileType == 'jpg' ||
          res.data.fileType == 'png' ||
          res.data.fileType == 'jpeg' ||
          res.data.fileType == 'bmp'
        ) {
          permissionsViewApi(res.data.imageNumberEncryption).then(res => {
            this.basicInfo[type] = window.URL.createObjectURL(res)
            this.$forceUpdate()
          })
        } else {
          this.showImg = true
          this.basicInfo[type] = res.data
        }
      })
    },
    // 基本信息预览
    handlePreviewBasic(val) {
      this.dialogImageUrl = val
      this.$nextTick(() => {
        this.showPreviewDialog = true
      })
    },
    // 下载
    downloadFile() {
      downloadImageApi({
        imageNumber: this.basicInfo.authFileUrl.imageNumber,
        type: 1,
      }).then(result => {
        downloadWord(result, this.basicInfo.authFileUrl.fileName)
      })
    },
    // 返回
    back() {
      this.$emit('showIndex')
    },
    // 融资信息预览
    handlePreviewBillInfo(title, src) {
      this.currentImageTitle = title
      this.dialogImageUrl = src
      this.$nextTick(() => {
        this.showPreviewDialog = true
      })
    },
    handleFilter(val, dictArr) {
      if (!dictArr) return val
      return (
        this.$staticData[dictArr].find(item => item.dictValue === String(val))?.dictLabel || val
      )
    },
  },
}
</script>

<style scoped lang="scss">
.enterprise-info {
  .basic-info,
  .bill-info,
  .finance-info,
  .company-info {
    margin-bottom: 20px;
    .info-title {
      font-weight: bold;
      font-size: 24px;
    }
    .info-content {
      padding-left: 200px;
      display: flex;
      flex-wrap: wrap;
      .info-item {
        width: 40%;
        line-height: 50px;
        display: flex;
        .label {
          width: 200px;
          text-align: right;
          margin-right: 10px;
          span {
            color: #f00;
            margin-right: 5px;
          }
        }
        .preview-btn {
          margin-left: 10px;
        }
      }
    }
  }
}

.imgSize {
  width: 200px;
}
.fileName {
  color: #1890ff;
  cursor: pointer;
}
</style>
