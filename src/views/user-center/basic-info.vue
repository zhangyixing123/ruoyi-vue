<template>
  <div class="basciInfoBox">
    <el-card class="box-card">
      <div class="imgBox">
        <!-- <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload> -->

        <div class="user-info-head" @click="editCropper()">
          <img v-bind:src="options.img" title="点击上传头像" class="img-circle img-lg" />
        </div>

        <el-dialog
          :modal-append-to-body="false"
          :title="title"
          :visible.sync="open"
          width="800px"
          append-to-body
          @opened="modalOpened"
        >
          <el-row>
            <el-col :xs="24" :md="12" :style="{ height: '350px' }">
              <vue-cropper
                ref="cropper"
                :img="options.img"
                :info="true"
                outputType="jpeg"
                :autoCrop="options.autoCrop"
                :autoCropWidth="options.autoCropWidth"
                :autoCropHeight="options.autoCropHeight"
                :fixedBox="options.fixedBox"
                @realTime="realTime"
                v-if="visible"
              />
            </el-col>
            <el-col :xs="24" :md="12" :style="{ height: '350px' }">
              <div class="avatar-upload-preview">
                <img :src="previews.url" :style="previews.img" />
              </div>
            </el-col>
          </el-row>
          <br />
          <el-row>
            <el-col :lg="2" :md="2">
              <el-upload
                action="#"
                :http-request="requestUpload"
                :show-file-list="false"
                :before-upload="beforeUpload"
              >
                <el-button size="small">
                  选择
                  <i class="el-icon-upload el-icon--right"></i>
                </el-button>
              </el-upload>
            </el-col>
            <el-col :lg="{ span: 1, offset: 2 }" :md="2">
              <el-button icon="el-icon-plus" size="small" @click="changeScale(1)"></el-button>
            </el-col>
            <el-col :lg="{ span: 1, offset: 1 }" :md="2">
              <el-button icon="el-icon-minus" size="small" @click="changeScale(-1)"></el-button>
            </el-col>
            <el-col :lg="{ span: 1, offset: 1 }" :md="2">
              <el-button icon="el-icon-refresh-left" size="small" @click="rotateLeft()"></el-button>
            </el-col>
            <el-col :lg="{ span: 1, offset: 1 }" :md="2">
              <el-button
                icon="el-icon-refresh-right"
                size="small"
                @click="rotateRight()"
              ></el-button>
            </el-col>
            <el-col :lg="{ span: 2, offset: 6 }" :md="2">
              <el-button type="primary" size="small" @click="uploadImg()">提 交</el-button>
            </el-col>
          </el-row>
        </el-dialog>
      </div>
      <div class="infoBox">
        <el-form ref="form" :model="user" :rules="rules" label-width="80px">
          <el-form-item label="手机号码" prop="realPhone">
            <!-- <el-input v-model.trim="user.realPhone" maxlength="11" /> -->
            <span>{{ realPhone }}</span>
            <i class="el-icon-edit" @click="edit"> 修改</i>
          </el-form-item>
          <el-form-item label="真实姓名" prop="realName">
            <!-- <el-input v-model.trim="user.realName" /> -->
            <span>{{ realName }}</span>
          </el-form-item>
          <el-form-item label="职务" prop="position">
            <el-input v-model.trim="user.position" maxlength="50" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model.trim="user.email" maxlength="50" />
          </el-form-item>
          <!-- <el-form-item label="年龄" prop="age">
            <el-input v-model.trim="age" maxlength="50" disabled />
          </el-form-item>

          <el-form-item label="性别">
            <el-radio-group v-model.trim="gender" disabled>
              <el-radio label="1">男</el-radio>
              <el-radio label="2">女</el-radio>
            </el-radio-group>
          </el-form-item> -->
        </el-form>
      </div>
    </el-card>

    <div class="back">
      <el-button type="primary" @click="submit">提交</el-button>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import { VueCropper } from 'vue-cropper'
import * as Api from '@/api/enterprise-information-management/index'
import { uploadApi, imageNumberApi, queryApi } from '@/api/image-management/index.js'
import { Decrypt } from '@/utils/jsencrypt'
import { utils } from '@/utils/utils'
export default {
  components: { VueCropper },
  props: {
    // user: {
    //   type: Object
    // }
  },
  data() {
    return {
      // 是否显示弹出层
      open: false,
      // 是否显示cropper
      visible: false,
      // 弹出层标题
      title: '修改头像',
      options: {
        img: '', //裁剪图片的地址
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 200, // 默认生成截图框宽度
        autoCropHeight: 200, // 默认生成截图框高度
        fixedBox: true, // 固定截图框大小 不允许改变
      },
      previews: {},
      imageUrl: '',
      realPhone: ' ',
      realName: ' ',
      age: ' ',
      gender: ' ',
      user: {
        userId: null,
        position: null,
        url: null,
        email: null,
      },

      // 表单校验
      rules: {
        position: [{ required: true, message: '职务不能为空', trigger: 'blur' }],
        email: [
          { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
          {
            type: 'email',
            message: "'请输入正确的邮箱地址",
            trigger: ['blur'],
          },
        ],
      },
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          console.log(this.user)
          Api.supplyUserMsg(this.user).then(res => {
            console.log(res.data)
            this.msgSuccess('修改成功')
            setTimeout(() => {
              this.$router.push('/index')
            }, 1000)
          })
        }
      })
    },
    close() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/index' })
    },

    // 用户基本信息
    getUserInfo() {
      Api.userInfoMsg().then(res => {
        this.gender = res.data.gender
        this.age = res.data.age
        this.realName = res.data.realName
        this.user.userId = res.data.userId
        this.user.position = res.data.position
        this.user.email = res.data.email
        this.realPhone = Decrypt(res.data.realPhone)
        if (res.data.url) {
          // 查询用户头像
          imageNumberApi({ imageNumber: res.data.url, type: 1 }).then(res => {
            this.options.img = window.URL.createObjectURL(res)
            store.commit('SET_AVATAR', this.options.img)
          })
        } else {
          this.options.img = 'https://img1.baidu.com/it/u=201340457,3408503524&fm=26&fmt=auto'
          store.commit('SET_AVATAR', this.options.img)
        }
      })
    },
    // 编辑头像
    editCropper() {
      this.open = true
    },

    // 打开弹出层结束时的回调
    modalOpened() {
      this.visible = true
    },
    // 覆盖默认的上传行为
    requestUpload() {},
    // 向左旋转
    rotateLeft() {
      this.$refs.cropper.rotateLeft()
    },
    // 向右旋转
    rotateRight() {
      this.$refs.cropper.rotateRight()
    },
    // 图片缩放
    changeScale(num) {
      num = num || 1
      this.$refs.cropper.changeScale(num)
    },
    // 上传预处理
    beforeUpload(file) {
      if (file.type.indexOf('image/') == -1) {
        this.msgError('文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。')
      } else {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          let blob = utils.dataURLtoBlob(reader.result)
          this.options.img = window.URL.createObjectURL(blob)
        }
      }
    },
    // 上传图片
    uploadImg() {
      this.$refs.cropper.getCropBlob(data => {
        // 将blob转为file
        let formData = new FormData()
        formData.append('file', data, 'avatar.jpg')
        formData.append('imageTypeNumber', '8')
        formData.append('businessId', this.$store.state.enterprise.enterpriseCertNo)
        formData.append('businessCode', '001')
        uploadApi(formData).then(res => {
          if (res.code === 200 && res.success) {
            this.user.url = res.data.imageNumber
          }
        })
        this.open = false
        store.commit('SET_AVATAR', this.options.img)
        this.visible = false
      })
    },
    // 实时预览
    realTime(data) {
      this.previews = data
    },

    edit() {
      this.$router.push('/user-center/change-phone')
    },
  },
}
</script>
<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.el-card__body {
  padding: 50px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.imgBox {
  width: 50%;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: auto;
}
.infoBox {
  padding: 0 80px;
  width: 50%;
  border-left: 1px dotted rgb(148, 144, 144);
}
.submitBtn {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(80%);
}

.user-info-head {
  position: relative;
  display: inline-block;
  height: 120px;
}

.user-info-head:hover:after {
  content: '上传头像';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  font-size: 16px;
  text-align: center;
  color: #eee;
  background: rgba(0, 0, 0, 0.5);
  // font-size: 24px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  cursor: pointer;
  line-height: 110px;
  border-radius: 50%;
}

.back {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 100px;
}

.el-icon-edit {
  color: #409eff;
  cursor: pointer;
}

.box-card ::v-deep.el-card__body {
  display: flex !important;
  justify-content: space-around;
}
</style>
