<template>
  <div class="playerBill">
    <div class="content">
        <div class="fl">
          <Input v-model="ownerId" size="small">
            <span slot="prepend">玩家ID</span>
          </Input>
        </div>
        <div class="fl">
          <Input v-model="ownerName" size="small">
            <span slot="prepend">玩家账号</span>
          </Input>
        </div>
        <div class="fl">
          <Input v-model="ownerNick" size="small">
            <span slot="prepend">玩家昵称</span>
          </Input>
        </div>

        <div class="fl">
          <Button type="primary" @click="search" size="small" class="search">搜索</Button>
          <Button @click="reset" size="small">重置</Button>
        </div>
      </div>
    <div>
      <Table :columns="columns" :data="billList" size="small">
        <template #createAt="row">
          {{createAtConfig(row)}}
        </template>
      </Table>
    </div>
    <Spin size="large" fix v-show="spinShow" style="z-index:200;">
      <Icon type="ios-loading" size="64" class="demo-spin-icon-load"></Icon>
      <div style>加载中...</div>
    </Spin>
  </div>  
</template>

<script>
import dayjs from 'dayjs'
import {queryBill} from '../../service/index'
export default {
  data() {
    return {
      spinShow: false,
      ownerId: '',
      ownerName: '',
      ownerNick: '',
      columns: [
        {
          title: '玩家账号',
          align: 'center',
          key: 'ownerName'
        },
        {
          title: '玩家ID',
          align: 'center',
          key: 'ownerId'
        },
        {
          title: '玩家昵称',
          align: 'center',
          key: 'ownerNick'
        },
        {
          title: '操作类型',
          align: 'center',
          key: 'project'
        },
        {
          title: '操作金额',
          align: 'center',
          key: 'amount'
        },
        {
          title: '创建时间',
          align: 'center',
          slot: 'createAt'
        }
      ],
      billList: []
    }
  },
  mounted() {
    this.search()
  },
  methods: {
    createAtConfig(row) {
      return dayjs(row.createAt).format('YY-MM-DD')
    },
    search() {
      this.getBill()
    },
    reset() {
      this.ownerId = ''
      this.ownerName = ''
      this.ownerNick = ''
      this.getBill()
    },
    getBill() {
      let params = {
        ownerId: this.ownerId,
        ownerName: this.ownerName,
        ownerNick: this.ownerNick,
        role: 'player'
      };
      this.spinShow = true
      queryBill(params).then(res => {
        this.billList = res
        this.spinShow = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .playerBill {
    .content {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      .fl {
        margin-right: 20px;
        > p {
          margin-left: 10px;
        }
        .search {
          margin-right: 5px;
        }
      }
    }
    /deep/.ivu-table-small th {
      height: 26px;
    }
    /deep/.ivu-table-small td {
      height: 26px;
    }
  }
  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
</style>
