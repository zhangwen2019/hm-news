<template>
  <div class="hm-login">
    <div class="close">
      <i class="iconfont iconicon-test"></i>
    </div>
    <div class="logo">
      <i class="iconfont iconnew"></i>
    </div>
    <div class="username">
      <auth-input placeholder="请输入用户名" v-model="username" :rules="/^1\d{4,10}$/" err-msg="用户名格式错误"></auth-input>
    </div>
    <div class="password">
      <auth-input type="password" placeholder="请输入密码" v-model="password" :rules="/^\d{2,6}$/" err-msg="密码格式错误"></auth-input>
    </div>
    <div class="login">
      <auth-button @click="login">登录</auth-button>
    </div>
  </div>
</template>

<script>
// 导入input框组件
import AuthInput from '../components/AuthInput'
// 导入按钮组件
import AuthButton from '../components/AuthButton'
// 导入axios模块
import axios from 'axios'
export default {
  components: {
    AuthInput,
    AuthButton
  },
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    async login () {
      // console.log(11)
      // 在表单校验成功后,可以发请求拿数据
      const res = await axios.post('http://localhost:3000/login', {
        username: this.username,
        password: this.password
      })
      console.log(res)
      if (res.data.statusCode === 401) {
        alert(res.data.message)
      } else {
        this.$router.push('/register')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.hm-login {
  padding: 20px;
  .close {
    i {
      font-size: 27px;
    }
  }
  .logo {
    text-align: center;
    i {
      font-size: 126px;
      color: #d81e06;
    }
  }
  .login {
    // 自己根据情况确定按钮的位置,这里不是在组件封装中书写
    margin-top: 20px;
  }
}
</style>
