<template>
  <div class="home">
    <div class="top">
      <van-nav-bar
        title="玩家报表"
        left-arrow
        @click-left="onClickLeft"
        :border="false"
        />
      <div class="detail">
        <van-field
          v-model="username"
          clearable
          left-icon="contact"
          placeholder="请输入用户名"
          :border="false"
        />
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
      <table>
          <tr>
            <th>账号</th>
            <th>输赢</th>
            <th>存款</th>
            <th>取款</th>
          </tr>
          <tr v-for="(item, index) in data">
            <td>{{item.playerName}}</td>
            <td>{{item.winloseAmount}}</td>
            <td>{{item.deposit}}</td>
            <td>{{item.withdraw}}</td>
          </tr>
        </table>
    </div>
  </div>
</template>

<script>
import {playerReport} from '../../service/index'
export default {
  data() {
    return {
      noData: require('../../assets/images/player/no_data.jpg'),
      currentDate: new Date(),
      data: '',
      st: '',
      et: '',
      startTime: '2233',
      endTime: '',
      startWeek: '2233',
      endWeek: '',
      showModel1: false,
      username: ''
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      playerReport().then(res => {
        this.data = res
      })
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
    }
  }
}
</script>


<style lang="less" scoped>
  .home {
    
    .top {
      box-sizing: border-box;
      background: #6cbfff;
      height: 160px;
      padding: 30px 8px;
      position: relative;
      
      .detail {
        box-sizing: border-box;
        padding: 8px 8px;
        height: 140px;
        background: #fff;
        position: absolute;
        width: 92%;
        bottom: -70px;
        border-radius: 5px;
        left: 50%;
        transform: translateX(-50%);
        box-shadow: 0px 8px 10px #bebebe;
        .van-cell {
          padding: 5px 5px;
        }
        .time {
          margin: 15px 0;
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
      margin-top: 90px;
      .list {
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: 0 16px;
        margin-bottom: 5px;
        >div {
          height: 100px;
         /*  background: url('../../../assets/images/home/v1.png') no-repeat; */
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
    table {
        width: 100%;
        border-collapse: collapse;
        text-align: center;
        tr {
          height: 50px;
          &:nth-child(2n) {
              background: #FBFBFB;
            }
          th {
            font-weight: normal;
          }
          td {
            
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
