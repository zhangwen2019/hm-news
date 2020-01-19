<template>
  <div class="hm-back">
    <!-- 返回上一级的组件使用具名插槽(每个返回的按钮的字体图标都不一样) -->
    <slot name="icon"></slot>
  </div>
</template>

<script>
export default {
}
</script>

<style>
/* 样式怎么使用父组件传进来的信息 */
.hm-back i {
  font-size: 27px;
}
</style>
