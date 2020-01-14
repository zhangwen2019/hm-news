<template>
  <button class="btn_box" @click="handleClick">
    <!-- 使用插槽:开发者在不同的使用场景,button中所展示的内容是有所不同的 -->
    <slot></slot>
  </button>
</template>

<script>
export default {
  methods: {
    handleClick (e) {
      // 触发父组件的click事件
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="scss" scoped>
  .btn_box {
    width: 100%;
    display: block;
    background-color: #cc3300;
    height: 48px;
    line-height: 48px;
    color: #fff;
    text-align: center;
    border-radius: 24px;
    font-size: 18px;
  }
</style>
