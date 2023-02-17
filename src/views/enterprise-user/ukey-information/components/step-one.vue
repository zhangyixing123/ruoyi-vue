<template>
  <div class="ukey-adjustment app-container flex1 flex-col over-hidden">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="绑定UKey"></el-step>
      <el-step title="上传《数字证书使用承诺函》"></el-step>
      <!-- <el-step title="平台审核"></el-step> -->
    </el-steps>
    <div class="table-container">
      <div class="opt-btn">
        <el-button
          type="primary"
          plain
          size="small"
          @click="handleAddUKey('1')"
          :disabled="addDisabled"
        >
          新增经办人UKey
        </el-button>
        <el-button
          type="primary"
          plain
          size="small"
          @click="handleAddUKey('2')"
          :disabled="addDisabled"
        >
          新增审核人UKey
        </el-button>
      </div>
      <!--  :header-cell-style="{ background: '#eee', color: '#333' }"  -->
      <el-table
        :data="tableData"
        height="300px"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
        ref="multipleTable"
        border
      >
        <el-table-column label="" type="selection"></el-table-column>
        <el-table-column label="序号" prop="seqNo" align="center"></el-table-column>
        <el-table-column label="角色" prop="ukeyType" align="center">
          <template slot-scope="scope">
            <span>
              {{ scope.row.ukeyType | dictFilter(ukeyRoleArr) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="UKey编号" prop="ukeyNo" align="center"></el-table-column>
        <el-table-column label="UKey获取银行" prop="bankName" align="center"></el-table-column>
        <el-table-column label="证书序列号" prop="ukeySerialNo" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="small" type="primary" plain @click="handleDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="tips">
      <span class="title"> 注意事项: </span>
      <span class="tip"> 1、查看平台支持的UKey清单《UKey清单》</span>
      <span class="tip">
        2、立即申请CFCA（中国金融认证中心）UKey《操作指南》
      </span>
      <span class="tip">
        3、对UKey做出调整后，需要重新获取《数字证书使用承诺函》，加盖红色公章并由法人企业的法定代表人（或非法人企业的负责人）签字后，重新上传。
      </span>
    </div>
    <div class="next-btn">
      <el-button type="primary" @click="handleToNext"> 下一步 </el-button>
    </div>
    <!-- 新增Ukey弹窗 -->
    <el-dialog
      :modal-append-to-body="false"
      :title="`新增${addUkeyTypeLabel}ukey`"
      :visible.sync="showAddDialog"
      top="15vh !important"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="addForm" label-width="150px" ref="addForm" :rules="addRules">
        <el-form-item label="ukey获取银行" prop="bankName">
          <el-input
            v-model.trim="addForm.bankName"
            aria-placeholder="请输入ukey获取银行"
          ></el-input>
        </el-form-item>
        <el-form-item label="ukey编号" prop="ukeyNo">
          <el-input v-model.trim="addForm.ukeyNo" aria-placeholder="请输入ukey编号"></el-input>
        </el-form-item>
        <el-form-item label="ukey序列号" prop="ukeySerialNo">
          <el-input
            v-model.trim="addForm.ukeySerialNo"
            aria-placeholder="请输入ukey序列号"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="add-btn">
        <el-button type="primary" size="small" @click="handleConfirmAdd">
          绑定ukey
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { dictFilter } from '@/utils/filters/common'
import {
  getEnterpriseUkeyList,
  addUkey,
  deleteUkey,
} from '@/api/enterprise-information-management/ukeyIndex'

export default {
  filters: { dictFilter },
  props: ['seqNo'],
  data() {
    return {
      active: 0,
      tableData: [],
      ukeyRoleArr: [
        { dictValue: '1', dictLabel: '经办人' },
        { dictValue: '2', dictLabel: '审核人' },
      ],
      ukeyStatusArr: [
        {
          dictValue: '01',
          dictLabel: '生效',
        },
        {
          dictValue: '02',
          dictLabel: '待审核',
        },
      ],
      addForm: {
        bankName: null,
        ukeyNo: null,
        ukeySerialNo: null,
      },
      addRules: {
        bankName: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入ukey获取银行',
          },
        ],
        ukeyNo: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入ukey编号',
          },
        ],
        ukeySerialNo: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入ukey序列号',
          },
        ],
      },
      loading: false,
      showAddDialog: false,
      addUkeyType: '',
      ukeyId: '',
      addDisabled: false,
      newUkeyId: [],
      selectedData: [],
    }
  },
  computed: {
    addUkeyTypeLabel() {
      return this.addUkeyType === '1' ? '经办人' : '审核人'
    },
  },
  created() {
    this.getList()
  },
  mounted() {},
  watch: {},
  methods: {
    getList() {
      this.loading = true
      const query = { enterpriseId: this.seqNo, status: '' }
      getEnterpriseUkeyList(query).then(res => {
        this.tableData = res.data.filter(v => {
          return v.status == 1
        })
        this.loading = false
      })
    },
    handleAddUKey(type) {
      // 判断是否已经完成了第一步的添加
      this.addUkeyType = type
      this.$refs.addForm && this.$refs.addForm.resetFields()
      this.showAddDialog = true
    },
    handleConfirmAdd() {
      this.$refs.addForm.validate(val => {
        if (val) {
          const query = {
            enterpriseId: this.seqNo,
            ...this.addForm,
            ukeyType: this.addUkeyType,
            userId: '',
          }
          addUkey(query).then(res => {
            this.msgSuccess('添加成功')
            this.showAddDialog = false
            this.getList()
          })
        }
      })
    },
    handleDeleteUKey({ sn }) {
      this.tableData = this.tableData.filter(item => item.sn !== sn)
    },
    handleDelete({ seqNo }) {
      const query = { seqNo }
      deleteUkey(query).then(res => {
        res.success && this.msgSuccess('删除成功！')
        this.getList()
      })
    },
    handleToNext() {
      if (this.tableData.length == 0) {
        this.$message.error(`请先新增一条ukey!`)
        return
      }
      if (this.selectedData.length > 0) {
        this.newUkeyId = this.selectedData.map(v => v.seqNo)
        this.$emit('nextStep', 1, this.newUkeyId)
      } else {
        this.$message.error(`请选择对应ukey记录!`)
      }

      //
    },
    // 更新选中表单内容
    handleSelectionChange(select) {
      this.selectedData = select
    },
    //点击行触发，选中或不选中复选框
    handleRowClick(row, column, event) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
  },
  components: {},
}
</script>

<style scoped lang="scss">
.ukey-adjustment {
  .table-container {
    .opt-btn {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 20px;
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
  .addForm-text {
    display: flex;
    flex-direction: column;
    margin-left: 40px;
    margin-bottom: 20px;
    .title {
      font-weight: bold;
      font-size: 18px;
    }
    .desc {
      color: red;
      font-size: 14px;
    }
  }
  .add-btn {
    width: 200px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
  }
  .next-btn {
    width: 200px;
    margin: 20px auto;
    display: flex;
    justify-content: center;
  }
}
</style>
