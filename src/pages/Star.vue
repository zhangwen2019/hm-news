<template>
  <div class="hm-star">
    <hm-header @click="$router.go(-1)">我的收藏</hm-header>
    <hm-post v-for="item in starList" :key="item.id" :post="item"></hm-post>
  </div>
</template>

<script>
// 导入hm-post组件
import HmPost from '../components/hm-post'
export default {
  data () {
    return {
      starList: []
    }
  },
  created () {
    this.getStarList()
  },
  methods: {
    async getStarList () {
      const res = await this.$axios.get('/user_star')
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        // 跟帖的人数没有计算(在数劫持之前添加属性comment_length,计算出来)
        // 或则通过计算属性动态的计算
        data.forEach(item => {
          item.comment_length = item.comments.length
        })
        this.starList = data
        console.log(this.starList)
      }
    }
  },
  components: {
    HmPost
  }
}
</script>

<style lang="scss" scoped>
.item {
  padding: 15px 10px;
  display: flex;
  border-bottom: 1px solid #ccc;
  .info {
    flex: 1;
    height: 70px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .title {
      font-size: 16px;
      color: #444;
    }
    .bottom {
      font-size: 12px;
      color: #666;
      span:last-child {
        margin-left: 10px;
      }
    }
  }
  .picture {
    img {
      object-fit: cover;
      width: 120px;
      height: 70px;
    }
  }
}
</style>
