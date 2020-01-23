<template>
  <div class="edit-profile">
    <hm-header @click="back">编辑资料</hm-header>
    <div class="content">
      <div class="avator">
        <img v-show="loading" :src="avator" alt="">
      </div>
      <hm-nav name="昵称" :desc="profile.username"></hm-nav>
      <hm-nav name="密码" desc="******"></hm-nav>
      <hm-nav name="性别" :desc="profile.gender===1?'男':'女'"></hm-nav>
    </div>
  </div>
</template>

<script>
// 导入默认图片
import img from '../assets/logo.png'
export default {
  data () {
    return {
      profile: {},
      // 解决图片闪动的问题
      loading: false
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
  async created () {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('user_id')
    const res = await this.$axios.get(`/user/${userId}`, {
      headers: {
        Authorization: token
      }
    })
    this.loading = true
    // 如果不发送请求,而是通过路由router,push带参数传过来,一刷新就没了
    console.log(res)
    this.profile = res.data.data
  },
  methods: {
    back () {
      this.$router.back()
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
  }
}
</style>
