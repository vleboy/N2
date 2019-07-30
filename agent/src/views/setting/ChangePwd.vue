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
    size="large"
  />
  <div class="sub">
    <van-button type="info" size="large" :disabled="isConfirm">确认</van-button>
  </div>
  
    </div>
  </div>
</template>

<script>
export default {
  name: 'chanePwd',
  data() {
    return {
      oldPwd: '',
      newPwd: '',
      confirmPwd: '',
      isConfirm: true
    }
  },
  methods: {
    onClickLeft() {
      this.$router.push('/setting')
    },
  }
}
</script>


<style lang="less" scoped>
  .chanePwd {
    
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
      font-size: 1.2rem; 
    }
    .van-nav-bar__title {
      color: #505050;
      font-size: 1.2rem; 
    }
    
  }
  .sub {
    padding: 0 1rem;
    .van-button {
        margin-top: 1rem;
        border-radius: 20px;
      }
  }
  /deep/ input::-webkit-input-placeholder {
    text-align: right;
  }
  

</style>
