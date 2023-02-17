<template>
  <div>
    <div v-if="!showOrderDetails">
      <el-button size="mini" @click="back">返回</el-button>
      <el-card class="box-card m-t-20">
        <div class="details m-t-20 f-s-14">
          <!-- 基本信息 -->
          <div>
            <span class="c-606266 f-weight-bold">账单信息</span>
            <el-row :gutter="24" class="pd5 m-t-5">
              <el-col :span="6">供应商名称：{{ baseInfo.supplierName }}</el-col>
              <el-col :span="6">采购合同编号：{{ baseInfo.contractCode }}</el-col>
              <el-col :span="6">平台名称：{{ baseInfo.vendorName }}</el-col>
              <el-col :span="6">账单统计日期：{{ baseInfo.billCheckYearmonth }}</el-col>
              <el-col :span="6">账单金额(元)：{{ baseInfo.billCheckAmount }}</el-col>
              <el-col :span="6"
                >结算状态：{{ changeComLabel(billStatusList, baseInfo.billStatus) }}</el-col
              >
              <el-col :span="6">订单总数量：{{ baseInfo.orderNum }}</el-col>
              <el-col :span="6">退换货金额(元)：{{ baseInfo.billCancellAmount }}</el-col>
              <el-col :span="6">已结算金额(元)：{{ baseInfo.settlementTotalAmount }}</el-col>
              <el-col :span="6">未结算金额(元)：{{ baseInfo.unsettledTotalAmount }}</el-col>
              <el-col :span="6">商品SKU数量：{{ baseInfo.skuAmount }}</el-col>
              <el-col :span="6">最晚应付款日期：{{ baseInfo.billPaymentDate }}</el-col>
            </el-row>
          </div>
          <!-- 订单列表 -->
          <div class="m-t-20">
            <span class="c-606266 f-weight-bold">订单列表</span>
            <el-table :data="orderData" class="m-t-20">
              <el-table-column type="index" label="序号" :show-overflow-tooltip="true" width="50">
              </el-table-column>
              <el-table-column
                prop="purchasePayOrgName"
                label="采购方名称"
                :show-overflow-tooltip="true"
              >
              </el-table-column>
              <el-table-column
                prop="orderYearmonth"
                label="子账单统计日期"
                :show-overflow-tooltip="true"
              >
              </el-table-column>
              <el-table-column
                prop="orderSettledAmount"
                label="确认收货单金额"
                :show-overflow-tooltip="true"
              >
              </el-table-column>
              <el-table-column
                prop="orderSettledNum"
                label="确认收货订单数量"
                :show-overflow-tooltip="true"
              >
              </el-table-column>
              <el-table-column
                prop="cancellOrderAmount"
                label="退换货金额"
                :show-overflow-tooltip="true"
              >
              </el-table-column>
              <el-table-column
                prop="cancellOrderNum"
                label="退换货订单数"
                :show-overflow-tooltip="true"
              >
              </el-table-column>
              <el-table-column
                prop="settlementOrderAmount"
                label="已结算金额"
                :show-overflow-tooltip="true"
              >
              </el-table-column>
              <el-table-column
                prop="unsettledOrderAmount"
                label="未结算金额"
                :show-overflow-tooltip="true"
              >
              </el-table-column>
              <el-table-column
                prop="settlementOrderNum"
                label="已结算订单数"
                :show-overflow-tooltip="true"
              >
              </el-table-column>
              <el-table-column
                prop="unsettledOrderNum"
                label="未结算订单数"
                :show-overflow-tooltip="true"
              >
              </el-table-column>
              <el-table-column prop="skuAmount" label="商品SKU数量" :show-overflow-tooltip="true">
              </el-table-column>
            </el-table>
          </div>
          <div class="m-t-10 pagination">
            <el-pagination
              class="text-center bgfff pd10 flex-shrink-0"
              layout="total, sizes, prev, pager, next, jumper"
              :current-page.sync="queryOrder.pageNum"
              :page-sizes="[10, 20, 30, 50]"
              :page-size.sync="queryOrder.pageSize"
              :total="orderTotal"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            >
            </el-pagination>
          </div>
          <!-- 文件列表 -->
          <div class="m-t-20">
            <span class="c-606266 f-weight-bold">文件列表</span>
            <el-table :data="fileData" class="m-t-20">
              <el-table-column
                prop="fileType"
                label="文件类型"
                :show-overflow-tooltip="true"
                :formatter="formatFileType"
              ></el-table-column>
              <el-table-column
                prop="fileNo"
                label="文件编号"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column
                prop="fileName"
                label="文件名称"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column
                prop="fileSuffix"
                label="文件格式"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column
                prop="fileSize"
                label="文件大小"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column
                prop="uploader"
                label="上传人"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column
                prop="remark"
                label="文件备注"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column
                prop="shipmentNumber"
                label="操作"
                :show-overflow-tooltip="true"
                width="100"
              >
                <template slot-scope="scope">
                  <span
                    class="c-1890ff cur-pointer m-r-10"
                    @click="viewImg(scope.row)"
                    v-if="['png', 'jpg', 'bmp', 'jpeg', 'gif'].includes(scope.row.fileSuffix)"
                    >查看</span
                  >
                  <span class="c-1890ff cur-pointer" @click="downloadFile(scope.row)">下载</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="m-t-10 pagination">
            <el-pagination
              class="text-center bgfff pd10 flex-shrink-0"
              layout="total, sizes, prev, pager, next, jumper"
              :current-page.sync="queryFile.pageNum"
              :page-sizes="[10, 20, 30, 50]"
              :page-size.sync="queryFile.pageSize"
              :total="fileTotal"
              @size-change="handleFileSizeChange"
              @current-change="handleFileCurrentChange"
            >
            </el-pagination>
          </div>
        </div>
      </el-card>
    </div>
    <order-details
      v-if="showOrderDetails"
      @hideOrderDetails="hideOrderDetails"
      :seqNo="getOrderSeqNo"
    ></order-details>
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
import orderDetails from './order-details.vue'
import {
  getBillDetailsApi,
  billDetailsAttachApi,
  getOrderListApi,
  querySComCodeApi,
  previewFileApi,
  downloadFileApi,
} from '@/api/money-raise-management'
import { downloadImageApi, imageNumberApi } from '@/api/image-management'

import { downloadWord } from '@/utils/ruoyi'
export default {
  components: {
    orderDetails,
  },
  props: {
    hideDetails: {
      type: Function,
    },
    seqNo: {
      type: String,
      default: '',
    },
    billStatusList: {
      type: Array,
    },
    orderStatusList: {
      type: Array,
    },
  },
  data() {
    return {
      currentImageTitle: '',
      showPreviewDialog: false,
      dialogImageUrl: '',

      showOrderDetails: false, // 显示订单详情
      pageNum: 1,
      pageSize: 10,
      total: 1,
      queryFile: {
        pageNum: 1,
        pageSize: 10,
      },
      fileTotal: 0,
      // 基本信息
      baseInfo: {},
      queryOrder: {
        pageNum: 1,
        pageSize: 10,
        billSeqNo: '',
      },
      // 订单列表
      orderData: [],
      orderTotal: 0,
      // 文件列表
      fileData: [],
      fileTypeList: [],
      // 账单跟踪
      billTracking: [],
      getOrderSeqNo: '', // 查看订单详情seqNo
      billSeqNo: '',
    }
  },
  created() {
    this.getDetails()
    this.getFileTypeList()
  },
  computed: {},
  methods: {
    // 详情
    getDetails() {
      getBillDetailsApi(this.seqNo).then(res => {
        if (res.code == 200) {
          this.baseInfo = res.data
          this.billSeqNo = res.data.billNo
          this.getFileLists()
          this.getOrderList()
        }
      })
    },
    // 文件列表
    getFileLists() {
      let params = {
        attachType: 1,
        attachNo: this.baseInfo.seqNo,
        ...this.queryFile,
      }
      billDetailsAttachApi(params).then(res => {
        this.fileData = res.data.rows
        this.fileTotal = res.data.total
      })
    },
    // 查询文件类型
    getFileTypeList() {
      querySComCodeApi('FILE_TYPE').then(res => {
        this.fileTypeList = res.data
      })
    },
    // 文件分页
    handleFileSizeChange(page) {
      this.queryFile.pageSize = page
      this.getFileLists()
    },
    handleFileCurrentChange(page) {
      this.queryFile.pageNum = page
      this.getFileLists()
    },
    // 格式化文件类型
    formatFileType(row) {
      return this.selectComLabel(this.fileTypeList, row.fileType)
    },
    // 订单列表
    getOrderList() {
      this.queryOrder.billSeqNo = this.seqNo
      getOrderListApi(this.queryOrder).then(res => {
        this.orderData = res.data.rows
        this.orderTotal = res.data.total
      })
    },
    // 订单状态转化
    formatOrderStatus(row) {
      return this.selectComLabel(this.orderStatusList, row.orderStatus)
    },
    // 订单列表分页
    handleSizeChange(page) {
      this.queryOrder.pageSize = page
      this.getOrderList()
    },
    handleCurrentChange(page) {
      this.queryOrder.pageNum = page
      this.getOrderList()
    },
    // 返回
    back() {
      const {
        query: { billNo },
      } = this.$route
      if (billNo) {
        this.$router.push('/money-raise-list')
      } else {
        this.$emit('hideDetails')
      }
    },
    // 订单列表详情
    detailsFn(row) {
      this.getOrderSeqNo = row.seqNo
      this.showOrderDetails = true
    },
    // 隐藏
    hideOrderDetails() {
      this.getOrderSeqNo = ''
      this.showOrderDetails = false
    },
    // 预览图片
    async viewImg(row) {
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
    async downloadFile(row) {
      let res = await downloadImageApi({
        imageNumber: row.fileNo,
        type: 1,
      })
      downloadWord(res, row.fileName)
    },
  },
}
</script>
<style lang="scss" scoped>
.details {
  padding: 0 2%;
  .el-col {
    line-height: 30px;
  }
}
.commodityImg {
  width: 70px;
  height: 70px;
}
.pagination {
  display: flex;
  justify-content: flex-end;
}
</style>
