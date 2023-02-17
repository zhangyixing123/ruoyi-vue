<template>
  <div>
    <div class="m-t-20">
      <el-form :model="queryFile" ref="queryForm" class="flex-shrink-0" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="文件名称" prop="fileName">
              <el-input
                v-model.trim="queryFile.fileName"
                placeholder="请输入文件名称"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="文件类型" prop="fileType">
              <el-select
                v-model.trim="queryFile.fileType"
                placeholder="请选择文件类型"
                clearable
                size="small"
              >
                <el-option
                  v-for="item in fileTypeList"
                  :key="item.comCode"
                  :label="item.comCodeDesc"
                  :value="item.comCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button
                type="primary"
                v-hasPermi="['supplier:bill:list']"
                icon="el-icon-search"
                size="mini"
                @click="handleQuery"
                >搜索</el-button
              >
              <el-button
                v-hasPermi="['supplier:bill:list']"
                icon="el-icon-refresh"
                size="mini"
                @click="resetQuery"
                >重置</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="flex m-t-20">
      <el-button size="mini" @click="back">返回</el-button>
      <el-button
        size="mini"
        type="success"
        @click="uploadFile"
        v-hasPermi="['supplier:voucher:upload']"
        >上传</el-button
      >

      <el-button
        class="m-l-10"
        type="warning"
        size="mini"
        @click="downloadAll"
        :disabled="!overOne"
        v-hasPermi="['supplier:voucher:batchDownload']"
        >批量下载</el-button
      >
      <el-button
        type="primary"
        size="mini"
        @click="deleteFile"
        :disabled="single"
        v-hasPermi="['supplier:voucher:delete']"
        >删除</el-button
      >
    </div>
    <el-table
      ref="multipleTable"
      :data="fileData"
      class="m-t-20"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
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
        prop="createTime"
        label="上传时间"
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
      <el-table-column prop="shipmentNumber" label="操作" :show-overflow-tooltip="true" width="140">
        <template slot-scope="scope">
          <span
            class="c-1890ff cur-pointer m-r-10"
            @click="seeFile(scope.row)"
            v-if="['png', 'jpg', 'bmp', 'jpeg', 'gif'].includes(scope.row.fileSuffix)"
            v-hasPermi="['supplier:voucher:preview']"
            >查看</span
          >
          <span class="c-1890ff cur-pointer m-r-10" @click="fileDetail(scope.row)">详情</span>
          <span
            class="c-1890ff cur-pointer"
            @click="downloadFile(scope.row)"
            v-hasPermi="['supplier:voucher:download']"
            >下载</span
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="m-t-20">
      <el-pagination
        class="text-center bgfff pd10 flex-shrink-0"
        layout="total, sizes, prev, pager, next, jumper"
        :current-page.sync="queryFile.pageNum"
        :page-sizes="[10, 20, 30, 50]"
        :page-size.sync="queryFile.pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :total="total"
      >
      </el-pagination>
    </div>
    <el-dialog
      :modal-append-to-body="false"
      :title="currentImageTitle"
      :visible.sync="showPreviewDialog"
      width="600px"
    >
      <img width="100%" ref="previewImg" :src="dialogImageUrl" alt="" />
    </el-dialog>
    <!-- <img :src="imgUrl" alt="" /> -->
    <uploadDialog
      ref="uploadDialog"
      :selected="selected"
      :fileTypeList="fileTypeList"
    ></uploadDialog>
    <el-dialog
      :modal-append-to-body="false"
      title="详情"
      :visible.sync="showDetail"
      width="26%"
      center
    >
      <el-form :model="ruleForm" ref="ruleForm" label-width="80px" class="demo-ruleForm">
        <el-form-item label="文件类型" prop="fileType">
          <el-select v-model.trim="ruleForm.fileType" placeholder="请选择文件类型" disabled>
            <el-option
              v-for="item in fileTypeList"
              :key="item.comCode"
              :value="item.comCode"
              :label="item.comCodeDesc"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择文件" prop="fileName">
          <el-input disabled v-model.trim="ruleForm.fileName"></el-input>
        </el-form-item>
        <el-form-item label="文件名" prop="fileInputName">
          <el-input disabled v-model.trim="ruleForm.fileName"></el-input>
        </el-form-item>
        <el-form-item label="合同编号" prop="contractNo" v-if="ruleForm.fileType == 1">
          <el-input disabled v-model.trim="ruleForm.contractNo"></el-input>
        </el-form-item>
        <el-form-item v-if="ruleForm.fileType == 5" label="发票号码" prop="invoiceNo">
          <el-input disabled v-model.trim="ruleForm.invoiceNo"></el-input>
        </el-form-item>
        <el-form-item v-if="ruleForm.fileType == 5" label="发票代码" prop="invoiceCode">
          <el-input disabled v-model.trim="ruleForm.invoiceCode"></el-input>
        </el-form-item>
        <el-form-item v-if="ruleForm.fileType == 5" label="发票金额" prop="invoiceAmt">
          <el-input disabled v-model.trim="ruleForm.invoiceAmt"></el-input>
        </el-form-item>
        <el-form-item label="文件备注" prop="remark">
          <el-input disabled v-model.trim="ruleForm.remark"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {
  billDetailsAttachApi,
  querySComCodeApi,
  deleteFileApi,
  batchDownloadFileApi,
} from '@/api/money-raise-management'
import {
  imageNumberApi,
  downloadImageApi,
  getFileMaskIds,
  fileDownload,
} from '@/api/image-management'
import uploadDialog from './upload-dialog.vue'
import { downloadWord, downloadZip } from '@/utils/ruoyi'
export default {
  props: {
    hideDetails: {
      type: Function,
    },
    selected: {
      type: Array,
    },
  },
  components: {
    uploadDialog,
  },
  data() {
    return {
      queryFile: {
        pageNum: 1,
        pageSize: 10,

        fileName: undefined,
        fileType: undefined,
      },
      total: 0,
      fileData: [],
      fileList: [],
      single: true,
      overOne: false,
      selectArr: [],
      fileTypeList: [],
      showPreviewDialog: false,
      currentImageTitle: '',
      dialogImageUrl: '',
      showDetail: false,
      ruleForm: {},
    }
  },
  created() {
    this.getFileTypeList()
  },
  computed: {},
  methods: {
    handleQuery() {
      this.queryFile.pageNum = 1
      this.queryFile.pageSize = 10
      this.getFileLists()
    },
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    back() {
      this.$emit('hideDetails')
    },
    // 文件列表
    getFileLists() {
      let params = {
        attachType: 1,
        attachNo: this.selected[0].seqNo,
        ...this.queryFile,
      }
      billDetailsAttachApi(params).then(res => {
        this.fileData = res.data.rows
        this.total = res.data.total
      })
    },
    // 查询文件类型
    getFileTypeList() {
      querySComCodeApi('FILE_TYPE').then(res => {
        this.fileTypeList = res.data
        this.getFileLists()
      })
    },
    // 格式化文件类型
    formatFileType(row) {
      return this.selectComLabel(this.fileTypeList, row.fileType)
    },
    handleSelectionChange(select) {
      this.selectArr = select
      this.single = select.length != 1
      this.overOne = select.length > 0
    },
    handleSizeChange(size) {
      this.queryFile.pageSize = size
      this.getFileLists()
    },
    handleCurrentChange(cur) {
      this.queryFile.pageNum = cur
      this.getFileLists()
    },
    // 上传
    uploadFile() {
      this.$refs.uploadDialog.show = true
    },
    // 批量下载
    downloadAll() {
      let ids = this.selectArr.map(v => {
        return v.fileNo
      })
      let params = ids.join(',')
      getFileMaskIds({ imageNumbers: params, type: '1' }).then(res => {
        let imageNumbers = res.data.map(item => item.imageNumberEncryption).join(',')
        this.handleDownLoad(imageNumbers)
      })
    },
    handleDownLoad(imageNumbers) {
      const query = {
        imageNumbers,
      }
      fileDownload(query).then(res => {
        const a = document.createElement('a')
        const href = window.URL.createObjectURL(res)
        a.href = href
        a.download = `文件列表.zip`
        a.click()
        window.URL.revokeObjectURL(href)
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
    // 文件详情
    fileDetail(row) {
      this.ruleForm = row
      this.showDetail = true
    },
    // 下载文件
    async downloadFile(row) {
      let res = await downloadImageApi({
        imageNumber: row.fileNo,
        type: 1,
      })
      downloadWord(res, row.fileName + '.' + row.fileSuffix)
    },
    deleteFileFn() {
      deleteFileApi(this.selectArr[0].seqNo).then(res => {
        if (res.code == 200) {
          this.getFileTypeList()
          this.$refs.multipleTable.clearSelection()
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
        }
      })
    },
    // 删除
    deleteFile() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
      })
        .then(() => {
          this.deleteFileFn()
        })
        .catch(() => {
          this.$refs.multipleTable.clearSelection()
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
  },
}
</script>
<style lang="scss" scoped></style>
