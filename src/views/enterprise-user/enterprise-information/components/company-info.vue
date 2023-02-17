<template>
  <div>
    <el-form :model="companyInfoForm" ref="companyInfoForm" inline label-width="180px">
      <el-row :gutter="50">
        <el-col :span="12">
          <el-form-item label="注册资本">
            <el-input
              v-model.trim="companyInfoForm.registerAmount"
              style="width: 350px"
              placeholder="请输入注册资本"
              :disabled="!editCompanyInfo"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经营范围">
            <el-input
              v-model.trim="companyInfoForm.businessScope"
              style="width: 350px"
              placeholder="请输入经营范围"
              :disabled="!editCompanyInfo"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="50">
        <el-col :span="12">
          <el-form-item label="成立日期">
            <el-date-picker
              :clearable="false"
              v-model.trim="companyInfoForm.setUpDate"
              :disabled="!editCompanyInfo"
              type="date"
              placeholder="选择日期"
              style="width: 350px"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经营期限">
            <el-input
              v-model.trim="companyInfoForm.businessDeadline"
              style="width: 350px"
              placeholder="请输入经营期限"
              :disabled="!editCompanyInfo"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="50">
        <el-col :span="12">
          <el-form-item label="登记机关">
            <el-input
              v-model.trim="companyInfoForm.registerAuth"
              style="width: 350px"
              placeholder="请输入登记机关"
              :disabled="!editCompanyInfo"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="营业收入">
            <el-input
              v-model.trim="companyInfoForm.taking"
              style="width: 350px"
              placeholder="请输入营业收入"
              :disabled="!editCompanyInfo"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="50">
        <el-col :span="12">
          <el-form-item label="工商登记日">
            <el-date-picker
              :clearable="false"
              v-model.trim="companyInfoForm.signInDate"
              :disabled="!editCompanyInfo"
              type="date"
              placeholder="选择日期"
              style="width: 350px"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="资产总额">
            <el-input
              v-model.trim="companyInfoForm.amountTotal"
              style="width: 350px"
              placeholder="请输入资产总额"
              :disabled="!editCompanyInfo"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="50">
        <el-col :span="12">
          <el-form-item label="集团公司组织机构代码">
            <el-input
              v-model.trim="companyInfoForm.code"
              style="width: 350px"
              placeholder="请输入集团公司组织机构代码"
              :disabled="!editCompanyInfo"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上级公司组织机构代码">
            <el-input
              v-model.trim="companyInfoForm.supCode"
              style="width: 350px"
              placeholder="请输入上级公司组织机构代码"
              :disabled="!editCompanyInfo"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="50">
        <el-col :span="12">
          <el-form-item label="法定代表人手机号">
            <el-input
              v-model.trim="companyInfoForm.responsePhone"
              style="width: 350px"
              placeholder="请输入法定代表人手机号"
              :disabled="!editCompanyInfo"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="员工人数">
            <el-input
              v-model.trim="companyInfoForm.staffNumber"
              style="width: 350px"
              placeholder="请输入员工人数"
              :disabled="!editCompanyInfo"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div v-if="!editCompanyInfo" class="edit-btn">
      <el-button type="primary" @click="editCompanyInfo = true">修改</el-button>
    </div>
    <div v-else class="edit-btn">
      <el-button type="primary" @click="confirmCompanyInfoChange">
        确认修改
      </el-button>
      <el-button type="primary" @click="editCompanyInfo = false">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      companyInfoForm: {
        registerAmount: '5000',
        businessScope: '企业咨询服务 信息咨询服务',
        setUpDate: '1997-10-10',
        businessDeadline: '2年',
        registerAuth: '横琴粤澳深度合作区事务服务局',
        taking: '50,000',
        signInDate: '2002-10-10',
        amountTotal: '100,000',
        code: '59910',
        supCode: '59912',
        responsePhone: '133****4862',
        staffNumber: '50',
      },
      editCompanyInfo: false,
    }
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {
    confirmCompanyInfoChange() {
      this.editCompanyInfo = false
    },
  },
}
</script>

<style scoped lang="scss">
.edit-btn {
  display: flex;
  justify-content: flex-end;
  padding: 20px;
}
</style>
