<template>
  <div class="financing-info">
    <el-row>
      <p class="menu-title">融资信息</p>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-col :span="6" class="text-right">融资编号：</el-col>
        <el-col :span="18">{{ financeDetails.financeNo }}</el-col>
      </el-col>
      <el-col :span="8">
        <el-col :span="6" class="text-right">账单总额：</el-col>
        <el-col :span="18">{{ '￥' + financeDetails.billsAmount }}</el-col>
      </el-col>
      <el-col :span="8">
        <el-col :span="6" class="text-right">审批金额：</el-col>
        <el-col :span="18" style="color:red" v-if="financeDetails.financeAmount">{{
          '￥' + financeDetails.financeAmount
        }}</el-col>
        <el-col :span="18" style="color:red" v-else></el-col>
      </el-col>
    </el-row>
    <!-- 放款申请 -->
    <template v-if="step === 2">
      <el-row>
        <el-col :span="8">
          <el-col :span="6" class="text-right">申请时间：</el-col>
          <el-col :span="18">{{ financeDetails.applyTime }}</el-col>
        </el-col>
        <el-col :span="8">
          <el-col :span="6" class="text-right">申请人：</el-col>
          <el-col :span="18">{{ financeDetails.applyUser }}</el-col>
        </el-col>
        <el-col :span="8">
          <el-col :span="6" class="text-right">审批时间：</el-col>
          <el-col :span="18">{{ financeDetails.creditTime }}</el-col>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-col :span="6" class="text-right">审批机构：</el-col>
          <el-col :span="18">{{ financeDetails.loanMerName }}</el-col>
        </el-col>
      </el-row>
    </template>
    <!-- 融资审批 -->
    <template v-if="[3, 4].includes(step)">
      <el-row>
        <el-col :span="8">
          <el-col :span="6" class="text-right">融资主体：</el-col>
          <el-col :span="18">{{ financeDetails.companyName }}</el-col>
        </el-col>
        <el-col :span="8">
          <el-col :span="6" class="text-right">申请时间：</el-col>
          <el-col :span="18">{{ financeDetails.applyTime }}</el-col>
        </el-col>
        <el-col :span="8">
          <el-col :span="6" class="text-right">审批时间：</el-col>
          <el-col :span="18">{{ financeDetails.creditTime }}</el-col>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-col :span="6" class="text-right">融资期限：</el-col>
          <el-col :span="18" v-if="financeDetails.applyTnr">{{
            financeDetails.applyTnr + '天'
          }}</el-col>
        </el-col>
        <el-col :span="8">
          <el-col :span="6" class="text-right">年化利率：</el-col>
          <el-col :span="18" v-if="financeDetails.exeIntRat">{{
            financeDetails.exeIntRat * 100 + '%'
          }}</el-col>
        </el-col>

        <el-col :span="8">
          <el-col :span="6" class="text-right">手续费率：</el-col>
          <el-col :span="18" v-if="financeDetails.feeRatio">{{
            financeDetails.feeRatio * 100 + '%'
          }}</el-col>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-col :span="6" class="text-right">还款方式：</el-col>
          <el-col :span="18">{{ financeDetails.mtdCde }}</el-col>
        </el-col>
        <el-col :span="8" v-if="financeDetails.mtdCde != '利随本清'">
          <el-col :span="6" class="text-right">还款日：</el-col>
          <el-col :span="18">{{ financeDetails.dueDay }}</el-col>
        </el-col>

        <el-col :span="8">
          <el-col :span="6" class="text-right">放款机构：</el-col>
          <el-col :span="18">{{ financeDetails.loanCompanyName }}</el-col>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-col :span="6" class="text-right">放款时间：</el-col>
          <el-col :span="18">{{ financeDetails.dnTime }}</el-col>
        </el-col>
      </el-row>
    </template>
  </div>
</template>

<script>
// FIXME:引入顺序，先引入npm包，再是绝对路径，最后是相对路径
export default {
  name: 'financing-info',
  components: {},
  mixins: [],
  props: ['step', 'financeDetails'],
  data() {
    return {
      data: {},
    }
  },
  computed: {},
  watch: {},
  filters: {},
  created() {},
  mounted() {},
  destroyed() {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.text-right {
  text-align: right;
}
::v-deep .el-row + .el-row {
  margin-top: 20px;
}

::v-deep .el-col {
  line-height: 24px;
}

::v-deep .el-col > .el-col + .el-col {
  color: #789;
}
</style>
