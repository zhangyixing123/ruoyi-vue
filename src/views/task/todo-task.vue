<template>
  <div class="app-container flex1 flex-col over-hidden">
    <!-- :header-cell-style="{ background: '#eee', color: '#333' }" -->
    <el-table :data="tableData" v-loading="loading" ref="multipleTable" border>
      <el-table-column
        label="业务类型"
        prop="businessType"
        align="center"
      ></el-table-column>
      <el-table-column
        label="任务描述"
        prop="taskDesc"
        align="center"
      ></el-table-column>
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          <span> {{ scope.row.status | dictFilter(statusArr) }} </span>
        </template>
      </el-table-column>
      <el-table-column
        label="任务时间"
        prop="taskTime"
        align="center"
      ></el-table-column>
      <el-table-column
        label="备注"
        prop="remark"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            plain
            type="primary"
            size="small"
            @click="handleBusiness(scope.row)"
            >去处理</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { dictFilter } from "@/utils/filters/common";

export default {
  filters: { dictFilter },
  props: {},
  data() {
    return {
      tableData: [],
      loading: false,
      statusArr: [
        { dictValue: "0", dictLabel: "未处理" },
        { dictValue: "1", dictLabel: "处理中" }
      ]
    };
  },
  computed: {},
  created() {
    this.getList();
  },
  methods: {
    getList() {
      import("@/mocks/zjl/todoTask.json").then(res => {
        const {
          data: { rows, total }
        } = res;
        this.tableData = rows;
      });
    },
    handleBusiness({ businessType }) {
      this.$message.warning(`去处理${businessType}`);
    }
  }
};
</script>

<style scoped lang="scss"></style>
