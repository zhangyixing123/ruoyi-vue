const tableMixin = {
  data() {
    return {
      pageSize: 10,
      pageNum: 1,
    };
  },
  methods: {
    // 搜索
    handleQuery() {
      this.pageNum = 1;
      this.pageSize = 10;
      this.getList();
    },
    // 重置搜索条件
    resetQuery(query) {
      this.$refs[query].resetFields();
      this.getList();
    },
    // pageSize 变化回调
    handleSizeChange(size) {
      this.pageSize = size;
      this.getList();
    },
    // pageNum 变化回调
    handleCurrentChange(current) {
      this.pageNum = current;
      this.getList();
    },
    // 更新选中表单内容
    handleSelectionChange(select) {
      this.selectedData = select;
    },
    //点击行触发，选中或不选中复选框
    handleRowClick(row, column, event) {
      this.$refs.multipleTable.toggleRowSelection(row);
    },
  },
};

export default tableMixin;
