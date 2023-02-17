<template>
  <div class="app-container flex1 flex-col over-hidden">
    <!-- 搜索重置 -->
    <el-form class="flex-shrink-0" :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="用户名称" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phonenumber">
        <el-input
          v-model="queryParams.phonenumber"
          placeholder="请输入手机号"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery"
          >查询</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 添加、批量取消、关闭按钮 -->
    <el-row :gutter="10" class="mb8 flex-shrink-0">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:user:batchGrant']"
          >添加用户</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-circle-close"
          size="mini"
          :disabled="multiple"
          @click="handleCacelListAllowed"
          v-hasPermi="['system:user:batchRevoke']"
          >批量取消授权</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-close" size="mini" @click="handleClose"
          >关闭</el-button
        >
      </el-col>
    </el-row>

    <!-- 表格数据 -->
    <div class="flex1 over-hidden">
      <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column
          label="用户名称"
          align="center"
          key="userName"
          prop="userName"
          v-if="columns[1].visible"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="用户昵称"
          align="center"
          key="nickName"
          prop="nickName"
          v-if="columns[2].visible"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="部门"
          align="center"
          key="deptName"
          prop="dept.deptName"
          v-if="columns[3].visible"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="手机号"
          align="center"
          key="phonenumber"
          prop="phonenumber"
          v-if="columns[4].visible"
          width="120"
        />
        <el-table-column label="状态" align="center" key="status" v-if="columns[5].visible">
          <template slot-scope="scope">
            <span>{{ getStatusTxt(scope.row.status) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          v-if="columns[6].visible"
          width="160"
        >
          <!-- <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template> -->
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="160"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-circle-close"
              @click="handleCacelAllowed(scope.row)"
              v-hasPermi="['system:user:revoke']"
              >取消授权</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination
      class="text-center bgfff pd10 top-border flex-shrink-0"
      layout="total, sizes, prev, pager, next, jumper"
      :current-page.sync="queryParams.pageNum"
      :page-sizes="[10, 20, 30, 50]"
      :page-size.sync="queryParams.pageSize"
      @size-change="getList"
      @current-change="getList"
      :total="total"
    >
    </el-pagination>

    <!-- 选择用户弹框 -->
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog
      :modal-append-to-body="false"
      :title="title"
      :visible.sync="open"
      width="1200px"
      append-to-body
    >
      <el-row :gutter="20" class="flex1 flex over-hidden">
        <!--弹窗部门数据-->
        <el-col :span="4" :xs="24" class="flex-col over-hidden">
          <div class="head-container flex-shrink-0">
            <el-input
              v-model="deptName"
              placeholder="请输入部门名称"
              clearable
              size="small"
              prefix-icon="el-icon-search"
              style="margin-bottom: 20px"
            />
          </div>
          <div class="head-container flex1 over-hidden y-scroll">
            <el-tree
              :data="deptOptions"
              :props="defaultProps"
              :expand-on-click-node="false"
              :filter-node-method="dialogDeptFilterNode"
              ref="tree"
              default-expand-all
              @node-click="dialogDeptHandleNodeClick"
            />
          </div>
        </el-col>

        <el-col :span="20" :xs="24" class="flex-col over-hidden">
          <!-- 弹框搜索重置 -->
          <el-form
            class="flex-shrink-0"
            :model="dialogUserListQueryParams"
            ref="dialogUserListQueryForm"
            :inline="true"
          >
            <el-form-item label="用户名称" prop="userName">
              <el-input
                v-model="dialogUserListQueryParams.userName"
                placeholder="请输入用户名称"
                clearable
                size="small"
                style="width: 240px"
                @keyup.enter.native="dialogUserListHandleQuery"
              />
            </el-form-item>
            <el-form-item label="手机号" prop="phonenumber">
              <el-input
                v-model="dialogUserListQueryParams.phonenumber"
                placeholder="请输入手机号"
                clearable
                size="small"
                style="width: 240px"
                @keyup.enter.native="dialogUserListHandleQuery"
              />
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                size="mini"
                @click="dialogUserListHandleQuery"
                >查询</el-button
              >
              <el-button icon="el-icon-refresh" size="mini" @click="dialogUserListResetQuery"
                >重置</el-button
              >
            </el-form-item>
          </el-form>

          <!-- 表格数据 -->
          <div>
            <el-table
              v-loading="loading"
              :data="dialogUserList"
              @selection-change="dialogSelectionChange"
            >
              <el-table-column type="selection" width="50" align="center" />
              <el-table-column label="用户编号" align="center" key="userId" prop="userId" />
              <el-table-column
                label="用户名称"
                align="center"
                key="userName"
                prop="userName"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                label="用户昵称"
                align="center"
                key="nickName"
                prop="nickName"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                label="部门"
                align="center"
                key="deptName"
                prop="dept.deptName"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                label="手机号"
                align="center"
                key="phonenumber"
                prop="phonenumber"
                width="120"
              />
              <el-table-column label="状态" align="center" key="status">
                <template slot-scope="scope">
                  <span>{{ getStatusTxt(scope.row.status) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="创建时间" align="center" prop="createTime" width="160">
              </el-table-column>
            </el-table>
          </div>

          <el-pagination
            class="text-center bgfff pd10 top-border flex-shrink-0"
            layout="total, sizes, prev, pager, next, jumper"
            :current-page.sync="dialogUserListQueryParams.pageNum"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="dialogUserListQueryParams.pageSize"
            @size-change="getDialogUserList"
            @current-change="getDialogUserList"
            :total="dialogUserListTotal"
          >
          </el-pagination>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogConfirm">保存</el-button>
        <el-button @click="dialogCancel">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listUser, cancelRoleAllowed, listCancelRoleAllowed, roleAllowed } from '@/api/system/user'
import { treeselect } from '@/api/system/dept'

export default {
  props: {
    roleUserAssignID: {
      type: String,
      default: '',
    },
    roleUserAssignClose: {
      type: Function,
    },
  },

  data() {
    return {
      // 遮罩层
      loading: true,
      // 列信息
      columns: [
        { key: 0, label: `用户编号`, visible: true },
        { key: 1, label: `用户名称`, visible: true },
        { key: 2, label: `用户昵称`, visible: true },
        { key: 3, label: `部门`, visible: true },
        { key: 4, label: `手机号码`, visible: true },
        { key: 5, label: `状态`, visible: true },
        { key: 6, label: `创建时间`, visible: true },
      ],

      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
      },

      // 用户表格数据
      userList: null,
      // 总条数
      total: 0,

      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: '选择用户',
      // 部门名称
      deptName: undefined,
      // 部门树选项
      deptOptions: undefined,
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      // 弹框用户查询参数
      dialogUserListQueryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
      },
      // 用户表格数据
      dialogUserList: null,
      // 总条数
      dialogUserListTotal: 0,

      // 选中数组
      dialogSelectIds: [],
      // 非单个禁用
      dialogSelectSingle: true,
      // 非多个禁用
      dialogSelectMultiple: true,
    }
  },

  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val)
    },
  },

  created() {
    this.getList()
  },

  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true

      this.queryParams.hasRoleId = this.roleUserAssignID

      listUser(this.queryParams).then(response => {
        this.userList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    getStatusTxt(status) {
      if ('0' === status) {
        return '正常'
      } else {
        return '停用'
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.resetDialogUserListQueryForm()
      this.getDialogDeptTreeselect()
      this.getDialogUserList()

      this.dialogSelectIds = []
      this.dialogSelectSingle = true
      this.dialogSelectMultiple = true

      this.open = true
    },

    /** 取消批量授权按钮操作 */
    handleCacelListAllowed() {
      let param = {
        userIds: this.ids,
        roleId: this.roleUserAssignID,
      }
      listCancelRoleAllowed(param)
        .then(response => {
          if (response.code === 200) {
            //取消授权后，重新拉取数据
            this.getList()
          }
        })
        .catch(error => {})
    },
    /** 关闭按钮操作 */
    handleClose() {
      this.$emit('roleUserAssignClose')
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },

    /** 取消授权操作 */
    handleCacelAllowed(row) {
      let param = new FormData()
      param.append('userId', row.userId)
      param.append('roleId', this.roleUserAssignID)

      cancelRoleAllowed(param)
        .then(response => {
          if (response.code === 200) {
            //取消授权后，重新拉取数据
            this.getList()
          }
        })
        .catch(error => {})
    },

    // 表单重置
    resetDialogUserListQueryForm() {
      this.dialogUserListQueryParams = {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
        deptId: undefined,
      }
      this.resetForm('dialogUserListQueryForm')
    },

    /** 查询部门下拉树结构 */
    getDialogDeptTreeselect() {
      treeselect().then(response => {
        this.deptOptions = response.data
      })
    },
    // 筛选节点
    dialogDeptFilterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 弹窗部门节点单击事件
    dialogDeptHandleNodeClick(data) {
      this.dialogUserListQueryParams.deptId = data.id
      this.getDialogUserList()
    },

    /** 查询用户列表 */
    getDialogUserList() {
      this.loading = true

      this.dialogUserListQueryParams.notRoleId = this.roleUserAssignID
      listUser(this.dialogUserListQueryParams).then(response => {
        this.dialogUserList = response.rows
        this.dialogUserListTotal = response.total
        this.loading = false
      })
    },

    /** 搜索按钮操作 */
    dialogUserListHandleQuery() {
      this.dialogUserListQueryParams.page = 1
      this.getDialogUserList()
    },
    /** 重置按钮操作 */
    dialogUserListResetQuery() {
      this.resetForm('dialogUserListQueryForm')
      this.dialogUserListHandleQuery()
    },

    dialogSelectionChange(selection) {
      this.dialogSelectIds = selection.map(item => item.userId)
      this.dialogSelectSingle = selection.length != 1
      this.dialogSelectMultiple = !selection.length
    },

    dialogConfirm() {
      if (this.dialogSelectMultiple) {
        this.msgSuccess('请选择用户')
        return
      }

      let param = {
        userIds: this.dialogSelectIds,
        roleId: this.roleUserAssignID,
      }
      roleAllowed(param)
        .then(response => {
          if (response.code === 200) {
            this.open = false
            //批量授权后，重新拉取数据
            this.getList()
          }
        })
        .catch(error => {})
    },
    dialogCancel() {
      this.open = false
    },
  },
}
</script>

<style></style>
