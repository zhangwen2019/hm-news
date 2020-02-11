<template>
  <div>
    <!-- 递归组件,自己调用(通过name属性)(并将parent数据传递给子组件) -->
    <hm-floor :index="index-1" v-if="comment.parent" :comment="comment.parent"></hm-floor>
    <div class="hm-floor">
      <div class="title">
        <div class="name">{{index}} {{comment.user.nickname}}</div>
        <div class="time">{{comment.create_date | filter_time('YYYY-MM-DD HH:mm:ss')}}</div>
        <div class="reply">回复</div>
      </div>
      <div class="content">{{comment.content}}</div>
    </div>
  </div>
</template>

<script>
export default {
  // 使用递归组件需要使用到name
  name: 'hm-floor',
  props: {
    comment: Object,
    index: Number
  }
}
</script>

<style lang="scss" scoped>
.hm-floor {
  border: 1px solid #ddd;
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
