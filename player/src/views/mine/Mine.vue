<template>
  <div class="mine">
   <div class="box">
    <div class="message">
      <img src="" alt="">
      <!-- <img src="../assets/images/mine/message.png" alt=""> -->
    </div>
    <div class="top">
      <div class="header">
        <div class="via">
          <van-image round :src="via" :show-loading="false" />
        </div>
        <div class="nickname">{{nickname}}</div>
      </div>
      <div class="content">
        <div class="left">
          <div>
            <p>&yen</p>
            <p>{{formatMoney}}</p>
          </div>
          <div>钱包余额</div>
        </div>
        <div class="split"></div>
        <div class="right">
          <div class="list" v-for="(item, index) in topMenu" :key="index">
              <van-image
                :src="item.img"
                :show-loading='false'
              />
            <p>{{item.text}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="list" v-for="val in contentMenu">
        <div v-for="item in val" @click="operate(item)">
          <div>
            <div>
              <van-image :src="item.img" :show-loading="false" />
              <p>{{item.text}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
   </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'mine',
  data() {
    return {
      
      via: require("../../assets/images/mine/icon_default_head_bg.png"),//头像
      nickname: '请登录',//默认请登录
      money: 0,//中心钱包
      //顶部菜单
      topMenu: [
        {
          img: require("../../assets/images/mine/icon_charge.png"),
          text: '存款'
        },
        {
          img: require("../../assets/images/mine/ico_withdraw.png"),
          text: '取款'
        },
        {
          img: require("../../assets/images/mine/icon_discount.png"),
          text: 'VIP详情'
        }
      ],
      //
      contentMenu: [
        [
          {
            img: require("../../assets/images/mine/icon_home_setting.png"),
            text: '个人资料',
            name: ''
          },
          {
            img: require("../../assets/images/mine/icon_mine_account.png"),
            text: '交易记录',
            name: ''
          },
          {
            img: require("../../assets/images/mine/icon_mine_settle.png"),
            text: '投注记录',
            name: 'betRecord'
          }
        ],
        [
          {
            img: require("../../assets/images/mine/icon_home_about.png"),
            text: '关于YIBO',
            name: 'about'
          },
          {
            img: require("../../assets/images/mine/icon_home_partner.png"),
            text: '银行卡号',
            name: 'bank'
          },
          {
            img: require("../../assets/images/mine/icon_mine_unsettle.png"),
            text: '安全退出',
            name: 'logout'
          }
        ],
      ]
    }
  },
  computed: {
    formatMoney() {
      return this.money.toFixed(2)
    }
  },
  methods:{
    operate(item) {
      if (item.name == 'logout') {
        this.$dialog.confirm({
        title: '退出当前账号',
        message: '确定退出当前账号?'
        }).then(() => {
          localStorage.clear();
          this.$router.push({ name: "login" });
        }).catch(err => {
          return
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
  [v-cloak]{ display:none}
  .mine {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    overflow-y: auto;
    background: url('../../assets/images/background/bg_mine.jpg') no-repeat fixed;
    background-size: cover;
    .box {
      padding: 0 16px;
      .message {
        padding-top: 20px;
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
      }
      .top {
        height: 160px;
        background: rgba(255, 255, 255, .5);
        .header {
          display: flex;
          justify-content: start;
          padding: 16px;
          .via {
            width: 48px;
            height: 48px;
            border: 2px solid #fff;
            border-radius: 50%;
            .van-image {
              width: 48px;
              height: 48px;
            }
          }
          .nickname {
            margin-left: 16px;
            display: flex;
            align-items: center;
            color: #fff;
          }
        }
        .content {
          display: flex;
          align-items: center;
          .left {
            padding: 0 32px;
            
            font-size: 15px;
            div:first-child {
              color:#0478e1;
              display: flex;
              font-size: 32px;
              margin-bottom: 4px;
              p {
                margin: 0;
              }
              p:first-child {
                font-size: 15px;
                margin-right: .16px;
                margin-top: 4px;
              }
            }
          }
          .right {
            display: flex;
            padding-left: 16px;
            .list {
              margin-right: 11.2px;
              .van-image {
                width: 32px;
                height: 32px;
              }
            }
            p {
              margin: 0;
              font-size: 15px;
              text-align: center;
            }
          }
        }
      }
      .container {
        .list {
          height: 60px;
          background: rgba(255, 255, 255, .5);
          margin: 15px 0;
          display: flex;
          padding: 8px 24px;
          align-items: center;
          justify-content: space-around;
          .van-image {
            width: 24px;
            height: 24px;
          }
          p {
              margin: 0;
              font-size: 16px;
              text-align: center;
              padding-top: 2px;
            }
          div:nth-child(2) {
            display: flex;
            align-items: center;
            div {
              margin: 0 10px;
            }
          }
          div:nth-child(2)::before {
              content: "";   
              display: block;
              width: 1px;
              height: 25px;
              background: #98806f;
              transform: scaleX(0.5)   
          }
          div:nth-child(2)::after {
              content: "";   
              display: block;
              width: 1px;
              height: 25px;
              background: #98806f;
              transform: scaleX(0.5)    
          }
        }
        }
      }
  }
  .split {
    width: 1px;
    height: 25px;
    background: #98806f;
    display: flex;
    /* align-items: center;
    margin-top: 10px; */
    transform: scaleX(0.5)
  }
</style>
