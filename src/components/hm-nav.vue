<template>
  <div class="item" @click="handleClick">
    <div class="left">{{name}}</div>
    <div class="center">{{desc}}</div>
    <div class="icon">
      <i class="iconfont iconjiantou1"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleClick (e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="scss" scoped>
  .item {
    height: 50px;
    line-height: 50px;
    display: flex;
    border-bottom: 1px solid #ddd;
    .left {
      font-size: 14px;
      color: #333;
    }
    .center {
      flex: 1;
      color: #999;
      text-align: right;
      // padding-right: 10px;
    }
    .icon {
      width: 30px;
      text-align: right;
      i {
        font-size: 16px;
      }
    }
  }
</style>
