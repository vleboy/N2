<template>
  <div class="box">
    <div style="background:red"></div>
    <div style="background:blue"></div>
    <div style="background:yellow"></div>
    <div style="background:green"></div>
  </div>  
</template>

<script>
export default {
  
}
</script>

<style lang="less" scoped>
  .box {
    position: absolute;
    width: 100%;
    height: 100%;
    div {
      height: 25%;
      width: 100%;
    }
  }
</style>