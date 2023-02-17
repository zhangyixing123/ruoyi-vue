<template>
  <div class="create-step3">
    <div v-if="!showStatus">
      <div class="l-h-40">认证信息</div>
      <div class="l-h-40">
        <span>请选择证件类型</span>
        <el-radio-group class="m-l-10" v-model.trim="certificateType">
          <!-- <el-radio label="Ukey认证">Ukey认证</el-radio> -->
          <el-radio label="同名户基本认证">同名户基本认证</el-radio>
        </el-radio-group>
      </div>
      <div v-if="certificateType == 'Ukey认证'" key="Ukey认证">
        <div class="flex just-center">
          <div class="c-999">
            <span
              >说明：1、请先绑定UKey并获取《数字证书使用承诺函》；2、完成法定代表人或被授权人签字并加盖红色公章；3、上传文件提交申请；4、平台审核通过后认证成功；</span
            >
          </div>
          <div class="flex">
            <el-select v-model.trim="ukeyType" class="w280">
              <el-option label="经办人ukey" value="1"></el-option>
              <el-option label="审核人ukey" value="2"></el-option>
            </el-select>
            <div>
              <el-button class="m-l-10" type="primary" @click="addUkey" :disabled="!ukeyType">
                新增UKey
              </el-button>
            </div>
          </div>
        </div>
        <el-form :model="formData1" :rules="formData1Rules" ref="formData1">
          <el-form-item label-width="0px" prop="list">
            <el-table class="m-t-10" empty-text="请新增UKey" :data="formData1.list">
              <el-table-column type="index" label="序号" width="60"> </el-table-column>
              <el-table-column label="UKey获取银行">
                <template slot-scope="scope">
                  <el-input
                    v-model.trim="scope.row.bankName"
                    :disabled="scope.row.seqNo != ''"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="UKey编号">
                <template slot-scope="scope">
                  <el-input
                    v-model.trim="scope.row.ukeyNo"
                    :disabled="scope.row.seqNo != ''"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="UKey序列号">
                <template slot-scope="scope">
                  <el-input
                    v-model.trim="scope.row.ukeySerialNo"
                    :disabled="scope.row.seqNo != ''"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column width="180" label="操作">
                <template slot-scope="scope">
                  <el-button
                    :disabled="!(scope.row.bankName && scope.row.ukeyNo && scope.row.ukeySerialNo)"
                    @click="bindEnterpriseUkey(scope)"
                    v-if="!scope.row.seqNo && scope.row.ukeyType == '1'"
                    type="text"
                  >
                    绑定经办人ukey
                  </el-button>
                  <el-button
                    :disabled="!(scope.row.bankName && scope.row.ukeyNo && scope.row.ukeySerialNo)"
                    @click="bindEnterpriseUkey(scope)"
                    v-if="!scope.row.seqNo && scope.row.ukeyType == '2'"
                    type="text"
                  >
                    绑定审核人ukey
                  </el-button>
                  <el-button @click="del(scope)" type="text-danger">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="数字证书使用承诺函" prop="promiseFile">
            <div class="flex just-between">
              <div>
                <el-upload
                  class="upload-demo"
                  action=" "
                  :on-change="
                    (file, fileList) => handleImgChange(file, fileList, 'promiseFile', 'upload')
                  "
                  :on-remove="(file, fileList) => handleImgChange(file, fileList, 'promiseFile')"
                  multiple
                  :limit="1"
                  :file-list="formData1.promiseFile"
                  :auto-upload="false"
                >
                  <el-button size="small" type="primary" :disabled="idCardBackArea"
                    >点击上传</el-button
                  >
                </el-upload>
                <el-button type="text" @click="getFileShow('UKEY', 'UKEY_COMMITMENT')"
                  >获取《数字证书使用承诺函》</el-button
                >
                <div class="flex1">
                  <p>
                    <span>请上传</span>
                    <span class="text-danger">法定代表或被授权人签字</span>
                    <span>并</span>
                    <span class="text-danger">加盖红色公章</span>
                    <span>图片</span>
                  </p>
                  <p><span>支持word,pdf,png,jpg格式</span></p>
                </div>
              </div>
            </div>
          </el-form-item>
        </el-form>
        <div class="c-999">
          <div>注意事项：</div>
          <div>
            1、查看平台支持的UKey清单<el-button
              type="text"
              @click="getFileShow('UKEY', 'UKEY_INVENTORY')"
              >《UKey清单》</el-button
            >
          </div>
          <div>
            2、立即申请CFCA（中国金融认证中心）UKey<el-button
              type="text"
              @click="getFileShow('UKEY', 'UKEY_INSTRUCTIONS')"
              >《操作指南》</el-button
            >
          </div>
          <div>
            3、对UKey做出调整后，需要重新获取《数字证书使用承诺函》并完成法定代表人/负责人或被授权人签字并加盖红色公章后重新上传
          </div>
        </div>
        <div class="text-center m-t-10 m-b-10">
          <el-button type="primary" @click="submit1">下一步</el-button>
        </div>
      </div>
      <div v-if="certificateType == '同名户基本认证'" key="同名户基本认证">
        <el-form :model="formData2" :rules="formData2Rules" ref="formData2" label-width="150px">
          <el-row>
            <el-col :span="12">
              <el-form-item label=""> </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="企业名称">
                <span>{{ enterpriseName }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="bgf5f5f5 pd20 ">
              <p>说明：</p>
              <p>1、请填写同名基本户信息并提交申请</p>
              <p>2、平台审批通过后自动向您的银行账户发起打款验证</p>
              <p>3、您收到验证提醒短信后，请查询银行账户转账信息并获取验证码</p>
              <p>4、登录平台输入验证码后完成认证</p>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开户行支行名称" prop="accountBankName">
                <!-- <el-input v-model.trim="formData2.accountBankName"></el-input> -->
                <el-select
                  v-model.trim="formData2.accountBankName"
                  filterable
                  remote
                  :remote-method="remoteMethod"
                  clearable
                  placeholder="请输入开户行支行关键字"
                  :loading="loading"
                  @change="bankNameChange(formData2.accountBankName)"
                  :disabled="disableInput"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.seqNo"
                    :label="item.accBchName"
                    :value="item.accBchName"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="基本户开户银行" prop="bankName">
                <el-input v-model.trim="formData2.bankName" disabled></el-input>
              </el-form-item>

              <el-form-item label="开户行联行号" prop="bankUnionNo">
                <el-input v-model.trim="formData2.bankUnionNo" disabled></el-input>
              </el-form-item>
              <el-form-item label="基本户银行账号" prop="bankAccNo">
                <el-input v-model.trim="formData2.bankAccNo" :disabled="disableInput"></el-input>
              </el-form-item>
              <el-form-item label="打款金额" prop="amount">
                <div class="flex">
                  <el-input v-model.trim="formData2.amount"></el-input>
                  <el-button :disabled="verificationCodeTime > 0" @click="send" class="m-l-10">{{
                    verificationCodeTime > 0 ? verificationCodeTime + 's后重新获取' : '获取金额'
                  }}</el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="text-center m-t-10 m-b-10">
          <!-- <el-button>暂存</el-button> -->
          <!-- <el-button @click="prev">上一步</el-button> -->
          <el-button type="primary" @click="submit2" :disabled="!formData2.amount">提交</el-button>
        </div>
      </div>

      <!-- 查看合同弹框 -->
      <el-dialog
        :modal-append-to-body="false"
        class="text-center  "
        :visible.sync="fileShow"
        width="720px"
        append-to-body
      >
        <span v-html="msg" class="template-preview"></span>
      </el-dialog>
    </div>
    <div class="create-step4" v-if="showStatus">
      <div v-if="dkStatus == 1">
        <img src="@/assets/images/step-three.png" mode="" />
        <p class="m-t-20">处理中!</p>
        <el-button class="m-t-20" size="small" @click="back">返回</el-button>
      </div>
      <div v-if="dkStatus == 2">
        <img src="@/assets/images/approvel-fail.png" mode="" />
        <p class="m-t-20">申请失败!</p>
        <el-button class="m-t-20" size="small" @click="back">返回</el-button>
      </div>
      <div v-if="dkStatus == 3">
        <img src="@/assets/images/auth-success.png" mode="" />
        <p>申请成功</p>
        <el-button class="m-t-20" size="small" @click="toNext">下一步</el-button>
      </div>
    </div>
  </div>
</template>

<script>
// import { imgToBase64 } from '@/common/js/utils.js';
import { uploadAndGetUrlApi, downloadImageApi } from '@/api/image-management/index.js'
import {
  enterpriseBasicCardAuthApi,
  basicCardAuthApi,
  bindEnterpriseUkeyApi,
  enterpriseUkeyAuthApi,
  relieveEnterpriseUkeyApi,
  enterpriseBasicCardAuthQueryApi,
  enterpriseSmallPayAuthApi,
} from '@/api/enterprise-information-management/create-enterprise.js'
import { sAccBankBchListApi } from '@/api/enterprise-information-management/index'
import { getDataDictApi, previewContractByTemplateCodeApi } from '@/api/amount-management/index'
import { Encrypt, Decrypt } from '@/utils/jsencrypt'
import {
  getContractPDFUrlApi,
  enterpriseListApi,
} from '@/api/enterprise-information-management/index'
import { utils } from '@/utils/utils'
import { downloadWord } from '@/utils/ruoyi'

export default {
  props: {
    enterpriseId: {
      type: [String, Number],
    },
    bankList: {
      type: Array,
    },
  },
  data() {
    return {
      fileShow: false,
      msg: '',
      canNext: false,
      certificateType: '同名户基本认证',
      ukeyType: '',
      formData1: {
        list: [],
        promiseFile: [],
        agree: false,
      },
      formData1Rules: {
        list: [
          {
            required: true,
            trigger: [],
            validator: (rule, value, callback) => {
              if (!value.length) {
                callback('请绑定uKey!')
              } else {
                console.log(value)
                let bool = value.every(item => {
                  return item.seqNo
                })
                if (bool) {
                  // 这里还要判断 是否有经办人和审核人
                  let hasJBR = value.some(item => {
                    return item.ukeyType == '1'
                  })
                  let hasSHR = value.some(item => {
                    return item.ukeyType == '2'
                  })
                  if (hasJBR && hasSHR) {
                    callback()
                  } else {
                    console.log(value)
                    callback('至少有一个经办人和一个审核人！')
                  }
                } else {
                  callback('有uKey为未绑定状态，请绑定或删除！')
                }
              }
            },
          },
        ],
        promiseFile: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请补充完整',
          },
        ],
        agree: [
          {
            required: true,
            trigger: ['blur', 'change'],
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                callback('请勾选协议')
              }
            },
          },
        ],
      },
      formData2: {
        bankName: '',
        accountBankName: '',
        bankUnionNo: '',
        bankAccNo: '',
        agree: false,
        bankCode: '',
        amount: '',
      },
      formData2Rules: {
        bankName: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入基本户开户银行',
          },
        ],
        accountBankName: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请选择开户行支行名称',
          },
        ],
        bankUnionNo: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入开户行联行号',
          },
        ],
        bankAccNo: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入基本户银行账号',
          },
        ],
        amount: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入打款金额',
          },
        ],
        agree: [
          {
            required: true,
            trigger: ['blur', 'change'],
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                callback('请勾选协议')
              }
            },
          },
        ],
      },
      dialogVisible: false,
      verificationCode: '',
      verificationCodeTime: 0,
      verificationCodeTimer: null,
      nextSeqNo: '', // 点击下一步要传的SeqNo
      idCardBackArea: false, // 数字证书使用承诺函
      bankNum: '',
      enterpriseName: '',
      options: [],
      loading: false,
      showStatus: false, // 是否显示打款认证
      dkStatus: '', // 打款认证状态
      disableInput: false,
    }
  },
  created() {
    this.disableInput = this.idCardBackArea = false
    this.getList()
    // this.getStatus()
  },
  methods: {
    remoteMethod(query) {
      this.options = []
      if (query !== '') {
        this.loading = true
        sAccBankBchListApi({
          pageSize: 50,
          accBchName: query,
        }).then(res => {
          this.options = res.data.rows
          this.loading = false
        })
      } else {
        this.options = []
      }
    },
    bankNameChange(val) {
      if (!val) {
        this.options = []
        this.formData2.bankName = this.formData2.bankUnionNo = this.formData2.bankCode = ''
      } else {
        this.options.forEach(v => {
          if (v.accBchName == val) {
            this.formData2.bankName = v.accBankName
            this.formData2.bankUnionNo = v.accBchCde
            this.formData2.bankCode = v.accBankCde
          }
        })
      }
    },
    // 获取开户行信息
    getBankList() {
      sAccBankBchListApi({
        pageSize: 50,
        accBchName: queryString,
      }).then(res => {
        this.bankList = res.data.rows
      })
    },
    // 获取企业列表
    getList() {
      enterpriseListApi({
        pageSize: 10,
        pageNum: 1,
      }).then(res => {
        if (res.data.rows.length > 0) this.enterpriseName = res.data.rows[0].enterpriseName
      })
    },
    // 查看文件
    getFileShow(type, code) {
      getDataDictApi({ dictType: type, dictCode: code }).then(res => {
        if (res.code == 200) {
          const dictValue = res.data.find(item => item.dictCode == code).dictValue
          if (code == 'UKEY_COMMITMENT') {
            getContractPDFUrlApi(dictValue).then(res => {
              downloadWord(res, '数字证书使用承诺函.pdf')
              // if (utils.isIE) {
              //   window.navigator.msSaveOrOpenBlob(res, '数字证书使用承诺函.pdf')
              // } else {
              // }
            })
          } else {
            this.fileShow = true
            previewContractByTemplateCodeApi({ templateCode: dictValue }).then(res => {
              let str = res.substr(0, res.indexOf('<style>')) + res.substr(res.indexOf('</style>'))
              this.msg = str
              document.close()
              this.fileShow = true
            })
          }
        }
      })
    },
    addUkey() {
      this.formData1.list.push({
        seqNo: '',
        ukeyType: this.ukeyType,
        bankName: '',
        ukeyNo: '',
        ukeySerialNo: '',
      })
    },
    bindEnterpriseUkey(scope) {
      let params = {
        enterpriseId: this.enterpriseId,
        ukeyType: scope.row.ukeyType,
        bankName: scope.row.bankName,
        ukeyNo: scope.row.ukeyNo,
        ukeySerialNo: scope.row.ukeySerialNo,
      }
      bindEnterpriseUkeyApi(params).then(res => {
        // 接口调用成功之后，置为已绑定，并拿到对应的seqNo
        scope.row.seqNo = res.data
      })
    },
    del(scope) {
      if (scope.row.seqNo) {
        let params = {
          seqNo: scope.row.seqNo,
        }
        relieveEnterpriseUkeyApi(params).then(res => {
          // 接口调用成功之后，删除该条数据
          this.formData1.list.splice(scope.$index, 1)
        })
      } else {
        this.formData1.list.splice(scope.$index, 1)
      }
    },
    async handleImgChange(file, fileList, key, method) {
      if (key == 'authorization' && method == 'upload') {
        const isJPG =
          file.raw.type === 'image/jpeg' ||
          file.raw.type === 'application/msword' ||
          file.raw.type === 'image/png' ||
          file.raw.type === 'application/pdf' ||
          file.raw.type ===
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

        if (!isJPG) {
          this.formData1[key] = []
          this.$message.error('请上传word,pdf,png,jpg类型的文件')
          return false
        }
      }
      let files = []
      for (let item of fileList) {
        if (item.raw) {
          try {
            let formData = new FormData()
            formData.append('file', item.raw)
            formData.append('imageTypeNumber', '3')

            let res = await uploadAndGetUrlApi({
              file: item.raw,
              imageTypeNumber: '3',
              showType: '0',
            })
            files.push({
              uid: item.uid,
              name: item.name,
              url: item.url,
              imageNumber: res.imageNumber,
            })
          } catch (error) {}
        } else {
          files.push(item)
        }
      }
      this.formData1[key] = files
      this.idCardBackArea = this.formData1[key].length > 0
      this.$refs.formData1.validateField([key])
    },
    submit1() {
      this.$refs.formData1.validate((valid, obj) => {
        if (valid) {
          let params = this.formData1.list.map(item => {
            return {
              enterpriseId: this.enterpriseId,
              promiseFile: this.formData1.promiseFile[0].imageNumber,
              seqNo: item.seqNo,
            }
          })
          enterpriseUkeyAuthApi(params).then(res => {
            if (res.code == 200) {
              this.canNext = true
              this.$emit('activeChange', 3)
            }
          })
        }
      })
    },
    // 下一步
    toNext() {
      this.$emit('activeChange', 3)
    },
    // 返回
    back() {
      this.showStatus = false
      this.formData2.amount = ''
    },
    // next2() {
    //   let params = {
    //     seqNo: this.nextSeqNo,
    //     code: this.verificationCode,
    //   }
    //   basicCardAuthApi(params).then(res => {
    //     this.dialogVisible = false
    //     this.$emit('activeChange', 3)
    //   })
    // },
    submit2() {
      this.formData2Rules.amount = [
        {
          required: true,
          trigger: ['blur', 'change'],
          message: '请输入打款金额',
        },
      ]
      this.$refs.formData2.validate((valid, obj) => {
        if (valid) {
          let params = {
            enterpriseId: this.enterpriseId,
            ...this.formData2,
          }
          params.bankAccNo = Encrypt(params.bankAccNo)
          enterpriseBasicCardAuthApi(params).then(res => {
            if (res.code == 200) {
              this.bankNum = this.formData2.bankAccNo.substr(-4)
              this.nextSeqNo = res.data.seqNo
              // this.dialogVisible = true
              // this.send()
              this.getStatus()
            }
          })
        }
      })
    },
    // 查看打款验证状态
    getStatus() {
      enterpriseBasicCardAuthQueryApi({ enterpriseId: this.enterpriseId }).then(res => {
        if (res.code == 200) {
          this.dkStatus = res.data.status
          if (this.dkStatus == 0) {
            this.showStatus = false
          } else if (this.dkStatus == 1 || this.dkStatus == 2) {
            this.disableInput = this.showStatus = true
          } else if (this.dkStatus == 3) {
            this.$emit('activeChange', 3)
          }
        }
      })
    },
    send() {
      this.formData2Rules.amount = []

      this.$refs.formData2.validate((valid, obj) => {
        if (valid) {
          this.verificationCodeTime = 60
          if (this.verificationCodeTimer) {
            clearInterval(this.verificationCodeTimer)
            this.verificationCodeTimer = null
          }
          this.verificationCodeTimer = setInterval(() => {
            this.verificationCodeTime--
            if (this.verificationCodeTime <= 0) {
              clearInterval(this.verificationCodeTimer)
              this.verificationCodeTimer = null
            }
          }, 1000)
          let params = {
            enterpriseId: this.enterpriseId,
            ...this.formData2,
          }
          params.bankAccNo = Encrypt(params.bankAccNo)
          enterpriseSmallPayAuthApi(params).then(res => {
            if (res.code == 200) {
              this.$message.success('发送成功')
            }
          })
        }
      })
    },
  },
}
</script>

<style lang="scss">
.create-step3 {
  padding: 0 20px;
  font-size: 14px;
}
.hide {
  .el-upload--picture-card {
    display: none;
  }
}
.create-step4 {
  text-align: center;
  padding-top: 20px;
  img {
    height: 140px;
  }
}
</style>
