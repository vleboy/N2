<template>
  <div class="home">
    <Carousel/>
    <div class="box">
      <van-notice-bar :text="notice" :left-icon="leftIcon" background="transparent" color="#fff" />
      <div class="operate">
        <div class="header">
          <div class="left">
            早上好,请登录
          </div>
          <div class="right">
            <img src="../assets/images/home/icon_yabo.png" alt="" height="20px">
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
              <img :src="item.img" alt="" height="40px">
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
                <img :src="item.actImg" alt="" width="32px" v-if="swipeIndex == index">
                <img :src="item.img" alt="" width="32px" v-else>
              </span>
              <span>{{item.name}}</span>
            </li>
         </ul>
        </div>
        <div class="right">
          <van-swipe ref="swipe" style="height: 325px;" :height="325" vertical :show-indicators='false' :loop="false" @change="changeSwipe">
            <van-swipe-item class="swipeMenu1">
              <div class="logo">
                <img src="../assets/images/home/about_logo.png" alt="" width="70px;">
              </div>
              <div class="split">
                <div class="sp"></div>
                <div class="content">赞数伙伴</div>
                <div class="sp"></div>
              </div>
              <div class="lab">
                <div>
                  <p><img src="../assets/images/home/yijia_logo.png" alt="" width="40px"></p>
                  
                </div>
                <div>
                  <p><img src="../assets/images/home/berlin_logo.png" alt="" width="40px"></p>
                 
                </div>
                <div>
                  <p><img src="../assets/images/home/ata_logo.png" alt="" width="40px"></p>
                  
                </div>
                <div>
                  <p><img src="../assets/images/home/as_logo.png" alt="" width="40px"></p>
                
                </div>
              </div> 
              <div class="enter">点击进入</div>
            </van-swipe-item>
            <van-swipe-item class="swipeMenu2">
              <div class="sm2_01">
                <img src="../assets/images/home/font_livecasino_ag.png" alt="">
              </div>
              <div class="sm2_02">
                <img src="../assets/images/home/font_livecasino_ebet_short.png" alt="">
              </div>
              <div class="sm2_03">
                <div class="sm2_03_1">
                  <img src="../assets/images/home/font_livecasino_og_short.png" alt="">
                </div>
                <div class="sm2_03_2">
                  <img src="../assets/images/home/font_livecasino_gd_short.png" alt="">
                </div>
              </div>
            </van-swipe-item>
            <van-swipe-item class="swipeMenu3">
              <div class="sm3_01">
                <img src="../assets/images/home/font_lottery_sg_short.png" alt="">
              </div>
              <div class="sm3_02">
                <div class="sm3_02_1">
                  <img src="../assets/images/home/font_lb.png" alt="">
                </div>
                <div class="sm3_02_2">
                  <img src="../assets/images/home/font_kg.png" alt="">
                </div>
              </div>
              <div class="sm3_03">
                <div class="sm3_03_1">
                  <img src="../assets/images/home/font_bbin.png" alt="">
                </div>
                <div class="sm3_03_2">
                  <img src="../assets/images/home/font_lottery_tcg_short.png" alt="">
                </div>
              </div>
            </van-swipe-item>
            <van-swipe-item class="swipeMenu5">
              <div class="sm5_01">
                <img src="../assets/images/home/font_esports_yb.png" alt="" class="img1">
                <img src="../assets/images/home/col_top_yaboesports.png" alt="" class="img3">
                <img src="../assets/images/home/col_bottom_yaboesports_long.png" alt="" class="img2">
              </div>
              <div class="sm5_02">
                <img src="../assets/images/home/font_esports_avia.png" alt="" class="img1">
                <img src="../assets/images/home/col_bottom_aviaesports_long.png" alt="" class="img2">
              </div>
            </van-swipe-item>
            <van-swipe-item class="swipeMenu4">
              <div class="sm4_01">
                <div class="sm4_01_1">
                  <img src="../assets/images/home/font_pg.png" alt="">
                </div>
                <div class="sm4_01_2">
                  <img src="../assets/images/home/font_ag.png" alt="">
                </div>
              </div>
              <div class="sm4_02">
                <div class="sm4_02_1">
                  <img src="../assets/images/home/font_pt.png" alt="">
                </div>
                <div class="sm4_02_2">
                  <img src="../assets/images/home/font_mg.png" alt="">
                </div>
              </div>
              <div class="sm4_03">
                <div class="sm4_03_1">
                  <img src="../assets/images/home/font_pp.png" alt="">
                </div>
                <div class="sm4_03_2">
                  <img src="../assets/images/home/font_dt.png" alt="">
                </div>
              </div>
            </van-swipe-item>
            <van-swipe-item class="swipeMenu6">
              <div class="sm6_01">
                <img src="../assets/images/home/font_gd.png" alt="">
              </div>
              <div class="sm6_02">
                <img src="../assets/images/home/font_sy.png" alt="">
              </div>
            </van-swipe-item>
          </van-swipe>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Carousel from './Carousel.vue'

export default {
  name: 'home',
  components: {
    Carousel
  },
  data() {
    return {
      notice: '足协杯战线连续第2年上演广州德比战，上赛季半决赛上恒大以两回合5-3的总比分淘汰富力。',
      leftIcon: require('../assets/images/home/ico_notice.png'),
      operateHeader: [
        {
          img: require('../assets/images/home/icon_wallet_deposit.png'),
          name: '存款'
        },
        {
          img: require('../assets/images/home/icon_wallet_transfer.png'),
          name: '转账'
        },
        {
          img: require('../assets/images/home/icon_wallet_withdraw.png'),
          name: '取款'
        }
      ],
      tabMenuList:[
        {
          name: '亚搏体育',
          img: require('../assets/images/home/icon_sports_darkgolden.png'),
          actImg: require('../assets/images/home/icon_sports_white.png')
        },
        {
          name: '真人娱乐',
          img: require('../assets/images/home/icon_livecasino_darkgolden.png'),
          actImg: require('../assets/images/home/icon_livecasino_white.png')
        },
        {
          name: '彩票投注',
          img: require('../assets/images/home/icon_lottery_darkgolden.png'),
          actImg: require('../assets/images/home/icon_lottery_white.png')
        },
        {
          name: '电子竞技',
          img: require('../assets/images/home/icon_esports_darkgolden.png'),
          actImg: require('../assets/images/home/icon_esports_white.png')
        },
        {
          name: '捕鱼电玩',
          img: require('../assets/images/home/icon_slotgame_darkgolden.png'),
          actImg: require('../assets/images/home/icon_slotgame_white.png')
        },
        {
          name: '棋牌游戏',
          img: require('../assets/images/home/icon_boardgame_darkgolden.png'),
          actImg: require('../assets/images/home/icon_boardgame_white.png')
        }
      ],
      swipeIndex: 0//tab激活下标
    }
  },
  computed: {
    changeIndex() {
      return this.swipeIndex
    }
  },
  methods: {
    changeSwipe(index) {
      this.swipeIndex = index
    },
    changeMenu(index) {
      this.swipeIndex = index
      this.$refs.swipe.swipeTo(index)
    }
  }
}
</script>

<style lang="less" scoped>
  .home {
    padding-top: 0.5rem;
    position: absolute;
    width: 100%;
    height: 95%;
    top: 0;
    left: 0;
    overflow-y: auto;
    background: url('../assets/images/background/bg_discount.jpg') no-repeat fixed;
    background-size: cover;
    .box {
      padding: 0 .5rem;
      margin-top: 5px;
      .van-notice-bar {
        height: 20px;
        padding: 0.2rem .5rem;
        font-size: 0.5rem;
        /deep/.van-image {
          width: 1.5rem;
          height: 1.5rem;
          margin-right: 0.3rem;
        }
      }
      .operate {
        height: 100px;
        background:rgba(255, 255, 255, .4);
        border-radius: 5px;
        .header {
          height: 24px;
          border-radius: 5px 5px 0 0;
          background: url('../assets/images/home/bg_wallet_top.png') no-repeat ;
          background-size: cover;
          display: flex;
          justify-content: space-between;
          color:#fff;
          font-size: .7rem;
          padding: 0 1rem;
          .left {
            display: flex;
            align-items: center;
          }
          .right {
            display: flex;
            align-items: center;
            div {
              border: 1px solid #fff;
              border-radius: 20px;
              padding: 0 0.5rem;
              margin-left: 0.4rem;
            }
          }
        }
        .content {
          display: flex;
          padding: 0.2rem 0;
          .left {
            font-size: .7rem;
            padding: 1rem 2rem;
            .see {
              border: 1px solid rgb(139, 126, 126);
              color: rgb(139, 126, 126);
              padding: 0 0.5rem;
              border-radius: 20px;
              margin-bottom: 0.2rem;
            }      
          }
          .right {
            border-left: 1px solid rgb(192, 189, 189);
            flex: 1;
            display: flex;
            justify-content: space-around;
            .menu {
              .name {
                font-size: 0.8rem;
                color: rgb(139, 126, 126);
              }
            }
          }
        }
      }  
      .tabMenu {
        margin-top: 5px;
        display: flex;
        .left {
          width: 7rem;
          margin-right: .4rem;
          .tabMenuList {
            li {
              border-radius: 5px;
              height: 50px;
              margin-bottom: 5px;
              display: flex;
              justify-content: center;
              align-items: center;
              background:rgba(255, 255, 255, .4);
              font-size: .7rem;
              &:nth-child(6) {
                margin-bottom: 0;
              }
            }
            .actMenu {
              background: url('../assets/images/home/btn_register.png') no-repeat;
              background-size: cover;
              color: #fff;
            }
          }
        }
        .right {
          flex: 1;
          .swipeMenu1 {
            background: url('../assets/images/home/col_cover_sports.webp') no-repeat fixed;
            background-size: cover;
            box-sizing:border-box;
            padding-top: 30px;
            position: relative;
            .lab {
              display: flex;
              justify-content: space-around;
              div {
                width: 60px;
                height: 5rem;
              }
            }
            .enter {
              position: absolute;
              width: 6rem;
              padding: .3rem .6rem;
              border: 1px solid #fff;
              border-radius: 20px;
              color: #fff;
              font-size: 1rem;
              background: rgba(255, 255, 255, .2);
              left: 50%;
              transform: translateX(-50%);
              bottom: 50px;
            }
            .split {
              display: flex;
              align-items: center;
              justify-content: space-around;
              .sp {
                width: 4rem;
                height: 1px;
                background: #fff;
              }
              .content {
                font-size: .8rem;
                color: #fff;
              }
              
            }
          }
          .swipeMenu2 {
            .sm2_01 {
              border-radius: 5px;
              background: url('../assets/images/home/col_cover_livecasino_ag_short.webp') no-repeat;
              background-size: cover;
              height: 105px;
              margin-bottom: 5px;
              position: relative;
              img {
                position: absolute;
                display: block;
                width: 4.5rem;
                right: .5rem;
                top: .5rem;
              }
            }
            .sm2_02 {
              border-radius: 5px;
              background: url('../assets/images/home/col_cover_livecasino_ebet.webp') no-repeat;
              background-size: cover;
              height: 105px;
              margin-bottom: 5px;
              position: relative;
              img {
                position: absolute;
                display: block;
                width: 4.5rem;
                right: .5rem;
                top: .5rem;
              }
            }
            .sm2_03 {
              display: flex;
              height: 105px;
              justify-content: space-between;
              .sm2_03_1 {
                width: 7.4rem;
                border-radius: 5px;
                height: 105px;
                background: url('../assets/images/home/col_cover_livecasino_og_short.webp') no-repeat;
                background-size: cover;
                position: relative;
                img {
                position: absolute;
                display: block;
                width: 4rem;
                right: .1rem;
             
              }
              }
              .sm2_03_2 {
                width: 7.4rem;
                border-radius: 5px;
                height: 105px;
                background: url('../assets/images/home/col_cover_livecasino_gd_short.webp') no-repeat;
                background-size: cover;
                position: relative;
                img {
                position: absolute;
                display: block;
                width: 4rem;
                right: .1rem;
                
              }
              }
            }
          }
          .swipeMenu3 {
            .sm3_01 {
              border-radius: 5px;
              background: url('../assets/images/home/col_cover_lottery_sg.webp') no-repeat;
              background-size: cover;
              height: 105px;
              margin-bottom: 5px;
              position: relative;
              img {
                position: absolute;
                display: block;
                width: 4.5rem;
                left: .5rem;
                top: .5rem;
              }
            }
            .sm3_02 {
              display: flex;
              height: 105px;
              justify-content: space-between;
              margin-bottom: 5px;
              .sm3_02_1 {
                width: 7.4rem;
                border-radius: 5px;
                height: 105px;
                background: url('../assets/images/home/col_cover_lottery_lb.webp') no-repeat;
                background-size: cover;
                position: relative;
                img {
                position: absolute;
                display: block;
                width: 6rem;
                left: 1rem;
                top: .2rem;
             
              }
              }
              .sm3_02_2 {
                width: 7.4rem;
                border-radius: 5px;
                height: 105px;
                background: url('../assets/images/home/col_cover_lottery_kg.webp') no-repeat;
                background-size: cover;
                position: relative;
                img {
                position: absolute;
                display: block;
                width: 6rem;
                left: 1rem;
                top: .2rem;
                
              }
              }
            }
            .sm3_03 {
              display: flex;
              height: 105px;
              justify-content: space-between;
              .sm3_03_1 {
                width: 7.4rem;
                border-radius: 5px;
                height: 105px;
                background: url('../assets/images/home/col_cover_lottery_bbin.webp') no-repeat;
                background-size: cover;
                position: relative;
                img {
                position: absolute;
                display: block;
                width: 6rem;
                left: 1rem;
                top: .2rem;
             
              }
              }
              .sm3_03_2 {
                width: 7.4rem;
                border-radius: 5px;
                height: 105px;
                background: url('../assets/images/home/col_cover_lottery_tcg.webp') no-repeat;
                background-size: cover;
                position: relative;
                img {
                position: absolute;
                display: block;
                width: 6rem;
                left: 1rem;
                top: .2rem;
                
              }
              }
            }
          }
          .swipeMenu5 {
            .sm5_01 {
              border-radius: 5px;
              background: url('../assets/images/home/col_cover_esports_short.webp') no-repeat;
              background-size: cover;
              height: 160px;
              margin-bottom: 5px;
              position: relative;
              .img1 {
                position: absolute;
                display: block;
                width: 4rem;
                right: .5rem;
                top: 1rem;
              }
              .img3 {
                position: absolute;
                display: block;
                width: 9rem;
                left: 1rem;
                top: 1rem;
              }
              .img2 {
                position: absolute;
                display: block;
                width: 100%;
                bottom: 0;
                height: 100px;
              }
            }
            .sm5_02 {
              border-radius: 5px;
              background: url('../assets/images/home/col_cover_aviaesports_long.png') no-repeat;
              background-size: cover;
              height: 160px;
              margin-bottom: 5px;
              position: relative;
              .img1 {
                position: absolute;
                display: block;
                width: 4rem;
                right: .5rem;
                top: .5rem;
              }
              .img2 {
                position: absolute;
                display: block;
                width: 100%;
                bottom: 0;
                height: 100px;
              }
            }
          }
          .swipeMenu4 {
            .sm4_01 {
              display: flex;
              height: 105px;
              justify-content: space-between;
              margin-bottom: 5px;
              .sm4_01_1 {
                width: 7.4rem;
                border-radius: 5px;
                height: 105px;
                background: url('../assets/images/home/col_cover_slotgame_pg.webp') no-repeat;
                background-size: cover;
                position: relative;
                img {
                position: absolute;
                display: block;
                width: 6rem;
                left: 1rem;
                top: .2rem;
             
              }
              }
              .sm4_01_2 {
                width: 7.4rem;
                border-radius: 5px;
                height: 105px;
                background: url('../assets/images/home/col_cover_slotgame_ag.webp') no-repeat;
                background-size: cover;
                position: relative;
                img {
                position: absolute;
                display: block;
                width: 6rem;
                left: 1rem;
                top: .2rem;
                
              }
              }
            }
            .sm4_02 {
              display: flex;
              height: 105px;
              justify-content: space-between;
              margin-bottom: 5px;
              .sm4_02_1 {
                width: 7.4rem;
                border-radius: 5px;
                height: 105px;
                background: url('../assets/images/home/col_cover_slotgame_pt.webp') no-repeat;
                background-size: cover;
                position: relative;
                img {
                position: absolute;
                display: block;
                width: 6rem;
                left: 1rem;
                top: .2rem;
             
              }
              }
              .sm4_02_2 {
                width: 7.4rem;
                border-radius: 5px;
                height: 105px;
                background: url('../assets/images/home/col_cover_slotgame_mg.webp') no-repeat;
                background-size: cover;
                position: relative;
                img {
                position: absolute;
                display: block;
                width: 6rem;
                left: 1rem;
                top: .2rem;
                
              }
              }
            }
            .sm4_03 {
              display: flex;
              height: 105px;
              justify-content: space-between;
              .sm4_03_1 {
                width: 7.4rem;
                border-radius: 5px;
                height: 105px;
                background: url('../assets/images/home/col_cover_slotgame_pp.webp') no-repeat;
                background-size: cover;
                position: relative;
                img {
                position: absolute;
                display: block;
                width: 6rem;
                left: 1rem;
                top: .2rem;
             
              }
              }
              .sm4_03_2 {
                width: 7.4rem;
                border-radius: 5px;
                height: 105px;
                background: url('../assets/images/home/col_cover_slotgame_dt.webp') no-repeat;
                background-size: cover;
                position: relative;
                img {
                position: absolute;
                display: block;
                width: 6rem;
                left: 1rem;
                top: .2rem;
                
              }
              }
            }
          }
          .swipeMenu6 {
            .sm6_01 {
              border-radius: 5px;
              background: url('../assets/images/home/col_cover_boardgame_sg_short.webp') no-repeat;
              background-size: cover;
              height: 160px;
              margin-bottom: 5px;
              position: relative;
              img {
                position: absolute;
                display: block;
                width: 4rem;
                right: .5rem;
                top: .5rem;
              }
            }
            .sm6_02 {
              border-radius: 5px;
              background: url('../assets/images/home/col_cover_boardgame_sy_short.webp') no-repeat;
              background-size: cover;
              height: 160px;
              margin-bottom: 5px;
              position: relative;
              img {
                position: absolute;
                display: block;
                width: 4rem;
                right: .5rem;
                top: .5rem;
              }
            }
          }
        }
      }
    }
  }
</style>
