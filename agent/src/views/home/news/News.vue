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
          <div class="container" v-for="(item, index) in publicMsg" @click="showDetail(item.msg)">
            <div class="news">
              <div class="msg">{{item.msg}}</div>
              <div class="time">{{item.createAtStr}}</div>
            </div>
          </div>
          <div class="noDada" v-if="show1">
            <van-image
              width="100"
              height="100"
              :src="msg"
            />
            <div>暂无消息</div>
          </div>
        </van-tab>
        <van-tab title="私信消息">
          <div class="container" v-for="(item, index) in privateMsg" @click="showDetail(item.msg)">
            <div class="news">
              <div class="msg">{{item.msg}}</div>
              <div class="time">{{item.createAtStr}}</div>
            </div>
          </div>
          <div class="noDada" v-if="show2">
            <van-image
              width="100"
              height="100"
              :src="msg"
            />
            <div>暂无消息</div>
          </div>
        </van-tab>
      </van-tabs>
    </div>



    <van-dialog
      v-model="show"
      title="公告"
      closeOnClickOverlay
    >
      {{msgDetail}}
    </van-dialog>
  </div>
</template>

<script>
import {queryMessage} from '../../../service/index'
export default {
  data() {
    return {
      show: false,
      active: 0,
      msg: require('../../../assets/images/home/nodata-search.png'),
      publicMsg: [],
      privateMsg: [],
      msgDetail: ''
    }
  },
  computed: {
    show1() {
      return this.publicMsg.length == 0 ? true : false
    },
    show2() {
      return this.privateMsg.length == 0 ? true : false
    }
  },
  mounted() {
   this.getList()
  },
  methods: {
    onClickLeft() {
      this.$router.push('home')
    },
    getList() {
      let params1 = {
        project: 'all'
      }
      let params2 = {
        project: 'private'
      }
      queryMessage(params1).then(res => {
        this.publicMsg = res.res
      }) 
      queryMessage(params2).then(res => {
        this.privateMsg = res.res
      }) 
    },
    showDetail(val) {
      this.msgDetail = val
      this.show = true
    }
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
      .container {
       box-sizing: border-box;
       padding: 15px 15px 0 15px;
        .news {
          height: 100px;
          background: #fff;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-sizing: border-box;
          padding: 10px;
          border-radius: 5px;
          box-shadow: 0px 2px 10px rgb(88, 88, 88);
          .msg {
            text-indent:2em;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
          }
          .time {
            text-align: right;
          }
        }
      }
      .noDada {
        position: absolute;
        top: 30vh;
        left: 50%;
        transform: translateX(-50%)
      }  
      .list {
        box-sizing: border-box;
        border-bottom:1px solid rgb(214, 212, 212);
        padding: 12.8px;
        .van-button {
          border-radius: 20px;
          padding: 0 16px;
        }
      }
      .service {
        padding: 0 16px;
        margin-top: 50%;
        .van-button {
          border-radius: 10px;
          margin-bottom: 8px;
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
