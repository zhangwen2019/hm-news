<template>
  <div class="hm-register">
    <div class="close">
      <i class="iconfont iconicon-test"></i>
    </div>
    <div class="logo">
      <i class="iconfont iconnew"></i>
    </div>
    <div class="username">
      <auth-input v-model="username" err-msg="用户名格式错误" placeholder="用户名/手机号码" :rules="/^1\d{2,10}/"></auth-input>
    </div>
    <div class="nickname">
      <auth-input v-model="nickname" err-msg="昵称格式错误" placeholder="昵称" :rules="/.{3,8}/"></auth-input>
    </div>
    <div class="password">
      <auth-input v-model="password" err-msg="密码格式错误" placeholder="密码" :rules="/^1\d{2,10}$/"></auth-input>
    </div>
    <div class="register">
      <auth-bottom @click="register">注册</auth-bottom>
    </div>
  </div>
</template>

<script>
import AuthInput from '../components/AuthInput'
import AuthBottom from '../components/AuthButton'
import axios from 'axios'
export default {
  components: {
    AuthInput,
    AuthBottom
  },
  data () {
    return {
      username: '',
      password: '',
      nickname: ''
    }
  },
  methods: {
    async register () {
      const res = await axios.post('http://localhost:3000/register', {
        username: this.username,
        password: this.password,
        nickname: this.nickname
      })
      if (res.status === 200) {
        // 登录成功,跳转首页
        this.$router.push('/index')
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
    i {
      font-size: 126px;
      color: #d81e06;
    }
  }
  .register {
    margin-top: 20px;
  }
}
</style>
