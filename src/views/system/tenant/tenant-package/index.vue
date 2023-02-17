<template>
  <div class="app-container flex1 flex-col over-hidden">
    <div class="flex1 flex-col over-hidden" v-if="!showModify">
      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        v-show="showSearch"
        label-width="130px"
      >
        <el-form-item label="套餐名" prop="packageName">
          <el-input
            v-model="queryParams.packageName"
            placeholder="请输入套餐名"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
            <el-option
              v-for="dict in $staticData.sys_normal_disable"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="创建时间">
          <el-date-picker
            :clearable="false"
            v-model="createTime"
            size="small"
            style="width: 240px"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="daterange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :default-time="['00:00:00', '23:59:59']"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            size="mini"
            @click="handleModify('add')"
            v-hasPermi="['system:tenant-package:add']"
            >新增</el-button
          >
        </el-col>

        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
      <div class="flex1 over-hidden">
        <el-table v-loading="loading" :data="dataList" border height="100%">
          <el-table-column label="套餐编号" align="center" prop="id" />
          <el-table-column label="套餐名" align="center" prop="packageName" />
          <el-table-column label="状态" align="center" prop="status" :formatter="statusFormatter">
            <template slot-scope="scope">
              <el-button :type="scope.row.status == '0' ? 'primary' : 'info'" plain>{{
                scope.row.status == '0' ? '正常' : '停用'
              }}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center" prop="remark" />
          <el-table-column label="创建时间" align="center" prop="createTime" />

          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="editFn(scope.row)"
                v-hasPermi="['system:tenant-package:edit']"
                >修改</el-button
              >

              <el-button
                type="text"
                @click="deleteFn(scope.row)"
                v-hasPermi="['system:tenant-package:remove']"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />

      <el-dialog
        :modal-append-to-body="false"
        :title="title"
        :visible.sync="open"
        width="500px"
        append-to-body
        @close="closeFn"
      >
        <el-form :model="form" ref="form" :rules="rules" label-width="80px">
          <el-form-item label="套餐名" prop="packageName">
            <el-input v-model="form.packageName" />
          </el-form-item>
          <el-form-item label="菜单权限">
            <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')"
              >展示/折叠</el-checkbox
            >
            <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')"
              >全选/全不选</el-checkbox
            >

            <el-tree
              class="tree-border"
              :data="menuOptions"
              show-checkbox
              ref="menu"
              node-key="id"
              :check-strictly="!!form.menuCheckStrictly"
              empty-text="加载中，请稍后"
              :props="defaultProps"
            ></el-tree>
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio
                v-for="item in statusOptions"
                :key="item.dictValue"
                :label="Number(item.dictValue)"
                >{{ item.dictLabel }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入备注"></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitDataScope">确定</el-button>
          <el-button @click="cancelDataScope">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  packageList,
  addPackage,
  editPackage,
  deletePackage,
  getpackageById,
} from '@/api/system/audit'
import tenantModify from '../../component/tenant-modify.vue'
import { dictFilter } from '@/utils/filters/common'
import { treeselect as menuTreeselect } from '@/api/system/menu'

export default {
  name: 'Post',
  components: {
    'tenant-modify': tenantModify,
  },
  filters: { dictFilter },
  data() {
    return {
      menuExpand: false,
      menuNodeAll: false,
      deptExpand: true,
      deptNodeAll: false,
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      // 菜单列表
      menuOptions: [],
      // 遮罩层
      loading: true,
      createTime: [],
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      dataList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        packageName: null,
        status: null,
      },
      showModify: false,
      type: '',
      auditRecords: [],
      form: {
        status: 0,
      },
      rules: {
        packageName: [
          {
            required: true,
            message: `请输入套餐名`,
            trigger: 'blur',
          },
        ],
        status: [
          {
            required: true,
            message: `请选择状态`,
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {
    this.getList()
    this.getDicts('sys_normal_disable').then(response => {
      this.statusOptions = response.data
    })
  },
  methods: {
    changeStatu() {},
    closeFn() {
      this.resetQuery()
    },
    /** 查询岗位列表 */
    getList() {
      this.loading = true
      packageList(this.queryParams).then(response => {
        this.dataList = response.rows
        this.total = response.total
        this.loading = false
      })
    },

    statusFormatter(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },

    // 取消按钮
    cancel() {
      this.open = false
      this.resetQuery()
    },

    /** 搜索按钮操作 */
    handleQuery() {
      if (this.createTime) {
        this.queryParams.startTime = this.createTime[0]
        this.queryParams.endTime = this.createTime[1]
      }
      this.queryParams.pageNum = 1
      this.getList()
    },

    /** 查询菜单树结构 */
    getMenuTreeselect() {
      menuTreeselect().then(response => {
        response.data.forEach(v => {
          if (v.label == '系统管理') {
            v.children = v.children.filter(val => {
              return (
                val.label != '租户管理' &&
                val.label != '字典管理' &&
                val.label != '参数设置' &&
                val.label != '菜单管理' &&
                val.label != '通知公告'
              )
            })
          }
        })
        this.menuOptions = response.data
      })
    },

    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value, type) {
      let treeList = this.menuOptions
      for (let i = 0; i < treeList.length; i++) {
        this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      if (type == 'menu') {
        this.$refs.menu.setCheckedNodes(value ? this.menuOptions : [])
      } else if (type == 'dept') {
        this.$refs.dept.setCheckedNodes(value ? this.deptOptions : [])
      }
    },

    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      let checkedKeys = this.$refs.menu.getCheckedKeys()
      // 半选中的菜单节点
      let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    },
    /** 提交按钮（数据权限） */
    submitDataScope: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form.menuIds = this.getMenuAllCheckedKeys() || []
          if (this.form.menuIds.length == 0) {
            this.msgWarning('请选择菜单权限')
            return
          }
          if (this.type == 'add') {
            addPackage(this.form).then(response => {
              this.msgSuccess('成功')
              this.open = false
              this.getList()
            })
          } else {
            const obj = Object.assign({}, this.form)
            editPackage(obj).then(res => {
              this.msgSuccess('成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    // 取消按钮（数据权限）
    cancelDataScope() {
      this.open = false
      this.resetQuery()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.createTime = []
      this.resetForm('queryForm')

      if (this.$refs.menu != undefined) {
        this.$refs.menu.setCheckedKeys([])
      }
      ;(this.menuExpand = false),
        (this.menuNodeAll = false),
        (this.deptExpand = true),
        (this.deptNodeAll = false),
        (this.form = {
          packageName: undefined,
          status: 0,
          menuIds: [],
          remark: undefined,
        })

      this.handleQuery()
    },

    /** 新增、修改、查看按钮操作 */
    handleModify(type) {
      this.getMenuTreeselect()
      this.type = type
      if (this.type == 'add') {
        this.title = '添加租户套餐'
        this.form = {
          packageName: undefined,
          status: 0,
          menuIds: [],
          remark: undefined,
        }
      } else {
        this.title = '修改租户套餐'
      }
      this.open = true
    },

    // 设置复选框选中态
    setCheckNodeSelected(row) {
      menuTreeselect()
        .then(response => {
          this.menuOptions = response.data
        })
        .then(() => {
          getpackageById(row.id).then(response => {
            this.form = response.data

            const menuIds = response.data.menuIds
            this.$nextTick(() => {
              menuIds.forEach(v => this.$refs.menu.setChecked(v, true, false))
            })
          })
        })
    },

    // 修改租户套餐
    editFn(row) {
      this.resetQuery()
      this.getMenuTreeselect()
      this.type = 'edit'
      this.title = '修改租户套餐'
      this.setCheckNodeSelected(row)
      this.open = true
    },

    // 删除租户套餐
    deleteFn(row) {
      this.$confirm('确定删除本套餐吗？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          deletePackage(row.id).then(res => {
            if (res.code == 200) {
              console.log(res)
              this.$message.success('操作成功')
              this.getList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    /**关闭新增 */
    closeModify() {
      this.showModify = false
      this.ids = []
      this.single = true
      this.type = ''
      this.getList()
    },
  },
}
</script>
<style scoped>
.triangle-topright {
  display: block;
  width: 0;
  height: 0;
  border-top: 20px solid red;
  border-left: 20px solid transparent;
  position: absolute;
  right: 0;
  top: 0;
}
</style>
