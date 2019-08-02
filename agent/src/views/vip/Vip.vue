<template>
  <div class="vip">
    <van-nav-bar
      title="VIP专享"
  />
    <div class="box">
      <div class="mark">备注:高级VIP如果未达到本等级增长要求,可对应等级的增长标准与奖励制度执行</div>
      <div>VIP代理升级</div>
    </div>
  </div>
</template>

<script>
export default {
  
}
</script>


<style lang="less" scoped>
  .vip {
    font-size: 16px;
    color: #515151;
    /*顶部导航*/
  .van-nav-bar {
    height: 50px;
    line-height: 50px;
    .van-icon {
      color: #515151;
      font-size: 19.2px; 
    }
    .van-nav-bar__title {
      color: #50505;
      font-size: 19.2px; 
    }
  }
    .box {
      padding: 0 16px;
      .mark {
        font-size: 12.8px;
        padding: 10px 0;
      }
    }
  }

</style>
