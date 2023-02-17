<template>
  <div>
    <div class="flex">
      <el-button size="mini" @click="back">返回订单</el-button>
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
        :formatter="formatfileType"
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
      <el-table-column prop="fileSize" label="文件大小" :show-overflow-tooltip="true">
      </el-table-column>
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
      <el-table-column prop="shipmentNumber" label="操作" :show-overflow-tooltip="true" width="100">
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
    <!-- 上传文件弹框 -->

    <uploadDialog
      ref="uploadDialog"
      :selected="selected"
      :fileTypeList="getfileTypeList"
      :type="type"
    ></uploadDialog>
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
    hideOrderDetails: {
      type: Function,
    },
    seqNo: {
      type: String,
      default: '',
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
      getfileTypeList: [],
      currentImageTitle: '',
      dialogImageUrl: '',
      showPreviewDialog: false,
      dialogFormVisible: false,
      pageNum: 1,
      pageSize: 10,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        attachType: 2,
        attachNo: undefined,
      },
      total: 0,
      form: {},
      fileData: [],
      fileList: [],
      single: true,
      overOne: false,
      selectItem: [],
      type: 'order',
    }
  },
  created() {
    this.getDiceData()
    this.total = this.fileData.length
  },
  computed: {},
  methods: {
    subMit() {
      console.log(this.form)
    },
    back() {
      this.$emit('hideOrderDetails')
    },
    handleSelectionChange(select) {
      this.selectItem = select
      this.single = select.length != 1
      this.overOne = select.length > 0
    },
    handleSizeOrCurrentChange() {
      this.queryParams.pageNum = this.pageNum
      this.queryParams.pageSize = this.pageSize
      this.getFileLists()
    },

    // 凭证列表
    getFileLists() {
      this.queryParams.attachNo = this.seqNo
      Api.voucherList(this.queryParams).then(res => {
        this.total = res.data.total
        this.fileData = res.data.rows
      })
    },

    // 查询字典
    getDiceData() {
      // 文件类型
      querySComCodeApi('FILE_TYPE').then(res => {
        this.getfileTypeList = res.data
      })

      this.getFileLists()
    },
    formatfileType(row) {
      return this.selectComLabel(this.getfileTypeList, row.fileType)
    },

    // 上传文件
    uploadFile() {
      this.$refs.uploadDialog.show = true
    },
    selectFile() {},
    // 批量下载
    downloadAll() {
      let ids = this.selectItem.map(v => {
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

    // 下载
    async downLoad(row) {
      let res = await downloadImageApi({
        imageNumber: row.fileNo,
        type: 1,
      })
      downloadWord(res, row.fileName + '.' + row.fileSuffix)
    },
    // 删除
    deleteFile() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
      })
        .then(() => {
          Api.voucherDelete({ id: this.selectItem[0].seqNo }).then(res => {
            if (res.code == 200) {
              this.$refs.multipleTable.clearSelection()
              this.$message({
                type: 'success',
                message: '删除成功!',
              })
              this.getFileLists()
            }
          })
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
