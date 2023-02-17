<template>
  <!-- 此次demo有差异，如果需要实现一页全部显示，内部滚动，需要增加 w100 h100 over-hidden 样式 -->
  <!-- 如果不加，可以做一屏滚动显示 -->
	<div class="page-name app-container">
		<!-- 如果设置page-name,必须和其他页面不一样,flex-col 使页面为flex布局 flex1获取父级剩余高度，全部占满 -->
		<!-- 顶部搜索框 flex-shrink-0 是为了防止dom被挤压-->
		<!-- el-form 不建议用inline属性，如需一排显示，使用el-row+el-span -->
		<el-form class="flex-shrink-0">
			<!-- 这里放搜索模块内容 -->
			<span>这里放搜索模块内容</span>
		</el-form>
		<!-- 中间有其他按钮或者展示区，也可以加 -->
		<div class="flex-shrink-0">

		</div>
		<!-- 剩余空间通过 flex1 全部分给表格，over-hidden 必须使用 -->
		<div class="flex1 over-hidden">
			<!-- el-table 配置 height 属性 100%，起到自动撑开，且表格标题固定的效果； -->
			<el-table
        height="100%"
        v-loading="loading"
        :data="tableData">
        <el-table-column label="字典编号" align="center" prop="dictId" />
        <el-table-column label="字典名称" align="center" prop="dictName" :show-overflow-tooltip="true" />
				<el-table-column label="字典编号" align="center" prop="dictId" />
				<el-table-column label="字典编号" align="center" prop="dictId" />
				<el-table-column label="字典编号" align="center" prop="dictId" />
      </el-table>
		</div>
		<!-- 分页必须加 flex-shrink-0 样式不一定用我的，好看就行 -->
		<!-- size-change 和 current-change 统一用一个时间处理就行了，无非是再去获取列表数据 -->
		<el-pagination
      class="text-center bgfff pd10 flex-shrink-0"
      layout="total, sizes, prev, pager, next, jumper"
      :current-page.sync="pageNum"
      :page-sizes="[10, 20, 30, 50]"
      :page-size.sync="pageSize"
			@size-change="handleSizeOrCurrentChange"
			@current-change="handleSizeOrCurrentChange"
      :total="total">
    </el-pagination>
	</div>
</template>

<script>
export default {
	// name 属性，如果需要使用 keep-alive 缓存页面，name必须配置
  name: "dataList",
	// 这里不说了 data(){return {}}模式；
  data() {
    return {
			loading: false,
      tableData: [],
      total: 1000,
      pageSize: 10,
      pageNum: 1,
    }
  },
  mounted: function () {
    this.addUser();
  },
  methods: {
    addUser(){
      
    },
    handleSizeOrCurrentChange(){
		}
  }
};
</script>

<style lang="scss" scoped>
/* style 建议使用, scoped 可以用可不用，如果不用 scoped，第一级必须是 本页面的独有的page-name */
/* 必须按规范，不然会对别人的页面造成样式干扰 */
.page-name {
  padding: 10px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
