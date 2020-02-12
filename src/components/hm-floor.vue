<template>
  <div>
    <!-- 递归组件,自己调用(通过name属性)(并将parent数据传递给子组件) -->
    <hm-floor @reply="reply" :index="index-1" v-if="comment.parent" :comment="comment.parent"></hm-floor>
    <div class="hm-floor no_border">
      <div class="title">
        <div class="name">{{index}} {{comment.user.nickname}}</div>
        <div class="time">{{comment.create_date | filter_time('YYYY-MM-DD HH:mm:ss')}}</div>
        <div class="reply" @click="reply(comment.id, comment.user.nickname)">回复</div>
      </div>
      <div class="content">{{comment.content}}</div>
    </div>
  </div>
</template>

<script>
export default {
  // 使用递归组件需要使用到name
  created () {
    console.log(this.$parent)
  },
  name: 'hm-floor',
  props: {
    comment: Object,
    index: Number
  },
  methods: {
    reply (id, name) {
      this.$emit('reply', id, name)
    }
  }
}
</script>

<style lang="scss" scoped>
.hm-floor {
  border: 1px solid #ddd;
  &.no_border {
    border-bottom: none;
  }
  padding: 10px;
  .title {
    display: flex;
    align-items: flex-end;
    .name {
      font-size: 14px;
      color: #555;
    }
    .time {
      flex: 1;
      margin-left: 10px;
    }
  }
  .content {
    font-size: 14px;
    padding: 10px 0;
  }
}
</style>
