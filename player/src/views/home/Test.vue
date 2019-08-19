<template>
  <div class="home">
    <div class="swipe">
      <van-swipe :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="(item, index) in swipeList" :key="index">
          <img :src="item.img" alt="">
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="box">
      <div class="notice">
        <van-notice-bar :text="notice" :left-icon="leftIcon" background="transparent" color="#8A8A8A" />
      </div>
       <div class="operate">
        <div class="header">
          <div class="left">
            <span>早上好,</span>
            <span>{{playerName}}</span>
          </div>
          <div class="right">
            <div>个人资料</div>
          </div>
        </div>
        <div class="content">
          <div class="left">
            <div class="see">
              登录查看
            </div>
            <div class="money">
              中心钱包
            </div>
          </div>
          <div class="right">
            <div class="menu" v-for="(item, index) in operateHeader" :key="index">
              <img :src="item.img" alt="" >
              <div class="name">{{item.name}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="tabMenu">
         <div class="left">
         <ul class="tabMenuList">
            <li v-for="(item, index) in tabMenuList" :key="index" :class="{'actMenu': index==swipeIndex}" @click="changeMenu(index)">
              <span>
                <img :src="item.actImg" alt="" v-if="swipeIndex == index">
                <img :src="item.img" alt="" v-else>
              </span>
              <span>{{item.name}}</span>
            </li>
         </ul>
        </div>
        <div class="right">
          <ul ref="swipe" :style="{transform: swipeTo}">
            <li style="background:red" class="swip1">
              <img :src="sideImg1" alt="">
            </li>
            <li style="background:yellow">2</li>
            <li style="background:blue">3</li>
            <li style="background:green">4</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>



export default {
  name: 'home',
  data() {
    return {
      notice: '足协杯战线连续第2年上演广州德比战，上赛季半决赛上恒大以两回合5-3的总比分淘汰富力。',
      leftIcon: require('../../assets/images/home/ico_notice.png'),
      operateHeader: [
        {
          img: require('../../assets/images/home/icon_wallet_deposit.png'),
          name: '存款'
        },
        {
          img: require('../../assets/images/home/icon_wallet_transfer.png'),
          name: '转账'
        },
        {
          img: require('../../assets/images/home/icon_wallet_withdraw.png'),
          name: '取款'
        }
      ],
      swipeList: [
        {
          img: require('../../assets/images/home/swipe1.png')
        },
        {
          img: require('../../assets/images/home/swipe2.png')
        },
        {
          img: require('../../assets/images/home/swipe3.png')
        }
      ],
      tabMenuList:[
        {
          name: '真人视讯',
          img: require('../../assets/images/home/icon_sports_darkgolden.png'),
          actImg: require('../../assets/images/home/icon_sports_white.png')
        },
        {
          name: '电子游艺',
          img: require('../../assets/images/home/icon_livecasino_darkgolden.png'),
          actImg: require('../../assets/images/home/icon_livecasino_white.png')
        },
        {
          name: '体育竞技',
          img: require('../../assets/images/home/icon_lottery_darkgolden.png'),
          actImg: require('../../assets/images/home/icon_lottery_white.png')
        },
        {
          name: '棋牌游戏',
          img: require('../../assets/images/home/icon_esports_darkgolden.png'),
          actImg: require('../../assets/images/home/icon_esports_white.png')
        }
      ],
      sideImg1: require('../../assets/images/home/side_menu_1_1.png'),
      swipeIndex: 0//tab激活下标
    }
  },
  computed: {
    swipeTo() {
      let num = -(this.swipeIndex * 100)
      return `translateY(${num}%)`
    },
    playerName() {
      return localStorage.playerNick ? localStorage.playerNick : '请登录'
    }
  },
  methods: {
    changeMenu(index) {
      this.swipeIndex = index
    }
  }
}
</script>

<style lang="less" scoped>
  .home {
    color: #8A8A8A;
    position: absolute;
    background: #F0F0F0;
     box-sizing: border-box;  
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    overflow-y: auto;
    .swipe {
      height: 30%;
      overflow: hidden;
      box-sizing: border-box;
      padding: 0 8px;
      .van-swipe {
         height: 100%;
      }
      .van-swipe__track {
        img {
          display: block;
          height: 100%;
          width: 100%;
        }
      }
    }
    .box {
      box-sizing: border-box;  
      padding: 0 8px;
      height: 68%;
      .notice {
        height: 5%;
        margin: 1% 0;
        .van-notice-bar {
        box-sizing: border-box;  
        height: 100%;
        padding: 0;
        font-size: 8px;
        /deep/.van-image {
          width: 24px;
          height: 24px;
          margin-right: 4.8px;
          }
        }
      }
      .operate {
        height: 23%;
        overflow: hidden;
        background:rgba(255, 255, 255, .4);
        border-radius: 5px;
        margin-bottom: 1%;
        .header {
          box-sizing: border-box;
          height: 30%;
          border-radius: 5px 5px 0 0;
          background: #fff;
          display: flex;
          justify-content: space-between;
          color:#8A8A8A;
          padding: 0 16px;
          .left {
            display: flex;
            align-items: center;
            span {
              font-size: 12px;
            }
          }
          .right {    
            display: flex;
            align-items: center;
            div {
              box-sizing: border-box;
              font-size: 12px;
              border: 1px solid #8A8A8A;
              border-radius: 20px;
              padding: 0 8px;
              margin-left: 6.5px;
            }
          }
        }
        .content {
          height: 70%;
          box-sizing: border-box;
          display: flex;
          background: #E1E0E1;
          .left {
            font-size: 11.2px;
            box-sizing: border-box;
            padding: 0 32px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            .see {
              box-sizing: border-box;
              border: 1px solid rgb(139, 126, 126);
              padding: 0 8px;
              border-radius: 20px;
            }   
            .money {
              margin-top: 1vh;
            }   
          }
          .right {
            flex: 1;
            display: flex;
            justify-content: space-around;
            align-items: center;
            .menu {
              img {
                height: 40px;
              }
              .name {
                font-size: 12.8px;
              }
            }
          }
        }
      }  
      .tabMenu {
        height: 60%;
        display: flex;
        box-sizing: border-box;
        margin-top: 2%;
        .left {
          height: 100%;
          width: 112px;
          margin-right: 6.5px;
          .tabMenuList {
            height: 100%;
            li {
              border-radius: 5px;
              height: 25%;
              display: flex;
              justify-content: center;
              align-items: center;
              background:rgba(255, 255, 255, .4);
              font-size: 11.2px;
              &:nth-child(6) {
                margin-bottom: 0;
              }
              img {
                height: 4vh;
              }
            }
            .actMenu {
              background: url('../../assets/images/home/btn_register.png') no-repeat;
              background-size: cover;
              color: #fff;
            }
          }
        }
        .right {
          flex: 1;
          height: 100%;
          border-radius: 5px;
          overflow: hidden;
          ul {
            height: 100%;
            transition: all .2s linear;
            li {
              height: 100%;
            }
            .swip1 {
              img {
                height: 100%;
                width: 100%;
              }
            }
          }
        }
      }
    }
  }
</style>
