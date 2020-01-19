<template>
  <div class="hm-header">
    <div class="back" @click="handleClick">
      <i class="iconfont iconjiantou2"></i>
    </div>
    <div class="center"><slot></slot></div>
    <div class="right"></div>
  </div>
</template>

<script>
export default {
  methods: {
    handleClick (e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="scss" scoped>
.hm-header {
  display: flex;
  height: 45px;
  line-height: 45px;
  text-align: center;
  border-bottom: 1px solid #ddd;
  .back,
  .right {
    width: 45px;
  }
  .center {
    flex: 1;
    font-weight: 700;
    font-size: 14px;
  }
}
</style>
