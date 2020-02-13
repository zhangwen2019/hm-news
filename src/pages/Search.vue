<template>
  <div class="hm-search">
    <!-- 头部 -->
    <div class="header">
      <div class="back" @click="back">
        <i class="iconfont iconjiantou"></i>
      </div>
      <div class="search">
        <i class="iconfont iconsearch"></i>
        <input ref="input" v-model="keyword" type="text" placeholder="请输入关键字">
      </div>
      <div class="search_name" @click="getSearchList">搜索</div>
    </div>
    <!--注意: v-if应该在包装组件的容器上 -->
    <div class="post_list" v-if="searchList.length > 0">
      <hm-post v-for="item in searchList" :key="item.id" :post="item"></hm-post>
    </div>
    <div class="content" v-else>
      <!-- 历史记录 -->
      <div class="history">
        <div class="title">历史记录</div>
        <ul class="info">
          <li v-for="item in history" :key="item" @click="clickSearch(item)">{{item}}</li>
        </ul>
      </div>
      <hr class="cross">
      <!-- 热门搜索 -->
      <div class="hotSearch">
        <div class="title">热门搜索</div>
        <ul class="info">
          <li v-for="item in hotKeywords" :key="item" @click="clickSearch(item)">{{item}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
// 导入hm-post组件
import HmPost from '../components/hm-post'
export default {
  data () {
    return {
      keyword: '',
      hotKeywords: ['说好不哭', '王祖贤', '性感', '关晓彤'],
      // 存放搜索的结果
      searchList: [],
      // 从缓存中获取搜索的历史记录
      history: JSON.parse(localStorage.getItem('history')) || []
    }
  },
  mounted () {
    // 页面加载完成之后需要自动获取焦点
    this.$refs.input.focus()
  },
  methods: {
    async getSearchList () {
      // 每次搜索应该将keyword关键字存储起来(可以放在请求获取成功之后)
      // 如果老数据中有新的搜索关键字,将老的删除掉,添加新的(保证新搜索的顺序在最前面)
      this.history.includes(this.keyword) && (() => { this.history = this.history.filter(item => item !== this.keyword) })()
      this.history.unshift(this.keyword)
      localStorage.setItem('history', JSON.stringify(this.history))
      const res = await this.$axios.get(`/post_search`, {
        params: {
          keyword: this.keyword
        }
      })
      const { statusCode, data } = res.data
      // 如果data中没有数据,直接提示没有数据
      data.length || (() => { this.$toast.fail('没有更多数据') })()
      if (statusCode === 200) {
        this.searchList = data
        console.log(this.searchList)
      }
    },
    clickSearch (item) {
      this.keyword = item
      this.getSearchList()
    },
    // 返回上一页
    back () {
      // 如果在搜索中(有关键字应该清空输入框,返回搜索页面,如果没有直接返回上一级)
      this.keyword || this.$router.back()
      this.keyword = ''
    }
  },
  components: {
    HmPost
  },
  watch: {
    // 监听keyword数据的变化(若数据为空,则将searchList数据清空)
    keyword (value) {
      value || (() => { this.searchList = [] })()
    }
  }
}
</script>

<style lang="scss" scoped>
.hm-search {
  // 头部
  .header {
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    height: 45px;
    align-items: center;
    .back,
    .search_name {
      width: 45px;
      text-align: center;
    }
    .search {
      flex: 1;
      border: 1px solid #ccc;
      height: 30px;
      border-radius: 15px;
      padding: 0 10px;
      display: flex;
      align-items: center;
      input {
        padding-left: 10px;
        font-size: 14px;
        color: #666;
        background-color: #f7f7f7;
      }
      .iconfont {
        position: relative;
        top: 2px;
      }
    }
  }
  .cross {
    margin: 10px;
  }
  .content {
    .history,
    .hotSearch {
      padding: 10px;
      .title {
        font-size: 14px;
        font-weight: 700;
      }
      .info {
        padding-top: 10px;
        overflow: hidden;
        li {
          float: left;
          padding: 5px 10px;
        }
      }
    }
  }
}
</style>
