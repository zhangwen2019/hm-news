<template>
  <div class="hm-follow">
    <hm-header @click="$router.back()">我的关注</hm-header>
    <div class="item" v-for="item in followList" :key="item.id">
      <div class="left">
        <!-- img需要加上baseURL -->
        <img :src="$axios.defaults.baseURL + item.head_img" alt="">
      </div>
      <div class="center">
        <p class="name">{{item.nickname}}</p>
        <p class="time">{{item.create_date | filter_time}}</p>
      </div>
      <div @click="unfollow(item.id)" class="right">取消关注</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      followList: []
    }
  },
  created () {
    this.getFollowList()
    // this.follow(1)
    // this.follow(2)
    // this.follow(3)
    // this.follow(4)
    // this.follow(5)
    // this.follow(6)
    // this.follow(7)
    // this.follow(8)
    // this.follow(9)
  },
  methods: {
    // 封装获取关注列表函数
    async getFollowList () {
      // 需要验证的token在请求拦截器中添加了
      const res = await this.$axios.get('/user_follows')
      console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.followList = data
      }
    },
    async unfollow (id) {
      // 取消关注需要发送ajax请求(取消关注的id值)
      // 值得注意的是:组件的调用注册的是comfirm事件(知道是点击了确定按钮)
      // 这里是确定弹框,调用confirm()方法
      try {
        await this.$dialog.confirm({
          title: '提示',
          message: '确定要取消关注该用户吗?'
        })
        // 将取消的id传给后台
        const res = await this.$axios.get(`/user_unfollow/${id}`)
        console.log(res)
        const { statusCode } = res.data
        if (statusCode === 200) {
          // 取关成功
          this.$toast.success('取关成功')
          // 重新渲染列表
          this.getFollowList()
        }
      } catch {
        this.$toast('取消操作')
      }
    },
    // 关注的函数
    async follow (id) {
      const res = await this.$axios.get(`/user_follows/${id}`)
      const { statusCode } = res.data
      if (statusCode === 200) {
        this.getFollowList()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  border-bottom: 1px solid #ccc;
  display: flex;
  padding: 20px;
  align-items: center;
  .left {
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }
  .center {
    flex: 1;
    padding-left: 15px;
    .name {
      font-size: 16px;
      color: #000;
    }
    .time {
      color: #999;
      font-size: 14px;
    }
  }
  .right {
    height: 30px;
    line-height: 30px;
    background-color: #e1e1e1;
    padding: 0 10px;
    border-radius: 15px;
    color: #000;
  }
}
</style>
