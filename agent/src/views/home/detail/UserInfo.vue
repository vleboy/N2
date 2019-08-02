<template>
  <div class="home">
    <div class="top">
      <van-nav-bar
        title="用户信息"
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
      <Table :columns="column1" :data="userList" :stripe="true">
        <!-- <template slot-scope="{row, index}" slot="winLose">
          {{1321564321}}
        </template> -->
        <template v-slot:name="{ winLose }">
          1231
        </template>
      </Table>
    </div>
  </div>
</template>

<script>
import Table from '../../../components/Table'
export default {
  components: {
    Table
  },
  data() {
    return {
      column1:[
        {
          title: '用户名',
          key: 'username'
        },
        {
          title: '输赢',
          key: 'winLose'
        },
        {
          title: '存款',
          key: 'fund'
        },
        {
          title: '取款',
          key: 'Withdrawal'
        }
      ],
      userList:[
        {
          username: 'ly13',
          winLose: -0.27,
          fund: 100,
          Withdrawal: 0
        },
        {
          username: 'ly14',
          winLose: -0.27,
          fund: 100,
          Withdrawal: 0
        }
      ],
      noData: require('../../../assets/images/home/no_data.jpg'),
      currentDate: new Date(),
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
  methods: {
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
