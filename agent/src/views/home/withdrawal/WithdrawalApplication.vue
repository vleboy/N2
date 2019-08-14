<template>
  <div class="home">
    <div class="top">
      <van-nav-bar
        title="取款申请"
        right-text="取款记录"
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
        :border="false"
      />
      <p class="fs12">可取款金额</p>
      <van-row>
        <van-col span="7"></van-col>
        <van-col span="10" class="col10">0.00</van-col>
        <van-col span="7"></van-col>
      </van-row>
      <van-row align="center">
        <van-col span="7" class="col7">
          <div>0.00</div>
          <div>锁定钱包</div>
        </van-col>
        <van-col span="10" class="col7">
          <div>2019-06</div>
          <div>发放月份</div>
        </van-col>
        <van-col span="7" class="col7">
          <div>0.00</div>
          <div>合计</div>
        </van-col>
      </van-row>
    </div>
    <div class="container">
      <!-- <van-cell-group>
        <van-field v-model="point" label="金额" placeholder="请输入金额" />
      </van-cell-group>
      <van-radio-group v-model="radio">
        <van-radio name="1">充值</van-radio>
        <van-radio name="2">提现</van-radio>
      </van-radio-group>-->
      <div class="cardInfo">
        <div class="card" v-for="(item, index) in cardList" :key="index">
          <van-swipe-cell>
            <template slot="default">
              <div>{{item.cardBank}}</div>
              <div class="no">{{cardNoFormat(item.cardNo)}}</div>
            </template>
            <template slot="right">
              <van-button square type="danger" text="删除" />
            </template>
          </van-swipe-cell>
        </div>
      </div>
      <div class="add" @click="addBankCard">
        <div>
          <van-icon name="plus" />
          <div>点击添加银行卡</div>
        </div>
      </div>
      <div class="sub">
        <van-button type="info" size="large" @click="showDialog = true">提交申请</van-button>
      </div>
    </div>
    <van-dialog
      v-model="showDialog"
      title="标题"
      show-cancel-button
    >
      <van-field v-model="point" label="金额" placeholder="请输入金额" />
      <van-radio-group v-model="radio">
        <van-cell-group>
          <van-cell v-for="(item, index) in cardList" :title="item.cardBank" clickable @click="radio = index">
            <van-radio slot="right-icon" name="1" />
          </van-cell>
          <!-- <van-cell title="单选框 1" clickable @click="radio = '1'">
            <van-radio slot="right-icon" name="1" />
          </van-cell>
          <van-cell title="单选框 2" clickable @click="radio = '2'">
            <van-radio slot="right-icon" name="2" />
          </van-cell> -->
        </van-cell-group>
      </van-radio-group>
    </van-dialog>
    <van-number-keyboard
      :show="show"
      theme="custom"
      extra-key="."
      close-button-text="完成"
      @blur="show = false"
      @input="onInput"
    />
  </div>
</template>

<script>
import { getCardList } from "../../../service/index";
import { log } from 'util';
export default {
  data() {
    return {
      show: false,
      radio: "1",
      point: "",
      cardList: [],
      showDialog: false
    };
  },
  mounted() {
    this.getCardList()
  },
  computed: {
    
  },
  methods: {
    cardNoFormat(val) {
      let length = val.length - 4
      return '**** **** **** ' + val.substr(length)
    },
    getCardList() {
      getCardList().then(res => {
        this.cardList = res
      }).catch(err => {

      })
    },
    onClickLeft() {
      this.$router.push("home");
    },
    onClickRight() {
      this.$router.push("WithdrawalRecord");
    },
    sub() {
      /* let params = {
        project: this.radio,
        amount: this.point
      };
      createReview(params)
        .then(res => {
          console.log("success");
        })
        .catch(err => {
          console.log("err");
        }); */
    },
    addBankCard() {
      this.$router.push({ name: "addBankCard" });
    },
    onInput(key) {
      this.point += key;
    },
    /* onDelete(key) {
      this.point -= this.point.substring(this.point.length - 1)
    },*/
    showKeyboard() {
      console.log(1);
      console.log(document.activeElement);
      this.show = true;
      document.activeElement.blur();
    }
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
    height: 160px;
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
        background: green;
        box-sizing: border-box;
        padding: 10px 0 10px 10px;
        color: #fff;
        height: 80px;
        border-radius: 5px;
        margin-bottom: 10px;
        .no {
          margin-top: 10px;
          font-size: 20px;
        }
        .van-button {
          height: 100%;
        }
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
      background: rgb(230, 230, 230);
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
