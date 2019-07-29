<template>
  <div class="service">
   <div class="box">
     <div class="first">主线客服</div>
    <div class="second">次线客服</div>
   </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'service',
  data() {
    return {

    }
  }
}
</script>

<style lang="less" scoped>
  .service {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    overflow-y: auto;
    background: url('../assets/images/background/bg_service.jpg') no-repeat fixed;
    background-size: cover;
    .box {
      padding: 0 1rem;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      width: 20rem;
      .first {
        background: rgba(255, 255, 255, .3);
        height: 50px;
        margin-bottom: 10px;
        line-height: 50px;
        font-size: .9rem;
      }
      .second {
        background: rgba(255, 255, 255, .3);
        height: 50px;
        line-height: 50px;
        font-size: .9rem;
      }
    }
    
  }
</style>
