<template>
  <div class="tab-manager">
    <hm-header @click="$router.back()">栏目管理</hm-header>
    <div class="del-tab">
      <div class="title">点击删除以下频道</div>
      <ul class="tabs">
        <li @click="del(index)" v-for="(item, index) in activeTabs" :key="item.id">{{item.name}}</li>
      </ul>
    </div>
    <div class="add-tab">
      <div class="title">点击添加以下频道</div>
      <ul class="tabs">
        <li @click="add(index)" v-for="(item, index) in deactiveTabs" :key="item.id">{{item.name}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 用于存放激活的tab
      activeTabs: [],
      // 用于存放未激活的项目
      deactiveTabs: []
    }
  },
  created () {
    // 进行判断localStorage中没有数据就发送请求获取数据
    const activeTabs = JSON.parse(localStorage.getItem('activeTabs'))
    const deactiveTabs = JSON.parse(localStorage.getItem('deactiveTabs'))
    // console.log(deactiveTabs === true)
    // 严格的true和false
    if (deactiveTabs && activeTabs) {
      // 缓存中有数据就使用缓存中的数据
      this.activeTabs = activeTabs
      this.deactiveTabs = deactiveTabs
    } else {
      this.getTabList()
    }
  },
  methods: {
    async getTabList () {
      const res = await this.$axios.get(`/category`)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.activeTabs = data
        console.log(this.activeTabs)
      }
    },
    // 删除数据
    del (index) {
      // 至少保留三个数据
      if (this.activeTabs.length <= 3) {
        this.$toast.fail('至少保留三个')
        return
      }
      // 添加到下面
      this.deactiveTabs.push(this.activeTabs[index])
      // 删除该数据
      this.activeTabs.splice(index, 1)
    },
    // 添加数据
    add (index) {
      // 渲染的时候index会随着数据的变化而变化,会即时更新
      this.activeTabs.push(this.deactiveTabs[index])
      this.deactiveTabs.splice(index, 1)
    }
  },
  watch: {
    // activeTabs数据变化了,说明请求获取数据了(也就是localStorage中没有数据)
    // 还有在添加和删除时activeTabs数据会发生变化(即时改变localStorage中的数据)
    activeTabs () {
      // 将数据存储在localStorage中
      localStorage.setItem('activeTabs', JSON.stringify(this.activeTabs))
      localStorage.setItem('deactiveTabs', JSON.stringify(this.deactiveTabs))
    }
  }
}
</script>

<style lang="scss" scoped>
.del-tab,
.add-tab {
  padding: 10px;
  .title {
    font-size: 16px
  }
  .tabs {
    padding: 10px 10px 0;
    overflow: hidden;
    li {
      width: 60px;
      height: 30px;
      border: 1px solid #ddd;
      line-height: 28px;
      text-align: center;
      float: left;
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
}
</style>
