<template>
  <div class="page-name app-container">
    <div class="page-name">
      <el-form
        class="el-form-noValid flex-shrink-0"
        :model="queryParams"
        ref="queryForm"
        label-width="100px"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item :label="`民商信编号`" prop="creditCode">
              <el-input
                v-model.trim="queryParams.creditCode"
                :placeholder="`请输入民商信编号`"
                size="small"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="`核心企业名称`" prop="openerName">
              <el-input
                v-model.trim="queryParams.openerName"
                :placeholder="`请输入核心企业名称`"
                size="small"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="`申请时间`" prop="applyDate">
              <el-date-picker
                :clearable="false"
                v-model.trim="queryParams.applyDate"
                size="small"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="daterange"
                range-separator="-"
                :start-placeholder="`开始时间`"
                :end-placeholder="`结束时间`"
                :default-time="['00:00:00', '23:59:59']"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="`当前状态`" prop="extStatus">
              <el-select size="small" v-model.trim="queryParams.extStatus">
                <el-option
                  v-for="item in statusList"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">
                查询
              </el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">
                重置
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="flex-shrink-0">
        <el-row :gutter="10" class="mb8 flex-shrink-0">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-add"
              size="mini"
              :disabled="single || cantClick"
              @click="handlePass"
              >审批通过</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-add"
              size="mini"
              @click="handleReject"
              :disabled="single || cantClick"
              >审批拒绝</el-button
            >
          </el-col>
        </el-row>
      </div>
      <!-- 剩余空间通过 flex1 全部分给表格，over-hidden 必须使用 -->
      <div class="flex1 over-hidden">
        <!-- el-table 配置 height 属性 100%，起到自动撑开，且表格标题固定的效果； -->
        <el-table
          height="100%"
          v-loading="loading"
          :data="tableData"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="民商信编号" align="center" prop="creditCode" />
          <el-table-column label="开立方" align="center" prop="openerName" />
          <el-table-column label="民商信金额/元" align="center" prop="commercialCreditAmt" />
          <el-table-column label="未兑付金额/元" align="center" prop="unCashAmt" />
          <el-table-column label="展期费率" align="center" prop="extensionRate"> </el-table-column>
          <el-table-column label="承诺付款日" align="center" prop="dueDate" />
          <el-table-column label="展期付款日" align="center" prop="extDate"> </el-table-column>
          <el-table-column label="展期天数/天" align="center" prop="extDays" />
          <el-table-column label="展期费用/元" align="center" prop="extensionAmount" />
          <el-table-column
            label="当前状态"
            align="center"
            prop="extStatus"
            :formatter="statusFormat"
          />
          <el-table-column label="展期备注" align="center" prop="remark" />
          <el-table-column label="申请时间" align="center" prop="createTime" />
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" v-if="canclick(scope.row)" @click="handleView(scope.row)"
                >展期付款明细</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页必须加 flex-shrink-0 样式不一定用我的，好看就行 -->
      <!-- size-change 和 current-change 统一用一个时间处理就行了，无非是再去获取列表数据 -->
      <el-pagination
        class="text-center bgfff pd10 flex-shrink-0"
        layout="total, sizes, prev, pager, next, jumper"
        :current-page.sync="pageNum"
        :page-sizes="[10, 20, 30, 50]"
        :page-size.sync="pageSize"
        @size-change="handleSizeOrSizePageChange"
        @current-change="handleSizeOrCurrentChange"
        :total="total"
      >
      </el-pagination>
    </div>
    <approval-modal
      v-if="approveData"
      @getList="getList"
      :formData="approveData"
      :show.sync="open"
    ></approval-modal>
    <detail-modal :applySeq="seqNo" v-if="showDetail" :show.sync="showDetail"></detail-modal>
  </div>
</template>

<script>
import {
  rollOverRecordApi,
  rollOverRecordApproveApi,
  rollOverPayDetail,
} from '@/api/civil_and_ommercial_letter/zq'
import ApprovalModal from './components/ApproveModal.vue'
import DetailModal from './components/DetailModal.vue'
import { UKeyModal } from '@/utils/business'
import { selectDictLabel } from '@/utils/ruoyi'

export default {
  name: 'dataList',
  components: {
    ApprovalModal,
    DetailModal,
  },
  data() {
    return {
      seqNo: '',
      loading: false,
      tableData: [],
      total: 0,
      pageSize: 10,
      pageNum: 1,
      single: '',
      title: '',
      currentList: [],
      open: false,
      showDetail: false,
      queryParams: {
        creditCode: undefined, //民商信编号
        openerName: undefined, //开立方
        applyDate: undefined, //开始创建时间
        extStatus: undefined, // 清分状态
        pageSize: 10,
        pageNum: 1,
      },
      approveData: {},
      cantClick: null,
    }
  },
  computed: {
    statusList() {
      return this.$staticData['roll_over_cut_sts']
    },
  },
  created() {
    this.getList()
  },

  methods: {
    getList() {
      const reqData = Object.assign({}, this.queryParams, {
        payType: 1,
        ownCertNo: this.$store.state.enterprise.enterpriseCertNo,
      })
      rollOverRecordApi(reqData).then(res => {
        this.tableData = res.data.rows
        this.total = Number(res.data.total)
      })
    },
    //查询
    handleQuery() {
      this.queryParams.pageNum = 1
      if (this.queryParams.applyDate) {
        const [applyStartTime, applyEndTime] = this.queryParams.applyDate
        if (applyStartTime && applyEndTime) {
          this.queryParams = Object.assign({}, this.queryParams, { applyStartTime, applyEndTime })
        }
      }
      this.getList()
    },
    //重置
    resetQuery() {
      this.resetForm('queryForm')
      this.queryParams.applyDate = undefined
      delete this.queryParams.applyStartTime
      delete this.queryParams.applyEndTime
      this.queryParams.pageSize = 10
      this.queryParams.pageNum = 1
      this.getList()
    },

    handleSizeOrSizePageChange(page) {
      this.queryParams.pageSize = page
      this.getList()
    },
    handleSizeOrCurrentChange(page) {
      this.queryParams.pageNum = page
      this.getList()
    },

    handleSelectionChange(selection) {
      this.cantClick = false
      this.currentList = selection
      if (this.currentList.length !== 0) {
        this.cantClick = this.currentList[0].status != '0'
      }
      this.seqNo = selection.map(item => item.seqNo)
      this.single = selection.length != 1
    },
    canclick({ extStatus }) {
      return extStatus == 3 || extStatus == 4 || extStatus == 5
    },

    /**展期付款明细 */
    handleView(row) {
      this.seqNo = row.seqNo
      this.showDetail = true
    },
    /** 审核通过  */
    handlePass() {
      this.approveData = this.currentList[0]
      this.open = true
    },
    /** 审核拒绝 */
    handleReject() {
      this.$confirm('请确定是否执行审批拒绝？', '审批拒绝', {
        type: 'warning',
      }).then(_ => {
        // 发起审批 目前不知传参状态

        UKeyModal(this, null, () => {
          rollOverRecordApproveApi({
            status: '2',
            seqNo: this.seqNo[0],
            ownCertNo: this.$store.state.enterprise.enterpriseCertNo,
          }).then(res => {
            if (res.code == 200) {
              this.$message.success('成功')
              this.getList()
            }
          })
        })
      })
    },

    statusFormat(row, col, value) {
      return selectDictLabel(this.statusList, value)
    },
  },
}
</script>

<style lang="scss" scoped>
/* style 建议使用, scoped 可以用可不用，如果不用 scoped，第一级必须是 本页面的独有的page-name */
/* 必须按规范，不然会对别人的页面造成样式干扰 */
.page-name {
  padding: 10px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
