<template>
  <div class="personal">
    <div class="box">
      <van-nav-bar
        title="取款记录"
        left-arrow
        @click-left="onClickLeft"
      />
      <div class="table">
        <table>
          <tr>
            <th>操作金额</th>
            <th>余额</th>
            <th>时间</th>
          </tr>
          <tr v-for="(item, index) in data">
            <td>{{item.amount}}</td>
            <td>{{item.balance}}</td>
            <td>{{createAtConfig(item.minCreateAt)}}</td>
          </tr>
        </table>
      </div>
      <div v-if="isBottom">已经到底了....</div>
    </div>
  </div>
</template>

<script>
import {billPage} from '../../service/index'
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
    amountConfig(val) {
      let color =  val > 0 ? 'green' : 'red'
      let platFee = val > 0 ? `+${val}` : `${val}`
      return {
        color,
        platFee
      }
    },
    createAtConfig(val) {
      return dayjs(val).format('YY/MM/DD HH:mm')
    },
    onClickLeft() {
      this.$router.go(-1)
    },
    getList() {
      let params = {
        project: 'withdraw',
        startKey: this.startKey
      }
      billPage(params).then(res => {
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
