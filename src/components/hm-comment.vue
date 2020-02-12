<template>
  <div class="hm-comment">
    <div class="com_top">
      <div class="avator">
        <img :src="$axios.defaults.baseURL + comment.user.head_img" alt="">
      </div>
      <div class="center">
        <div class="name">{{comment.user.nickname}}</div>
        <div class="time">{{comment.user.create_date | filter_time('YYYY-MM-DD HH:mm:ss')}}</div>
      </div>
      <div class="reply" @click="reply(comment.id, comment.user.nickname)">回复</div>
    </div>
    <!-- 回复楼层,并将parent数据传给子组件 -->
    <hm-floor @reply="reply" :index="index" v-if="comment.parent" :comment="comment.parent"></hm-floor>
    <div class="com_content">
      <p>{{comment.content}}</p>
    </div>
  </div>
</template>

<script>
import HmFloor from './hm-floor'
export default {
  data () {
    return {
      index: this.getIndex(0, this.comment)
    }
  },
  components: {
    HmFloor
  },
  props: {
    comment: Object
  },
  methods: {
    // 用于计算comment数据中的parent的层级
    getIndex (num, comment) {
      // 如果传递过来的comment有parent属性num++
      if (comment.parent) {
        return this.getIndex(num + 1, comment.parent)
      } else {
        return num
      }
    },
    // 用于回复评论
    reply (id, name) {
      console.log(id, name)
      this.$emit('reply', id, name)
    }
  }
}
</script>

<style lang="scss" scoped>
.hm-comment {
  padding: 20px 10px 10px;
  border-bottom: 1px solid #ddd;
  .com_top {
    display: flex;
    padding-bottom: 10px;
    .avator {
      img {
        width: 35px;
        height: 35px;
        border-radius: 50%;
      }
    }
    .center {
      flex: 1;
      margin-left: 10px;
      .name {
        font-size: 14px;
        color: #444;
      }
      .time {
        font-size: 12px;
        color: #666;
      }
    }
  }
  .com_content {
    padding-top: 10px;
    font-size: 14px;
    color: #444;
  }
}
</style>
