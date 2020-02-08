<template>
  <div class="hm-post">
    <!-- 根据数据的不同显示不同结构 -->

    <!-- type值为2,则为视频结构的内容 -->
    <div class="video-post" v-if="post.type === 2">
      <div class="title txt-cut">{{post.title}}</div>
      <div class="video">
        <img :src="post.cover[0].url" alt="">
        <i class="iconfont iconshipin"></i>
      </div>
      <div class="bottom">
        <span class="origin">{{post.user.nickname}}</span>
        <span class="count">{{post.comment_length}}跟帖</span>
      </div>
    </div>
    <!-- 单张图片的结构 -->
    <div class="single-img-post" v-else-if="post.cover.length < 3">
      <div class="info">
        <div class="title txt-cut">{{post.title}}</div>
        <div class="bottom">
          <span class="origin">{{post.user.nickname}}</span>
          <span class="count">{{post.comment_length}}跟帖</span>
        </div>
      </div>
      <div class="picture">
        <img :src="post.cover[0].url" alt="">
      </div>
    </div>

    <!-- 多张图片的结构 -->
    <div class="multiple-img-post" v-else>
      <div class="title txt-cut">{{post.title}}</div>
      <div class="imgs">
        <img v-for="item in post.cover" :key="item.id" :src="item.url" alt="">
      </div>
      <div class="bottom">
        <span>{{post.user.nickname}}</span>
        <span>{{post.comment_length}}跟帖</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    post: Object
  }
}
</script>

<style lang="scss" scoped>
.hm-post {
  .title {
    font-size: 14px;
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
.single-img-post {
  padding: 10px;
  display: flex;
  border-bottom: 1px solid #ccc;
  .info {
    flex: 1;
    height: 70px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .picture {
    img {
      object-fit: cover;
      width: 120px;
      height: 70px;
    }
  }
}
.multiple-img-post {
  padding: 10px;
  border-bottom: 1px solid #ccc;
  .imgs {
    display: flex;
    justify-content: space-around;
    padding: 10px 0;
    img {
      width: 110px;
      height: 75px;
      object-fit: cover;
    }
  }
}
.video-post {
  padding: 10px;
  border-bottom: 1px solid #ccc;
  .video {
    position: relative;
    margin: 10px 0;
    img {
      display: block;
    }
    .iconshipin {
      width: 50px;
      height: 50px;
      border-radius: 50px;
      background-color: rgba(0, 0, 0, .4);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #fff;
      font-size: 32px;
      line-height: 50px;
      text-align: center;
    }
  }
}
</style>
