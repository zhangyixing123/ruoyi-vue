<template>
  <div>
    <el-button size="mini" @click="back">返回</el-button>
    <el-card class="m-t-20">
      <div slot="header" class="clearfix">
        <span>订单详情</span>
      </div>
      <div class="m-t-20">
        <div class="line"></div>
        <div class="flex just-between header">
          <div
            v-for="(item, index) in orderTraces"
            :key="index"
            class="text-center flex-col align-center"
          >
            <div class="circle">
              <span></span>
            </div>
            <div class="m-t-5 c-1890ff f-s-14">{{ item.dealContent }}</div>
            <div class="m-t-5 c-1890ff f-s-14">{{ item.dealTime }}</div>
          </div>
        </div>
      </div>
      <div class="details m-t-20 f-s-14">
        <!-- 基本信息 -->
        <div>
          <span class="c-606266 f-weight-bold">基本信息</span>
          <el-row :gutter="20" class="pd5 c-999 m-t-5">
            <el-col :span="8">订单编号：{{ dataInfo.orderNo }}</el-col>
            <el-col :span="8">订单状态：{{ orderStatusFormater }}</el-col>
            <el-col :span="8">审核状态：{{ dataInfo.auditStatus }}</el-col>
            <el-col :span="8">采购单位：{{ dataInfo.purchasingUnit }}</el-col>
            <el-col :span="8">所属项目：{{ dataInfo.projectName }}</el-col>
            <el-col :span="8">营销对接人：{{ dataInfo.marketingContactPerson }}</el-col>
            <el-col :span="8">供应商名称：{{ dataInfo.supplierName }}</el-col>
            <el-col :span="16">订单金额：{{ dataInfo.orderAmt }}</el-col>
            <el-col :span="8">下单时间：{{ dataInfo.orderTime }}</el-col>
            <el-col :span="8">审批时间：{{ dataInfo.auditTime }}</el-col>
            <el-col :span="8">完成时间：{{ dataInfo.finishTime }}</el-col>
            <el-col :span="8">交易主体：{{ dataInfo.tradeEntity }}</el-col>
            <el-col :span="8">终止原因：{{ dataInfo.terminationReason }}</el-col>
          </el-row>
        </div>
        <!-- 订单跟踪 -->
        <div class="m-t-20">
          <span class="c-606266 f-weight-bold">订单跟踪</span>
          <el-table :data="orderTraces" class="m-t-20">
            <el-table-column prop="dealTime" label="处理时间" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="dealContent" label="处理内容" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="processor" label="处理人" :show-overflow-tooltip="true">
            </el-table-column>
          </el-table>
        </div>
        <!-- 收货信息 -->
        <div class="m-t-20">
          <span class="c-606266 f-weight-bold">收货信息</span>
          <el-row :gutter="20" class="pd5 c-999 m-t-5">
            <el-col :span="16">收货人：{{ receiveInfo && receiveInfo.receiver }}</el-col>
            <el-col :span="4">联系电话：{{ receiveInfo && receiveInfo.phoneNo }}</el-col>
            <el-col :span="4">进场日期：{{ receiveInfo && receiveInfo.enterDate }}</el-col>
            <el-col :span="24">收货地址：{{ receiveInfo && receiveInfo.receiveAddress }}</el-col>
            <el-col :span="24">采购商留言：{{ receiveInfo && receiveInfo.purchaserNote }}</el-col>
            <el-col :span="24">供应商留言：{{ receiveInfo && receiveInfo.supplierNote }}</el-col>
          </el-row>
        </div>
        <!-- 商品信息 -->
        <div class="m-t-20">
          <span class="c-606266 f-weight-bold">商品信息</span>
          <el-table :data="goods" class="m-t-20">
            <el-table-column label="商品图片" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <img :src="scope.row.imgUrl" alt="" class="commodityImg" />
              </template>
            </el-table-column>
            <el-table-column
              prop="goodsName"
              label="商品名称"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
              prop="goodsSpecifications"
              label="规格型号"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
              prop="goodsBrand"
              label="品牌"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column label="单价" prop="goodsPrice" :show-overflow-tooltip="true">
              <!-- <template slot-scope="scope">
                <div>含税价：{{ scope.row.goodsPrice }}</div>
                <div>除税价：{{ scope.row.goodsPrice }}</div>
              </template> -->
            </el-table-column>
            <el-table-column
              prop="goodsNum"
              label="采购数量（/单位）"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
              prop="deliverNum"
              label="发货数量"
              :show-overflow-tooltip="true"
            ></el-table-column>
          </el-table>
        </div>
        <!-- 发货信息 -->
        <div class="m-t-20">
          <span class="c-606266 f-weight-bold">发货信息</span>
          <el-row :gutter="20" class="pd5 c-999 m-t-5">
            <el-col :span="8">送货单编号：{{ sendInfo.deliveryNo }}</el-col>
            <el-col :span="16">发货时间：{{ sendInfo.sendTime }}</el-col>
            <el-col :span="8">发货人：{{ sendInfo.sender }}</el-col>
            <el-col :span="16">发货地址：{{ sendInfo.sendAddress }}</el-col>
            <el-col :span="24">发货备注：{{ sendInfo.remark }}</el-col>
            <el-col :span="24">发货方式：{{ sendInfo.sendType }}</el-col>
          </el-row>
        </div>
        <!-- 送达凭证 -->
        <div class="m-t-20">
          <span class="c-606266 f-weight-bold">送达凭证</span>
          <el-table :data="vouchers" class="m-t-20">
            <el-table-column
              prop="fileType"
              label="文件类型"
              :formatter="formatfileType"
              :show-overflow-tooltip="true"
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
            <el-table-column prop="shipmentNumber" label="操作" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span class="c-1890ff cur-pointer" @click="viewImg(scope.row)">查看</span>
                <span class="c-1890ff m-l-10 cur-pointer" @click="downLoad(scope.row)">下载</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
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
import * as Api from '@/api/order-management/index'
import { querySComCodeApi } from '@/api/money-raise-management'
import { imageNumberApi, downloadImageApi } from '@/api/image-management'

import { downloadWord } from '@/utils/ruoyi'
export default {
  props: {
    hideOrderDetails: {
      type: Function,
    },
    seqNo: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      orderStatusFormater: '',
      statusOptions: [], //订单状态
      dataInfo: {},
      orderNo: '',
      showPreviewDialog: false,
      currentImageTitle: '',
      dialogImageUrl: '',
      // 订单跟踪
      orderTraces: [],
      // 收货信息
      receiveInfo: {},
      // 商品信息
      goods: [],
      // 发货信息
      sendInfo: {},
      vouchers: null,
    }
  },
  created() {
    this.getDiceData()
  },
  computed: {},
  methods: {
    // 返回
    back() {
      this.$emit('hideOrderDetails')
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
    // 查询字典
    getDiceData() {
      // 文件类型
      querySComCodeApi('FILE_TYPE').then(res => {
        this.getfileTypeList = res.data
      })
      // 订单状态
      querySComCodeApi('ORDER_STATUS').then(res => {
        this.statusOptions = res.data
      })
      this.getOrderDetail()
    },
    formatfileType(row) {
      return this.selectComLabel(this.getfileTypeList, row.fileType)
    },
    // 字典翻译
    formatFunction(item, arr) {
      let a = arr.filter(function(value) {
        if (value.comCode == item) return value
      })
      return a[0].comCodeDesc
    },
    // 下载
    async downLoad(row) {
      let res = await downloadImageApi({
        imageNumber: row.fileNo,
        type: 1,
      })
      downloadWord(res, row.fileName)
    },

    // 订单详情
    getOrderDetail() {
      Api.getOrderDetail({ seqNo: this.seqNo }).then(res => {
        if (res.code == 200) {
          if (res.data) {
            this.dataInfo = res.data
            this.orderTraces = res.data.orderTraces
            this.receiveInfo = res.data.receiveInfo
            this.sendInfo = res.data.sendInfo
            this.goods = res.data.goods
            this.vouchers = res.data.vouchers //送达凭证
            this.orderStatusFormater = this.formatFunction(res.data.orderStatus, this.statusOptions)
          }
        }
      })
    },

    // 数据字典翻译
  },
}
</script>
<style lang="scss" scoped>
::v-deep .el-card__body {
  display: block !important;
}
.line {
  width: 100%;
  height: 4px;
  background: #eee;
  border-radius: 2px;
}
.header {
  margin-top: -17px;
  padding: 0 30px;
}
.circle {
  height: 30px;
  width: 30px;
  background: #f5f5f5;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    height: 14px;
    width: 14px;
    background: #1890ff;
    border-radius: 50%;
  }
}
.details {
  padding: 0 10%;
  .el-col {
    line-height: 30px;
  }
}
.commodityImg {
  width: 70px;
  height: 70px;
}
</style>
