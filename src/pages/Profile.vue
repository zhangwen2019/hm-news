<template>
  <div class="hm-profile">
    <div class="pro-title" @click="editProfile">
      <div class="avator">
        <img v-show="loading" :src="avator" alt="">
      </div>
      <div class="info">
        <p>
          <i v-if="profile.gender===1" class="iconfont iconxingbienan"></i>
          <i v-else class="iconfont iconxingbienv"></i>
          <span>{{profile.username}}</span>
        </p>
        <!-- 使用过滤器以及moment包过滤时间 -->
        <p>{{profile.create_date | filter_time}}</p>
      </div>
      <div class="icon">
        <i class="iconfont iconjiantou1"></i>
      </div>
    </div>
    <div class="pro-list">
      <hm-nav name="我的关注" @click="follow" desc="关注的用户"></hm-nav>
      <hm-nav name="我的跟帖" @click="comment" desc="跟帖/回复"></hm-nav>
      <hm-nav name="我的收藏" desc="文章/视频"></hm-nav>
      <hm-nav name="设置" @click="editProfile"></hm-nav>
      <hm-nav name="退出登录" @click="logout"></hm-nav>
    </div>
  </div>
</template>

<script>
// 坑:如果在字符串中提供图片的地址，发现图片没有被解析，解决方案(直接引包的方式导入图片,有缺点)
import img from '../assets/logo.png'
export default {
  methods: {
    editProfile (e) {
      // console.log(e)
      // 编辑个人信息资料(跳转到edit界面)
      this.$router.push('/edit-profile')
    },
    follow () {
      this.$router.push('/follow')
    },
    comment () {
      console.log(111)
      this.$router.push('/comment')
    },
    async logout () {
      // 清除token数据即可
      try {
        await this.$dialog.confirm({
          title: '温馨提示',
          message: '你确定要退出吗?'
        })
        // 删除token信息和user_id,跳转到login界面,给个提示
        localStorage.removeItem('token')
        localStorage.removeItem('user_id')
        this.$router.push('/login')
        this.$toast.success('退出成功')
      } catch {
        // console.log(22)
        this.$toast('操作取消')
      }
      // .then(() => {
      //   console.log(11)
      // }).catch(() => {
      //   console.log('22')
      // })
      // 不使用.then和.catch,用async和await,try和catch
    }
  },
  data () {
    return {
      profile: {},
      loading: false
    }
  },
  computed: {
    avator () {
      if (this.profile.head_img) {
        // 拼接是因为,后端给的路径不是完整的,需要加上baseURL
        return this.$axios.defaults.baseURL + this.profile.head_img
      } else {
        return img
      }
    }
  },
  // 在页面创建之前需要进行权限校验，需要发送请求的时候增加一个请求头，
  // 将token传给后台，进行token校验（通过算法计算比对，是否是之前的token）Authorization: token
  async created () {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('user_id')
    const res = await this.$axios.get(`/user/${userId}`, {
      headers: {
        Authorization: token
      }
    })
    console.log(res)
    this.profile = res.data.data
    // 解决图片的闪动问题
    // 当请求的数据返回的时候,将图片显示
    this.loading = true
  }
}
</script>

<style lang="scss" scoped>
  .hm-profile {
    .pro-title {
      padding: 20px;
      display: flex;
      border-bottom: 5px solid #e4e4e4;
      .avator {
        width: 70px;
        height: 70px;
        img{
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .info {
        padding-left: 20px;
        padding-top: 10px;
        flex: 1;
        p:first-child {
          height: 30px;
          line-height: 30px;
          font-size: 16px;
          color: #000;
          .iconxingbienan {
            color: skyblue
          }
          .iconxingbienv {
            color: pink;
          }
        }
        p:last-child {
          color: #ccc;
          font-size: 14px;
        }
      }
      .icon {
        width: 30px;
        text-align: right;
        i {
          font-size: 20px;
          line-height: 70px;
        }
      }
    }
    .pro-list {
      padding: 0 20px;
    }
  }
</style>
