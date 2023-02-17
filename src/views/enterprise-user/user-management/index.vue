<template>
  <div class="user-management">
    <div>
      <el-button size="small" @click="back">返回</el-button>
    </div>
    <el-form class="flex-shrink-0" :model="queryParams" ref="queryForm" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="姓名" prop="realName">
            <el-input
              v-model.trim="queryParams.realName"
              placeholder="请输入姓名"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="手机号" prop="mobile">
            <el-input
              v-model.trim="queryParams.mobile"
              placeholder="请输入手机号"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="认证状态" prop="faceCheck">
            <el-select
              v-model.trim="queryParams.faceCheck"
              placeholder="请选择认证状态"
              clearable
              size="small"
            >
              <el-option
                v-for="userType in realNameArr"
                :key="userType.dictValue"
                :label="userType.dictLabel"
                :value="userType.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="用户状态" prop="status">
            <el-select
              v-model.trim="queryParams.status"
              placeholder="请选择用户状态"
              clearable
              size="small"
            >
              <el-option
                v-for="userType in personAuthArr"
                :key="userType.dictValue"
                :label="userType.dictLabel"
                :value="userType.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery"
              >搜索</el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery('queryForm')"
              >重置</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="flex-shrink-0 opt-btn">
      <!-- 邀请用户 -->
      <!-- <el-button plain type="primary" size="small" @click="handleInvitation">
        邀请用户
      </el-button> -->
      <!-- 删除 -->
      <el-button :disabled="single" plain type="default" size="small" @click="checkStatus">
        删除
      </el-button>
      <!-- 管理员移交 -->
      <!-- <el-button plain type="warning" size="small" @click="showHandOverDialog = true">
        管理员移交
      </el-button> -->
      <!-- 绑定UKey -->
      <!-- <el-button :disabled="single" plain type="warning" size="small" @click="handleBindUKey">
        绑定UKey
      </el-button> -->
      <el-button :disabled="single" size="small" plain type="warning" @click="triggerStatus">
        启用/停用
      </el-button>
    </div>
    <div class="flex1 over-hidden">
      <el-table
        :data="tableData"
        v-loading="loading"
        height="100%"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
        ref="multipleTable"
      >
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column label="姓名" prop="realName" align="center"></el-table-column>
        <el-table-column label="手机号" prop="maskMobile" align="center"></el-table-column>
        <el-table-column label="邮箱" prop="email" align="center"></el-table-column>
        <el-table-column label="证件号码" prop="maskCardCode" align="center"></el-table-column>
        <el-table-column label="用户状态" prop="status" align="center">
          <template slot-scope="scope">
            {{ scope.row.status | dictFilter(personAuthArr) }}
          </template>
        </el-table-column>
        <el-table-column label="认证状态" prop="faceCheck" align="center">
          <template slot-scope="scope">
            {{ scope.row.faceCheck | dictFilter(realNameArr) }}
          </template>
        </el-table-column>
        <el-table-column label="邀请码" prop="recommendCode" align="center"></el-table-column>
        <!-- <el-table-column label="Ukey" prop="ukeyNo" align="center"></el-table-column> -->
        <el-table-column label="用户类型" prop="ukeyType" align="center">
          <template slot-scope="scope">
            <span> {{ scope.row.ukeyType | dictFilter(ukeyTypeArr) }} </span>
          </template>
        </el-table-column>
        <el-table-column label="加入时间" prop="addTime" align="center"></el-table-column>
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
    <!-- 邀请用户弹窗 -->
    <el-dialog
      :modal-append-to-body="false"
      title="邀请用户"
      :visible.sync="showInvitationDialog"
      top="15vh !important"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="inviteForm" label-width="150px" ref="inviteForm" inline :rules="inviteRules">
        <el-form-item label="被邀请人手机号:" prop="mobile">
          <el-input v-model.trim="inviteForm.mobile" size="small" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="被邀请人姓名:" prop="realName">
          <el-input v-model.trim="inviteForm.realName" size="small" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="被邀请人身份证:" prop="idCardNo">
          <el-input v-model.trim="inviteForm.idCardNo" size="small" style="width: 240px"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-btn">
        <el-button type="primary" size="small" @click="handleConfirmInvite">
          确认提交
        </el-button>
        <el-button
          type="warning"
          size="small"
          @click=";(showInvitationDialog = false), $refs.inviteForm.clearValidate()"
        >
          取消
        </el-button>
      </div>
    </el-dialog>
    <!-- 删除弹窗 -->
    <el-dialog
      :modal-append-to-body="false"
      :visible.sync="showDeleteDoalog"
      top="15vh !important"
      width="300px"
      :close-on-click-modal="false"
      title="温馨提示"
    >
      <span> 请确认是否删除该用户信息 </span>
      <div class="dialog-btn delete-btn">
        <el-button type="primary" size="small" @click="handleConfirmDelete">
          确认删除
        </el-button>
        <el-button type="warning" size="small" @click="showDeleteDoalog = false">
          取消
        </el-button>
      </div>
    </el-dialog>
    <!-- 绑定UKey弹窗 -->
    <el-dialog
      :modal-append-to-body="false"
      :visible.sync="showBindUKeyDialog"
      title="添加UKey"
      top="15vh !important"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="bindUKeyForm" ref="bindUKeyForm" label-width="120px" :rules="bindUKeyRules">
        <el-form-item label="用户姓名" prop="bindName">
          <el-input
            v-model.trim="bindUKeyForm.bindName"
            style="width: 240px"
            placeholder="请输入用户姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="UKey" prop="ukeyCode">
          <el-select
            v-model.trim="bindUKeyForm.ukeyCode"
            placeholder="请选择UKey"
            style="width: 240px"
          >
            <el-option
              v-for="ukey in ukeyList"
              :key="ukey.seqNo"
              :value="ukey.seqNo"
              :label="getUkeyLabel(ukey)"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="dialog-btn delete-btn">
        <el-button type="primary" size="small" @click="handleConfirmAddUKey">
          确认添加
        </el-button>
        <el-button type="warning" size="small" @click="showBindUKeyDialog = false">
          取消
        </el-button>
      </div>
    </el-dialog>
    <!-- 管理员移交弹窗 -->
    <el-dialog
      :modal-append-to-body="false"
      title="管理员移交"
      :visible.sync="showHandOverDialog"
      top="15vh !important"
      width="800px"
      :close-on-click-modal="false"
    >
      <!-- :header-cell-style="{ background: '#eee', color: '#333' }" -->
      <el-form class="flex-shrink-0" :model="handOver" ref="handOverForm" label-width="60px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="姓名" prop="realName">
              <el-input
                v-model.trim="handOver.realName"
                placeholder="请输入姓名"
                clearable
                size="small"
                @keyup.enter.native="handOverFn"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号" prop="mobile">
              <el-input
                v-model.trim="handOver.mobile"
                placeholder="请输入手机号"
                clearable
                size="small"
                @keyup.enter.native="handOverFn"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handOverFn"
                >搜索</el-button
              >
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        :data="userList"
        border
        ref="managerTable"
        @selection-change="managerSelected"
        @row-click="manageTableRowClick"
      >
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column label="姓名" prop="realName" align="center"></el-table-column>
        <el-table-column label="手机号" prop="maskMobile" align="center"></el-table-column>
      </el-table>
      <div class="dialog-btn delete-btn">
        <el-button
          :disabled="managerSelectedData.length !== 1"
          type="primary"
          @click="handleConfirmHandOver"
        >
          确认移交
        </el-button>
        <el-button type="warning" @click="showHandOverDialog = false">
          取消
        </el-button>
      </div>
    </el-dialog>
    <!-- 停用/启用 弹窗 -->
    <el-dialog
      :modal-append-to-body="false"
      title="温馨提示"
      :visible.sync="showTriggerDialog"
      top="15vh !important"
      width="500px"
      :close-on-click-modal="false"
    >
      <span> 请确认是否要停用/启用该用户信息 </span>
      <div class="dialog-btn delete-btn">
        <el-button type="primary" @click="triggerStatusConfirm">
          确认提交
        </el-button>
        <el-button type="warning" @click="showTriggerDialog = false">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { tableMixin } from '@/mixins/index'
import { dictFilter } from '@/utils/filters/common.js'
import * as Api from '@/api/enterprise-information-management/index'

import { enterpriseUkeyListApi, invitationUserApi } from '@/api/user-center/index'
import { Encrypt } from '@/utils/jsencrypt'
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
  data() {
    return {
      // ukey 列表
      ukeyList: null,
      // 用户管理表格被选中的内容
      rows: [],
      ids: null,
      single: true,
      multiple: null,
      tableData: [],
      total: 1,
      // 移交管理员表格被选中内容
      managerSelectedData: [],
      pageSize: 10,
      pageNum: 1,
      queryParams: {
        realName: undefined,
        mobile: undefined,
        status: undefined,
        faceCheck: undefined,
        pageSize: 10,
        pageNum: 1,
      },
      handOver: {
        realName: undefined,
        mobile: undefined,
        status: undefined,
        faceCheck: undefined,
        pageSize: 1000,
        pageNum: 1,
      },
      showInvitationDialog: false,
      showDeleteDoalog: false,
      showBindUKeyDialog: false,
      showHandOverDialog: false,
      inviteForm: {
        mobile: null,
        realName: null,
        idCardNo: null,
      },

      inviteRules: {
        mobile: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入被邀请人手机号',
          },
        ],
        realName: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入被邀请人姓名',
          },
        ],
        idCardNo: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入被邀请人身份证号',
          },
        ],
      },
      bindUKeyForm: {
        bindName: null,
        ukeyCode: null,
      },
      bindUKeyRules: {
        bindName: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入添加用户姓名',
          },
        ],
        ukeyCode: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请选择UKey',
          },
        ],
      },
      loading: false,
      personAuthArr: [
        { dictValue: '1', dictLabel: '正常' },
        { dictValue: '2', dictLabel: '冻结' },
        { dictValue: '3', dictLabel: '注销' },
      ],
      realNameArr: [
        { dictValue: '0', dictLabel: '否' },
        { dictValue: '1', dictLabel: '是' },
        { dictValue: '2', dictLabel: '待人工审核' },
      ],
      // 启用/停用 弹窗
      showTriggerDialog: false,
      userList: [],
    }
  },
  watch: {
    showHandOverDialog() {
      this.handOverFn()
      this.handOver = {
        realName: undefined,
        mobile: undefined,
        status: undefined,
        faceCheck: undefined,
        pageSize: 1000,
        pageNum: 1,
      }
    },
  },
  computed: {
    ukeyTypeArr() {
      return [
        { dictValue: '1', dictLabel: '经办人' },
        { dictValue: '2', dictLabel: '审核人' },
      ]
    },
    enterpriseId() {
      return this.$store.state.enterprise.enterpriseId
    },
  },
  created() {
    this.getList()
    this.getukeyList()
  },
  methods: {
    // 管理员移交表格选中数据
    managerSelected(selection) {
      this.managerSelectedData = selection
    },
    manageTableRowClick(row, column, event) {
      this.$refs.managerTable.toggleRowSelection(row)
    },
    // 用户表格选中数据
    handleSelectionChange(selection) {
      this.rows = selection
      this.ids = selection.map(item => item.userId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },

    getukeyList() {
      const enterpriseId = this.seqNo
      enterpriseUkeyListApi({
        enterpriseId,
        status: 2,
      }).then(res => {
        this.ukeyList = res.data
      })
    },
    getList() {
      const query = {
        ...this.queryParams,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        enterpriseId: this.seqNo,
      }
      if (query.mobile) query.mobile = Encrypt(query.mobile)
      Api.userManagement(query).then(res => {
        this.tableData = res.data.rows
        this.total = res.data.total
        // 管理员移交表格列表
        this.userList = res.data.rows.filter(item => item.realNameCheck)
      })
    },
    resetQuery() {
      this.$refs.queryForm.resetFields()
      this.$refs.handOverForm.resetFields()
    },
    handleInvitation() {
      this.showInvitationDialog = true
      this.$refs.inviteForm && this.$refs.inviteForm.resetFields()
    },
    // 邀请用户确认提交
    handleConfirmInvite() {
      this.$refs.inviteForm.validate(val => {
        if (val) {
          const query = { ...this.inviteForm, enterpriseId: this.seqNo }
          invitationUserApi(query).then(res => {
            if (res.code == 200) {
              this.msgSuccess('邀请成功')
              // this.$emit('showIndex')
              this.getList()
              this.showInvitationDialog = false
            }
          })
        }
      })
    },
    checkStatus() {
      const { status } = this.rows[0]
      if (status === 1) {
        this.msgError('该账号为启用状态，请先停用后再进行删除操作！')
      } else {
        this.showDeleteDoalog = true
      }
    },
    // 删除用户
    handleConfirmDelete() {
      const enterpriseId = this.seqNo
      Api.userRemove({
        enterpriseId,
        userId: this.ids[0],
      }).then(res => {
        if (res.code == 200) {
          this.msgSuccess('删除成功')
          this.getList()
        }
      })
      this.showDeleteDoalog = false
    },
    handleHandOver() {
      this.showHandOverDialog = true
    },
    handOverFn() {
      const query = { ...this.handOver, enterpriseId: this.seqNo }
      if (query.mobile) query.mobile = Encrypt(query.mobile)
      Api.userManagement(query).then(res => {
        this.userList = res.data.rows.filter(item => item.realNameCheck)
      })
    },
    // 管理员确认移交
    handleConfirmHandOver() {
      const enterpriseId = this.seqNo
      const { userId } = this.managerSelectedData[0]
      const query = {
        // 企业id
        enterpriseId,
        // 当前管理员的id
        uid: '',
        // 需要移交给的用户id
        userId,
      }
      Api.transferAdmin(query).then(res => {
        if (res.code == 200) {
          this.msgSuccess('移交成功')
          this.$emit('showIndex')
        }
      })
      this.showHandOverDialog = false
    },
    handleBindUKey() {
      const { realName } = this.rows[0]
      this.bindUKeyForm.bindName = realName
      this.showBindUKeyDialog = true
      this.$refs.bindUKeyForm && this.$refs.bindUKeyForm.resetFields()
    },
    handleConfirmAddUKey() {
      const enterpriseId = this.seqNo
      this.$refs.bindUKeyForm.validate(val => {
        if (val) {
          const { userId } = this.rows[0] || { userId: 0 }
          const query = {
            enterpriseId,
            ukeyId: this.bindUKeyForm.ukeyCode,
            userId,
          }
          Api.userBindUkey(query).then(res => {
            if (res.code == 200) {
              this.showBindUKeyDialog = false
              this.msgSuccess('绑定成功')
              this.getList()
            }
          })
        }
      })
    },
    // 启用/停用
    triggerStatus() {
      this.showTriggerDialog = true
    },
    triggerStatusConfirm() {
      const { userId } = this.rows[0] || { userId: 0 }
      const enterpriseId = this.seqNo
      const query = {
        enterpriseId,
        userId,
      }
      Api.frostUser(query).then(res => {
        if (res.code == 200) {
          this.msgSuccess('修改成功')
          this.showTriggerDialog = false
          this.getList()
        }
      })
    },
    getUkeyLabel({ ukeyType, ukeyNo }) {
      const ukeyTypeLabel =
        this.ukeyTypeArr.find(item => item.dictValue == ukeyType)?.dictLabel || ''
      return ukeyTypeLabel + '--' + ukeyNo
    },
    back() {
      this.$emit('showIndex')
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
  },
}
</script>

<style scoped lang="scss">
.user-management {
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  .opt-btn {
    padding: 20px;
  }
  .dialog-btn {
    width: 200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
  }
  .delete-btn {
    margin-top: 40px;
  }
}
</style>
