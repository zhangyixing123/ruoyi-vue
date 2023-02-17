<template>
  <div class="app-container flex1 flex-col over-hidden">
    <el-table
      :data="tableData"
      :header-cell-style="{ background: '#eee', color: '#333' }"
      v-loading="loading"
      ref="multipleTable"
      border
    >
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
          <span :style="{ color: filterColor(scope.row.status) }">
            {{ scope.row.status | dictFilter(statusArr) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="任务时间"
        prop="taskTime"
        align="center"
      ></el-table-column>
      <el-table-column
        label="处理时间"
        prop="dealTime"
        align="center"
      ></el-table-column>
      <el-table-column
        label="备注"
        prop="remark"
        align="center"
      ></el-table-column>
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
        { dictValue: "2", dictLabel: "已处理" },
        { dictValue: "3", dictLabel: "处理失败" },
        { dictValue: "4", dictLabel: "未处理" },
      ],
    };
  },
  computed: {},
  created() {
    this.getList();
  },
  methods: {
    getList() {
      import("@/mocks/zjl/doneTask.json").then((res) => {
        const {
          data: { rows, total },
        } = res;
        this.tableData = rows;
      });
    },
    filterColor(status) {
      const colorArr = [
        { color: "#F97307", statusList: ["4"] },
        { color: "#FA0E0E", statusList: ["3"] },
        { color: "#53EE42", statusList: ["2"] },
      ];
      return (
        colorArr.find((item) => item.statusList.includes(status))?.color ||
        "#ccc"
      );
    },
  },
};
</script>

<style scoped lang="scss"></style>
