<template>
  <div class="home">
    <div class="top">
      <van-nav-bar
        title="银行卡号"
        left-arrow
        @click-left="onClickLeft"
        :border="false"
      />
    </div>
    <div class="container">
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
    </div>
  </div>  
</template>

<script>
import { getCardList, createReview, deleteBankCard } from "../../service/index";
import { log } from 'util';
export default {
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
    addBankCard() {
      this.$router.push({ name: "addBankCard" });
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
        background: url('../../assets/images/mine/card.png') no-repeat;
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
        background: url('../../assets/images/mine//card_select.png') no-repeat;
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
