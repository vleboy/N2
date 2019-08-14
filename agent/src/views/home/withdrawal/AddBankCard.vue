<template>
  <div class="home">
    <van-nav-bar title="添加银行卡" left-arrow @click-left="onClickLeft" />
    <div class="container">
      <van-cell-group>
        <van-field v-model="cardBank" label="开户行" placeholder="请输入开户行" />
        <van-field v-model="cardName" label="持卡人" placeholder="请输入持卡人姓名" />
        <van-field v-model="cardNo" label="银行卡号" placeholder="请输入银行卡号" />
      </van-cell-group>
      <div class="confirm">
        <van-button type="info" size="large" :disabled="isConfirm" @click="sub">确认</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import {addBankCard} from '../../../service/index'
export default {
  data() {
    return {
      cardBank: '',
      cardName: '',
      cardNo: '',
      isShow: true,
      noData: require("../../../assets/images/home/no_data.jpg")
    };
  },
  computed: {
    isConfirm() {
      if (this.cardBank != '' && this.cardName != '' && this.cardNo != '') {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    sub() {
      let params = {
        cardBank: this.cardBank,
        cardName: this.cardName,
        cardNo: this.cardNo
      }
      addBankCard(params).then(res => {
        this.$notify({
          message: '银行卡绑定成功',
          duration: 1000,
          background: 'green'
        })
        this.$router.push({name: 'withdrawalApplication'})
      })
    }
  }
};
</script>


<style lang="less" scoped>
.home {
  .container {
    .confirm {
      box-sizing: border-box;
      padding: 0 10px;
      .van-button {
        box-sizing: border-box;
        margin-top: 20px;
        border-radius: 20px;
      }
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
    color: #505050;
    font-size: 19.2px;
  }
}
</style>
