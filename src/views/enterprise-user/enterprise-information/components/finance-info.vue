<template>
  <div>
    <el-form
      :model="financeForm"
      ref="financeForm"
      :rules="financeFormRules"
      inline
      label-width="180px"
    >
      <el-row :gutter="50">
        <el-col :span="12">
          <el-form-item label="企业类型" prop="enterpriseType">
            <el-select
              v-model.trim="financeForm.enterpriseType"
              :disabled="!editFinanceInfo"
              placeholder="请选择企业类型"
              style="width: 350px"
            >
              <el-option
                v-for="(item, index) in enterpriseTypeArr"
                :key="index"
                :value="item.dictValue"
                :label="item.dictLabel"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="企业规模" prop="enterpriseSize">
            <el-select
              v-model.trim="financeForm.enterpriseSize"
              :disabled="!editFinanceInfo"
              placeholder="请选择企业规模"
              style="width: 350px"
            >
              <el-option
                v-for="(item, index) in enterpriseSizeArr"
                :key="index"
                :value="item.dictValue"
                :label="item.dictLabel"
              ></el-option
            ></el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="50">
        <el-col :span="12">
          <el-form-item label="机构信用代码" prop="authCode">
            <el-input
              v-model.trim="financeForm.authCode"
              :disabled="!editFinanceInfo"
              placeholder="请输入机构信用代码"
              style="width: 350px"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="行业门类" prop="industryType">
            <el-select
              v-model.trim="financeForm.industryType"
              :disabled="!editFinanceInfo"
              placeholder="请选择行业门类"
              style="width: 350px"
            >
              <el-option
                v-for="(item, index) in industryTypeArr"
                :key="index"
                :value="item.dictValue"
                :label="item.dictLabel"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="50">
        <el-col :span="12">
          <el-form-item label="机构信用代码有效期" prop="authCodeValidity">
            <el-date-picker
              :clearable="false"
              :disabled="!editFinanceInfo"
              v-model.trim="financeForm.authCodeValidity"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 350px"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="行业小类" prop="industry">
            <el-input
              v-model.trim="financeForm.industry"
              :disabled="!editFinanceInfo"
              placeholder="请输入行业小类"
              style="width: 350px"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="50">
        <el-col :span="12">
          <el-form-item label="机构信用代码正面" prop="authCodeFront">
            <div class="upload-div">
              <el-upload
                ref="authCodeFront"
                :disabled="!editFinanceInfo"
                class="upload-btn"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="
                  (res, file, fileList) => {
                    handleSuccess('authCodeFront', res, file, fileList)
                  }
                "
                :on-remove="
                  (file, fileList) => {
                    handleRemove('authCodeFront', file, fileList)
                  }
                "
                :file-list="uploadFiles.authCodeFront"
              >
                <el-button type="primary" size="medium" :disabled="!editFinanceInfo">
                  点击上传
                </el-button>
              </el-upload>
              <el-button plain size="small" @click="handlePreview('authCodeFront')">
                查看
              </el-button>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="机构信用代码反面" prop="authCodeBack">
            <div class="upload-div">
              <el-upload
                :disabled="!editFinanceInfo"
                class="upload-btn"
                :action="uploadUrl"
                ref="authCodeBack"
                :file-list="uploadFiles.authCodeBack"
                :show-file-list="false"
                :on-success="
                  (res, file, fileList) => {
                    handleSuccess('authCodeBack', res, file, fileList)
                  }
                "
                :on-remove="
                  (file, fileList) => {
                    handleRemove('authCodeBack', file, fileList)
                  }
                "
              >
                <el-button type="primary" size="medium" :disabled="!editFinanceInfo">
                  点击上传
                </el-button>
              </el-upload>
              <el-button plain size="small" @click="handlePreview('authCodeBack')">
                查看
              </el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="50">
        <el-col :span="12">
          <el-form-item label="开户许可证正面" prop="licenceFront">
            <div class="upload-div">
              <el-upload
                :disabled="!editFinanceInfo"
                class="upload-btn"
                :action="uploadUrl"
                ref="licenceFront"
                :file-list="uploadFiles.licenceFront"
                :show-file-list="false"
                :on-success="
                  (res, file, fileList) => {
                    handleSuccess('licenceFront', res, file, fileList)
                  }
                "
                :on-remove="
                  (file, fileList) => {
                    handleRemove('licenceFront', file, fileList)
                  }
                "
              >
                <el-button type="primary" size="medium" :disabled="!editFinanceInfo">
                  点击上传
                </el-button>
              </el-upload>
              <el-button plain size="small" @click="handlePreview('licenceFront')">
                查看
              </el-button>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开户许可证" prop="licence">
            <div class="upload-div">
              <el-upload
                :disabled="!editFinanceInfo"
                class="upload-btn"
                ref="licence"
                :action="uploadUrl"
                :file-list="uploadFiles.licence"
                :show-file-list="false"
                :on-success="
                  (res, file, fileList) => {
                    handleSuccess('licence', res, file, fileList)
                  }
                "
                :on-remove="
                  (file, fileList) => {
                    handleRemove('licence', file, fileList)
                  }
                "
              >
                <el-button type="primary" size="medium" :disabled="!editFinanceInfo">
                  点击上传
                </el-button>
              </el-upload>
              <el-button plain size="small" @click="handlePreview('licence')">
                查看
              </el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="50">
        <el-col :span="12">
          <el-form-item label="公司章程" prop="companyRule">
            <div class="upload-div">
              <el-upload
                :disabled="!editFinanceInfo"
                class="upload-btn"
                :action="uploadUrl"
                ref="companyRule"
                :file-list="uploadFiles.companyRule"
                :show-file-list="false"
                :on-success="
                  (res, file, fileList) => {
                    handleSuccess('companyRule', res, file, fileList)
                  }
                "
                :on-remove="
                  (file, fileList) => {
                    handleRemove('companyRule', file, fileList)
                  }
                "
              >
                <el-button type="primary" size="medium" :disabled="!editFinanceInfo">
                  点击上传
                </el-button>
              </el-upload>
              <el-button plain size="small" @click="handlePreview('companyRule')">
                查看
              </el-button>
            </div>
            <div class="tips">需加盖公章</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="近一年财务报表" prop="financial">
            <div class="upload-div">
              <el-upload
                :disabled="!editFinanceInfo"
                class="upload-btn"
                ref="financial"
                :action="uploadUrl"
                :file-list="uploadFiles.financial"
                :show-file-list="false"
                :on-success="
                  (res, file, fileList) => {
                    handleSuccess('financial', res, file, fileList)
                  }
                "
                :on-remove="
                  (file, fileList) => {
                    handleRemove('financial', file, fileList)
                  }
                "
              >
                <el-button type="primary" size="medium" :disabled="!editFinanceInfo">
                  点击上传
                </el-button>
              </el-upload>
              <el-button plain size="small" @click="handlePreview('financial')">
                查看
              </el-button>
            </div>
            <div class="tips">需加盖公章</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="50">
        <el-col :span="12">
          <el-form-item label="决策授权书" prop="decisionAuthorization">
            <div class="upload-div">
              <el-upload
                :disabled="!editFinanceInfo"
                class="upload-btn"
                :action="uploadUrl"
                :file-list="uploadFiles.decisionAuthorization"
                :show-file-list="false"
                :on-success="
                  (res, file, fileList) => {
                    handleSuccess('decisionAuthorization', res, file, fileList)
                  }
                "
                :on-remove="
                  (file, fileList) => {
                    handleRemove('decisionAuthorization', file, fileList)
                  }
                "
              >
                <el-button type="primary" size="medium" :disabled="!editFinanceInfo">
                  点击上传
                </el-button>
              </el-upload>
              <el-button
                plain
                size="small"
                style="margin-right: 20px"
                @click="handlePreview('decisionAuthorization')"
              >
                查看
              </el-button>
              <a
                href="https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg?response-content-type=application/octet-stream"
                download="决策授权书模板"
              >
                <el-button plain size="small">模板下载</el-button>
              </a>
            </div>
            <div class="tips">需加盖公章</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="验资报告" prop="capitalReport">
            <div class="upload-div">
              <el-upload
                :disabled="!editFinanceInfo"
                class="upload-btn"
                :action="uploadUrl"
                :file-list="uploadFiles.capitalReport"
                :show-file-list="false"
                :on-success="
                  (res, file, fileList) => {
                    handleSuccess('capitalReport', res, file, fileList)
                  }
                "
                :on-remove="
                  (file, fileList) => {
                    handleRemove('capitalReport', file, fileList)
                  }
                "
              >
                <el-button type="primary" size="medium" :disabled="!editFinanceInfo">
                  点击上传
                </el-button>
              </el-upload>
              <el-button plain size="small" @click="handlePreview('capitalReport')">
                查看
              </el-button>
            </div>
            <div class="tips">需加盖公章</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="50">
        <el-col :span="12">
          <el-form-item label="贷款卡" prop="loanCard">
            <div class="upload-div">
              <el-button
                type="primary"
                style="margin-right: 20px"
                @click="handlePreview('loanCard')"
              >
                查看
              </el-button>
              <el-upload
                :disabled="!editFinanceInfo"
                class="reload-btn"
                :action="uploadUrl"
                :file-list="uploadFiles.loanCard"
                :show-file-list="false"
                :on-success="
                  (res, file, fileList) => {
                    handleSuccess('loanCard', res, file, fileList)
                  }
                "
                :on-remove="
                  (file, fileList) => {
                    handleRemove('loanCard', file, fileList)
                  }
                "
              >
                <el-button type="primary" size="medium" :disabled="!editFinanceInfo">
                  点击上传
                </el-button>
              </el-upload>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="董事会(或股东会)同意融资授权书" prop="authorization">
            <div class="upload-div">
              <el-button
                type="primary"
                style="margin-right: 20px"
                @click="handlePreview('authorization')"
              >
                查看
              </el-button>
              <el-upload
                :disabled="!editFinanceInfo"
                class="reload-btn"
                :action="uploadUrl"
                :file-list="uploadFiles.authorization"
                :show-file-list="false"
                :on-success="
                  (res, file, fileList) => {
                    handleSuccess('authorization', res, file, fileList)
                  }
                "
                :on-remove="
                  (file, fileList) => {
                    handleRemove('authorization', file, fileList)
                  }
                "
              >
                <el-button type="primary" size="medium" :disabled="!editFinanceInfo">
                  上传
                </el-button>
              </el-upload>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div v-if="!editFinanceInfo" class="edit-btn">
      <el-button type="primary" @click="editFinanceInfo = true">修改</el-button>
    </div>
    <div v-else class="edit-btn">
      <el-button type="primary" @click="confirmFinanceInfoChange">
        确认修改
      </el-button>
      <el-button type="primary" @click="editFinanceInfo = false">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    const start = new Date('2021-10-11')
    const end = new Date('2022-10-11')
    return {
      uploadFiles: {
        // 机构信用代码正面
        authCodeFront: [
          {
            name: '机构信用代码正面',
            url: 'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg',
          },
        ],
        // 机构信用代码背面
        authCodeBack: [
          {
            name: '机构信用代码反面',
            url: 'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
          },
        ],
        // 开户许可证正面
        licenceFront: [
          {
            name: '开户许可证正面',
            url: 'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
          },
        ],
        // 卡户许可证
        licence: [
          {
            name: '开户许可证',
            url: 'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
          },
        ],
        // 公司章程
        companyRule: [
          {
            name: '公司章程',
            url: 'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
          },
        ],
        // 近一年财务报表
        financial: [
          {
            name: '近一年财务报表',
            url: 'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
          },
        ],
        // 决策授权书
        decisionAuthorization: [
          {
            name: '决策授权书',
            url: 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
          },
        ],
        // 验资报告
        capitalReport: [
          {
            name: '验资报告',
            url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
          },
        ],
        // 贷款卡
        loanCard: [
          {
            name: '贷款卡',
            url: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
          },
        ],
        // 董事会(或股东会)同意融资授权书
        authorization: [
          {
            name: '董事会(或股东会)同意融资授权书',
            url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
          },
        ],
      },
      uploadUrl: 'https://jsonplaceholder.typicode.com/posts/',
      financeForm: {
        enterpriseType: '01',
        enterpriseSize: '02',
        authCode: 'XAQWE12345912',
        industryType: '02',
        industry: '',
        authCodeValidity: [start, end],
      },
      financeFormRules: {
        enterpriseType: [
          {
            required: true,
            trggier: ['blur', 'change'],
            message: '请选择企业类型',
          },
        ],
        enterpriseSize: [
          {
            required: true,
            trggier: ['blur', 'change'],
            message: '请选择企业规模',
          },
        ],
        authCode: [
          {
            required: true,
            trggier: ['blur', 'change'],
            message: '请输入机构信用代码',
          },
        ],
        industryType: [
          {
            required: true,
            trggier: ['blur', 'change'],
            message: '请选择行业门类',
          },
        ],
        authCodeValidity: [
          {
            required: true,
            trigger: 'blur',
            message: '请选择机构信用代码有效期',
          },
        ],
        authCodeFront: [
          //注意这里是upload的ref绑定的值
          {
            required: true,
            validator: (rule, value, callback) => {
              let files = this.$refs.authCodeFront.uploadFiles
              if (!files.length) {
                callback(new Error('需要上传机构信用代码正面'))
              }
              callback()
            },
          },
        ],
        authCodeBack: [
          {
            required: true,
            validator: (rule, value, callback) => {
              let files = this.$refs.authCodeBack.uploadFiles
              if (!files.length) {
                callback(new Error('需要上传机构信用代码反面'))
              }
              callback()
            },
          },
        ],
        licenceFront: [
          {
            required: true,
            validator: (rule, value, callback) => {
              let files = this.$refs.licenceFront.uploadFiles
              if (!files.length) {
                callback(new Error('需要上传开户许可证正面'))
              }
              callback()
            },
          },
        ],
        licence: [
          {
            required: true,
            validator: (rule, value, callback) => {
              let files = this.$refs.licence.uploadFiles
              if (!files.length) {
                callback(new Error('需要上传开户许可证'))
              }
              callback()
            },
          },
        ],
        companyRule: [
          {
            required: true,
            validator: (rule, value, callback) => {
              let files = this.$refs.companyRule.uploadFiles
              if (!files.length) {
                callback(new Error('需要上传公司章程'))
              }
              callback()
            },
          },
        ],
        financial: [
          {
            required: true,
            validator: (rule, value, callback) => {
              let files = this.$refs.financial.uploadFiles
              if (!files.length) {
                callback(new Error('需要上传近一年财务报表'))
              }
              callback()
            },
          },
        ],
      },
      editFinanceInfo: false,
      // 企业类型
      enterpriseTypeArr: [
        { dictValue: '01', dictLabel: '类型1' },
        { dictValue: '02', dictLabel: '类型2' },
      ],
      // 企业规模
      enterpriseSizeArr: [
        { dictValue: '01', dictLabel: '0-50' },
        { dictValue: '02', dictLabel: '50-100' },
        { dictValue: '03', dictLabel: '100-200' },
      ],
      // 行业门类
      industryTypeArr: [
        { dictValue: '01', dictLabel: '农、林、渔牧业' },
        { dictValue: '02', dictLabel: '租赁和商务服务业' },
        { dictValue: '03', dictLabel: '电子上午业' },
      ],
    }
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制上传 1 个文件 !`)
    },
    handleSuccess(type, res, file, fileList) {
      this.$refs.financeForm.validateField(type)
      const newFile = { url: URL.createObjectURL(file.raw), name: file.name }
      this.uploadFiles[type][0] = newFile
      this.$message.success('上传成功!')
    },
    handleRemove(type, file, fileList) {
      this.uploadFiles[type] = this.uploadFiles[type].filter(item => item.uid !== file.uid)
    },
    handlePreview(type) {
      const { name, url } = this.uploadFiles[type][0]
      this.$emit('handlePreviewBillInfo', name, url)
    },
    confirmFinanceInfoChange() {
      this.$refs.financeForm.validate(val => {
        if (val) {
          this.$message.success('修改成功！')
          this.editFinanceInfo = false
        }
      })
    },
  },
}
</script>

<style scoped lang="scss">
.upload-div {
  width: 350px;
  display: flex;
  align-items: center;
  .upload-btn {
    display: inline-block !important;
    margin-right: 20px;
  }
}
.edit-btn {
  display: flex;
  justify-content: flex-end;
  padding: 20px;
}
.tips {
  color: #ccc;
  padding-left: 30px;
}
</style>
