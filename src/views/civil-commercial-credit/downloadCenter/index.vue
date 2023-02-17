<template>
  <div class="page-name app-container">
    <div class="title-box">
      <div class="title">下载中心</div>
      <el-button type="primary" :disabled="selectedData.length === 0" @click="handleBatchDownload">
        批量下载
      </el-button>
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
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column label="业务编号" prop="creditCode" align="center"></el-table-column>
        <!-- <el-table-column label="业务说明" prop="businessDesc" align="center"></el-table-column> -->
        <el-table-column label="文件名" prop="fileName" align="center"></el-table-column>
        <!-- <el-table-column label="状态" prop="status" align="center">
          <template slot-scope="scope">
            <span> {{ scope.row.status | dictFilter(statusArr) }} </span>
          </template>
        </el-table-column> -->
        <el-table-column label="生成时间" prop="createTime" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <!-- <a :href="scope.row.src" :download="scope.row.fileName"> -->
            <el-button plain size="small" type="primary" @click="downloadFile(scope.row)">
              下载
            </el-button>
            <!-- </a> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      class="text-center bgfff pd10 flex-shrink-0"
      layout="total, sizes, prev, pager, next, jumper"
      :current-page.sync="pageNum"
      :page-sizes="[10, 20, 30, 50]"
      :page-size.sync="pageSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import { Encrypt } from '@/utils/jsencrypt'
import {
  getFileList,
  fileDownload,
  getFileMaskId,
  getFileMaskIds,
} from '@/api/civil-commercial-credit/downloadCenter'
import { downloadImageApi } from '@/api/image-management'
import { downloadWord, downloadZip } from '@/utils/ruoyi'

export default {
  filters: {
    dictFilter: (val, dictOptions, keys) => {
      if (!dictOptions) {
        return val
      }
      let valueKey = 'dictValue',
        labelKey = 'dictLabel'
      if (keys) {
        valueKey = keys.valueKey || valueKey
        labelKey = keys.labelKey || labelKey
      }
      let dictOption = dictOptions.find(item => item[valueKey] == val)
      return dictOption ? dictOption[labelKey] : val
    },
  },
  created() {
    const { creditCode } = this.$route.query
    this.creditCode = creditCode
    this.getList()
  },
  data() {
    return {
      loading: false,
      tableData: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      selectedData: [],
      statusArr: [
        { dictValue: '01', dictLabel: '有效' },
        { dictValue: '02', dictLabel: '无效' },
      ],
      creditCode: '',
      isBatchDownLoad: false,
    }
  },
  methods: {
    getList() {
      const query = {
        creditCode: this.creditCode,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        ownId: this.$store.state.enterprise.enterpriseId,
      }
      this.loading = true
      getFileList(query).then(res => {
        this.tableData = res.data.rows
        this.total = res.data.total
        this.loading = false
      })
    },
    // pageSize 变化回调
    handleSizeChange(size) {
      this.pageSize = size
      this.getList()
    },
    // pageNum 变化回调
    handleCurrentChange(current) {
      this.pageNum = current
      this.getList()
    },
    // 更新选中表单内容
    handleSelectionChange(select) {
      this.selectedData = select
    },
    // 单个下载
    async downloadFile({ fileId, fileName }) {
      let res = await downloadImageApi({
        imageNumber: fileId,
        type: 1,
      })
      downloadWord(res, fileName)
    },
    // 批量下载
    handleBatchDownload() {
      this.isBatchDownLoad = true
      const fileIds = this.selectedData.map(item => item.fileId).join(',')
      getFileMaskIds({ imageNumbers: fileIds, type: '1' }).then(res => {
        this.imageNumbers = res.data.map(item => item.imageNumberEncryption).join(',')
        this.fileName = this.selectedData.map(item => item.fileName).join(',')
        this.handleDownLoad()
      })
    },
    handleDownLoad() {
      const query = {
        imageNumbers: this.imageNumbers,
      }
      fileDownload(query).then(res => {
        downloadZip(res, '文件列表')
        this.imageNumbers = ''
        this.fileName = ''
      })
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
  .title-box {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .title {
      font-size: 24px;
      font-weight: 600;
    }
  }
}
</style>
