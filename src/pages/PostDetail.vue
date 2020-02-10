<template>
  <div class="post-detail">
    <div class="header">
      <div class="left">
        <i class="iconfont iconjiantou2" @click="$router.back()"></i>
        <i class="iconfont iconnew"></i>
      </div>
      <!-- 关注状态点击后为unfollow -->
      <div class="follow" v-if="detail.has_follow" @click="unfollow">已关注</div>
      <div class="unfollow" v-else @click="follow">关注</div>
    </div>
    <!-- 内容部分 -->
    <div class="main">
      <div class="title">{{detail.title}}</div>
      <div class="info">
        <span class="author">{{detail.user.nickname}}</span>
        <span class="time">{{detail.create_date | filter_time}}</span>
      </div>
      <!-- 视频类结构和新闻类结构 -->
      <!-- 如果type为2则为视频类结构 -->
      <!--
        防盗链:403错误
        防盗链的方式： 1. 加水印  2. 后台配置防盗链
        https://qsh5.cn/595.html
      -->
      <div class="video" v-if="detail.type === 2">
        <video :src="detail.content" controls></video>
      </div>
      <div class="content" v-else v-html="detail.content"></div>

      <!-- 点赞与微信分享 -->
      <div class="like_share">
        <div class="like">
          <i class="iconfont icondianzan" @click="like" :class="{'like_click': detail.has_like}"></i>
          <span>{{detail.like_length}}</span>
        </div>
        <div class="share">
          <i class="iconfont iconweixin"></i>
          <span>微信</span>
        </div>
      </div>
    </div>

    <!-- footer部分(静态结构) -->
    <div class="footer">
        <input type="text" placeholder="写跟帖">
        <div class="icon-comment">
          <i class="iconfont iconpinglun-"></i>
          <div class="count">{{detail.comment_length}}</div>
        </div>
        <i class="iconfont iconshoucang"></i>
        <i class="iconfont iconfenxiang"></i>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 由于先渲染html结构,而发送请求获取数据是异步的
      // 数据还没有获取到,就需要用到数据会报错
      // 添加一个属性user(对象),如果是属性没有应该是undefined
      detail: {
        user: {}
      },
      // 数据为0,显示暂无评论抢占沙发
      commentList: []
    }
  },
  async created () {
    await this.getDetail()
    this.getComment()
  },
  methods: {
    // 获取评论信息
    async getComment () {
      const id = this.detail.id
      const res = await this.$axios.get(`/post_comment/${id}`)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.commentList = data
      }
      console.log(res)
    },
    // 用于获取新闻详情
    async getDetail () {
      const id = this.$route.params.id
      // 发送请求获取数据
      const res = await this.$axios.get(`/post/${id}`)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.detail = data
      }
      console.log(this.detail)
    },
    // 用于关注和取消关注信息的获取(封装公共的部分)
    async getFollow (url) {
      const id = this.detail.user.id
      const res = await this.$axios.get(url + id)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.detail.has_follow = !this.detail.has_follow
        this.$toast.success(message)
      }
    },
    // 用于关注用户
    async follow () {
      // id值为作者的id
      // const id = this.detail.user.id
      // const res = await this.$axios.get(`/user_follows/${id}`)
      // console.log(res)
      // const { statusCode, message } = res.data
      // if (statusCode === 200) {
      //   // 跟新数据
      //   this.detail.has_follow = true
      //   this.$toast.success(message)
      // }
      this.getFollow(`/user_follows/`)
    },
    // 取消关注
    async unfollow () {
      // const id = this.detail.user.id
      // const res = await this.$axios.get(`/user_unfollow/${id}`)
      // const { statusCode, message } = res.data
      // if (statusCode === 200) {
      //   this.detail.has_follow = false
      //   this.$toast.success(message)
      // }
      this.getFollow(`/user_unfollow/`)
    },
    // 用于点赞用户
    async like () {
      // 点赞的id文章的id值
      const id = this.detail.id
      const res = await this.$axios.get(`/post_like/${id}`)
      console.log(res)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getDetail()
      }
    }
  },
  watch: {
    // 监听路由的变化,地址发生变化了,重新获取数据
    $route () {
      this.getDetail()
    }
  }
}
</script>

<style lang="scss" scoped>
.post-detail {
  padding-bottom: 50px;
}
.header {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  height: 50px;
  align-items: center;
  border-bottom: 1px solid #eee;
  .left {
    display: flex;
    line-height: 50px;
    i:first-child {
      font-weight: 700;
    }
    .iconnew {
      font-size: 50px;
    }
  }
  .follow,
  .unfollow {
    width: 60px;
    height: 26px;
    border: 1px solid #ccc;
    font-size: 14px;
    border-radius: 15px;
    line-height: 24px;
    text-align: center;
  }
  .follow {
    background-color: #ff0000;
    border: 1px solid #ff0000;
    color: #fff;
  }
}
.main {
  padding: 10px;
  border-bottom: 5px solid #e4e4e4;
  .title {
    font-size: 18px;
    font-weight: 700;
  }
  .info {
    padding: 5px 0px 15px;
    span:first-child {
      margin-right: 10px;
    }
  }
  .video {
    video {
      width: 100%;
    }
  }
  .like_share {
    display: flex;
    justify-content: space-evenly;
    padding: 10px 0;
    .like,
    .share {
      border: 1px solid #ccc;
      padding: 0 15px;
      height: 30px;
      // line-height: 28px;
      border-radius: 15px;
      display: flex;
      align-items: center;
      .iconweixin {
        color: #42d342
      }
      span {
        margin-left: 5px;
      }
    }
    .like_click {
      color: red;
    }
  }
}
// 底部区域
.footer {
  background-color: #fff;
  padding: 10px 10px;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  .iconfont {
    font-size: 18px;
  }
  input {
    width: 180px;
    height: 30px;
    background-color: #ddd;
    border-radius: 15px;
    text-indent: 2em;
  }
  .icon-comment {
    position: relative;
    .count {
      position: absolute;
      background-color: red;
      height: 16px;
      line-height: 16px;
      color: #fff;
      padding: 0 10px;
      border-radius: 8px 8px 8px 0;
      top: -6px;
      right: -16px;
    }
  }
}
</style>
