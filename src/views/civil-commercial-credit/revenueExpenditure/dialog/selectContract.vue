<template>
  <div class="page-name app-container">
    <el-dialog
      :modal-append-to-body="false"
      :title="title"
      :visible.sync="open"
      width="1250px"
      append-to-body
      :close-on-click-modal="false"
      @close="cancel"
    >
      <el-form
        class="el-form-noValid flex-shrink-0"
        :model="queryParams"
        ref="queryForm"
        label-width="100px"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item :label="`合同编号`" prop="code">
              <el-input
                v-model.trim="queryParams.code"
                :placeholder="`请输入合同编号`"
                clearable
                size="small"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="`合同名称`" prop="name">
              <el-input
                v-model.trim="queryParams.name"
                :placeholder="`请输入合同名称`"
                clearable
                size="small"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="`生效日期`" prop="billingDate">
              <el-date-picker
                :clearable="false"
                v-model.trim="billingDate"
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
            <el-form-item :label="`购买方`" prop="coreCode">
              <el-select
                v-model.trim="queryParams.coreCode"
                :placeholder="`请选择购买方`"
                size="small"
              >
                <el-option
                  v-for="dict in $staticData.core_enterprise"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item :label="`上传日期`" prop="uploadDate">
              <el-date-picker
                :clearable="false"
                v-model.trim="uploadDate"
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
            <el-button type="primary" plain icon="el-icon-add" size="mini" @click="exportFun"
              >导出</el-button
            >
          </el-col>
        </el-row>
      </div>
      <!-- 剩余空间通过 flex1 全部分给表格，over-hidden 必须使用 -->
      <div class="flex1 over-hidden">
        <!-- el-table 配置 height 属性 100%，起到自动撑开，且表格标题固定的效果； -->
        <el-table
          height="400"
          v-loading="loading"
          :data="contractList"
          ref="data1"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="合同编号" align="center" prop="code" />
          <el-table-column label="合同名称" align="center" prop="name" />
          <el-table-column label="合同金额(元)" align="center" prop="amount" />
          <el-table-column label="购买方" align="center" prop="buyerName" />
          <el-table-column label="合同生效日期" align="center" prop="effectiveTime" />
          <el-table-column label="上传完成时间" align="center" prop="uploadTime" />
          <el-table-column label="合同附件" align="center">
            <template slot-scope="scope">
              <el-button @click="viewImg(scope.row)" type="text">下载</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页必须加 flex-shrink-0 样式不一定用我的，好看就行 -->
      <!-- size-change 和 current-change 统一用一个时间处理就行了，无非是再去获取列表数据 -->
      <el-pagination
        class="text-center bgfff pd10 flex-shrink-0"
        layout="total, sizes, prev, pager, next, jumper"
        :current-page.sync="queryParams.pageNum"
        :page-sizes="[10, 20, 30, 50]"
        :page-size.sync="queryParams.pageSize"
        @size-change="handleSizeOrSizePageChange"
        @current-change="handleSizeOrCurrentChange"
        :total="total"
      >
      </el-pagination>
      <div>
        说明：1、勾选所需合同，点击”确认“，添加至申请页；2、点击<el-button
          type="text"
          @click="toContract"
          >我的合同</el-button
        >，管理合同
      </div>
      <div slot="footer" class="footer dialog-footer text-center">
        <el-button type="primary" @click="submitForm" :disabled="single">确认</el-button>
        <el-button @click="cancel">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { utils } from '@/utils/utils.js'
import { contractApi, voucherApi, exportContractApi } from '@/api/civil-commercial-credit/financing'
import { downloadImageApi } from '@/api/image-management'
import { downloadWord } from '@/utils/ruoyi'
export default {
  name: 'selectInvoice',
  props: {
    backContract: {
      type: Function,
    },
  },
  data() {
    return {
      title: '关联合同信息',
      open: false,
      loading: false,
      contractList: [],
      total: 0,

      single: true,
      billingDate: [],
      uploadDate: [],
      queryParams: {
        code: undefined,
        name: undefined,
        startEffectiveTime: undefined,
        endEffectiveTime: undefined,
        coreCode: undefined,
        supplierCode: undefined,
        startUploadTime: undefined,
        endUploadTime: undefined,
        pageSize: 10,
        pageNum: 1,
      },
      selection: [],
      tableHead: {
        title: '关联合同信息',
        headName: [
          '合同编码',
          '合同名称',
          '购买方',
          '合同金额(元)',
          '可用金额(元)',
          '生效日期',
          '附件',
          '合同状态',
        ],
        headField: [
          'code',
          'name',
          'coreCode',
          'contractAmount',
          'availableAmount',
          'effectiveDate',
          'enclosure',
          'contractState',
        ],
      },
    }
  },
  watch: {
    open() {
      this.getList()
    },
  },

  methods: {
    getList() {
      let params = JSON.parse(JSON.stringify(this.queryParams))
      if (this.billingDate.length > 0) {
        params.startEffectiveTime = this.billingDate[0]
        params.endEffectiveTime = this.billingDate[1]
      }
      if (this.uploadDate.length > 0) {
        params.startUploadTime = this.uploadDate[0]
        params.endUploadTime = this.uploadDate[1]
      }
      params.supplierCode = this.$store.state.enterprise.enterpriseCertNo
      contractApi(params).then(res => {
        if (res.code == 200) {
          this.contractList = res.data.rows
          this.total = res.data.total
        }
      })
    },
    // 导出
    exportFun() {
      let params = JSON.parse(JSON.stringify(this.queryParams))
      if (this.billingDate.length > 0) {
        params.startEffectiveTime = this.billingDate[0]
        params.endEffectiveTime = this.billingDate[1]
      }
      if (this.uploadDate.length > 0) {
        params.startUploadTime = this.uploadDate[0]
        params.endUploadTime = this.uploadDate[1]
      }
      params.supplierCode = this.$store.state.enterprise.enterpriseCertNo

      exportContractApi(params).then(res => {
        downloadWord(res, '合同列表.xlsx')
      })
    },
    // 查看合同
    viewImg(row) {
      voucherApi(row.seqNo).then(res => {
        if (res.code == 200 && res.data.length > 0) {
          downloadImageApi({
            imageNumber: res.data[0].fileNo,
            type: 1,
          }).then(result => {
            downloadWord(result, res.data[0].fileName)
          })
        }
      })
    },
    // 销项合同
    toContract() {
      this.$router.push('/bills-manage/contract')
    },
    handleQuery() {
      this.getList()
    },
    resetQuery() {
      this.uploadDate = []
      this.billingDate = []
      this.resetForm('queryForm')
      this.queryParams.pageNum = 1
      this.handleQuery()
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
      this.selection = selection
      this.single = selection.length != 1
    },
    submitForm() {
      this.open = false
      this.$emit('backContract', this.selection)
      this.$refs.data1.clearSelection()
    },
    cancel() {
      this.open = false
      this.$refs.data1.clearSelection()
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
