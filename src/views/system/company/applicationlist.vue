<template>
  <div class="app-container flex1 flex-col over-hidden">
    <div>
      <el-button
        type="primary"
        plain
        icon="el-icon-plus"
        v-hasPermi="['system:application:add']"
        size="mini"
        @click="handleAdd"
        >新增</el-button
      >
    </div>
    <div class="flex1 over-hidden">
      <el-table height="100%" v-loading="loading" :data="dataList">
        <el-table-column label="应用名称" align="center" prop="applicationName" />
        <el-table-column label="AppID" align="center" prop="appId" />
        <el-table-column label="API Key" align="center" prop="apiKey" />
        <el-table-column label="Secret Key" align="center" prop="secretKey">
          <template slot-scope="scope">
            <span v-if="!rowHideList[scope.row.seqNo]">{{ scope.row.secretKey }}</span>
            <span v-else>**************</span>
            <el-button size="mini" type="text" @click="hideFn(scope.row)">{{
              rowHideList[scope.row.seqNo] ? '显示' : '隐藏'
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" />

        <el-table-column
          label='操作'
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              v-hasPermi="['system:application:delete']"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination
      class="text-center bgfff pd10 flex-shrink-0"
      layout="total, sizes, prev, pager, next, jumper"
      :current-page.sync="queryParams.pageNum"
      :page-sizes="[10, 20, 30, 50]"
      :page-size.sync="queryParams.pageSize"
      @size-change="getList"
      @current-change="getList"
      :total="total"
    >
    </el-pagination>

    <el-dialog title="创建新应用" :visible.sync="dialogShow" @close="closeFn">
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="应用名称" label-width="100" prop="applicationName">
          <el-input v-model="form.applicationName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="应用描述" label-width="100" prop="applicationDescribe">
          <el-input
            type="textarea"
            v-model="form.applicationDescribe"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitFn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { applicationList, delDept, addApplication } from '@/api/system/audit'
export default {
  name: 'Config',
  data() {
    return {
      // 遮罩层
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      dataList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        isTenant: 1,
      },
      // 表单参数
      form: {},
      rowHideList: {}, //控制显隐
      dialogShow: false,
      rules: {
        applicationName: [
          {
            required: true,
            message: `请输入应用名称`,
            trigger: 'blur',
          },
        ],
        applicationDescribe: [
          {
            required: true,
            message: `请输入应用描述`,
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = false
      applicationList(this.queryParams).then((response) => {
        this.total = response.total
        this.dataList = response.rows
        this.loading = false
      })
    },

    handleAdd() {
      this.dialogShow = true
    },

    closeFn() {
      this.form = {}
    },
    // 取消按钮
    cancel() {
      this.dialogShow = false
      this.closeFn()
    },
    submitFn() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          addApplication(this.form)
            .then((res) => {
              if (res.code == 200) {
                this.msgSuccess(res.msg)
                this.getList()
              }
              this.dialogShow = false
            })
            .catch((err) => {
              this.dialogShow = false
            })
        }
      })
    },

    // 控制列表显隐
    hideFn(row) {
      if (!this.rowHideList[row.seqNo]) {
        this.rowHideList[row.seqNo] === undefined
          ? this.$set(this.rowHideList, row.seqNo, true)
          : (this.rowHideList[row.seqNo] = true)
      } else {
        this.rowHideList[row.seqNo] = false
      }
    },
    // 删除
    handleDelete(row) {
      this.$confirm(`确认要删除应用${row.applicationName}吗？`, `提示`, {
        confirmButtonText: `确定`,
        cancelButtonText: `取消`,
        type: 'warning',
      })
        .then(function () {
          return delDept({ seqNo: row.seqNo })
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
    },
  },
}
</script>
