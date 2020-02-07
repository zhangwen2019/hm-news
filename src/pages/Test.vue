<template>
  <div class="test">
    <vueCropper
      ref="cropper"
      :img="option.img"
      :autoCrop="option.autoCrop"
      :autoCropWidth="option.autoCropWidth"
      :autoCropHeight="option.autoCropHeight"
      :fixed="option.fixed"
      :fixedNumber="option.fixedNumber">
    </vueCropper>
    <img :src="src" alt="">
    <!-- 确定裁剪 -->
    <van-button type="primary" @click="crop">确定裁剪图片</van-button>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
import img from '../assets/logo.png'
export default {
  components: {
    VueCropper
  },
  data () {
    return {
      src: '',
      option: {
        img: img, // 这个img应该要是上传的那张图片，只不过现在我写死了
        // info: true, // 裁剪框的大小信息
        // outputSize: 1, // 裁剪生成图片的质量
        // outputType: 'jpeg', // 裁剪生成图片的格式
        // canScale: false, // 图片是否允许滚轮缩放(移动端不支持)
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 150, // 默认生成截图框宽度
        autoCropHeight: 150, // 默认生成截图框高度
        fixed: false, // 是否开启截图框宽高固定比例
        fixedNumber: [4, 4] // 截图框的宽高比例
      }
    }
  },
  methods: {
    crop () {
      console.log(this.$refs.cropper)
      this.$refs.cropper.getCropData((imgData) => {
        // do something
        console.log(imgData)
        this.src = imgData
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.test {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 999;
  top: 0;
  left: 0;
}
.van-button {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}
</style>
