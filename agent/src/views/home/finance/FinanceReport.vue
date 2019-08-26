<template>
  <div class="home">
    <div class="top">
      <van-nav-bar
        title="财务报表"
        left-arrow
        @click-left="onClickLeft"
        :border="false"
        />
      <div class="detail">
        <div class="time">
          <div>
            <span class="fs14">2019-07-01</span>
            &nbsp;
            <span style="color: #bebebe;" class="fs12">星期一</span>
          </div>
          <div>-</div>
          <div>
             <span class="fs14">2019-07-31</span>
             &nbsp;
             <span style="color: #bebebe;" class="fs12">星期一</span>
          </div>
        </div>
        <div class="btn">
          <van-button type="default" size="small">查询</van-button>
        </div>
      </div>
      
    </div>
    <div class="container">
      <!-- <van-datetime-picker
        v-model="currentDate"
        type="date"
        @confirm="setStartTime"
        @change="getStartTime"
        v-if="showModel1"
      />
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        @confirm="setStartTime"
        @change="getStartTime"
        v-if="showModel1"
      /> -->
      <div class="list">
        <div @click="jumpTo('deposit')">
          <div class="name">存款通道费</div>
          <div class="num">
            {{formatConfig(dataList.depositFee)}}
            <van-button type="default">查看详情</van-button>
          </div>
        </div>
        <div @click="jumpTo('withdrawal')">
          <div class="name">取款通道费</div>
          <div class="num">
            {{formatConfig(dataList.withdrawFee) || 0.00}}
            <van-button type="default">查看详情</van-button>
          </div>
        </div>
      </div>
      <div class="list">
        <div @click="jumpTo('commission')">
          <div class="name">红利加返水</div>
          <div class="num">
            {{formatConfig(dataList.commissionFee) || 0.00}}
            <van-button type="default">查看详情</van-button>
          </div>
        </div>
        <div @click="jumpTo('platform')">
          <div class="name">平台费</div>
          <div class="num">
            {{formatConfig(dataList.platformFee) || 0.00}}
            <van-button type="default">查看详情</van-button>
          </div>
        </div>
      </div>
      <div class="list">
        <div @click="jumpTo('winLoseAll')">
          <div class="name">总输赢</div>
          <div class="num">
            {{formatConfig(dataList.winlose) || 0.00}}
            <van-button type="default">查看详情</van-button>
          </div>
        </div>
        <div>
          <div class="name">净输赢</div>
          <div class="num">{{formatConfig(dataList.profit) || 0.00}}</div>
        </div>
      </div>
    </div>
    <div class="footer">
      <p>提示:</p>
      <p>总输赢/净输赢中正数表示公司盈利,负数表示公司亏损</p>
      <p>每日数据仅供参考,并不作为结算佣金派发标准</p>
    </div>
  </div>
</template>

<script>
import { getView } from '../../../service/index'
import { formatMoney } from '../../../config/format'
export default {
  data() {
    return {
      noData: require('../../../assets/images/home/no_data.jpg'),
      currentDate: new Date(),
      st: '',
      et: '',
      startTime: '2233',
      endTime: '',
      startWeek: '2233',
      endWeek: '',
      showModel1: false,
      dataList: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    formatConfig(num) {
      return formatMoney(num)
    },
    onClickLeft() {
      this.$router.push('home')
    },
    changeStartTime() {
      this.showModel1 = true
    },
    setStartTime(value) {
      let weekDay = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
      this.startWeek = weekDay[value.getDay()]
      this.startTime = this.st
      this.showModel1 = false
    },
    getStartTime(e) {
      //console.log(e.getValues())
      this.st = e.getValues().join('-')
    },
    getData() {
      getView().then(res => {
        this.dataList = res
      })
    },
    /* 路由跳转 */
    jumpTo(name) {
      this.$router.push({name})
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
      padding: 30px 8px;
      position: relative;
      
      .detail {
        box-sizing: border-box;
        padding: 8px 8px;
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
          display: flex;
          justify-content: space-around;
          align-items: center;
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
      /* display: flex;
      justify-content: space-around;
      background: blue; */
      margin-top: 70px;
      .list {
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: 0 16px;
        margin-bottom: 5px;
        >div {
          height: 100px;
          background: url('../../../assets/images/home/v1.png') no-repeat;
          background-size: contain;
          width: 160px;
          color: #fff;
          box-sizing: border-box;
          padding: 5px;
          .name {
            height: 30px;
            font-size: 12.8px;
          }
          .num {
            display: flex;
            flex-direction: column;
            align-items: center;
            /* justify-content: center; */
            font-size: 19.2px;
            .van-button {
              background: rgba(255,255,255,.4);
              color:#fff;
              border-radius: 20px;
              padding: 0 16px;
              height: 20px;
              line-height: 18px;
              margin-top: 5px;
            }
          }
        }
      }
    }
    .footer {
      box-sizing: border-box;
      padding: 0 21px;
      margin-top: 16px;
      p {
        margin: 0;
        color: #515151;
        font-size: 12.8px;
        &:first-child {
          font-size: 16px;
        }
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
  .fs12 {
    font-size: 12px;
  }
  .fs14 {
    font-size: 14px;
  }
</style>
