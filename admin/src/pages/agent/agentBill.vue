<template>
  <div class="agentBill">
    <div class="content">
      <div class="fl">
        <Input v-model="ownerId" size="small">
          <span slot="prepend">代理ID</span>
        </Input>
      </div>
      <div class="fl">
        <Input v-model="ownerName" size="small">
          <span slot="prepend">代理账号</span>
        </Input>
      </div>
      <div class="fl">
        <Input v-model="ownerNick" size="small">
          <span slot="prepend">代理昵称</span>
        </Input>
      </div>

      <div class="fl">
        <Button type="primary" @click="search" size="small" class="search">搜索</Button>
        <Button @click="reset" size="small">重置</Button>
      </div>
    </div>
    <div class="tableForm">
      <Table :columns="columns" :data="billList" size="small">
        <template #createAt="{row}">{{createAtConfig(row)}}</template>
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
import dayjs from "dayjs";
import { queryBill } from "../../service/index";
export default {
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name == 'agentCenter' && vm.$route.params.ownerId != undefined) {
        vm.ownerId = vm.$route.params.ownerId
        vm.search()
      }
    })
  },
  data() {
    return {
      spinShow: false,
      ownerId: "",
      ownerName: "",
      ownerNick: "",
      totalPage: 200,
      currentPage: 1,
      pageSize: 50,
      startKey: null,
      columns: [
        {
          title: '流水号',
          key: 'id',
          align: "center"
        },
        {
          title: "代理账号",
          align: "center",
          key: "ownerName"
        },
        {
          title: "代理ID",
          align: "center",
          key: "ownerId"
        },
        {
          title: "代理昵称",
          align: "center",
          key: "ownerNick"
        },
        {
          title: "操作类型",
          align: "center",
          key: "project"
        },
        {
          title: "操作金额",
          align: "center",
          key: "amount"
        },
        {
          title: "创建时间",
          align: "center",
          slot: "createAt"
        }
      ],
      billList: [],
      data: []
    };
  },
  mounted() {
    this.search();
  },
  methods: {
    createAtConfig(row) {
      return dayjs(row.createAt).format("YY-MM-DD HH:mm:ss");
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
      this.getBill();
    },
    reset() {
      this.ownerId = ''
      this.ownerName = ''
      this.ownerNick = ''
      this.search();
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
        role: 'agent',
        startKey: this.startKey
      };
      this.spinShow = true;
      queryBill(params).then(res => {
        this.data = this.data.concat(res.res)
        this.totalPage = this.data.length
        this.billList = _.chunk(this.data, this.pageSize)[this.currentPage - 1]
        this.startKey = res.startKey
        this.spinShow = false;
      }).catch(err => {
        this.spinShow = false
      })
    }
  }
};
</script>

<style lang="less" scoped>
.agentBill {
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
  .tableForm {
    /deep/.ivu-table-small th {
      height: 26px;
    }
    /deep/.ivu-table-small td {
      height: 26px;
    }
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
