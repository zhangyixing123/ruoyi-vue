(<template>
  <div>
    <!-- 融资信息 -->
    <div v-if="!showDetails">
      <el-row>
        <p class="menu-title">融资信息</p>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-col :span="6" class="text-right">融资编号：</el-col>
          <el-col :span="18">{{ financeDetails.financeNo }}</el-col>
        </el-col>
        <el-col :span="8">
          <el-col :span="6" class="text-right">应收账款总额：</el-col>
          <el-col :span="18" v-if="financeDetails.billsAmount">{{
            '￥' + financeDetails.billsAmount
          }}</el-col>
        </el-col>
        <el-col :span="8">
          <el-col :span="6" class="text-right">最晚应付时间：</el-col>
          <el-col :span="18">{{ financeDetails.maxBillTime }}</el-col>
        </el-col>
        <el-col :span="8">
          <el-col :span="6" class="text-right">融资主体：</el-col>
          <el-col :span="18">{{ financeDetails.companyName }}</el-col>
        </el-col>
        <el-col :span="8">
          <el-col :span="6" class="text-right">申请时间：</el-col>
          <el-col :span="18">{{ financeDetails.applyTime }}</el-col>
        </el-col>
        <el-col :span="8">
          <el-col :span="6" class="text-right">申请人：</el-col>
          <el-col :span="18">{{ financeDetails.applyUser }}</el-col>
        </el-col>
        <el-col :span="8">
          <el-col :span="6" class="text-right">授信机构：</el-col>
          <el-col :span="18">{{ financeDetails.creditCompanyName }}</el-col>
        </el-col>

        <el-col :span="8">
          <el-col :span="6" class="text-right">可用额度：</el-col>
          <el-col :span="18" style="color:red" v-if="financeDetails.financeAmount">{{
            '￥' + financeDetails.financeAmount
          }}</el-col>
          <el-col :span="18" style="color:red" v-else></el-col>
        </el-col>
        <!-- 放款申请 -->
        <div v-if="financeDetails.financeStatus > 6">
          <el-col :span="8">
            <el-col :span="6" class="text-right">申请放款金额：</el-col>
            <el-col :span="18">{{ financeDetails.financeApplyAmount }}</el-col>
          </el-col>
          <el-col :span="8">
            <el-col :span="6" class="text-right">融资期限：</el-col>
            <el-col :span="18" v-if="financeDetails.applyTnr">{{
              financeDetails.applyTnr + '天'
            }}</el-col>
          </el-col>
          <el-col :span="8">
            <el-col :span="6" class="text-right">年化利率：</el-col>
            <el-col :span="18" v-if="financeDetails.irryearRate">{{
              financeDetails.irryearRate + '%'
            }}</el-col>
          </el-col>
          <el-col :span="8">
            <el-col :span="6" class="text-right">手续费率：</el-col>
            <el-col :span="18">{{ financeDetails.feeRatio + '%' }}</el-col>
          </el-col>
          <el-col :span="8">
            <el-col :span="6" class="text-right">还款方式：</el-col>
            <el-col :span="18">{{ financeDetails.mtdCde }}</el-col>
          </el-col>
          <el-col :span="8" v-if="financeDetails.mtdCde != '利随本清'">
            <el-col :span="6" class="text-right">还款日：</el-col>
            <el-col :span="18">{{ financeDetails.dueDay }}</el-col>
          </el-col>
          <el-col :span="8">
            <el-col :span="6" class="text-right">放款机构：</el-col>
            <el-col :span="18">{{ financeDetails.loanCompanyName }}</el-col>
          </el-col>
          <el-col :span="8">
            <el-col :span="6" class="text-right">放款金额：</el-col>
            <el-col :span="18">{{ financeDetails.financeLoanAmount }}</el-col>
          </el-col>
          <el-col :span="8">
            <el-col :span="6" class="text-right">放款时间：</el-col>
            <el-col :span="18">{{ financeDetails.dnTime }}</el-col>
          </el-col>
        </div>
      </el-row>
      <!-- 账单信息 -->
      <div class="menu-title m-t-20">账单信息</div>
      <el-table :data="financeDetails.bills || []" show-summary default-expand-all>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table :data="props.row.vouchers">
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
        <el-table-column label="平台名称" prop="vendorName" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          label="账单统计日期"
          prop="billCheckYearmonth"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column label="账单金额(元)" prop="billCheckAmount" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="订单总数量" prop="orderNum" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="结算状态" prop="billStatus" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          label="未结算金额(元)"
          prop="unsettledTotalAmount"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column label="最晚应付日期" prop="billPaymentDate" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="操作" prop="" width="150px">
          <template slot-scope="scope">
            <span class="c-1890ff cur-pointer" @click="seeDetails(scope.row)">详情</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 融资进度跟踪 -->
      <div class="menu-title m-t-20">融资进度跟踪</div>
      <el-table :data="financeDetails.tbFinanceTraces || []" style="width: 100%">
        <el-table-column prop="createTime" label="时间"> </el-table-column>
        <el-table-column prop="nodeName" label="操作节点"> </el-table-column>
        <el-table-column prop="userName" label="操作员"> </el-table-column>
        <el-table-column prop="remark" label="操作备注/结果"> </el-table-column>
      </el-table>
      <!-- 合同文件 -->
      <div v-if="financeDetails.recordContractVOList">
        <div class="menu-title m-t-20">合同文件</div>
        <el-table :data="financeDetails.recordContractVOList" style="width: 100%">
          <el-table-column label="合同编号">
            <template slot-scope="scope">
              <span>{{ scope.row.contractCode || '--' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="contractName" label="合同名称"> </el-table-column>
          <el-table-column label="签署日期">
            <template slot-scope="scope">
              <span>{{ scope.row.supplierSignTime || '--' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="viewProtocalFn(scope.row)">查看</el-button>
              <el-button type="text" @click="downloadPdf(scope.row)">下载</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="formType == 'approvel'" class="text-center m-t-20">
        <el-button @click="back" size="small" type="warning">返回</el-button>
      </div>
    </div>
    <!-- 查看凭证弹框 -->
    <el-dialog
      :modal-append-to-body="false"
      :title="currentImageTitle"
      :visible.sync="showPreviewDialog"
      width="600px"
    >
      <img width="100%" ref="previewImg" :src="dialogImageUrl" alt="" />
    </el-dialog>
    <!-- 账单详情 -->
    <bill-details
      v-if="showDetails"
      @hideDetails="hideDet"
      :seqNo="seqNo"
      :billStatusList="billStatusList"
    ></bill-details>
    <el-dialog
      :modal-append-to-body="false"
      class="text-center"
      :visible.sync="viewVisible"
      width="1200px"
      top="5vh"
    >
      <iframe :src="pdfSrc" frameborder="0" width="100%" height="700px"></iframe>
    </el-dialog>
  </div>
</template>
<script>
import {
  querySComCodeApi,
  viewContractApi,
  perviewContractTemplateApi,
  getContractPDFUrlApi,
  viewAfterSignPdfByFileIdApi,
} from '@/api/money-raise-management'

import { downloadWord } from '@/utils/ruoyi'
import { imageNumberApi, downloadImageApi } from '@/api/image-management'
import { voucherList } from '@/api/order-management/index'

import billDetails from '@/views/order-management/component/bill-details.vue' // 账单详情
export default {
  props: {
    financeDetails: {
      type: Object,
    },
    btnFlag: {
      type: Function,
    },
    myActive: {
      type: Number,
      default: 0,
    },
    hideFinance: {
      type: Function,
    },
    formType: {
      type: String,
      default: '',
    },
  },
  components: {
    billDetails,
  },
  data() {
    return {
      billsList: [],
      tbFinanceTraces: [],
      billStatusList: [], // 结算状态
      getfileTypeList: [], // 文件类型
      currentImageTitle: '',
      dialogImageUrl: '',
      showPreviewDialog: false,
      showDetails: false,
      seqNo: '',
      showBills: false,
      viewVisible: false,
      pdfSrc: '', // 放款申请协议src
      numPages: 0, // 放款申请协议num
    }
  },
  created() {
    if (this.formType == 'approvel') {
      this.showDetails = false
      this.showBillsFn()
    }
    this.getData()
  },
  watch: {
    financeDetails(val) {
      if (val) {
        this.showBillsFn()
      }
    },
  },
  computed: {},
  methods: {
    // 获取字典值
    getData() {
      // 结算状态
      querySComCodeApi('BILL_STATUS').then(res => {
        this.billStatusList = res.data
      })
      // 文件类型
      querySComCodeApi('FILE_TYPE').then(res => {
        this.getfileTypeList = res.data
      })
    },
    // 格式化文件类型
    formatfileType(row) {
      return this.selectComLabel(this.getfileTypeList, row.fileType)
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
    //隐藏详情
    hideDet() {
      this.showDetails = false
      this.$emit('btnFlag', false)
    },
    // 详情
    seeDetails(row) {
      this.seqNo = row.seqNo
      this.showDetails = true
      this.$emit('btnFlag', true)
    },
    /**预览申请放款合同 viewContractApi*/
    async viewProtocalFn(item) {
      //
      let res = ''
      if (item.contractType == 1) {
        res = await viewContractApi({
          financingOrderSeq: this.financeDetails.financeNo,
          templateId: item.templateId,
        })
      } else if (item.contractType == 2) {
        res = await perviewContractTemplateApi({
          businessNo: this.financeDetails.loanNo,
          templateCode: item.contractType,
        })
      } else if (item.contractType == 3) {
        res = await viewAfterSignPdfByFileIdApi({ pdfFileId: item.pdfFileId })
      }
      this.viewVisible = true
      const href = window.URL.createObjectURL(res)
      this.pdfSrc = href
    },
    // 下载pdf
    async downloadPdf(item) {
      //
      let res = ''
      if (item.contractType == 1) {
        res = await viewContractApi({
          financingOrderSeq: this.financeDetails.financeNo,
          templateId: item.templateId,
        })
      } else {
        res = await getContractPDFUrlApi({ pdfFileId: item.pdfFileId })
      }
      let fileName = item.contractName ? item.contractName : '文件'
      downloadWord(res, `${fileName}.pdf`)
    },
    getObjectURL(file) {
      let url = null
      if (window.createObjectURL !== undefined) {
        // basic
        url = window.createObjectURL(file)
      } else if (window.webkitURL !== undefined) {
        // webkit or chrome
        try {
          url = window.webkitURL.createObjectURL(file)
        } catch (error) {
          console.log(error)
        }
      } else if (window.URL !== undefined) {
        // mozilla(firefox)
        try {
          url = window.URL.createObjectURL(file)
        } catch (error) {
          console.log(error)
        }
      }
      return url
    },
    // 返回主动还款记录
    back() {
      this.$emit('hideFinance')
    },
    showBillsFn() {
      this.financeDetails.bills = this.financeDetails.bills || []
      this.financeDetails.bills.forEach(item => {
        item.fileData = []
        item.billStatus = item.billStatus == 1 ? '未结算' : item.billStatus == 2 ? '已结算' : ''
      })
      this.financeDetails.feeRatio = this.financeDetails.feeRatio
        ? this.percentage(this.financeDetails.feeRatio)
        : ''
      this.financeDetails.irryearRate = this.financeDetails.irryearRate
        ? this.percentage(this.financeDetails.irryearRate)
        : ''
    },
    /**百分数精度计算 */
    percentage(val) {
      const strVal = val.toString()
      const index = strVal.indexOf('.')
      let num = 0
      if (index > -1) {
        num = strVal.length - 1 - index
      }
      if (num > 2) {
        return Math.round(val * Math.pow(10, num)) / Math.pow(10, num - 2)
      } else {
        return Math.round(val * 100)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.text-right {
  text-align: right;
}

::v-deep .el-col {
  line-height: 24px;
  margin-top: 10px;
  color: #789;
}
</style>
)
