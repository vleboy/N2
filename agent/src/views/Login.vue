<template>
  <div class="login">
    <div class="container">
      <div class="logo">
        <p>
          <img :src="logo" alt="" class="logo1">
        </p>
      </div>
      <div class="form">
        <van-field
          v-model="username"
          :left-icon="userIcon"
          :border="false"
        />
        <van-field
          v-model="pwd"
          :left-icon="pwdIcon"
          :border="false"
          style="margin-top:30px"
        />
        <van-button type="info" size="large" :disabled="logInStatus" @click="login">登&emsp;录</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import bcrypt from "bcryptjs";
import {logIn} from '../service/index'
export default {
  name: 'login',
  data() {
    return {
      logo: require('../assets/images/logo.png'),
      userIcon: require('../assets/images/user.png'),
      pwdIcon: require('../assets/images/pwd.png'),
      username: '',
      pwd: '',
    }
  },
  computed: {
    logInStatus() {
      if (this.username != '' && this.pwd != '') {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    login() {
      let params = {
        userName: this.username,
        userPwd: bcrypt.hashSync(this.pwd, 10),
        mobile: true
      }
      logIn(params).then(res => {
        localStorage.setItem("Token", res.token);
        setTimeout(() => localStorage.removeItem("Token"), 259200000);
        this.$router.push('/home')
      }).catch(err => {
        this.pwd = ''
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  font-size: 100px !important;
  box-sizing: border-box;
  padding: 80px 30px;
  .container {
   
    .logo {
    p {
      margin: 0;
      text-align: center;
      .logo1 {
        width: 150px;
      }
    }
  }
  .form {
    /deep/ .van-field__left-icon {
       width: 25px;
      height: 25px;
    }
    /deep/ .van-icon {
       width: 25px;
      height: 25px;
    }
    /deep/ .van-field__body {
      height: 25px;
    }
    /deep/.van-icon__image {
       width: 25px;
      height: 25px;
    }
    /deep/.van-image__error, /deep/.van-image__img, /deep/.van-image__loading {
      width: 25px;
      height: 25px;
    }
    margin-top: 50px;
    /deep/.van-field__control {
      padding-left: 30px;
      height: 25px;
    }
    .van-button {
      border-radius: 30px;
      margin-top: 50px;
    }
  }
  }
  
}
</style>
