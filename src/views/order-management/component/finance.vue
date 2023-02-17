<template>
  <div class="clearPadding">
    <div v-if="!showUpload && !showDetails">
      <div v-if="active == 0">
        <span class="f-s-24">请确认以下账单信息</span>
        <div class="flex1 over-hidden m-t-2">
          <el-table :data="tableData" show-summary default-expand-all>
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-table :data="props.row.fileData">
                  <el-table-column
                    prop="fileType"
                    label="文件类型"
                    :show-overflow-tooltip="true"
                    :formatter="formatfileType"
                  ></el-table-column>
                  <el-table-column
                    label="文件名称"
                    prop="fileName"
                    :show-overflow-tooltip="true"
                  ></el-table-column>
                  <el-table-column label="文件备注" prop="remark" :show-overflow-tooltip="true">
                  </el-table-column>
                  <el-table-column label="操作" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                      <span
                        class="c-1890ff cur-pointer m-r-10"
                        @click="seeFile(scope.row)"
                        v-if="['png', 'jpg', 'bmp', 'jpeg', 'gif'].includes(scope.row.fileSuffix)"
                        v-hasPermi="['supplier:voucher:preview']"
                        >查看</span
                      >
                      <span
                        class="c-1890ff cur-pointer"
                        @click="downLoad(scope.row)"
                        v-hasPermi="['supplier:voucher:download']"
                        >下载</span
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <!-- <el-table-column label="采购合同编号" prop="contractCode" :show-overflow-tooltip="true">
            </el-table-column> -->
            <el-table-column label="平台名称" prop="vendorName" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              label="账单统计日期"
              prop="billCheckYearmonth"
              :show-overflow-tooltip="true"
            >
            </el-table-column>
            <el-table-column
              label="账单金额(元)"
              prop="billCheckAmount"
              :show-overflow-tooltip="true"
            >
            </el-table-column>
            <el-table-column label="订单总数量" prop="orderNum" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              label="结算状态"
              :show-overflow-tooltip="true"
              :formatter="formatfinancingStatus"
            >
            </el-table-column>
            <el-table-column
              label="未结算金额(元)"
              prop="unsettledTotalAmount"
              :show-overflow-tooltip="true"
            >
            </el-table-column>
            <el-table-column
              label="最晚应付日期"
              prop="billPaymentDate"
              :show-overflow-tooltip="true"
            >
            </el-table-column>
            <el-table-column label="操作" prop="" width="150px">
              <template slot-scope="scope">
                <span class="c-1890ff cur-pointer" @click="seeDetails(scope.row)">详情</span>
                <span class="c-1890ff cur-pointer m-l-5" @click="showUploadFn(scope.row)"
                  >上传凭证</span
                >
                <span class="c-1890ff cur-pointer m-l-5" @click="deleteRow(scope)">移除</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="text-center m-t-20">
          <el-button type="primary" size="small" @click="financeApplyFn" :disabled="btnDisable"
            >发起融资申请</el-button
          >
          <el-button size="small" @click="cancel">取消</el-button>
        </div>
      </div>
      <finance-apply
        ref="financeApply"
        :applyData="applyData"
        :queryParams="queryParams"
        @hideDetails="hideDetail"
        :billCount="billCount"
      ></finance-apply>
    </div>
    <upload-bill v-if="showUpload" @hideDetails="hideUpload" :selected="uploadArr"></upload-bill>
    <bill-details
      v-if="showDetails"
      @hideDetails="hideDet"
      :seqNo="seqNo"
      :billStatusList="billStatusList"
      :orderStatusList="orderStatusList"
    ></bill-details>
    <!-- 查看凭证弹框 -->
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
import {
  preFinanceInfoConfirmApi,
  financialApi,
  legalFaceTokenApi,
  querySComCodeApi,
} from '@/api/money-raise-management'
import { downloadWord } from '@/utils/ruoyi'
import { imageNumberApi, downloadImageApi } from '@/api/image-management'
import financeApply from './finance-apply.vue'
import uploadBill from './upload-bill.vue' // 上传凭证
import billDetails from './bill-details.vue' // 账单详情
import { mapState } from 'vuex'
export default {
  props: {
    hideDetails: {
      type: Function,
    },
    selectArr: {
      type: Array,
      default: [],
    },
    billStatusList: {
      type: Array,
      default: [],
    },
    orderStatusList: {
      type: Array,
      default: [],
    },
    setActive: {
      type: Function,
    },
    hideStep: {
      type: Function,
    },
  },
  components: {
    financeApply,
    uploadBill,
    billDetails,
  },
  data() {
    return {
      queryParams: {},
      tableData: [],
      applyData: {},
      billCount: 0,
      active: 0,
      showUpload: false,
      uploadArr: [],
      financingStatusList: [],
      showDetails: false,
      getfileTypeList: [],
      currentImageTitle: '',
      dialogImageUrl: '',
      showPreviewDialog: false,
      financeNo: '',
      btnDisable: false,
    }
  },
  created() {
    this.tableData = this.selectArr
    this.getFileType()
    this.getDictData()
    if (this.active == 0) this.showWarn()
  },
  computed: {
    ...mapState({
      companyCode: state => state.enterprise.enterpriseCertNo,
      companyName: state => state.enterprise.enterpriseName,
    }),
  },
  methods: {
    // 文件类型
    getFileType() {
      querySComCodeApi('FILE_TYPE').then(res => {
        this.getfileTypeList = res.data
      })
    },
    // 格式化文件类型
    formatfileType(row) {
      return this.selectComLabel(this.getfileTypeList, row.fileType)
    },
    // 融资状态
    getDictData() {
      querySComCodeApi('FINANCING_STATUS').then(res => {
        this.financingStatusList = res.data
      })
    },
    showWarn() {
      this.$alert(
        '核心企业与资金方会审核发票和合同的真实性，请确认发票和合同的真实性和完整性，发起融资后，将不可修改发票和合同！',
        '融资提示',
        {
          confirmButtonText: '确定',
        }
      )
    },
    getList() {
      preFinanceInfoConfirmApi(this.queryParams).then(res => {
        if (res.code == 200) {
          this.applyData = res.data
          this.$refs.financeApply.show = true
        }
      })
    },
    deleteRow(scope) {
      this.tableData.splice(scope.$index, 1)
      this.$forceUpdate()
    },
    cancel() {
      this.$emit('hideDetails')
    },
    hideDetail(data) {
      this.$emit('hideDetails', data)
    },
    // 显示上传
    showUploadFn(row) {
      this.uploadArr = []
      this.showUpload = true
      this.uploadArr.push(row)
      this.$emit('hideStep', true)
    },
    // 隐藏上传
    hideUpload() {
      this.showUpload = false
      this.getDictData()
      this.$emit('hideStep', false)
    },
    // 详情
    seeDetails(row) {
      this.seqNo = row.seqNo
      this.showDetails = true
      this.$emit('hideStep', true)
    },
    //隐藏详情
    hideDet() {
      this.showDetails = false
      this.$emit('hideStep', false)
    },
    handleReturn() {
      this.$emit('hideDetails')
    },
    formatfinancingStatus(row) {
      return this.selectComLabel(this.financingStatusList, row.financingStatus)
    },
    // 发起融资申请
    financeApplyFn() {
      if (this.tableData.length == 0) {
        this.$message.warning('至少需要一条账单！')
        return
      }
      this.btnDisable = true

      let billsIds = this.tableData.map(v => {
        return v.seqNo
      })
      for (let j = 0; j < this.tableData.length; j++) {
        let fileTypaArr = this.tableData[j].fileData.map(v => v.fileType)
        let flag = fileTypaArr.includes('1') && fileTypaArr.includes('5')
        if (!flag) {
          this.$message.warning('每笔账单，必须至少有一份合同，至少有一份发票文件！')
          this.btnDisable = false
          return
        }
      }
      financialApi({
        billIds: billsIds.join(','),
        companyCode: this.companyCode,
        companyName: this.companyName,
      })
        .then(res => {
          if (res.code == 200) {
            if (res.data.financeStatus == 3) {
              this.$emit('setActive', {
                active: 2,
                seqNo: res.data.seqNo,
              })
            } else if (res.data.financeStatus == 2) {
              this.$emit('setActive', {
                active: 1,
                seqNo: res.data.seqNo,
                financeNo: res.data.financeNo,
              })
            }
          }
          this.btnDisable = false
        })
        .catch(() => {
          this.btnDisable = false
        })
    },
    // 查看文件
    async seeFile(row) {
      this.dialogImageUrl = ''
      let res = await imageNumberApi({
        imageNumber: row.fileNo,
        type: 1,
      })
      this.dialogImageUrl = window.URL.createObjectURL(res)
      this.currentImageTitle = row.fileName
      this.showPreviewDialog = true
    },

    // 下载
    async downLoad(row) {
      let res = await downloadImageApi({
        imageNumber: row.fileNo,
        type: 1,
      })
      downloadWord(res, row.fileName + '.' + row.fileSuffix)
    },
  },
}
</script>
<style lang="scss" scoped></style>
