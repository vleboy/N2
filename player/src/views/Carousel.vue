<template>
  <div>
    <div class="examples">
      <div class="bannerBox">
        <div class="swiper-container">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(item,index) in banner" :key="index">
              <img :src="item.picture_path" alt />
            </div>
          </div>
          <div class="swiper-pagination"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swiper from "swiper";
import "swiper/dist/css/swiper.min.css";
export default {
  data() {
    return {
      bannerIndex: 0,
      banner: [
        {
          picture_path: require('../assets/images/home/h1.jpg')
        },
        {
          picture_path: require('../assets/images/home/h2.jpg')
        },
        {
          picture_path: require('../assets/images/home/h3.jpg')
        },
        {
          picture_path: require('../assets/images/home/h4.jpg')
        },
         {
          picture_path: require('../assets/images/home/h5.jpg')
        },
        {
          picture_path: require('../assets/images/home/h6.jpg')
        },
        {
          picture_path: require('../assets/images/home/h7.jpg')
        },
        {
          picture_path: require('../assets/images/home/h8.jpg')
        },
       {
          picture_path: require('../assets/images/home/h9.jpg')
        }
      ]
    };
  },
  mounted() {
    let that = this;
    /* eslint-disable */
    let mySwiper = new Swiper(".swiper-container", {
      pagination: {
        el: '.swiper-pagination',
      },
      direction: "horizontal", //滑动方向，可设置水平(horizontal)或垂直(vertical)。
      loop: true, // 设置为true 则开启loop模式
      autoplay: {
        delay: 3000, //1秒切换一次
        disableOnInteraction: false //用户操作后不会停止
      },
      slidesPerView: "auto", // 设置slider容器能够同时显示的slides数量(carousel模式)。类型：number or auto
      centeredSlides: true, // 设定为true时，active slide会居中，而不是默认状态下的居左。
      spaceBetween: 10, // 在slide之间设置距离（单位px）。
      loopAdditionaSlider: 0, // loop模式下会在slides前后复制若干个slide,，前后复制的个数不会大于原总个数。
      /* on: {
        slideChangeTransitionEnd: function() {
          if (this.activeIndex === 8 || this.activeIndex === 4) {
            that.bannerIndex = 1;
          } else {
            that.bannerIndex = this.activeIndex - 3;
          }
        }
      } */
    });
  }
};
</script>

<style lang="less" scoped>
.examples {
  font-size: 14px;
  height: 140px;
  .tips {
    bottom: 0px;
    width: 100%;
    height: 46px;
    background-color: #b5654d;
    text-align: center;
    img {
      width: 12px;
      height: 14px;
      color: #fff;
    }
    p {
      width: 240px;
      text-align: left;
      color: #fff;
      font-size: 12px;
     
      line-height: 16px;
    }
  }
}

.bannerIndex {
  line-height: 40px;
  text-align: center;
  color: #666666;
  font-size: 15px;
  text-align: center;
  span {
    color: #b5654d;
  }
}
.bannerBox {
  height: 140px;
}
.swiper-container {
  width: 100%;
  height: 140px;
}
.swiper-container .swiper-wrapper .swiper-slide {
  width: 80% !important;
  overflow: hidden;
  display: flex;
  align-items: center;
  transition: all 0.1s linear;
}
.swiper-container .swiper-wrapper .swiper-slide img {
  width: 100%;
  height: 140px;
  border-radius: 5px;
 
}
.swiper-container .swiper-wrapper .swiper-slide-prev,
.swiper-container .swiper-wrapper .swiper-slide-next {
  height: 120px !important;
  margin-top: 20px;
}
.swiper-container .swiper-wrapper .swiper-slide-prev img,
.swiper-container .swiper-wrapper .swiper-slide-next img {
  width: 100%;
  height: 140px;
}
/deep/ .swiper-container .swiper-wrapper .swiper-slide-prev[data-v-cb1178cc], .swiper-container .swiper-wrapper .swiper-slide-next[data-v-cb1178cc] {
  margin-top: 10px;
}
/deep/ .swiper-pagination-bullet {
  border: 1px solid #fff;
  background: transparent;
}
//激活状态分页器颜色
/deep/.swiper-pagination-bullet-active {
  background: #fff !important;
}
</style>