<template>
  <div class="index">
    <Carousel/>
    <div class="container">
      <van-notice-bar :text="notice" left-icon="volume-o" background="transparent" color="#fff" />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Carousel from './Carousel.vue'

export default {
  name: 'index',
  components: {
    Carousel
  },
  data() {
    return {
      notice: '足协杯战线连续第2年上演广州德比战，上赛季半决赛上恒大以两回合5-3的总比分淘汰富力。'
    }
  }
}
</script>

<style lang="less" scoped>
  .index {
    padding-top: 20px;
    background: blue;
    .container {
      padding: 0 8px;
      margin-top: 5px;
    }
  }
</style>
