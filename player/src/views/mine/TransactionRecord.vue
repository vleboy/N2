<template>
  <div class="personal">
    <div class="box">
      <van-nav-bar
        title="交易记录"
        left-arrow
        @click-left="onClickLeft"
      />
      <div class="table">
        <table>
          <tr>
            <th>游戏</th>
            <th>输赢</th>
            <th>时间</th>
          </tr>
          <tr v-for="(item, index) in data">
            <td>{{item.sourceGameIdStr}}</td>
            <td :style="{color: item.winloseAmount > 0 ? 'red' : 'green'}">{{item.winloseAmount}}</td>
            <td>{{createAtConfig(item.minCreateAt)}}</td>
          </tr>
        </table>
      </div>
      <div v-if="isBottom" style="margin-top:10px;color:gray;">已经到底了</div>
    </div>
  </div>
</template>

<script>
import {vroundPage} from '../../service/index'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      data: [],
      startKey: ''
    }
  },
  computed: {
    isBottom() {
      return this.startKey == null ? true : false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    this.getList(Window.sc)
  },
  methods: {
    createAtConfig(val) {
      return dayjs(val).format('YY/MM/DD HH:mm')
    },
    onClickLeft() {
      this.$router.go(-1)
    },
    getList() {
      let params = {
        startKey: this.startKey
      }
      vroundPage(params).then(res => {
        this.data = this.data.concat(res.res)
        this.startKey = res.startKey
      })
    },
    handleScroll () {
      //变量scrollTop是滚动条滚动时，距离顶部的距离
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      //变量windowHeight是可视区的高度
   		var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
   		//变量scrollHeight是滚动条的总高度
   		var scrollHeight = document.documentElement.scrollHeight||document.body.scrollHeight;
      //判断是否到底
      if(scrollTop+windowHeight==scrollHeight && scrollTop != 0){
        if (this.startKey != null) {
          this.getList()
        }
       } 
    },
  },
  watch: {
    
  }
}
</script>


<style lang="less" scoped>
  .personal {
    .box {
      height: 100%;
      position: absolute;
      width: 100%;
      .edit {
        display: flex;
        align-items: center;
        padding-left: 16px;
        color: rgb(196, 196, 196);
        a {
          margin-left: 8px;
          color: #20a0ff;
        }
      }
      table {
        width: 100%;
        border-collapse: collapse;
        text-align: center;
        tr {
          height: 50px;
          &:nth-child(2n) {
              background: #FBFBFB;
            }
          th {
            font-weight: normal;
          }
          td {
            
          }
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
