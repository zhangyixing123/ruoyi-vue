<template>
  <div class="flex1 flex-col ukey-information">
    <div v-if="!showAdjust">
      <div>
        <el-button @click="back" size="small">返回</el-button>
      </div>
      <div class="content">
        <div class="table-content">
          <div class="title">
            <span>Ukey清单</span>
            <!-- 新增Ukey -->
            <div>
              <el-button plain type="primary" size="small" @click="handleUpdateUkey">
                调整Ukey
              </el-button>
              <el-button
                plain
                type="primary"
                size="small"
                @click="handleDelUkey"
                :disabled="single"
              >
                删除Ukey
              </el-button>
            </div>
          </div>
          <div class="flex1 over-hidden">
            <!-- :header-cell-style="{ background: '#eee', color: '#333' }"   -->
            <el-table
              :data="tableData"
              height="300px"
              v-loading="loading"
              @selection-change="handleSelectionChange"
              @row-click="handleRowClick"
              ref="multipleTable"
              border
            >
              <el-table-column type="selection"></el-table-column>
              <el-table-column label="序号" prop="seqNo" align="center"></el-table-column>
              <el-table-column
                label="企业名称"
                prop="enterpriseName"
                align="center"
              ></el-table-column>
              <el-table-column label="角色" prop="ukeyType" align="center">
                <template slot-scope="scope">
                  <span>
                    {{ scope.row.ukeyType | dictFilter(ukeyRoleArr) }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="UKey编号" prop="ukeyNo" align="center"></el-table-column>
              <el-table-column
                label="UKey获取银行"
                prop="bankName"
                align="center"
              ></el-table-column>
              <el-table-column
                label="证书序列号"
                prop="ukeySerialNo"
                align="center"
              ></el-table-column>
              <el-table-column label="绑定时间" prop="createTime" align="center"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="tips">
        <span class="title"> 注意事项: </span>
        <span class="tip"> 1、查看平台支持的UKey清单《UKey清单》 </span>
        <span class="tip">
          2、立即申请CFCA（中国金融认证中心）UKey《操作指南》
        </span>
        <span class="tip">
          3、对UKey做出调整后，需要重新获取《数字证书使用承诺函》，加盖红色公章并由法人企业的法定代表人（或非法人企业的负责人）签字后，重新上传。
        </span>
      </div>
    </div>
    <adjustUkey v-if="showAdjust" :seqNo="seqNo" @showUkey="showUkey"></adjustUkey>
  </div>
</template>

<script>
import { tableMixin } from '@/mixins/index'
import { dictFilter } from '@/utils/filters/common.js'
import {
  getEnterpriseUkeyList,
  deleteUkey,
} from '@/api/enterprise-information-management/ukeyIndex'

import adjustUkey from './adjustUKey.vue'
export default {
  mixins: [tableMixin],
  filters: { dictFilter },
  props: {
    seqNo: {
      type: String,
      default: '',
    },
    showIndex: {
      type: Function,
    },
  },
  components: {
    adjustUkey,
  },
  data() {
    return {
      tableData: [],

      queryParams: {
        ukeyRole: '',
        // 编号
        sn: '',
        // 序列号
        serialNumber: '',
      },

      loading: false,
      showAdjust: false,
      selectData: [],
      single: true,
    }
  },
  computed: {
    ukeyRoleArr() {
      return [
        { dictValue: '1', dictLabel: '经办人' },
        { dictValue: '2', dictLabel: '审核员' },
      ]
    },
    ukeyStatusArr() {
      return [
        { dictValue: '0', dictLabel: '已启用' },
        { dictValue: '1', dictLabel: '已停用' },
      ]
    },
    auditStatusArr() {
      return [
        { dictValue: '01', dictLabel: '待审核' },
        { dictValue: '02', dictLabel: '审核通过' },
        { dictValue: '03', dictLabel: '审核拒绝' },
      ]
    },
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      const query = { enterpriseId: this.seqNo, status: '' }
      getEnterpriseUkeyList(query).then(res => {
        this.tableData = res.data.filter(v => {
          return v.status == 2
        })
      })
    },
    handleUpdateUkey() {
      this.showAdjust = true
    },
    // 删除Ukey
    handleDelUkey() {
      if (this.selectData.length == 0) {
        this.$message.error(`请选择一条数据!`)
        return
      }
      const query = { seqNo: this.selectData[0].seqNo }
      deleteUkey(query).then(res => {
        res.success && this.msgSuccess('删除成功！')
        this.getList()
      })
    },
    handleSelectionChange(select) {
      this.selectData = select
      this.single = select.length != 1
    },
    handleDownload() {},
    // 停用
    handleStopUkey(row) {
      const loading = this.$loading({
        lock: true,
        text: '接口请求中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      setTimeout(() => {
        loading.close()
        row.ukeyStatus = '1'
        this.msgSuccess('操作成功！')
      }, 1000)
    },
    back() {
      this.$emit('showIndex')
    },
    showUkey() {
      this.showAdjust = false
      this.getList()
    },
  },
}
</script>

<style scoped lang="scss">
.ukey-information {
  .content {
    .table-content {
      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        span {
          font-weight: bold;
          font-size: 24px;
        }
      }
    }
  }
  .tips {
    height: 120px;
    margin-top: 40px;
    background-color: #eee;
    padding: 20px 10px;
    box-sizing: content-box;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
  .opt-btn {
    padding: 20px;
  }
}
</style>
