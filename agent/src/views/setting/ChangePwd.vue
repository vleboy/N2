<template>
  <div class="chanePwd">
    <div class="box">
      <van-nav-bar
        title="修改密码"
        left-arrow
        @click-left="onClickLeft"
      />
    <van-field
      v-model="oldPwd"
      type="password"
      label="原始密码"
      placeholder="请输入原始密码"
      size="large"
    />
    <van-field
      v-model="newPwd"
      type="password"
      label="新密码"
      placeholder="请输入新密码"
      size="large"
    />
    <van-field
      v-model="confirmPwd"
      type="password"
      label="确认密码"
      placeholder="请再次输入新密码"
      :error-message="errMsg"
      size="large"
    />
    <div class="sub">
      <van-button type="info" size="large" :disabled="isConfirm" @click="sub">确认</van-button>
    </div>
    </div>
  </div>
</template>

<script>
import {updatePwd} from '../../service/index'
export default {
  name: 'chanePwd',
  data() {
    return {
      oldPwd: '',
      newPwd: '',
      confirmPwd: '',
      errMsg: ''      
    }
  },
  computed: {
    isConfirm() {
      if (this.oldPwd != '' && this.newPwd != '' && this.confirmPwd != '') {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    onClickLeft() {
      this.$router.push('/setting')
    },
    sub() {
      if (this.newPwd != this.confirmPwd) {
        this.errMsg = '两次密码不一致'
        this.newPwd = ''
        this.confirmPwd = ''
      } else {
        this.errMsg = ''
        let params = {
          oldPwd: this.oldPwd,
          userPwd: this.newPwd
        }
        updatePwd(params).then(res => {
          this.$notify({
            message: '密码修改成功,请重新登录',
            duration: 1000,
            background: 'green'
          })
          this.$router.push({name: 'login'})
        }).catch(err => {
          this.oldPwd = ''
          this.newPwd = ''
          this.confirmPwd = ''
        })
      }
    }
  }
}
</script>


<style lang="less" scoped>
  .chanePwd {
    font-size: 16px;
    .box {
      height: 100%;
      position: absolute;
      width: 100%;
      background: rgb(236, 236, 236);
      
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
  .sub {
    padding: 0 16px;
    .van-button {
        margin-top: 16px;
        border-radius: 20px;
      }
  }
  /deep/ input::-webkit-input-placeholder {
    text-align: right;
  }
  

</style>
