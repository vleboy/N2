<template>
  <div class="main">
    <router-view />
    <div class="tabbar">
      <van-tabbar v-model="active" active-color="#937769" inactive-color="#999" route>
        <van-tabbar-item icon="home-o" to="/test">
          <span>测试</span>
          <img
            slot="icon"
            slot-scope="props"
            :src="props.active ? home.active : home.normal"
          >
        </van-tabbar-item>
        <van-tabbar-item icon="home-o" to="/home">
          <span>首页</span>
          <img
            slot="icon"
            slot-scope="props"
            :src="props.active ? home.active : home.normal"
          >
        </van-tabbar-item>
        <van-tabbar-item icon="search" to="/discount">
          <span>优惠</span>
          <img
            slot="icon"
            slot-scope="props"
            :src="props.active ? discount.active : discount.normal"
          >
        </van-tabbar-item>
        <van-tabbar-item to="/service">
          <span>客服</span>
          <img
            slot="icon"
            slot-scope="props"
            :src="props.active ? service.active : service.normal"
          >
        </van-tabbar-item>
        <van-tabbar-item icon="setting-o" to="/mine">
          <span>我的</span>
          <img
            slot="icon"
            slot-scope="props"
            :src="props.active ? mine.active : mine.normal"
          >
        </van-tabbar-item>
      </van-tabbar>

    </div>
  </div>
</template>

<script>


export default {
  name: 'index',
  data() {
    return {
      active: '首页',
      home: {
        normal: require("../assets/images/tabbar/icon_tab_home_normal.png"),
        active: require("../assets/images/tabbar/icon_tab_home_sel.png")
      },
      discount: {
        normal: require("../assets/images/tabbar/icon_tab_discount_normal.png"),
        active: require("../assets/images/tabbar/icon_tab_discount_sel.png")
      },
      service: {
        normal: require("../assets/images/tabbar/icon_tab_service_normal.png"),
        active: require("../assets/images/tabbar/icon_tab_service_sel.png")
      },
      mine: {
        normal: require("../assets/images/tabbar/icon_tab_mine_normal.png"),
        active: require("../assets/images/tabbar/icon_tab_mine_sel.png")
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .tabbar {
    margin-top:80px;
   
    /deep/.van-tabbar {
      height: 6vh;
       /* background: url('../assets/images/tabbar/btn_close_pressed.png') no-repeat fixed; */
      background: rgb(235, 233, 226);
    }
  }
</style>
