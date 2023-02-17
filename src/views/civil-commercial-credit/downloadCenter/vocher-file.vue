<template>
  <div class="vocher-file">
    <div>
      <el-button size="mini" @click="back">返回</el-button>
      <el-button type="primary" size="mini" :disabled="selectData.length == 0" @click="downloadAll"
        >批量下载</el-button
      >
    </div>
    <div class="flex1 over-hidden m-t-10">
      <el-table
        v-loading="loading"
        :data="tableData"
        ref="data1"
        height="100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" label="序号"></el-table-column>
        <el-table-column
          label="文件类型"
          align="center"
          prop="imageTypeNumber"
          v-if="fileType == 'open'"
          :formatter="openfileTypeFormatter"
        />
        <el-table-column
          label="文件类型"
          align="center"
          prop="fileType"
          v-if="fileType !== 'open'"
          :formatter="esfileTypeFormatter"
        />
        <el-table-column label="文件编号" align="center" prop="fileId" v-if="fileType == 'open'" />
        <el-table-column label="文件编号" align="center" prop="fileNo" v-if="fileType !== 'open'" />
        <el-table-column label="文件名称" align="center" prop="fileName" />
        <el-table-column label="文件格式" align="center" prop="fileSuffix" />
        <el-table-column label="文件大小" align="center" prop="fileSize" />
        <el-table-column label="上传时间" align="center" prop="createTime" />
        <el-table-column label="上传人" align="center" prop="uploader" v-if="fileType !== 'open'" />
        <!-- <el-table-column label="文件备注" align="center" prop="remark"> </el-table-column> -->
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-if="['png', 'jpg'].includes(scope.row.fileSuffix)"
              @click="viewImg(scope.row)"
              >查看</el-button
            >
            <el-button type="text" @click="download(scope.row)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
import { voucherListApi, listFilePageApi } from '@/api/civil_and_ommercial_letter/zq'
import {
  imageNumberApi,
  getFileMaskIds,
  fileDownload,
  downloadImageApi,
} from '@/api/image-management'
import { downloadWord } from '@/utils/ruoyi'

export default {
  props: {
    hideFiles: {
      type: Function,
    },
    seqNo: {
      type: String,
      default: '',
    },
    fileType: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      tableData: [],
      loading: false,
      currentImageTitle: '',
      showPreviewDialog: false,
      dialogImageUrl: '',
      selectData: [],
    }
  },
  created() {},
  computed: {},
  watch: {
    seqNo(val) {
      if (val) {
        this.fileType == 'open' ? this.getOpenList() : this.getList()
      }
    },
  },
  methods: {
    getOpenList() {
      listFilePageApi({ creditCode: this.seqNo }).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.rows
        }
      })
    },
    getList() {
      voucherListApi(this.seqNo).then(res => {
        if (res.code == 200) {
          this.tableData = res.data
        }
      })
    },
    handleSelectionChange(select) {
      this.selectData = select
    },
    // 下载
    async download(item) {
      let res = await downloadImageApi({
        imageNumber: item.fileNo || item.fileId,
        type: 1,
      })
      downloadWord(res, item.fileName)
    },
    // 批量下载
    downloadAll() {
      let ids = []
      this.selectData.forEach(item => {
        ids.push(item.fileNo || item.fileId)
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
    // 预览图片
    async viewImg(row) {
      this.dialogImageUrl = ''
      let res = await imageNumberApi({
        imageNumber: row.fileNo || row.fileId,
        type: 1,
      })
      this.dialogImageUrl = window.URL.createObjectURL(res)
      this.currentImageTitle = row.fileName
      this.showPreviewDialog = true
    },
    back() {
      this.$emit('hideFiles')
    },

    // 上传文件类型字典翻译
    openfileTypeFormatter(row, column) {
      if (row.menuType == 'F') {
        return ''
      }
      return this.selectDictLabel(this.$staticData.upload_file_type, row.imageTypeNumber)
    },
    // 上传文件类型字典翻译
    esfileTypeFormatter(row, column) {
      if (row.menuType == 'F') {
        return ''
      }
      return this.selectDictLabel(this.$staticData.upload_file_type, row.fileType)
    },
  },
}
</script>
<style lang="scss" scoped>
.vocher-file {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
