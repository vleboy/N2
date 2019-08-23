<template>
  <div class="main">
      <router-view></router-view>
    <div class="tabbar">
      <van-tabbar v-model="active" active-color="#20a0ff" inactive-color="#A2A2A2" fixed :z-index="99" route>
        <van-tabbar-item to="/home">
          <span>首页</span>
          <img slot="icon" slot-scope="props" :src="props.active ? home.active : home.normal">
        </van-tabbar-item>
        <van-tabbar-item to="/player">
          <span>玩家</span>
          <img slot="icon" slot-scope="props" :src="props.active ? vip.active : vip.normal">
        </van-tabbar-item>
        <van-tabbar-item to="/agent">
          <span>代理</span>
          <img slot="icon" slot-scope="props" :src="props.active ? agent.active : agent.normal">
        </van-tabbar-item>
        <van-tabbar-item to="/setting">
          <span>设置</span>
          <img slot="icon" slot-scope="props" :src="props.active ? setting.active : setting.normal">
        </van-tabbar-item>
      </van-tabbar>
    </div> 
  </div>
</template>

<script>


export default {
  name: 'home',
  data() {
    return {
      active: 1,
      home: {
        normal: require('../assets/images/home/home.png'),
        active: require('../assets/images/home/home_active.png')
      },
      agent: {
       normal: require('../assets/images/agent/agent.png'),
        active: require('../assets/images/agent/agent_active.png')
      },
      vip: {
        normal: require('../assets/images/vip/vip.png'),
        active: require('../assets/images/vip/vip_active.png')
      },
      setting: {
        normal: require('../assets/images/setting/setting.png'),
        active: require('../assets/images/setting/setting_active.png')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
</style>
