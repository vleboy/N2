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
    color: #515151;
    /*顶部导航*/
  .van-nav-bar {
    height: 50px;
    line-height: 50px;
    .van-icon {
      color: #515151;
      font-size: 1.2rem; 
    }
    .van-nav-bar__title {
      color: #50505;
      font-size: 1.2rem; 
    }
  }
    .box {
      padding: 0 1rem;
      .mark {
        font-size: .8rem;
        padding: 10px 0;
      }
    }
  }

</style>
