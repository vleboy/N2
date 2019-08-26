<template>
  <div class="personal">
    <div class="box">
      <van-nav-bar
        title="平台费"
        left-arrow
        @click-left="onClickLeft"
      />
      <div class="table">
        <table>
          <tr>
            <th>平台</th>
            <th>平台费</th>
          </tr>
          <tr v-for="(item, index) in data">
            <td>{{item.plat}}</td>
            <td>{{item.platFee}}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import {platformBill} from '../../../service/index'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      data: [
        
      ]
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    createAtConfig(val) {
      return dayjs(val).format('YY/MM/DD HH:mm')
    },
    onClickLeft() {
      this.$router.push('/financeReport')
    },
    getList() {
      platformBill().then(res => {
        this.data = res
      })
    },
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
