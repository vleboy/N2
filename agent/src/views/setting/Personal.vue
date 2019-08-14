<template>
  <div class="personal">
    <div class="box">
      <van-nav-bar
        title="个人信息"
        left-arrow
        @click-left="onClickLeft"
      />
      <van-cell title="用户账号" value="ff88808" size="large"/>
      <van-cell title="用户昵称" size="large"/>
      <van-cell title="邮箱地址" size="large"/>
      <van-cell title="手机号码" size="large"/>
      <van-cell title="下线用户" value="2" size="large"/>
      <div class="edit">
        <p>如需修改个人信息请联系</p>
        <a href="#">在线客服</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    onClickLeft() {
      this.$router.push('/setting')
    },
  }
}
</script>


<style lang="less" scoped>
  .personal {
    .box {
      height: 100%;
      position: absolute;
      width: 100%;
      background: rgb(236, 236, 236);
      .edit {
        display: flex;
        align-items: center;
        padding-left: 16px;
        justify-content: center;
        color: rgb(196, 196, 196);
        margin-top: 10px;
        a {
          margin-left: 8px;
          color: #20a0ff;
        }
        p {
          margin: 0;
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
