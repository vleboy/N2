<template>
  <div class="simulator">
      <div class="navBar">
        <van-icon name="arrow-left" @click="onClickLeft"/>
        <div>
          <div class="count" :class="{'menu-active': showIndex == 0}" @click="showCount">佣金模拟器</div>
          <div class="rules" :class="{'menu-active': showIndex == 1}" @click="showRules">计算规则</div>
        </div>
        <div class="bottomSpan" ref="bottomSpan"></div>
      </div>
      <div class="box" ref="box">
        <div class="commission_count">
            <!-- <van-cell title="会员游戏场馆" size="large"/>
            <van-cell title="您本月可获得佣金" size="large"/> -->
            <van-field
              v-model="members"
              label="活跃会员人数"
              placeholder="请输入会员人数"
              size="large"
            />
            <van-field
              v-model="amount"
              label="本月公司输赢值(¥)"
              placeholder="请输入公司输赢值"
              size="large"
            />
            <van-field
              v-model="stadium"
              label="会员游戏场馆"
              disabled
              placeholder="选择场馆 >"
              @click="test"
              size="large"
            />
            <!-- <van-cell title="会员游戏场馆" size="large"/> -->
            <van-field
              v-model="commission"
              label="您本月可获得佣金(¥)"
              placeholder="计算结果"
              size="large"
            />
        </div>
        <div class="commission_rules"></div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'simulator',
  data() {
    return {
      showIndex: 0,
      commission: '',
      amount: '',
      stadium: '',
      members: ''
    }
  },
  mounted() {
    
    
  },
  methods: {
    test() {
      console.log(show)
    },
    onClickLeft() {
      this.$router.push('/setting')
    },
    showCount() {
      this.showIndex = 0
      this.$refs.bottomSpan.style.left = '140px'
      this.$refs.box.style.transform = 'translateX(0)'
    },
    showRules() {
      this.showIndex = 1
      this.$refs.bottomSpan.style.left = '475px'
      this.$refs.box.style.transform = 'translateX(-50%)'
    }
  }
}
</script>


<style lang="less" scoped>
  .simulator {
    box-sizing: border-box;
    overflow: hidden;
    .navBar {
      display: flex;
      align-items: center;
      padding: 0 15px;
      height: 50px;
      position: relative;
      border-bottom:1px solid #e7e3e3;
      .van-icon {
       font-size: 19px;
      }
      .bottomSpan {
          width: 96px;
          height: 3px;
          background: #20a0ff;
          position: absolute;
          bottom: 0;
          left: 74px;
          transition: all 0.1s linear;
        }
      >div {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-around;
        color: #505050;
        font-size: 19.2px;
        position: relative;
        .menu-active {
          color: #20a0ff !important;
        }
      }
    }
    .box {
      width: 750px;
      display: flex;
      transition: all 0.5s ease;
      .commission_count {
        width: 375px;
        height: 200px;
        .van-cell {
          background: #FBFAFA;
        }
        /deep/ .van-field__label {
          width: 150px;
        }
        /deep/ input::-webkit-input-placeholder {
          text-align: right;
        }
      }
      .commission_rules {
        width: 375px;
        height: 200px;
      }
    }
  }
  /*顶部导航*/
  .van-nav-bar {
    height: 50px;
    line-height: 50px;
    .van-icon {
      color: #505050;
      font-size: 19.2px; 
    }
    .van-nav-bar__title {
      color: #50505;
      font-size: 19.2px; 
    }
  }
  

</style>
