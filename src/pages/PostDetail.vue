<template>
  <div class="post-detail">
    <!-- 头部区域 -->
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

    <!-- 评论区域 -->
    <div class="post-comment">
      <h2 class="comment_title">精彩跟帖</h2>
      <div class="comment_content">
        <p v-if="isShowComment">暂无跟帖,抢占沙发</p>
        <!-- 可以通过计算hm-comment组件的高度累加起来,达到一定的值显示加载更多(点击跳转精彩跟帖页面) -->
        <hm-comment v-else v-for="item in commentList" :key="item.id" :comment="item" @reply="reply"></hm-comment>
      </div>
    </div>

    <!-- footer部分(静态结构) -->
    <div class="footer">
        <!-- 默认结构 -->
        <div class="comment-input" v-if="!isFocus">
          <input type="text" placeholder="写跟帖" @focus="handleFocus">
          <div class="icon-comment">
            <i class="iconfont iconpinglun-"></i>
            <!-- 评论人数超过99显示99+ -->
            <div class="count">{{commentLength}}</div>
          </div>
          <i class="iconfont iconshoucang" @click="collect" :class="{'star_click': detail.has_star}"></i>
          <i class="iconfont iconfenxiang"></i>
        </div>

        <!-- 发表评论结构 -->
        <div class="commemt-textarea" v-else>
          <textarea ref="textarea" v-model="content" rows="3" :placeholder="placeholder" @blur="handleBlur"></textarea>
          <div class="send" @click="send">发送</div>
        </div>
    </div>
  </div>
</template>

<script>
import HmComment from '../components/hm-comment'
export default {
  components: {
    HmComment
  },
  data () {
    return {
      // 由于先渲染html结构,而发送请求获取数据是异步的
      // 数据还没有获取到,就需要用到数据会报错
      // 添加一个属性user(对象),如果是属性没有应该是undefined
      detail: {
        user: {}
      },
      // 数据为0,显示暂无评论抢占沙发
      commentList: [],
      // 是否显示文本域
      isFocus: false,
      placeholder: '',
      // 回复别人的id值
      parentId: '',
      // 文本域的内容
      content: ''
    }
  },
  computed: {
    isShowComment () {
      return this.commentList.length === 0
    },
    // 评论人数的判断
    commentLength () {
      const count = this.detail.comment_length
      return count < 99 ? count : '99+'
    }
  },
  async created () {
    await this.getDetail()
    // 获取评论的id基于了getDetail的数据
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
      console.log(this.commentList)
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
    follow () {
      this.getFollow(`/user_follows/`)
    },
    // 取消关注
    unfollow () {
      this.getFollow(`/user_unfollow/`)
    },
    // 用于点赞和收藏封装
    async like_collect (url) {
      const id = this.detail.id
      const res = await this.$axios.get(url + id)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getDetail()
      }
    },
    // 用于点赞用户
    like () {
      this.like_collect(`/post_like/`)
    },
    // 用于收藏
    async collect () {
      this.like_collect(`/post_star/`)
    },
    // 用于显示输入文本域
    async handleFocus () {
      this.placeholder = '发布评论'
      // 对于文章发布评论不需要parentId(send函数可以封装,在发布评论和回复中调用决定是否用到parentId)
      this.parentId = ''
      this.isFocus = true
      // 并且让textarea自动获取焦点,调用focus()方法即可(操作dom使用ref知识点)
      // 存在dom的异步更新问题(等待dom跟新完)
      await this.$nextTick()
      // console.log(this.$refs)
      this.$refs.textarea.focus()
    },
    // 失去焦点
    handleBlur () {
      // 判断双向绑定的文本域内容是否有值content
      // 这种做法还是不够好
      if (this.content) return
      this.isFocus = false
    },
    // 用于回复评论
    async reply (id, name) {
      this.placeholder = `回复:@${name}`
      this.parentId = id
      this.isFocus = true
      await this.$nextTick()
      this.$refs.textarea.focus()
    },
    // 发送(最好区分文章评论和回复的发送(后台需要的数据不同,渲染需要的数据有所不同))
    // 在comment_length上面
    // 如果不采用更新this.detail()comment_length通过commentList.length计算得来还是不行
    // 后台不应该一次性将所有的数据返回(后台应该在commentList数据中加上comment_length和detail数据类似)
    async send () {
      // 存在一个问题(send函数还没有执行,文本域就失焦了,文本域就被隐藏了)
      // 可以根据文本域是否有内容,决定隐藏文本域
      const id = this.detail.id
      const res = await this.$axios.post(`/post_comment/${id}`, {
        content: this.content,
        parent_id: this.parentId
      })
      // console.log(res)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.isFocus = false
        this.content = ''
        this.parentId = ''
        this.getComment()
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
/**
 * 问题:
 * 1.文本域的失焦问题
 * 2.递归组件的border-bottom重叠的问题
 * 3.commentList数据中应该有comment_length属性
 * 4.视频详情的url未定义问题
 * 5.post-detail的padding-bottom应该随着footer的高度变化
 * 6.keep-alive(返回到首页会重置到头条tab栏的初始状态,状态未保留)
 */
</script>

<style lang="scss" scoped>
.post-detail {
  padding-bottom: 100px;
  padding-top: 50px;
}
// 头部
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
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
// 主体
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
// 评论区域
.post-comment {
  padding-top: 10px;
  .comment_title {
    padding-top: 10px;
    text-align: center;
    font-size: 20px;
    color: #444;
  }
  .comment_content {
    p {
      height: 80px;
      line-height: 80px;
      text-align: center;
      font-size: 14px;
      color: #ccc;
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
  width: 100%;
  .comment-input {
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
        // 不能用right,否则从一位数到两位数会向左边挤(保证往右边挤)
        // right: -16px;
        left: 10px;
      }
    }
    .star_click {
      color: red;
    }
  }
  .commemt-textarea {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding-right: 20px;
    textarea {
      width: 240px;
      height: 70px;
      background-color: #d7d7d7;
      border-radius: 10px;
      padding: 10px;
    }
    .send {
      width: 60px;
      height: 26px;
      line-height: 26px;
      background-color: red;
      color: #fff;
      text-align: center;
      border-radius: 13px;
    }
  }
}
</style>
