<template>
  <div class="hm-register">
    <div class="close">
      <i class="iconfont iconicon-test"></i>
    </div>
    <div class="logo">
      <i class="iconfont iconnew"></i>
    </div>
    <div class="username">
      <!-- 注意注册的用户名正则和登录的用户名正则应该一样 -->
      <auth-input v-model="form.username" err-msg="用户名格式错误" placeholder="用户名/手机号码" :rules="/^1\d{4,10}$/"></auth-input>
    </div>
    <div class="nickname">
      <auth-input v-model="form.nickname" err-msg="昵称格式错误" placeholder="昵称" :rules="/^[\u4e00-\u9fa5a-zA-Z-z0-9]{3,8}$/"></auth-input>
    </div>
    <div class="password">
      <auth-input type="password" v-model="form.password" err-msg="密码格式错误" placeholder="密码" :rules="/^[a-zA-Z0-9_]{4,6}$/"></auth-input>
    </div>
    <div class="register">
      <auth-button @click="register">注册</auth-button>
    </div>
    <div class="go-login">
      已有账号?<router-link to="/login">去登录</router-link>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // username: '',
      // password: '',
      // nickname: ''
      // 进行数据的优化
      form: {
        username: '',
        password: '',
        nickname: ''
      }
    }
  },
  methods: {
    async register () {
      if (!this.form.username || !this.form.nickname || !this.form.password) return
      const res = await this.$axios.post('/register', this.form)
      console.log(res)
      if (res.data.statusCode === 400) {
        // 注册成功
        this.$toast.fail('用户名已经存在')
      } else {
        this.$toast.success('注册成功')
        // 登录成功,跳转登录页(将注册的信息传递给login界面)
        this.$router.push({
          name: 'login',
          params: {
            username: this.form.username,
            password: this.form.password
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.hm-register {
  padding: 20px;
  .close i {
    font-size: 27px;
  }
  .logo {
    text-align: center;
    padding-bottom: 15px;
    i {
      font-size: 126px;
      line-height: 126px;
      color: #d81e06;
    }
  }
  .register {
    margin-top: 20px;
  }
  .go-login {
    width: 100%;
    height: 25px;
    line-height: 25px;
    text-align: center;
    font-size: 16px;
    margin-top: 10px;
  }
}
</style>
