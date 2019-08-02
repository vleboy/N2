<template>
  <div class="home">
    <div class="top">
      <van-nav-bar
        title="佣金报表"
        left-arrow
        @click-left="onClickLeft"
        />
      <div class="detail">
        <div class="time">2019-05</div>
        <div class="btn">
          <van-button type="default" size="small">查询</van-button>
        </div>
      </div>
    </div>
    <div class="container">
      <div>
        <van-image
          width="100"
          height="100"
          :src="noData"
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
      noData: require('../../../assets/images/home/no_data.jpg')
    }
  },
  methods: {
    onClickLeft() {
      this.$router.push('home')
    }
  }
}
</script>


<style lang="less" scoped>
  .home {
    font-size: 16px;
    .top {
      box-sizing: border-box;
      background: #6cbfff;
      height: 130px;
      padding: 40px 16px;
      position: relative;
     
      .detail {
        box-sizing: border-box;
        padding: 8px 16px;
        height: 90px;
        background: #fff;
        position: absolute;
        width: 92%;
        bottom: -45px;
        border-radius: 5px;
        left: 50%;
        transform: translateX(-50%);
        box-shadow: 0px 8px 10px #bebebe;
        .time {
          text-align: center;
        }
        .btn {
          margin-top: 10px;
          display: flex;
          justify-content: center;
          .van-button {
            padding: 0 128px;
            border-radius: 15px;
            background: #52b1fa;
            color: #fff;
            height: 40px /* 40/16 */;
            line-height: 40px /* 40/16 */;
            font-size: 16px;
          }
        } 
      }
    }
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
    /*顶部导航*/
  .van-nav-bar {
    height: 50px;
    line-height: 50px;
    background: rgba(255,255,255,0);
    .van-icon {
      color: #fff;
      font-size: 19.2px; 
    }
    .van-nav-bar__title {
      color: #fff;
      font-size: 19.2px; 
    }
  }
  }

</style>
