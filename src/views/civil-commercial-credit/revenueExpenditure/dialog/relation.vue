<template>
  <div class="page-name">
    <el-dialog
      :modal-append-to-body="false"
      :visible.sync="open"
      width="80%"
      append-to-body
      :close-on-click-modal="false"
      @close="cancel"
    >
      <div style="height:55%">
        <div class="flex-shrink-0">
          <el-row :gutter="10" class="mb8 flex-shrink-0">
            <el-col :span="19">
              发票信息
            </el-col>
            <el-col :span="2">
              <el-button type="primary" icon="el-icon-add" size="mini" @click="referenceInvoice"
                >引用发票</el-button
              >
            </el-col>
            <el-col :span="2">
              <el-button
                type="danger"
                plain
                icon="el-icon-delete"
                size="mini"
                :disabled="single"
                @click="deleteInvoice"
                >删除发票</el-button
              >
            </el-col>
          </el-row>
        </div>
        <!-- 剩余空间通过 flex1 全部分给表格，over-hidden 必须使用 -->
        <div class="flex1 over-hidden">
          <!-- el-table 配置 height 属性 100%，起到自动撑开，且表格标题固定的效果； -->
          <el-table
            height="250"
            v-loading="loading"
            :data="invoiceList"
            ref="data1"
            @selection-change="invoiceSelectionChange"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="发票代码" align="center" prop="code" />
            <el-table-column label="发票号码" align="center" prop="number" />
            <el-table-column label="购买方" align="center" prop="buyerName" />
            <el-table-column label="发票金额(元)" align="center" prop="amount" />
            <el-table-column label="不含税金额(元)" align="center" prop="exclTaxAmt" />
            <el-table-column label="开票日期" align="center" prop="invoiceDate" />
            <el-table-column label="发票附件" align="center">
              <template slot-scope="scope">
                <el-button @click="viewImg(scope.row.fileList, 'fj')" type="text">下载</el-button>
              </template>
            </el-table-column>
            <el-table-column label="发票清单" align="center">
              <template slot-scope="scope">
                <el-button @click="viewImg(scope.row.fileList, 'qd')" type="text">下载</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div style="height:50%">
        <div class="flex-shrink-0">
          <el-row :gutter="10" class="mb8 m-t-10 flex-shrink-0">
            <el-col :span="19">
              合同信息
            </el-col>
            <el-col :span="2">
              <el-button type="primary" icon="el-icon-add" size="mini" @click="referenceContract"
                >引用合同</el-button
              >
            </el-col>
            <el-col :span="2">
              <el-button
                type="danger"
                plain
                icon="el-icon-delete"
                size="mini"
                :disabled="single"
                @click="deleteContract"
                >删除合同</el-button
              >
            </el-col>
          </el-row>
        </div>
        <div class="flex1 over-hidden">
          <el-table
            height="300"
            v-loading="loading"
            :data="contractList"
            ref="data1"
            @selection-change="contractSelectionChange"
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
                <el-button @click="seeContract(scope.row)" type="text">下载</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="footer dialog-footer text-center">
        <el-button @click="cancel">上一步</el-button>
        <el-button
          type="primary"
          @click="next"
          :disabled="invoiceList.length == 0 || contractList.length == 0"
          >下一步</el-button
        >
      </div>
      <select-invoice ref="invoiceShow" @backInvoice="backInvoice"></select-invoice>
      <select-contract ref="contractShow" @backContract="backContract"></select-contract>
    </el-dialog>
  </div>
</template>

<script>
import selectInvoice from './selectInvoice.vue'
import selectContract from './selectContract.vue'
import { financingSubmitApi, voucherApi } from '@/api/civil-commercial-credit/financing'
import { downloadImageApi } from '@/api/image-management'
import { downloadWord } from '@/utils/ruoyi'

export default {
  name: 'relation',
  components: {
    'select-invoice': selectInvoice,
    'select-contract': selectContract,
  },
  props: {
    inquiryNo: {
      type: String,
    },
  },
  data() {
    return {
      loading: false,
      invoiceList: [], // 发票列表
      contractList: [],
      total: 0,
      pageSize: 10,
      pageNum: 1,
      single: '',
      committedPaymentDate: [],
      applicationDate: [],

      invoiceShow: false,
      contractShow: false,
      selectInvoiceItem: {},
      selectContractItem: {},
      open: false,
    }
  },
  mounted: function() {},
  methods: {
    getList() {},
    // 申请融资
    applyFinancing() {
      this.$router.push({
        name: 'financing',
        query: {},
      })
    },
    invoiceSelectionChange(selection) {
      this.selectInvoiceItem = selection[0]
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
    },
    contractSelectionChange(selection) {
      this.selectContractItem = selection[0]
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
    },
    // 引用发票
    referenceInvoice() {
      this.$refs.invoiceShow.open = true
    },
    // 回显发票
    backInvoice(data) {
      this.invoiceList = data
    },
    // 删除发票
    deleteInvoice() {
      this.invoiceList = []
    },
    viewImg(files, type) {
      if (files.length == 0) {
        this.$message({
          type: 'warning',
          message: '此发票暂无文件信息',
        })
        return
      }
      if (type == 'fj') {
        let fjList = files.filter(v => {
          return v.fileType == '0301'
        })
        if (fjList.length == 0) {
          this.$message({
            type: 'warning',
            message: '暂无发票附件',
          })
        } else {
          downloadImageApi({
            imageNumber: fjList[0].fileNo,
            type: 1,
          }).then(result => {
            downloadWord(result, fjList[0].fileName)
          })
        }
      }
      if (type == 'qd') {
        let qdList = files.filter(v => {
          return v.fileType == '0302'
        })
        if (qdList.length == 0) {
          this.$message({
            type: 'warning',
            message: '暂无发票清单',
          })
        } else {
          downloadImageApi({
            imageNumber: qdList[0].fileNo,
            type: 1,
          }).then(result => {
            downloadWord(result, qdList[0].fileName)
          })
        }
      }
    },
    // 引用合同
    referenceContract() {
      this.$refs.contractShow.open = true
    },
    // 回显合同
    backContract(data) {
      this.contractList = data
    },
    // 删除合同
    deleteContract() {
      this.contractList = []
    },
    // 下载合同
    seeContract(row) {
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
    // 取消
    cancel() {
      this.open = false
      this.contractList = []
      this.invoiceList = []
    },
    // 下一步 需要ukey
    next() {
      let params = {
        billCode: this.invoiceList[0].code,
        billNo: this.invoiceList[0].number,
        billSeq: this.invoiceList[0].seqNo,
        contractName: this.contractList[0].name,
        contractNo: this.contractList[0].code,
        contractSeq: this.contractList[0].seqNo,
        inquiryNo: this.inquiryNo,
      }
      financingSubmitApi(params).then(res => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: '申请成功',
          })
          this.$router.push({
            path: '/lcivil-commercial-credit/financingApplicationRecord/index',
            query: { activeName: '2' },
          })
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
/* style 建议使用, scoped 可以用可不用，如果不用 scoped，第一级必须是 本页面的独有的page-name */
/* 必须按规范，不然会对别人的页面造成样式干扰 */
.page-name {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .footer {
    margin: 30px 0;
  }
}
</style>
