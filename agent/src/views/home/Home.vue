<template>
  <div class="home">
    <div class="top">
      <div class="username">
        <van-image
            width="3.125rem"
            height="3.125rem"
            round
            src="https://img.yzcdn.cn/vant/cat.jpeg"
          />
        <p>早上好!</p>
        <p>ff88808</p>
      </div>
      <div class="amount">
        <p>净输赢(元)</p>
        <p>-1.32</p>
      </div>
      <div class="detail">
        <ul>
          <li>
            <p>0%</p>
            <p>佣金比例</p>
          </li>
          <li>
            <p>2</p>
            <p>下线用户</p>
          </li>
          <li>
            <p>2</p>
            <p>新注册</p>
          </li>
          <li>
            <p>1</p>
            <p>活跃用户</p>
          </li>
        </ul>
      </div>
    </div>
    <div class="container">
      <div class="list">
        <div @click="jump('/commissionReport')">
          <van-image
            width="3.125rem"
            height="3.125rem"
            :src="img_commission"
          />
          <div>佣金报表</div>
        </div>
        <div class="split"></div>
        <div @click="jump('/financeReport')">
          <van-image
            width="3.125rem"
            height="3.125rem"
            :src="img_financing"
          />
          <div>财务报表</div>
        </div>
      </div>
      <div class="list">
        <div @click="jump('/WithdrawalApplication')">
          <van-image
            width="3.125rem"
            height="3.125rem"
            :src="img_withdrawal"
          />
          <div>取款申请</div>
        </div>
        <div class="split"></div>
        <div>
          <van-image
            width="3.125rem"
            height="3.125rem"
            :src="img_user"
          />
          <div>用户信息</div>
        </div>
      </div>
      <div class="list">
        <div @click="jump('/news')">
          <van-image
            width="3.125rem"
            height="3.125rem"
            :src="img_info"
          />
          <div>消息</div>
        </div>
        <div class="split"></div>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      img_commission: require('../../assets/images/home/yongjin.png'),
      img_financing: require('../../assets/images/home/caiwu.png'),
      img_withdrawal: require('../../assets/images/home/qukuan.png'),
      img_user: require('../../assets/images/home/yonghu.png'),
      img_info: require('../../assets/images/home/xiaoxi.png')
    }
  },
  methods: {
    jump(name) {
      this.$router.push(name)
    }
  }
}
</script>


<style lang="less" scoped>
  .home {
    .top {
      box-sizing: border-box;
      background: #6cbfff;
      /* height: 220px; */
      height: 13.75rem;
      padding: 2.5rem /* 40/16 */ 1rem;
      position: relative;
      .username {
        display: flex;
        align-items: center;
        color: #fff;
        p {
          margin-left: .8rem;
        }
      }
      .amount {
        p {
          margin: 0;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          letter-spacing: 1px;
          &:first-child {
            font-size: .7rem;
            font-weight: normal;
          }
          &:last-child {
            font-size: 1.5rem;
            font-weight: bold;
            margin-top: 8px;
          }
        }
      }
      .detail {
        /* height: 70px; */
        height: 4.975rem;
        background: #fff;
        position: absolute;
        width: 92%;
        bottom: -35px;
        border-radius: 5px;
        left: 50%;
        transform: translateX(-50%);
        box-shadow: 0px 8px 10px #bebebe;
        ul {
          display: flex;
          height: 4.375rem;
          justify-content: space-around;
          align-items: center;
          li {
            p {
              margin: 0;
              text-align: center;
              &:first-child {
                font-size: 1.3rem;
                color: #20a0ff;
              }
              &:last-child {
                color: #c4c4c4;
                font-size: .8rem;
                margin-top: 2px;
              }
            }
          }
        }
      }
    }
    .container {
      box-sizing: border-box;
      margin-top: 65px;
      .list {
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: 0 1rem;
        margin-bottom: 40px;
        >div {
          text-align: center;
          /* margin: 0 2rem; */
          width: 7rem;
        }
      }
      .split {
        height: 2.5rem;
        width: 0.125rem !important;
        background: #eceaea;
        transform: scaleX(.4)
      }
    }
  }

</style>
