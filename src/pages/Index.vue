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
        <!-- 使用pull-refresh组件实现下拉刷新效果 -->
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <!-- 使用List组件实现加载数据效果 -->
          <!--
            loading:加载的状态,直接给一个通用的loading
            finished:加载是否完成,应该加给每一个tab
            immediate-check:初始化不触发load事件
          -->
          <van-list
            v-model="loading"
            :finished="item.finished"
            finished-text="没有更多了"
            :offset="50"
            @load="onLoad"
            :immediate-check="false"
          >
            <!-- 通过item.postList渲染数据(封装组件将这个数据传给后台) -->
            <hm-post v-for="post in item.postList" :key="post.id" :post="post"></hm-post>
          </van-list>
        </van-pull-refresh>
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
      tabList: [],
      loading: false,
      // 分页,每个tab的size可以设定一样的,但是pageIndex应该每个tab有自己的
      pageSize: 5,
      // 是否在下拉刷新状态
      isLoading: false
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
        // this.tabList = data
        // // 给tabList中每一个对象都存储一个内容的数据(通过添加一个postList属性)
        // this.tabList.forEach(item => {
        //   // item.postList = []
        //   // 但是直接在tabList数据被vue劫持之后添加的属性不是响应式的
        //   this.$set(item, 'postList', [])
        // })
        // // this.tabList = data
        // console.log(this.tabList)

        data.forEach(item => {
          item.postList = []
          // 每个tab有自己的finished属性,每页是否加载完不一定是一样的
          item.finished = false
          // 每个tab都有自己的pageIndex,记录了它加载到了第几页
          item.pageIndex = 1
        })
        this.tabList = data
      }
    },
    // 获取当前分类下的内容数据
    async getPostList () {
      // 分类的id值
      const id = this.tabList[this.active].id
      const res = await this.$axios.get('/post', {
        params: {
          category: id,
          pageIndex: this.tabList[this.active].pageIndex,
          pageSize: this.pageSize
        }
      })
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        // 将获取到的数据存储到tabList中(保证数据的一一对应)
        this.tabList[this.active].postList = [...this.tabList[this.active].postList, ...data]
        // 得到数据后,将加载的状态改为false
        this.loading = false
        // 关闭下拉刷新
        setTimeout(() => {
          this.isLoading = false
        }, 1000)
        // 判断是否还有更多的数据(请求的到的数据条数小于每页的条数)
        if (data.length < this.pageSize) {
          this.tabList[this.active].finished = true
        }
        console.log(this.tabList[this.active].postList)
      }
    },
    // 上拉加载更多的事件函数
    onLoad () {
      console.log('触发了')
      // 发送请求加载更多的数据(下一页的数据)

      // 有一个问题在finished为true时任然触发load事件(需要手动处理)
      if (this.tabList[this.active].finished) return
      this.tabList[this.active].pageIndex++
      this.getPostList()
    },

    /*
      ***重要点:
      在下拉刷新数据之前重置数据一定要loading状态改为true,同样active改变了,
      也是在加载数据,需要将loading状态改为true,表示处于加载的状态
    */

    // 下拉刷新的事件函数
    onRefresh () {
      console.log('下拉刷新')
      // 重置所有的状态
      this.loading = true
      this.tabList[this.active].pageIndex = 1
      this.tabList[this.active].postList = []
      this.tabList[this.active].finished = false
      // 重新获取数据
      this.getPostList()
    }
  },
  // 使用watch监听active数据的变化,并获取所在的tab的内容数据
  watch: {
    active (value) {
      // loading状态改为true(属于切换tab栏,使得loading为true,处于加载状态)
      this.loading = true
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
