<template>
  <div class="app-container">
    <div class="main" v-if="!showCreate && !showAdd && !showDetails && !showUser && !showUkey">
      <el-form :model="queryParams" ref="queryForm" class="flex-shrink-0" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="企业名称" prop="name">
              <el-input
                v-model.trim="queryParams.name"
                placeholder="请输入企业名称"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="社会信用代码" prop="enterpriseNo">
              <el-input
                v-model.trim="queryParams.enterpriseNo"
                placeholder="请输入社会信用代码"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="企业认证状态" prop="status">
              <el-select
                v-model.trim="queryParams.status"
                placeholder="请选择企业认证状态"
                clearable
                size="small"
              >
                <el-option
                  v-for="dict in auditList"
                  :key="dict.dictCode"
                  :label="dict.dictValue"
                  :value="dict.dictCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="0">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery"
                >搜索</el-button
              >
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="m-b-20 flex">
        <el-button type="primary" size="mini" @click="createEnterprice" :disabled="createBtn"
          >创建企业</el-button
        >
        <el-button type="warning" size="mini" @click="addEnterprice" :disabled="createBtn"
          >加入企业</el-button
        >
        <el-button type="primary " size="mini" @click="viewUser">企业用户管理</el-button>
        <el-button type="primary " size="mini" :disabled="single" @click="viewEnterprice"
          >查看企业</el-button
        >
        <!-- <el-button type="primary " size="mini" :disabled="btnDisable" @click="viewUkey"
          >企业ukey管理</el-button
        > -->
      </div>
      <div class="flex1 over-hidden">
        <el-table
          :data="tableData"
          v-loading="loading"
          height="100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="企业名称" prop="enterpriseName" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-button type="text" @click="continueFn(scope.row)">{{
                scope.row.enterpriseName
              }}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="统一社会信用代码"
            prop="enterpriseCertNo"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column label="法人姓名" prop="legalPersonName" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column label="法人身份证号" prop="maskIdNo" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column label="注册地址" prop="enterpriseAddress" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column label="通讯地址" prop="address" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column label="管理员" prop="adminName" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            label="企业认证状态"
            prop="enterpriseStatus"
            :show-overflow-tooltip="true"
            :formatter="formatStatus"
          >
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="voidConpany(scope.row)"
                :disabled="scope.row.enterpriseStatus == 1"
                >作废</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="m-t-20">
        <el-pagination
          class="text-center bgfff pd10 flex-shrink-0"
          layout="total, sizes, prev, pager, next, jumper"
          :current-page.sync="queryParams.pageNum"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="queryParams.pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <create
      v-if="showCreate"
      :seqNo="seqNo"
      @showIndex="showIndex"
      :status="status"
      :authStatus="authStatus"
    ></create>
    <add v-if="showAdd" @showIndex="showIndex"></add>
    <enterpriceDetails v-if="showDetails" :seqNo="seqNo" @showIndex="showIndex"></enterpriceDetails>
    <userManagement v-if="showUser" :seqNo="seqNo" @showIndex="showIndex"></userManagement>
    <ukeyInfo v-if="showUkey" :seqNo="seqNo" @showIndex="showIndex"></ukeyInfo>
  </div>
</template>
<script>
import Vue from 'vue'
import { enterpriseListApi, cancellationApi } from '@/api/enterprise-information-management/index'
import create from '../create.vue'
import add from '../add.vue'
import enterpriceDetails from '@/views/enterprise-user/enterprise-information/index_1.vue'
import userManagement from '@/views/enterprise-user/user-management/index.vue'
import ukeyInfo from '@/views/enterprise-user/ukey-information/index.vue'
import { getUid } from '@/utils/auth'
import { getAllDictApi } from '@/api/system/dict/data.js'
import { getDataDictApi } from '@/api/amount-management/index'
import router from '@/router/index'
export default {
  components: {
    create,
    add,
    enterpriceDetails,
    userManagement,
    ukeyInfo,
  },
  data() {
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        status: undefined,
        enterpriseNo: undefined,
      },
      single: true,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      tableData: [],
      showCreate: false, // 创建企业
      showAdd: false, // 加入企业
      showDetails: false, // 查看企业
      showUser: false, // 查看企业用户
      showUkey: false, // 查看ukey
      seqNo: '',
      selectData: [],
      status: 0, // 认证状态
      enterpriseStatus: '', // 总状态
      btnDisable: true, // 控制企业用户管理、企业ukey管理
      addBtn: false, // 控制加入企业
      createBtn: true, // 控制创建企业
      authStatus: '', // 授权状态
      auditList: [],
    }
  },
  created() {
    this.getDataDict()
  },
  computed: {
    uid() {
      return getUid()
    },
  },
  methods: {
    getList() {
      enterpriseListApi(this.queryParams).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.rows
          this.createBtn = this.tableData.length > 0
          this.total = res.data.total
          if (!this.$store.state.enterprise.enterpriseId) {
            for (let i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].enterpriseStatus == 1) {
                Vue.prototype.$staticData = {}
                getAllDictApi().then(res => {
                  Vue.prototype.$staticData = res.data || {}
                })
                this.$store.dispatch('GenerateRoutes').then(accessRoutes => {
                  // console.log(router)
                  router.addRoutes(accessRoutes)
                })
              }
              return
            }
          }
        }
      })
    },
    getDataDict() {
      getDataDictApi({ dictType: 'audit_final_status' }).then(res => {
        this.auditList = res.data
        this.getList()
      })
    },
    // 创建企业
    createEnterprice() {
      this.$store.commit('SET_LEGEL_PHONE', '')
      this.showCreate = true
    },
    // 点击企业名称
    continueFn(row) {
      this.seqNo = row.seqNo
      this.status = row.status
      this.authStatus = row.authStatus
      row.enterpriseStatus == 1 ? (this.showDetails = true) : (this.showCreate = true)
    },
    // 加入企业
    addEnterprice() {
      this.showAdd = true
    },
    // 查看企业用户
    viewUser() {
      this.$router.push({
        path: '/system/user',
      })
      // this.showUser = true
    },
    // 查看企业
    viewEnterprice() {
      this.showDetails = true
    },
    // 企业ukey管理
    viewUkey() {
      this.showUkey = true
    },
    // 显示首页
    showIndex() {
      this.authStatus = this.seqNo = this.enterpriseStatus = ''
      this.single = true
      this.showCreate = false
      this.showAdd = false
      this.showDetails = false
      this.showUser = false
      this.showUkey = false
      this.btnDisable = true
      this.addBtn = false
      this.getList()
    },
    // 作废
    voidConpany(row) {
      this.$confirm('该操作会清除当前记录所有信息, 确定作废?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          cancellationApi({
            enterpriseId: row.seqNo,
          }).then(res => {
            if (res.code == 200) {
              this.$message({
                type: 'success',
                message: '操作成功',
              })
              this.getList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          })
        })
    },
    formatStatus(row) {
      let arr = this.auditList.filter(v => {
        return v.dictCode == row.enterpriseStatus
      })
      return arr[0].dictValue
    },
    handleSelectionChange(select) {
      if (select.length == 1) {
        this.seqNo = select[0].seqNo
        this.status = select[0].status
        this.authStatus = select[0].authStatus
        this.enterpriseStatus = select[0].enterpriseStatus
        this.isAdmin = select[0].adminId == this.uid
        this.btnDisable = select[0].adminId != this.uid || this.enterpriseStatus == 0
      } else {
        this.btnDisable = true
        this.isAdmin = false
        this.status = 0
        this.enterpriseStatus = this.seqNo = ''
      }
      this.single = select.length != 1
      this.addBtn = select.length > 0
    },

    handleSizeChange(val) {
      this.queryParams.pageNum = 1
      this.queryParams.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getList()
    },
    handleQuery() {
      this.getList()
    },
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        status: undefined,
        enterpriseNo: undefined,
      }
      this.getList()
    },
  },
}
</script>
<style lang="scss" scoped>
.app-container {
  height: 100%;
}
.main {
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
