<template>
  <div>
    <div class="info-content">
      <el-form
        :model="billInfoForm"
        ref="billInfoForm"
        inline
        label-width="180px"
        :rules="billInfoFormRules"
      >
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="企业全称" prop="enterpriseName">
              <el-input
                v-model.trim="billInfoForm.enterpriseName"
                :disabled="!editBillInfo"
                placeholder="请输入企业全称"
                style="width: 350px"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="纳税人识别号" prop="taxPayerCode">
              <el-input
                v-model.trim="billInfoForm.taxPayerCode"
                :disabled="!editBillInfo"
                placeholder="请输入纳税人识别号"
                style="width: 350px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="地址" prop="address">
              <el-input
                v-model.trim="billInfoForm.address"
                :disabled="!editBillInfo"
                placeholder="请输入税务备案地址"
                style="width: 350px"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话" prop="phone">
              <el-input
                v-model.trim="billInfoForm.phone"
                :disabled="!editBillInfo"
                placeholder="请输入税务备案电话"
                style="width: 350px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="开户银行" prop="bankName">
              <el-input
                v-model.trim="billInfoForm.bankName"
                :disabled="!editBillInfo"
                placeholder="请输入税务备案银行名称"
                style="width: 350px"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户银行账户" prop="bankCode">
              <el-input
                v-model.trim="billInfoForm.bankCode"
                :disabled="!editBillInfo"
                placeholder="请输入税务备案银行账户"
                style="width: 350px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="纳税人类型" prop="taxPayerType">
              <el-select
                :disabled="!editBillInfo"
                v-model.trim="billInfoForm.taxPayerType"
                placeholder="请选择纳税人类型"
                style="width: 350px"
              >
                <el-option
                  v-for="type in taxPayerTypeArr"
                  :key="type.dictValue"
                  :value="type.dictValue"
                  :label="type.dictLabel"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="tip-text">
          以下信息为开具增值税发票所用，需要与税务部门备案一致
        </div>
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="收件人姓名" prop="name">
              <el-input
                :disabled="!editBillInfo"
                v-model.trim="billInfoForm.name"
                style="width: 350px"
                placeholder="请输入收件人姓名"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="billPhone">
              <el-input
                :disabled="!editBillInfo"
                v-model.trim="billInfoForm.billPhone"
                style="width: 350px"
                placeholder="请输入手机号"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="收件人证件类型" prop="idType">
              <el-select
                :disabled="!editBillInfo"
                v-model.trim="billInfoForm.idType"
                style="width: 350px"
                placeholder="请选择收件人证件类型"
              >
                <el-option
                  v-for="type in idTypeArr"
                  :key="type.dictValue"
                  :value="type.dictValue"
                  :label="type.dictLabel"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收件人证件号码" prop="idNo">
              <el-input
                :disabled="!editBillInfo"
                v-model.trim="billInfoForm.idNo"
                style="width: 350px"
                placeholder="请输入收件人证件号码"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="通讯地址" prop="billAddress">
              <el-cascader
                :disabled="!editBillInfo"
                class="w200"
                v-model.trim="billInfoForm.billAddress"
                placeholder="请选择省/市/区"
                :options="cityList"
                :props="{ value: 'v', label: 'v', children: 'c' }"
                filterable
                clearable
              >
              </el-cascader>
              <el-input
                :disabled="!editBillInfo"
                v-model.trim="billInfoForm.addressDetail"
                style="width: 150px"
                placeholder="请输入详细地址"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电子发票邮箱" prop="email">
              <el-input
                :disabled="!editBillInfo"
                v-model.trim="billInfoForm.email"
                placeholder="请输入电子发票收取邮箱(不建议使用QQ邮箱)"
                style="width: 350px"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div v-if="!editBillInfo" class="edit-btn">
      <el-button type="primary" @click="editBillInfo = true">修改</el-button>
    </div>
    <div v-else class="edit-btn">
      <el-button type="primary" @click="confirmBillInfoChange">
        确认修改
      </el-button>
      <el-button type="primary" @click="editBillInfo = false">取消</el-button>
    </div>
  </div>
</template>

<script>
import { cityList } from '@/assets/js/city.js'
export default {
  props: {},
  data() {
    return {
      cityList,
      // 开票信息
      editBillInfo: false,
      taxPayerTypeArr: [
        { dictValue: '01', dictLabel: '企业纳税' },
        { dictValue: '02', dictLabel: '个人纳税' },
      ],
      idTypeArr: [
        { dictValue: '01', dictLabel: '身份证' },
        { dictValue: '02', dictLabel: '军官证' },
      ],
      billInfoForm: {
        enterpriseName: '一飞冲天有限责任公司',
        taxPayerCode: '1332334330',
        address: '第三省第二市第一县区',
        phone: '199****8808',
        bankName: '中国银行',
        bankCode: '6221925555555512345',
        taxPayerType: '01',
        name: '阮一飞',
        billPhone: '188****8899',
        idType: '01',
        idNo: '123456021112314x',
        billAddress: ['北京', '北京', '东城区'],
        addressDetail: '第二胡同口',
        email: '199x0x0@163.com',
      },
      billInfoConfig: [
        { label: '企业全称', prop: 'enterpriseName' },
        { label: '纳税人识别号', prop: 'taxPayerCode' },
        { label: '地址', prop: 'address' },
        { label: '电话', prop: 'phone' },
        { label: '开户银行', prop: 'bankName' },
        { label: '开户银行账号', prop: 'bankCode' },
        { label: '纳税人类型', prop: 'taxPayerType' },
      ],
      billInfoFormRules: {
        enterpriseName: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入企业全称',
          },
        ],
        taxPayerCode: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入纳税人识别号',
          },
        ],
        address: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入税务备案地址',
          },
        ],
        phone: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入税务备案电话',
          },
        ],
        bankName: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入税务备案银行名称',
          },
        ],
        bankCode: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入税务备案银行账户',
          },
        ],
        taxPayerType: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请选择纳税人类型',
          },
        ],
        name: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入收件人姓名',
          },
        ],
        billPhone: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入手机号',
          },
        ],
        idType: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请选择收件人证件类型',
          },
        ],
        idNo: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入收件人证件号码',
          },
        ],
        billAddress: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请完善通讯地址',
          },
        ],
        email: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入电子发票收取邮箱',
          },
        ],
      },
    }
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {
    confirmBillInfoChange() {
      this.$refs.billInfoForm.validate(val => {
        if (val) {
          this.$message.success('修改成功！')
          this.editBillInfo = false
        }
      })
    },
  },
  components: {},
}
</script>

<style scoped lang="scss">
.edit-btn {
  display: flex;
  justify-content: flex-end;
  padding: 20px;
}
.tip-text {
  color: #f00;
  margin-bottom: 20px;
}
</style>
