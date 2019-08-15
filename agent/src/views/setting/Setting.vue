<template>
  <div class="setting">
    <van-nav-bar
      title="设置"
  />
    <div class="box">
      <van-cell title="个人信息" is-link size="large" to="personal" />
      <van-cell title="修改密码" is-link size="large" to="changePwd"/>
      <van-cell title="关于YIBO" is-link size="large"/>
      <van-button type="info" round size="large" @click="logout">退出登录</van-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'setting',
  data() {
    return {

    }
  },
  methods: {
    logout() {
      this.$dialog.confirm({
        title: '退出当前账号',
        message: '确定退出当前账号?'
      }).then(() => {
        localStorage.clear();
        this.$router.push({ name: "login" });
      }).catch(err => {
        return
      })
    }
  }  
}
</script>

<style lang="less" scoped>
  .setting {
    color: #515151;
    /*顶部导航*/
  .van-nav-bar {
    height: 50px;
    line-height: 50px;
    .van-icon {
      color: #505050;
      font-size: 20px; 
    }
    .van-nav-bar__title {
      color: #505050;
      font-size: 20px; 
    }
  }
    .box {
      padding: 8px;
      .van-cell {
        margin-bottom:5px;
      }
      .van-button {
        margin-top: 16px;
        padding: 0 40px;
      }
    }
  }
</style>

