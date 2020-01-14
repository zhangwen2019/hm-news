<template>
  <div class="input_box">
    <!-- :class自定义属性如果是多个的话,可以采用数组的方式-->
    <!-- 当在表单中输入内容的时候,触发input的事件,并将事件对象中value值传给父组件,然后父组件通过得到的值再次通过:value绑定给子组件 -->
    <input :type="type" :class="status" :placeholder="placeholder" :value="value" @input="handleInput">
    <span v-show="showTips" class="tips">{{errMsg}}</span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 表单校验的状态
      status: ''
    }
  },
  // 接收父组件传递的信息
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    value: {
      type: String,
      default: ''
    },
    // 接收表单校验规则(正则)
    rules: {
      type: RegExp,
      required: true
    },
    errMsg: {
      type: String,
      default: '你输入的格式有误'
    }
  },
  methods: {
    handleInput (e) {
      // console.log(e.target.value)
      // 将信息传给父组件,让父组件去改这个value值(顺带事件对象e也传过去)
      // 触发v-model语法糖中的@input事件
      const { value } = e.target
      this.$emit('input', value)

      if (!this.rules) return

      if (this.rules.test(this.value)) {
        this.status = 'success'
      } else {
        this.status = 'error'
        // 格式验证错误,就不应该发送请求了
      }
    }
  },
  computed: {
    showTips () {
      return this.status === 'error'
    }
  }
}
</script>

<style lang="scss" scoped>
.input_box {
  padding-bottom: 15px;
  // 给span定位到父盒子的padding-bottom中,以免隐藏显示导致input框的移动
  position: relative;
  input {
    width: 100%;
    height: 100%;
    background-color: transparent;
    border-bottom: 1px solid #666;
    padding-bottom: 5px;
    font-size: 18px;
    &.error {
      border-bottom-color: red;
    }
    &.success {
      border-bottom-color: green;
    }
  }
  .tips {
    color: red;
    position: absolute;
    bottom: 0;
    left: 0;
  }
}
</style>
