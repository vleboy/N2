<template>
  <div class="home">
    <div class="top">
      <van-nav-bar
        title="存款申请"
        left-arrow
        @click-left="onClickLeft"
        :border="false"
      />
    </div>
    <div class="container">
      <van-field v-model="value" label="申请金额" :placeholder="pointHolder" :error="pointErr" @focus="pointFocus" @touchstart.native.stop="show = true" clickable/>
      <div class="sub">
        <van-button type="info" size="large" @click="sub">提交申请</van-button>
      </div>
    </div>
     <van-number-keyboard
      v-model="value"
      :show="show"
      :maxlength="6"
      theme="custom"
      close-button-text="完成"
      extra-key="."
      @blur="show = false"
    /> 
  </div>
</template>

<script>
import { createReview } from "../../../service/index";
export default {
  beforeRouteEnter(to, from, next) {
    let token = window.localStorage.getItem('playerToken')
    if (token) {
      next()
    }  else {
      next({
        name: 'login',
        query: {
          redirect: to.fullPath
        }
      })
    }
  },
  data() {
    return {
      show: false,
      value: "",
      pointErr: false,
      pointHolder: '请输入金额',
    };
  },
  mounted() {

  },
  computed: {
    
  },
  methods: {
    pointFocus() {
      document.activeElement.blur()
      this.pointErr = false
      this.pointHolder = '请输入金额'
    },
    
    onClickLeft() {
      this.$router.push("home");
    },
    sub() {
       let params = {
        project: 1, //-1代表取款(提现)
        amount: this.value,
      };
      if (this.value != '') {
        createReview(params)
        .then(res => {
          this.$notify({
            message: '存款成功',
            duration: 1000,
            background: 'green'
          })
          this.pointErr = false
          this.value = ''
        })
        .catch(err => {
          this.value = ''
          this.pointHolder = err.res
          this.pointErr = true
        });
      } else {
        this.pointErr = true
      }
    },
  }
};
</script>


<style lang="less" scoped>
.home {
  position: absolute;
  width: 100%;
  height: 100%;
  .top {
    box-sizing: border-box;
    background: #6cbfff;
    height: 80px;
    position: relative;
    padding-top: 10px;
    box-sizing: border-box;
    p {
      margin: 0;
      color: #fff;
      text-align: center;
      margin-bottom: 8px;
    }
    .detail {
      display: flex;
      justify-content: space-around;
      color: #fff;
      div {
        text-align: center;
        font-size: 12.8px;
      }
    }
  }
  .container {
    .cardInfo {
      box-sizing: border-box;
      padding:0 16px;
      margin: 10px 0;
      .card {
        background: url('../../../assets/images/home/card.png') no-repeat;
        background-size: cover;
        box-sizing: border-box;
        padding: 0 0 0 10px;
        color: #fff;
        height: 80px;
        border-radius: 5px;
        margin-bottom: 10px;
        .no {
          margin-top: 10px;
          font-size: 20px;
        }
        .van-swipe-cell {
          height: 80px;
        }
        .van-button {
          height: 80px;
          border-radius: 0 5px 5px 0;
        }
      }
      .cardBg {
        background: url('../../../assets/images/home/card_select.png') no-repeat;
        background-size: cover;
      }
    }
    .add {
      padding: 0 16px;
      > div {
        background: rgb(230, 230, 230);
        height: 80px;
        text-align: center;
        color: rgb(201, 201, 201);
        box-sizing: border-box;
        padding: 16px 0;
      }
    }
    .sub {
      position: fixed;
      width: 100%;
      box-sizing: border-box;
      padding: 0 16px;
      height: 80px;
      bottom: 0px;
      .van-button {
        border-radius: 20px;
      }
    }
  }
  /*顶部导航*/
  .van-nav-bar {
    height: 50px;
    line-height: 50px;
    background: rgba(255, 255, 255, 0);
    .van-nav-bar__text {
      color: #fff;
    }
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

.col7 {
  text-align: center;
  color: #fff;
  font-size: 13px;
}
.col10 {
  text-align: center;
  color: #fff;
  font-size: 23px;
}
</style>
