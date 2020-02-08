<template>
  <div class="hm-index">
    <div class="header">
      <div class="logo">
        <i class="iconfont iconnew"></i>
      </div>
      <div class="search">
        <i class="iconfont iconsearch"></i>
        <span>搜索新闻</span>
      </div>
      <div class="user" @click="$router.push('/profile')">
        <i class="iconfont iconwode"></i>
      </div>
    </div>

    <!-- tab栏,使用vant-ui的tab标签页 -->
    <!--
      参数说明:sticky(吸顶功能) animated(转场动画) swipeable(支持左右滑动)
      active:通过v-model动态绑定的这个数据,可以知道当前所在tab栏的位置
     -->
    <van-tabs v-model="active" sticky animated swipeable>
      <van-tab v-for="item in tabList" :key="item.id" :title="item.name">
        <!-- 通过item.postList渲染数据(封装组件将这个数据传给后台) -->
        <hm-post v-for="post in item.postList" :key="post.id" :post="post"></hm-post>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
// 局部注册post组件
import HmPost from '../components/hm-post'
export default {
  data () {
    return {
      active: localStorage.getItem('token') ? 1 : 0,
      tabList: []
    }
  },
  async created () {
    await this.getTabList()
    // 获取分类的内容列表是基于tab栏的数据的(需要等tab栏数据加载完之后,否则会报错)
    // 页面一进来加载默认tab的内容数据(之后切换的数据通过监听active来调用函数发送请求得到)
    this.getPostList()
  },
  components: {
    HmPost
  },
  methods: {
    // 获取tab栏的所有的分类
    async getTabList () {
      const res = await this.$axios.get('/category')
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.tabList = data
        // 给tabList中每一个对象都存储一个内容的数据(通过添加一个postList属性)
        this.tabList.forEach(item => {
          // item.postList = []
          // 但是直接在tabList数据被vue劫持之后添加的属性不是响应式的
          this.$set(item, 'postList', [])
        })
        // this.tabList = data
        console.log(this.tabList)

        // data.forEach(item => {
        //   item.postList = []
        // })
        // this.tabList = data
      }
    },
    // 获取当前分类下的内容数据
    async getPostList () {
      // 分类的id值
      const id = this.tabList[this.active].id
      const res = await this.$axios.get('/post', {
        params: {
          category: id
        }
      })
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        // 将获取到的数据存储到tabList中(保证数据的一一对应)
        this.tabList[this.active].postList = data
        console.log(this.tabList[this.active].postList)
      }
    }
  },
  // 使用watch监听active数据的变化,并获取所在的tab的内容数据
  watch: {
    active (value) {
      // console.log(this.active, value)
      // 在切换分类的时候, 需要重新获取数据
      // 值得注意的是:如果当前分类下有数据(说明先前已经发送过请求获取到了数据),就不需要再次发送请求了
      if (this.tabList[this.active].postList.length > 0) return
      this.getPostList()
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  height: 50px;
  line-height: 50px;
  background-color: #ff0000;
  display: flex;
  padding: 0 10px;
  text-align: center;
  color: #fff;
  .logo,
  .user {
    width: 50px;
  }
  .iconnew {
    font-size: 45px;
  }
  .iconsearch {
    font-size: 20px;
    position: relative;
    top: 2px;
  }
  .iconwode {
    font-size: 24px;
  }
  .search {
    flex: 1;
    height: 36px;
    margin-top: 7px;
    line-height: 36px;
    background-color: rgb(255, 255, 255, 0.5);
    border-radius: 18px;
    span {
      font-size: 14px;
      margin-left: 5px;
    }
  }
}
</style>
