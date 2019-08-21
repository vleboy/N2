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
          <Select v-model="project" style="width:100px" size="small">
              <Option v-for="item in projectList" :value="item.label" :key="item.value">{{ item.value }}</Option>
          </Select>
        </div>
        <div class="fl">
          <Button type="primary" @click="search" size="small" class="search">搜索</Button>
          <Button @click="reset" size="small">重置</Button>
        </div>
      </div>
    <div>
      <Table :columns="columns" :data="billList" size="small">
        <template #createAt="{row}">
          {{createAtConfig(row)}}
        </template>
      </Table>
    </div>
    <div class="page">
      <Page :current="currentPage" :total="totalPage" :page-size="pageSize" @on-change="changepage"/>
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
import _ from 'lodash'
export default {
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name == 'playerCenter' && vm.$route.params.ownerId != undefined) {
        vm.ownerId = vm.$route.params.ownerId
        vm.search()
      }
    })
  },
  data() {
    return {
      spinShow: false,
      ownerId: '',
      ownerName: '',
      ownerNick: '',
      totalPage: 200,
      currentPage: 1,
      pageSize: 50,
      startKey: null,
      data: [],
      project: 'all',
      projectList: [
        {
          value: '全部类型',
          label: 'all'
        },
        {
          value: '加点',
          label: 'add'
        },
        {
          value: '减点',
          label: 'reduce'
        },
        {
          value: '存款',
          label: 'deposit'
        },
        {
          value: '取款',
          label: 'withdraw'
        },
        {
          value: '解冻',
          label: 'unfreeze'
        },
        {
          value: '转入',
          label: 'transferIn'
        },
        {
          value: '转出',
          label: 'transferOut'
        }
      ],
      columns: [
        {
          title: '流水号',
          key: 'id',
          align: "center",
          minWidth: 40,
        },
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
          key: 'projectStr'
        },
        {
          title: "前置金额",
          align: "center",
          key: "preBalance"
        },
        {
          title: "操作金额",
          align: "center",
          key: "amount"
        },
        {
          title: "余额",
          align: "center",
          key: "balance"
        },
        {
          title: '创建时间',
          align: 'center',
          slot: 'createAt',
          minWidth: 40
        }
      ],
      billList: []
    }
  },
  methods: {
    createAtConfig(row) {
      return dayjs(row.createAt).format('YY-MM-DD HH:mm:ss')
    },
    //切换页码
    changepage(val) {
      this.currentPage = val
      if (this.startKey != null && this.currentPage % 4 == 0 && this.currentPage * this.pageSize >= this.data.length) {
        this.getBill()
      } else {
        this.billList = _.chunk(this.data, this.pageSize)[this.currentPage - 1]
      }
    },
    search() {
      this.initPage()
      this.getBill()
    },
    reset() {
      this.ownerId = ''
      this.ownerName = ''
      this.ownerNick = ''
      this.project = 'all'
      this.search()
    },
    //重置分页
    initPage() {
      this.data = []
      this.startKey = null
      this.currentPage = 1
    },
    getBill() {
      let params = {
        ownerId: this.ownerId,
        ownerName: this.ownerName,
        ownerNick: this.ownerNick,
        role: 'player',
        startKey: this.startKey,
        project: this.project
      };
      this.spinShow = true
      queryBill(params).then(res => {
        this.data = this.data.concat(res.res)
        this.totalPage = this.data.length
        this.billList = _.chunk(this.data, this.pageSize)[this.currentPage - 1]
        this.startKey = res.startKey
        this.spinShow = false
      }).catch(err => {
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
    .page {
      text-align: right;
      margin-top: 20px;
    }
  }
  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
</style>
