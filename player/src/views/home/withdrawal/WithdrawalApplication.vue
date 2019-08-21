<template>
  <div class="home">
    <div class="top">
      <van-nav-bar
        title="取款申请"
        left-arrow
        @click-left="onClickLeft"
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
          
        </van-col>
        <van-col span="10" class="col7">
          <div>发放月份</div>
          <div>2019-06</div>
        </van-col>
        <van-col span="7" class="col7">
          
        </van-col>
      </van-row>
    </div>
    <div class="container">
      <van-field v-model="value" label="申请金额" :placeholder="pointHolder" :error="pointErr" @focus="pointFocus" @touchstart.native.stop="show = true" clickable/>
      <div class="cardInfo">
        <div class="card" :class="{cardBg: actCard == index}" v-for="(item, index) in cardList" :key="index" @click="checkBankCard(item, index)">
          <van-swipe-cell>
            <template slot="default">
              <div style="padding-top:10px">{{item.cardBank}}</div>
              <div class="no">{{cardNoFormat(item.cardNo)}}</div>
            </template>
            <template slot="right">
              <van-button @click="deleteCard(item.cardNo)" square type="danger" text="删除" />
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
import { getCardList, createReview, deleteBankCard } from "../../../service/index";
import { log } from 'util';
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
      radio: 0,
      value: "",
      pointErr: false,
      pointHolder: '请输入金额',
      cardList: [],
      cardBank: '',
      cardName: '',
      cardNo: '',
      show: false,
      actCard: 0
    };
  },
  mounted() {
    this.getCardList()
  },
  computed: {
    
  },
  methods: {
    pointFocus() {
      document.activeElement.blur()
      this.pointErr = false
      this.pointHolder = '请输入金额'
    },
    cardNoFormat(val) {
      let length = val.length - 4
      return '**** **** **** ' + val.substr(length)
    },
    getCardList() {
      getCardList().then(res => {
        this.cardList = res
        this.checkBankCard(this.cardList[0], 0)
      }).catch(err => {

      })
    },
    checkBankCard(val, index) {
      this.actCard = index
      this.cardBank = val.cardBank
      this.cardName = val.cardName
      this.cardNo = val.cardNo
    },
    onClickLeft() {
      this.$router.push("home");
    },
    deleteCard(val) {
      this.$dialog.confirm({
        title: '删除银行卡',
        message: '确定删除银行卡?'
      }).then(() => {
        deleteBankCard({cardNo: val}).then(res => {
        this.$notify({
          message: '删除成功',
          duration: 1000,
          background: 'green'
        })
          this.getCardList()
        }).catch(err => {
          this.$notify({
            message: res.res,
            duration: 1000,
            background: 'red'
          })
        })
      });
      
    },
    sub() {
       let params = {
        project: -1, //-1代表取款(提现)
        amount: this.value,
        cardBank: this.cardBank,
        cardName: this.cardName,
        cardNo: this.cardNo
      };
      console.log(params)
      if (this.value != '') {
        createReview(params)
        .then(res => {
          this.$notify({
            message: '取款成功',
            duration: 1000,
            background: 'green'
          })
          this.pointErr = false
          this.value = ''
          this.getCardList()
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
    addBankCard() {
      this.$router.push({ name: "addBankCard" });
    },
    onInput(key) {
      this.point += key;
    },
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
