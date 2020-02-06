<template>
  <div class="edit-profile">
    <hm-header @click="back">编辑资料</hm-header>
    <div class="content">
      <div class="avator">
        <img v-show="loading" :src="avator" alt="">
        <!--
          实现文件上传功能,文件上传完毕后会触发after-read回调函数，获取到对应的file对象
          注意:uploader组件不会自动帮我们上传图片,需要我们自己动手上传图片(使用formData),但是这个组件会返回给你对应的file对象
        -->

        <!-- 将van-uploader定位到原来的图片的下面 -->
        <van-uploader :after-read="afterRead" />
      </div>
      <hm-nav @click="showNickname" name="昵称" :desc="profile.nickname"></hm-nav>
      <hm-nav @click="showPassword" name="密码" desc="******"></hm-nav>
      <hm-nav @click="showGender" name="性别" :desc="profile.gender===1?'男':'女'"></hm-nav>
    </div>

    <!-- 编辑昵称对话框 -->
    <!-- 组件调用,在弹窗中嵌入组件或其他的自定义内容 -->
    <!-- 1.dialog组件点击确认时,触发confirm事件 -->
    <van-dialog v-model="isShowNickname" title="修改昵称" @confirm='editNickname' show-cancel-button>
      <!-- 嵌入input输入框(field输入框) -->
      <van-cell-group>
        <!-- 这里v-model如果绑定profile.nickname,则会在边输入边修改 -->
        <van-field v-model="nickname" placeholder="请输入用户名" />
      </van-cell-group>
    </van-dialog>

    <!-- 编辑密码 -->
    <van-dialog v-model="isShowPassword" title="修改密码" @confirm='editPassword' show-cancel-button>
      <van-cell-group>
        <van-field v-model="password" placeholder="请输入密码" />
      </van-cell-group>
    </van-dialog>

    <!-- 编辑性别(使用vant-ui的radio的单选框) -->
    <van-dialog v-model="isShowGender" title="修改性别" @confirm='editGender' show-cancel-button>
      <!-- <van-radio-group v-model="gender">
        <van-radio :name="1">男</van-radio>
        <van-radio :name="0">女</van-radio>
      </van-radio-group> -->

      <!-- 与cell组件一起使用 -->
      <van-radio-group v-model="gender">
        <van-cell-group>
          <van-cell title="男" clickable @click="gender = 1">
            <van-radio slot="right-icon" :name="1" />
          </van-cell>
          <van-cell title="女" clickable @click="gender = 0">
            <van-radio slot="right-icon" :name="0" />
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-dialog>
  </div>
  <!--
    小结:修改昵称,密码同注册一样也需要进行校验
   -->
</template>

<script>
// 导入默认图片
import img from '../assets/logo.png'
export default {
  data () {
    return {
      profile: {},
      // 解决图片闪动的问题(当图片加载进来之后,显示它)
      loading: false,
      isShowNickname: false,
      nickname: '',
      isShowPassword: false,
      password: '',
      isShowGender: false,
      gender: 1
    }
  },
  computed: {
    avator () {
      if (this.profile.head_img) {
        return this.$axios.defaults.baseURL + this.profile.head_img
      } else {
        return img
      }
    }
  },
  created () {
    this.getProfile()
  },
  methods: {
    back () {
      this.$router.back()
    },
    // 用于渲染页面的函数
    async getProfile () {
      const userId = localStorage.getItem('user_id')
      const res = await this.$axios.get(`/user/${userId}`)
      this.loading = true
      // 如果不发送请求拿数据,而是通过路由router,push带参数传过来,一刷新就没了
      console.log(res)
      this.profile = res.data.data
    },
    // 用于修改个人信息的函数封装(data是修改所需要的函数)
    async editProfile (data) {
      const id = localStorage.getItem('user_id')
      const res = await this.$axios.post(`/user_update/${id}`, data)
      // 修改成功了(当信息修改成功了,会发送两次ajax请求)
      if (res.data.statusCode === 200) {
        this.$toast.success(res.data.message)
        this.getProfile()
      }
    },
    // 用于修改昵称
    editNickname () {
      console.log('点击确定按钮了')
      this.editProfile({ nickname: this.nickname })
    },
    // 用于显示昵称对话框
    showNickname () {
      this.isShowNickname = true
      // 将输入框双向绑定的数据nickname的默认值改为profile.username
      this.nickname = this.profile.nickname
    },
    // 用于显示密码对话框
    showPassword () {
      this.isShowPassword = true
      this.password = this.profile.password
    },
    // 用于修改密码
    editPassword () {
      console.log('修改密码')
      this.editProfile({ password: this.password })
    },
    // 用于显示性别
    showGender () {
      this.isShowGender = true
    },
    // 用于修改性别
    editGender () {
      console.log('修改性别')
      this.editProfile({ gender: this.gender })
    },
    // 上传文件触发的回调函数
    async afterRead (file) {
      console.log(file.file)

      // 上传头像的校验(文件的格式,文件的大小)
      if (file.file.type !== 'image/gif') {
        this.$toast('请上传gif图片')
        return
      }
      if (file.file.size / 1024 >= 20) {
        this.$toast('上传的文件过大')
        return
      }
      // 在触发的回调函数中发送ajax请求
      // 创建fromDate对象,用于上传文件
      const fd = new FormData()
      fd.append('file', file.file)

      const res = await this.$axios.post('/upload', fd)
      console.log(res)
      // 头像上传成功,需要获取到上传成功后的图片地址,发送请求,修改头像
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.editProfile({ head_img: data.url })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  padding: 0 20px;
  .avator {
    padding: 30px 0;
    img {
      width: 70px;
      height: 70px;
      margin: 0 auto;
      border-radius: 50%;
    }
    .van-uploader {
      position: absolute;
      top: 30px;
      left: 50%;
      transform: translateX(-50%);
      // 使得其透明度为0,display和visibility都不行(是点不到的)
      opacity: 0;
    }
  }
}
.van-dialog {
  padding: 0 15px;
  .van-field {
    border: 1px solid #ccc;
    margin-top: 10px;
    border-radius: 10px;
  }
}
</style>
