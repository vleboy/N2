<template>
  <div class="personal">
    <div class="box">
      <van-nav-bar
        title="存款通道费"
        left-arrow
        @click-left="onClickLeft"
      />
      <div class="table">
        <table>
          <tr>
            <th>操作人</th>
            <th>金额</th>
            <th>通道费</th>
            <th>时间</th>
          </tr>
          <tr v-for="(item, index) in data">
            <td>{{item.ownerName}}</td>
            <td style="color: red;">{{formatConfig(item.amount)}}</td>
            <td >{{formatConfig(item.channelFee)}}</td>
            <td>{{createAtConfig(item.createAt)}}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import {depositBill} from '../../../service/index'
import { formatMoney } from '../../../config/format'
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
    formatConfig(num) {
      return formatMoney(num)
    },
    createAtConfig(val) {
      return dayjs(val).format('YY/MM/DD HH:mm')
    },
    onClickLeft() {
      this.$router.push('/financeReport')
    },
    getList() {
      let params = {
        project: 'deposit'
      }
      depositBill(params).then(res => {
        this.data = res
      }).catch(err => {

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
