<template>
  <div class="hm-comment">
    <hm-header @click="$router.go(-1)">我的跟帖</hm-header>
    <!-- 重点: 处理分页 -->
    <!--
      使用van-list组件可以有下拉更多的数据的功能(常用于移动端的分页)
      它包裹的内容可以任意指定
      1.导入van-list组件

      2.设置pageIndex和pageSize并在get请求中带入数据(params)

      3.List组件可以通过loading和finished两个变量控制,滚动到底部时触发load事件将loading设置为true
        此时发起异步操作更新数据,更新完成后loading设置为false即可,全部加载完成后finished设置为true

      4. immediate-check: 关闭页面加载立即触发load事件
     -->
     <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :immediate-check="false"
        @load="onLoad"
        :offset="50"
      >
        <div class="item" v-for="item in commentList" :key="item.id">
          <!-- 过滤时间 -->
          <div class="time">{{item.create_date | filter_time('YYYY-MM-DD HH:mm')}}</div>
          <!-- 父级的跟帖 -->
          <div class="parent" v-if="item.parent">
            <p>回复: {{item.parent.user.nickname}}</p>
            <p>{{item.parent.content}}</p>
          </div>
          <div class="content">{{item.content}}</div>
          <div class="origin">
            <span class="one-txt-cut">原文:{{item.post.title}}</span>
            <span><i class="iconfont iconjiantou1"></i></span>
          </div>
        </div>
      </van-list>
  </div>
</template>

<script>
export default {
  data () {
    return {
      commentList: [],
      // 当前页
      pageIndex: 1,
      // 每页的条数
      pageSize: 5,
      // 指定加载状态
      loading: false,
      // 是否加载完成
      finished: false
    }
  },
  created () {
    this.getCommentList()
  },
  methods: {
    // 封装获取跟帖列表的函数
    async getCommentList () {
      // 注意:如果是put和post请求,数据通过data进行提供
      // 如果是get请求,数据要通过params来提供
      const res = await this.$axios.get(`/user_comments`, {
        params: {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      })
      // console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        // this.commentList = data
        // 数据的拼接
        this.commentList = [...this.commentList, ...data]
        // 当数据加载完成,需要把loading重新改为false,才能出发下一次的加载(不然会一直在加载中状态)
        this.loading = false
        // 当没有更多的数据了,需要把finished改为true,就不会继续加载了
        // 通过读取到的条数 < pageSize,即没有更多的数据
        if (data.length < this.pageSize) {
          this.finished = true
        }
        console.log(this.commentList)
      }
    },
    onLoad () {
      console.log('到底了需要加载数据了')
      setTimeout(() => {
        this.pageIndex++
        // 重新发送请求,加载下一页的数据(需要拼接到原来的数据中)
        this.getCommentList()
      }, 2000)
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  border-bottom: 1px solid #ccc;
  padding: 10px 20px;
  line-height: 30px;
  .parent {
    padding: 10px;
    line-height: 25px;
    background-color: #ddd;
    border-radius: 5px;
  }
  .time {
    color: #888;
    font-size: 14px;
  }
  .origin {
    font-size: 14px;
    color: #888;
    display: flex;
    span:first-child {
      flex: 1;
    }
    span:last-child {
      width: 30px;
    }
  }
  .content {
    font-size: 14px;
    color: #444;
  }
}
</style>
