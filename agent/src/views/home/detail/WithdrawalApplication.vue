<template>
  <div class="home">
    <div class="top">
      <van-nav-bar
        title="取款申请"
        right-text="取款记录"
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
        :border="false"
        />
        <p style="font-size:.7rem">可取款金额</p>
        <van-row style="margin-bottom:.5rem;">
          <van-col span="7"></van-col>
          <van-col span="10" style="text-align:center;color:#fff;font-size:1.4rem;">0.00</van-col>
          <van-col span="7"></van-col>
        </van-row>
        <van-row align="center">
          <van-col span="7" style="text-align:center;color:#fff;font-size:0.8rem;">
            <div>0.00</div>
            <div>锁定钱包</div>
          </van-col>
          <van-col span="10" style="text-align:center;color:#fff;font-size:0.8rem;">
            <div>2019-06</div>
            <div>发放月份</div>
          </van-col>
          <van-col span="7" style="text-align:center;color:#fff;font-size:0.8rem;">
            <div>0.00</div>
            <div>合计</div>
          </van-col>
        </van-row>
    </div>
    <div class="container">
      <van-tabs v-model="active" title-active-color="#20a0ff" color="#20a0ff">
        <van-tab title="提款至银行卡">
          <div class="add">
            <div>
              <van-icon name="plus" />
              <div>点击添加银行卡</div>
            </div>
          </div>
          <div class="sub">
            <van-button disabled type="info" size="large">提交申请</van-button>
          </div>
        </van-tab>
        <van-tab title="提款至中心钱包">内容 2</van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 2,
      noData: require('../../../assets/images/home/no_data.jpg')
    }
  },
  methods: {
    onClickLeft() {
      this.$router.push('home')
    },
    onClickRight() {
      this.$router.push('WithdrawalRecord')
    }
  }
}
</script>


<style lang="less" scoped>
  .home {
    .top {
      box-sizing: border-box;
      background: #6cbfff;
      height: 11rem;
      position: relative;
      padding-top: 10px;
      box-sizing: border-box;
      p {
        margin: 0;
        color: #fff;
        text-align: center;
        margin-bottom: .5rem;
      }
      .detail {
        display: flex;
        justify-content: space-around;
        color: #fff;
        div {
          text-align: center;
          font-size: .8rem;
        }
      }
    }
    .container {
      .add {
        padding: 1rem;
        >div {
          background: rgb(230, 230, 230);
          height: 5rem;
          text-align: center;
          color: rgb(201, 201, 201);
          box-sizing: border-box;
          padding: 1rem 0;
        }
      }
      .sub {
        position: fixed;
        width: 100%;
        box-sizing: border-box;
        padding: 0 1rem;
        height:5rem;
        bottom: 0;
        background:rgb(230, 230, 230);
        .van-button {
          border-radius: 20px;
        } 
      }
    }
    /*顶部导航*/
  .van-nav-bar {
    height: 50px;
    line-height: 50px;
    background: rgba(255,255,255,0);
    .van-nav-bar__text {
      color: #fff;
 
    }
    .van-icon {
      color: #fff;
      font-size: 1.2rem; 
    }
    .van-nav-bar__title {
      color: #fff;
      font-size: 1.2rem; 
    }
  }
  }

</style>
