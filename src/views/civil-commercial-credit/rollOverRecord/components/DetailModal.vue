<template>
  <div>
    <el-dialog
      :modal-append-to-body="false"
      title="展期付款明细"
      :visible.sync="show"
      width="80%"
      append-to-body
      :close-on-click-modal="false"
      @close="cancel"
    >
      <div class="page-name">
        <!-- 剩余空间通过 flex1 全部分给表格，over-hidden 必须使用 -->
        <div class="flex1 over-hidden">
          <!-- el-table 配置 height 属性 100%，起到自动撑开，且表格标题固定的效果； -->
          <el-table height="100%" v-loading="loading" :data="tableData">
            <el-table-column label="民商信编号" align="center" prop="creditCode" />
            <el-table-column label="民商信持有人" align="center" prop="ownName" />
            <el-table-column label="民商信持有金额/元" align="center" prop="ownLimit" />
            <el-table-column label="展期费率" align="center" prop="extensionRate" />
            <!-- 与后端交流过字段 -->
            <el-table-column label="承诺付款日" align="center" prop="dueDate" />
            <el-table-column label="展期付款日" align="center" prop="extDate" />
            <el-table-column label="展期天数/天" align="center" prop="extDays" />
            <el-table-column label="展期费用/元" align="center" prop="tradeAmount" />
            <el-table-column
              label="当前状态"
              align="center"
              prop="extStatus"
              :formatter="rollOverStaFormatter"
            />
            <!-- 与后端交流过字段 -->
            <el-table-column label="申请时间" align="center" prop="tradeTime" width="160" />
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  v-if="showCleanBtn(scope.row)"
                  @click="handleClean(scope.row)"
                  >重新清分</el-button
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
          @size-change="getList"
          @current-change="getList"
          :total="total"
        >
        </el-pagination>
        <div slot="footer" class="dialog-footer text-center">
          <el-button @click="cancel">关闭</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { rollOverClean, rollOverPayDetail } from '@/api/civil_and_ommercial_letter/zq'
import { UKeyModal } from '@/utils/business'
export default {
  name: 'detailModal',
  props: {
    applySeq: {
      type: String,
    },
    show: {
      type: Boolean,
    },
  },
  data() {
    return {
      tableData: [],
      loading: false,
      pageSize: 10,
      pageNum: 1,
      total: 0,
    }
  },
  watch: {},
  created() {
    this.getList()
  },
  computed: {},
  methods: {
    getList() {
      const { applySeq, pageSize, pageNum } = this
      const reqData = { applySeq, pageSize, pageNum }
      rollOverPayDetail(reqData).then(res => {
        this.tableData = res.data.rows
        this.total = res.data.total
      })
    },
    handleClean(row) {
      this.$confirm('是否确认执行重新清分？', '提示').then(() => {
        UKeyModal(this, null, () => {
          rollOverClean({
            ids: row.seqNo,
          }).then(res => {
            if (res.code == 200) {
              this.$message.success('成功')
              this.getList()
            }
          })
        })
      })
    },
    cancel() {
      this.close()
    },
    close() {
      this.$emit('update:show', false)
    },
    rollOverStaFormatter(row) {
      return this.selectDictLabel(this.$staticData.CLEAR_RECORD_STS, row.extStatus)
    },
    showCleanBtn({ status }) {
      return status === 2
    },
  },
}
</script>
<style lang="scss" scoped>
.page-name {
  height: 70vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
