<template>
  <div class="home">
    
    <van-nav-bar
      title="取款记录"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="container">
      <div>
        <van-image
          width="100"
          height="100"
          :src="noData"
          :show-loading="false"
        />
        <div class="msg">暂无相关数据</div>
        <van-button type="info" size="normal" plain>点击重试</van-button>
      </div>
    </div>  
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: true,
      noData: require('../../../assets/images/home/no_data.jpg')
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    }
  }
}
</script>


<style lang="less" scoped>
  .home {
    .container {
      display: flex;
      margin-top: 40%;
      justify-content: center;
      .msg {
        text-align:
        center;
        margin:15px 0;
        color: #888888;
      }
      .van-button {
        padding: 0 32px;
        border-radius: 20px;
        
      }
    }
  }
  /*顶部导航*/
  .van-nav-bar {
    height: 50px;
    line-height: 50px;
    .van-icon {
      color: #505050;
      font-size: 19.2px; 
    }
    .van-nav-bar__title {
      color: #505050;
      font-size: 19.2px; 
    }
  }

</style>
