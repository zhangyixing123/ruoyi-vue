<template>
  <div class="app-container">
    <div v-if="!showDetails && !showUpload">
      <el-form :model="queryParams" ref="queryForm" class="flex-shrink-0" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="订单编号" prop="orderNo">
              <el-input
                v-model.trim="queryParams.orderNo"
                placeholder="请输入订单编号"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="订单时间">
              <el-date-picker
                :clearable="false"
                v-model.trim="orderTime"
                size="small"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="项目名称" prop="projectName">
              <el-input
                v-model.trim="queryParams.projectName"
                placeholder="请输入项目名称"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="订单状态" prop="orderStatus">
              <el-select
                v-model.trim="queryParams.orderStatus"
                placeholder="请选择订单状态"
                clearable
                size="small"
              >
                <el-option
                  v-for="dict in statusOptions"
                  :key="dict.comCode"
                  :label="dict.comCodeDesc"
                  :value="dict.comCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              v-hasPermi="['supplier:order:list']"
              >搜索</el-button
            >
            <el-button
              icon="el-icon-refresh"
              size="mini"
              @click="resetQuery"
              v-hasPermi="['supplier:order:list']"
              >重置</el-button
            >
          </el-col>
        </el-row>
      </el-form>
      <div class="flex-shrink-0  mb8  btn">
        <el-button type="primary" size="mini" @click="uploadCer" :disabled="single"
          >上传凭证</el-button
        >
      </div>
      <div class="flex1 over-hidden m-t-20">
        <el-table
          :data="tableData"
          v-loading="loading"
          @selection-change="handleSelectionChange"
          @expand-change="expandChange"
          default-expand-all
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table :data="props.row.data">
                <el-table-column label="商品图片" prop="goodsImg" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <img :src="scope.row.imgUrl" alt="" class="commodityImg" />
                  </template>
                </el-table-column>
                <el-table-column
                  label="商品名称"
                  prop="goodsName"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column label="单价" prop="goodsPrice" :show-overflow-tooltip="true">
                  <!-- <template slot-scope="scope">
                    <div>{{ scope.row.includePrice }}</div>
                  </template> -->
                </el-table-column>
                <el-table-column
                  label="采购数量"
                  prop="goodsNum"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                  label="单位"
                  prop="goodsUnit"
                  :show-overflow-tooltip="true"
                ></el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="订单编号" prop="orderNo" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column label="订单时间" prop="orderTime" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column label="采购商" prop="purchasingUnit" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column label="订单金额" prop="orderAmt" :show-overflow-tooltip="true">
          </el-table-column>
          <!-- <el-table-column
            label="所属区域"
            prop="area"
            :show-overflow-tooltip="true"
          >
          </el-table-column> -->
          <el-table-column
            label="订单状态"
            prop="orderStatus"
            :show-overflow-tooltip="true"
            :formatter="orderStatus"
          >
          </el-table-column>
          <el-table-column label="操作" prop="" width="80px">
            <template slot-scope="scope">
              <span
                class="c-1890ff cur-pointer"
                @click="seeDetails(scope.row)"
                v-hasPermi="['supplier:order:detail']"
                >详情</span
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="m-t-20">
        <el-pagination
          class="text-center bgfff pd10 flex-shrink-0"
          layout="total, sizes, prev, pager, next, jumper"
          :current-page.sync="pageNum"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="pageSize"
          @size-change="handleSizeOrCurrentChange"
          @current-change="handleSizeOrCurrentChange"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <order-details
      v-if="showDetails"
      :seqNo="seqNo"
      @hideOrderDetails="hideOrderDetails"
    ></order-details>
    <uploader-certificate
      v-if="showUpload"
      :seqNo="seqNo"
      :selected="selected"
      @hideOrderDetails="hideOrderDetails"
    ></uploader-certificate>
  </div>
</template>
<script>
import * as Api from '@/api/order-management/index'
import orderDetails from './component/order-details.vue'
import uploaderCertificate from './component/upload-certificate.vue'
import { querySComCodeApi } from '@/api/money-raise-management'
export default {
  // name: 'order-management-list',
  components: {
    orderDetails,
    uploaderCertificate,
  },
  data() {
    return {
      seqNo: '',
      queryParams: {
        pageSize: 10,
        pageNum: 1,
        orderNo: undefined, //订单编号
        startTime: undefined, //订单时间始
        endTime: undefined, //订单时间末
        orderStatus: undefined, //订单状态
        projectName: undefined, //项目名称
        companyCode: undefined,
      },
      pageSize: 10,
      pageNum: 1,
      total: 0,
      statusOptions: [],
      orderTime: [],
      tableData: [],
      goods: [], //商品详情
      loading: false,
      showDetails: false, // 查询详情
      showUpload: false, // 上传凭证
      single: true,
      seletItem: undefined,
      selected: [],
    }
  },
  created() {
    this.total = this.tableData.length
    this.getDiceData()
  },
  computed: {},
  methods: {
    // 查询字典
    getDiceData() {
      // 订单状态
      querySComCodeApi('ORDER_STATUS').then(res => {
        this.statusOptions = res.data
      })

      this.getOrderList()
    },
    orderStatus(row) {
      return this.selectComLabel(this.statusOptions, row.orderStatus)
    },
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getOrderList()
    },
    resetQuery() {
      this.orderTime = []
      this.resetForm('queryForm')
      this.getOrderList()
    },
    handleSelectionChange(select) {
      this.selected = select
      this.seletItem = select[0]
      this.single = select.length != 1
    },
    handleSizeOrCurrentChange() {
      this.queryParams.pageNum = this.pageNum
      this.queryParams.pageSize = this.pageSize
      this.getOrderList()
    },
    // 获取订单列表
    getOrderList() {
      this.queryParams.startTime = this.orderTime[0]
      this.queryParams.endTime = this.orderTime[1]
      this.queryParams.companyCode = this.$store.state.enterprise.enterpriseCertNo

      Api.getOrderList(this.queryParams).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.rows.map(item => {
            item.data = []
            return item
          })
          this.total = res.data.total
        }
      })
    },

    // 查看详情
    seeDetails(row) {
      this.seqNo = row.seqNo
      this.showDetails = true
    },
    // 隐藏
    hideOrderDetails() {
      this.showDetails = false
      this.showUpload = false
    },
    // 上传凭证列表
    uploadCer() {
      this.seqNo = this.seletItem.seqNo
      this.showUpload = true
    },

    // 展开详情
    expandChange(row) {
      Api.getOrderDetail({ seqNo: row.seqNo }).then(res => {
        if (res.code == 200) {
          const index = this.tableData.findIndex(item => item.seqNo == row.seqNo)

          this.$set(this.tableData[index], 'data', res.data.goods)
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.commodityImg {
  width: 70px;
  height: 70px;
}

.btn {
  margin: 20px 0;
}
</style>
