<template>
  <div class="home">
    <div class="top">
      <div class="username">
        <van-image
            :show-loading="false"
            round
            src="https://img.yzcdn.cn/vant/cat.jpeg"
          />
        <p>早上好!</p>
        <p>ff88808</p>
      </div>
      <div class="amount">
        <p>净输赢(元)</p>
        <p>{{dataList.currentProfit}}</p>
      </div>
      <div class="detail">
        <ul>
          <li>
            <p>{{dataList.modeValue}}%</p>
            <p>佣金比例</p>
          </li>
          <li>
            <p>{{dataList.playerCount}}</p>
            <p>下线用户</p>
          </li>
          <li>
            <p>{{dataList.newRegPlayerCount}}</p>
            <p>新注册</p>
          </li>
          <li>
            <p>{{dataList.activePlayerCount}}</p>
            <p>活跃用户</p>
          </li>
        </ul>
      </div>
    </div>
    <div class="container">
      <div class="list">
        <div @click="jump('/commissionReport')">
          <van-image
            :show-loading="false"
            :src="img_commission"
          />
          <div>佣金报表</div>
        </div>
        <div class="split"></div>
        <div @click="jump('/financeReport')">
          <van-image
           :show-loading="false"
            :src="img_financing"
          />
          <div>财务报表</div>
        </div>
      </div>
      <div class="list">
        <div @click="jump('/withdrawalApplication')">
          <van-image
           :show-loading="false"
            :src="img_withdrawal"
          />
          <div>取款申请</div>
        </div>
        <div class="split"></div>
        <div @click="jump('/userInfo')">
          <van-image
            :show-loading="false"
            :src="img_user"
          />
          <div>玩家报表</div>
        </div>
      </div>
      <div class="list">
        <div @click="jump('/news')">
          <van-image
          :show-loading="false"
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
import { getView } from '../../service/index'
export default {
  data() {
    return {
      img_commission: require('../../assets/images/home/yongjin.png'),
      img_financing: require('../../assets/images/home/caiwu.png'),
      img_withdrawal: require('../../assets/images/home/qukuan.png'),
      img_user: require('../../assets/images/home/yonghu.png'),
      img_info: require('../../assets/images/home/xiaoxi.png'),
      dataList: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    jump(name) {
      this.$router.push(name)
    },
    getData() {
      getView().then(res => {
        console.log(res)
        this.dataList = res
        // mode: agent.mode,                     // 业务模式
        // modeValue: agent.modeValue,           // 业务模式比例
        // playerCount: agent.playerCount,       // 玩家数量
        // newRegPlayerCount: 0,                 // 新注册玩家数量
        // activePlayerCount: 0,                 // 活跃玩家数量
        // currentProfit: 0,                     // 当前利润
        // currentWinlose: 0,                    // 当前输赢
        // currentPlatformFee: 0,                // 当前平台费
        // currentDeposit: 0,                    // 当前存款
        // currentWithdraw: 0,                   // 当前取款
        // currentCommission: 0                  // 当前佣金

      })
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
      /* height: 220px; */
      height: 220px;
      padding: 40px /* 40/16 */ 16px;
      position: relative;
      .username {
        display: flex;
        align-items: center;
        color: #fff;
        .van-image {
          width: 50px;
          height: 50px;
        }
        p {
          margin-left: 12.8px;
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
            font-size: 12px;
            font-weight: normal;
          }
          &:last-child {
            font-size: 30px;
            font-weight: bold;
            margin-top: 8px;
          }
        }
      }
      .detail {
        /* height: 70px; */
        height: 80px;
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
          height: 70px;
          justify-content: space-around;
          align-items: center;
          li {
            p {
              margin: 0;
              text-align: center;
              &:first-child {
                font-size: 20px;
                color: #20a0ff;
              }
              &:last-child {
                color: #c4c4c4;
                font-size: 12.8px;
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
        padding: 0 16px;
        margin-bottom: 40px;
        font-size: 16px;
        .van-image {
          width: 50px;
          height: 50px;
        }
        >div {
          text-align: center;
          width: 112px;
          
        }
      }
      .split {
        height: 40px;
        width: 2px !important;
        background: #eceaea;
        transform: scaleX(.4)
      }
    }
  }

</style>
