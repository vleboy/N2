<template>
  <div class="personal">
    <div class="box">
      <van-nav-bar
        title="消息"
        left-arrow
        @click-left="onClickLeft"
      />
      <van-tabs v-model="active" swipeable title-active-color="#20a0ff" color="#20a0ff">
        <van-tab title="公告消息">
          <div class="noDada" v-if="isShow">
            <van-image
              width="100"
              height="100"
              :src="msg"
            />
            <div>暂无消息</div>
          </div>
        </van-tab>
        <van-tab title="联系我们">
          <div style="padding:0 .8rem;">
            <div class="list flex">
              <div class="flex">
                <van-image
                  round
                  width="30"
                  height="30"
                  src="https://img.yzcdn.cn/vant/cat.jpeg"
                  style="margin-right:1rem"
                />
                <div>
                  <div class="flex">
                    <div style="margin-right:0.5rem">合营部QQ</div>
                    <div>1线</div>
                  </div>
                  <div>87866091</div>
                </div>
              </div>
              <van-button type="info" size="small">复制</van-button>
            </div>
            <div class="list flex">
              <div class="flex">
                <van-image
                  round
                  width="30"
                  height="30"
                  src="https://img.yzcdn.cn/vant/cat.jpeg"
                  style="margin-right:1rem"
                />
                <div>
                  <div class="flex">
                    <div style="margin-right:0.5rem">合营部QQ</div>
                    <div>1线</div>
                  </div>
                  <div>87866091</div>
                </div>
              </div>
              <van-button type="info" size="small">复制</van-button>
            </div>
            <div class="list flex">
              <div class="flex">
                <van-image
                  round
                  width="30"
                  height="30"
                  src="https://img.yzcdn.cn/vant/cat.jpeg"
                  style="margin-right:1rem"
                />
                <div>
                  <div class="flex">
                    <div style="margin-right:0.5rem">合营部QQ</div>
                    <div>1线</div>
                  </div>
                  <div>87866091</div>
                </div>
              </div>
              <van-button type="info" size="small">复制</van-button>
            </div>
         </div>
        </van-tab>
        <van-tab title="在线客服">
          <div class="service">
            <van-button type="default" size="large">主线客服</van-button>
            <van-button type="default" size="large">次线客服</van-button>
          </div> 
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      isShow: true,//公告消息是否为空
      msg: require('../../../assets/images/home/nodata-search.png')
    }
  },
  methods: {
    onClickLeft() {
      this.$router.push('home')
    },
  }
}
</script>


<style lang="less" scoped>
  .personal {
    .flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .box {
      height: 100%;
      position: absolute;
      width: 100%;
      background: rgb(236, 236, 236);
      
      
    .noDada {
      position: absolute;
      top: 10rem;
      left: 50%;
      transform: translateX(-50%)
    }  
    .list {
      box-sizing: border-box;
      border-bottom:1px solid rgb(214, 212, 212);
      padding: .8rem;
      .van-button {
        border-radius: 20px;
        padding: 0 1rem;
      }
    }
    .service {
      padding: 0 1rem;
      margin-top: 50%;
      .van-button {
        border-radius: 10px;
        margin-bottom: .5rem;
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
      font-size: 1.2rem; 
    }
    .van-nav-bar__title {
      color: #505050;
      font-size: 1.2rem; 
    }
  }
  

</style>
