<template>
  <div class="hm-login">
    <!-- <div class="close" @click="back">
      <i class="iconfont iconicon-test"></i>
    </div> -->
    <hm-back>
      <template v-slot:icon>
        <i class="iconfont iconicon-test"></i>
      </template>
    </hm-back>
    <div class="logo">
      <i class="iconfont iconnew"></i>
    </div>
    <div class="username">
      <auth-input placeholder="请输入用户名" v-model="username" :rules="/^1\d{4,10}$/" err-msg="用户名格式错误"></auth-input>
    </div>
    <div class="password">
      <auth-input type="password" placeholder="请输入密码" v-model="password" :rules="/^[a-zA-Z0-9_]{4,6}$/" err-msg="密码格式错误"></auth-input>
    </div>
    <div class="login">
      <!-- <auth-button @click="login">登录</auth-button> -->
      <van-button type="danger" size="large" @click="login" round>登录</van-button>
    </div>
    <div class="go-rgiste">
      没有账号?<router-link to="/register">去注册</router-link>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  created () {
    // console.log(this.$route)
    // 将params的参数写到数据中
    const { username, password } = this.$route.params
    this.username = username
    this.password = password
  },
  methods: {
    async login () {
      if (!this.username || !this.password) return
      // console.log(11)
      // 在表单校验成功后,可以发请求拿数据
      const res = await this.$axios.post('/login', {
        // timeout: 2500,
        username: this.username,
        password: this.password
      })
      console.log(res)
      if (res.data.statusCode === 401) {
        this.$toast.fail('用户名或密码错误')
      } else {
        // 用户第一次登陆成功,存储token
        console.log(res)
        const { token, user } = res.data.data
        localStorage.setItem('token', token)
        localStorage.setItem('user_id', user.id)
        this.$toast.success('登录成功')
        this.$router.push('/profile')
      }
    },
    back () {
      // 返回历史页面
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.hm-login {
  padding: 20px;
  .logo {
    text-align: center;
    padding-bottom: 15px;
    i {
      font-size: 126px;
      line-height: 126px;
      color: #ee0a24;
    }
  }
  .login {
    // 自己根据情况确定按钮的位置,这里不是在组件封装中书写
    margin-top: 20px;
  }
  .go-rgiste {
    width: 100%;
    height: 25px;
    line-height: 25px;
    text-align: center;
    font-size: 16px;
    margin-top: 10px;
  }
}
</style>
