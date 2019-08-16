<template>
  <div class="discount">
    <div class="box">
      <van-tabs :duration="dur" animated swipeable v-model="active" background="rgba(255,255,255,.4)" color="#fff" title-active-color="#000" title-inactive-color="#a59187">
        <van-tab title="全部优惠">
          <div class="discountBox" v-for="(item, index) in tabsAll" :key="index">
            <div class="ad">
              <div class="lab">
                <img :src="item.icon" alt="" height="50">
              </div>
              <img :src="item.img" alt="" height="100%" width="100%" style="border-radius: 5px;">
            </div>
            <div class="detail">
              <div class="name">
                <span v-for="value in item.label">{{value}}</span>
              </div>
              <div class="time">
                <span>{{item.time}}</span>
              </div>
            </div>
            <div class="link">
              <img src="../assets/images/discounts/ic_user_discount_arrow.png" alt="" width="20" height="20">
            </div>
          </div>
        </van-tab>
        <van-tab title="体育优惠">
          <div class="discountBox" v-for="(item, index) in tabsAll" :key="index">
            <div class="ad">
              <div class="lab">
                <img :src="item.icon" alt="" height="50">
              </div>
              <img :src="item.img" alt="" height="100%" width="100%" style="border-radius: 5px;">
            </div>
            <div class="detail">
              <div class="name">
                <span v-for="value in item.label">{{value}}</span>
              </div>
              <div class="time">
                <span>{{item.time}}</span>
              </div>
            </div>
            <div class="link">
              <img src="../assets/images/discounts/ic_user_discount_arrow.png" alt="" width="20" height="20">
            </div>
          </div>
        </van-tab>
        <van-tab title="真人优惠">
          <div class="discountBox" v-for="(item, index) in tabsAll" :key="index">
            <div class="ad">
              <div class="lab">
                <img :src="item.icon" alt="" height="50">
              </div>
              <img :src="item.img" alt="" height="100%" width="100%" style="border-radius: 5px;">
            </div>
            <div class="detail">
              <div class="name">
                <span v-for="value in item.label">{{value}}</span>
              </div>
              <div class="time">
                <span>{{item.time}}</span>
              </div>
            </div>
            <div class="link">
              <img src="../assets/images/discounts/ic_user_discount_arrow.png" alt="" width="20" height="20">
            </div>
          </div>
        </van-tab>
        <van-tab title="彩票优惠">
          <div class="discountBox" v-for="(item, index) in tabsAll" :key="index">
            <div class="ad">
              <div class="lab">
                <img :src="item.icon" alt="" height="50">
              </div>
              <img :src="item.img" alt="" height="100%" width="100%" style="border-radius: 5px;">
            </div>
            <div class="detail">
              <div class="name">
                <span v-for="value in item.label">{{value}}</span>
              </div>
              <div class="time">
                <span>{{item.time}}</span>
              </div>
            </div>
            <div class="link">
              <img src="../assets/images/discounts/ic_user_discount_arrow.png" alt="" width="20" height="20">
            </div>
          </div>
        </van-tab>
        <van-tab title="电子优惠">
          <div class="discountBox" v-for="(item, index) in tabsAll" :key="index">
            <div class="ad">
              <div class="lab">
                <img :src="item.icon" alt="" height="50">
              </div>
              <img :src="item.img" alt="" height="100%" width="100%" style="border-radius: 5px;">
            </div>
            <div class="detail">
              <div class="name">
                <span v-for="value in item.label">{{value}}</span>
              </div>
              <div class="time">
                <span>{{item.time}}</span>
              </div>
            </div>
            <div class="link">
              <img src="../assets/images/discounts/ic_user_discount_arrow.png" alt="" width="20" height="20">
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'discount',
  data() {
    return {
      dur: 0.5,
      active: 0,
      //全部优惠
      tabsAll: [
        {
          img: require('../assets/images/discounts/d1.jpg'),
          icon: require('../assets/images/discounts/icon_discount_newest1.png'),
          time: '2019/07/01 - 2019/07/31',
          label: ['豪门逐鹿', '豪礼盛宴']
        },
        {
          img: require('../assets/images/discounts/d3.jpg'),
          icon: require('../assets/images/discounts/icon_discount_daily1.png'),
          time: '长期活动',
          label: ['欢乐送', '保险投注', '亚博免单']
        },
        {
          img: require('../assets/images/discounts/d5.jpg'),
          icon: require('../assets/images/discounts/icon_discount_welcome1.png'),
          time: '长期活动',
          label: ['亚博体育', '50%首存红利', '开户即送']
        },
        {
          img: require('../assets/images/discounts/d1.jpg'),
          icon: require('../assets/images/discounts/icon_discount_newest1.png'),
          time: '长期活动',
          label: ['体育连赢8场', '即得12888现金']
        },
        {
          img: require('../assets/images/discounts/d3.jpg'),
          icon: require('../assets/images/discounts/icon_discount_daily1.png'),
          time: '长期活动',
          label: ['真人连赢', '好运不停']
        },
        {
          img: require('../assets/images/discounts/d5.jpg'),
          icon: require('../assets/images/discounts/icon_discount_newest1.png'),
          time: '长期活动',
          label: ['豪门逐鹿', '豪礼盛宴']
        },
        {
          img: require('../assets/images/discounts/d1.jpg'),
          icon: require('../assets/images/discounts/icon_discount_daily1.png'),
          time: '长期活动',
          label: ['欢乐送', '保险投注', '亚博免单']
        },
        {
          img: require('../assets/images/discounts/d3.jpg'),
          icon: require('../assets/images/discounts/icon_discount_welcome1.png'),
          time: '长期活动',
          label: ['亚博体育', '50%首存红利', '开户即送']
        },
        {
          img: require('../assets/images/discounts/d5.jpg'),
          icon: require('../assets/images/discounts/icon_discount_newest1.png'),
          time: '长期活动',
          label: ['体育连赢8场', '即得12888现金']
        },
        {
          img: require('../assets/images/discounts/d1.jpg'),
          icon: require('../assets/images/discounts/icon_discount_daily1.png'),
          time: '长期活动',
          label: ['真人连赢', '好运不停']
        },
      ],
      img: require('../assets/images/discounts/d1.jpg')
    };
  }
}
</script>

<style lang="less" scoped>
  .discount {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    overflow-y: auto;
    background: url('../assets/images/background/bg_discount.jpg') no-repeat fixed;
    background-size: cover;
    .box {
      padding: 16px 8px;
      .van-tabs--card {
        padding: 0;
        .van-tabs__nav--card {
          border-radius: 5px;
        }
      }
      .discountBox {
        background: #fff;
        margin: 70px 0;
        height: 100px;
        border-radius: 5px;
        position: relative;
        .ad {
          border-radius: 5px;
          position: absolute;
          height: 100px;
          background: red;
          top: -60px;
          width: 95%;
          left: 2.5%;
          .lab {
            position: absolute;
            left: 5%;
          }
        }
        .detail {
          width: 100%;
          position: absolute;
          text-align: left;
          width: 95%;
          left: 2.5%;
          bottom: 10px;
          .name {
            font-size: 16px;
            font-weight: bolder;
            margin-bottom: 4px;
            span {
              display: inline-block;
              margin-right: 9px;
            }
          }
          .time {
            font-size: 16px;
            span {
              display: inline-block;
              margin-right: 8px;
            }
          }
        }
        .link {
          position: absolute;
          right: 2%;
          bottom: 15px;
        }
      }
    }
    
  }
  /deep/ .van-tabs__wrap {
    border-radius: 40px;
  }
  /deep/ .van-tab--active {
    background: #fff;
    border-radius: 40px;
  }
  /deep/ .van-tabs__line {
    z-index: -1;
  }
</style>
