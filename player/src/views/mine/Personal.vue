<template>
  <div class="personal">
    <div class="box">
      <van-nav-bar
        title="个人资料"
        left-arrow
        @click-left="onClickLeft"
      />
      <van-cell title="玩家ID" :value="userInfo.id" ize="large"/>
      <van-cell title="玩家账号" :value="userInfo.playerName" size="large"/>
      <van-cell title="玩家昵称" :value="userInfo.playerNick" size="large"/>
      <div class="edit">
        <p>如需修改个人信息请联系</p>
        <a href="#">在线客服</a>
      </div>
    </div>
  </div>
</template>

<script>
import {playerGet} from '../../service/index'
export default {
  data() {
    return {
      userInfo: {}
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    getList() {
      let params = {
        id: JSON.parse(localStorage.playerInfo).id
      }
      playerGet(params).then(res => {
        this.userInfo = res.res
      })
    }
  }
}
</script>


<style lang="less" scoped>
  .personal {
    text-align: left;
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
