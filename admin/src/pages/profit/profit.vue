<template>
  <div class="playerCenter">
    <div>
      <div class="content">
        <div class="fl">
          <Select v-model="role" style="width:100px" size="small">
              <Option v-for="item in roleList" :value="item.label" :key="item.value">{{ item.value }}</Option>
          </Select>
        </div>
        <div class="fl">
          <Select v-model="status" style="width:100px" size="small">
              <Option v-for="item in statusList" :value="item.label" :key="item.value">{{ item.value }}</Option>
          </Select>
        </div>
        <div class="fl">
          <Input v-model="ownerId" size="small">
            <span slot="prepend">账号ID</span>
          </Input>
        </div>
        <div class="fl">
          <Input v-model="ownerName" size="small">
            <span slot="prepend">账号</span>
          </Input>
        </div>
        <div class="fl">
          <Input v-model="ownerNick" size="small">
            <span slot="prepend">昵称</span>
          </Input>
        </div>
        <div class="fl">
          <Button type="primary" @click="search" size="small" class="search">搜索</Button>
          <Button @click="reset" size="small">重置</Button>
        </div>
      </div>
    </div>
    <div class="playerform">
      <Table :columns="columns" :data="profitList" size="small" style="width:100%">
        <template #status="{row}">
          <Tag
            type="border"
            :color="row.status == 0 ? 'error' : 'success'"
          >{{row.status == 0 ? '未发放' : '已发放'}}</Tag>
        </template>
        <template #operate="{row}">
          <Button size="small" type="info" ghost @click="send(row)" v-if="!isSend(row)">发放</Button>
          <Button size="small" type="info" disabled ghost v-else>已发放</Button>
          <Button size="small" type="info" ghost style="margin-left:5px" @click="detail(row)">查看详情</Button>
        </template>
      </Table>
    </div>
    <div class="page">
      <Page :current="currentPage" :total="totalPage" :page-size="pageSize" @on-change="changepage"/>
    </div>
    <operateProfit></operateProfit>
    <Spin size="large" fix v-show="spinShow" style="z-index:200;">
      <Icon type="ios-loading" size="64" class="demo-spin-icon-load"></Icon>
      <div style>加载中...</div>
    </Spin>
  </div>
</template>

<script type="text/ecmascript-6">
import dayjs from "dayjs";
import { profitPage, profitUpdate } from "../../service/index";
import operateProfit from './operateProfit'
import _ from 'lodash'
export default {
  components: {
    operateProfit
  },
  data() {
    return {
      spinShow: false,
      ownerId: "",
      ownerName: "",
      ownerNick: "",
      startKey: null,
      status: 'all',
      role: 'all',
      roleList: [
        {
          value: '全部角色',
          label: 'all'
        },
        {
          value: '代理',
          label: 'agent'
        },
        {
          value: '玩家',
          label: 'player'
        }
      ],
      statusList: [
        {
          value: '全部状态',
          label: 'all'
        },
        {
          value: '已启用',
          label: '1'
        },
        {
          value: '已停用',
          label: '0'
        }
      ],
      profitList: [],
      data: [],
      columns: [
        {
          title: "结算时间",
          align: "center",
          key: "month"
        },
        {
          title: "角色",
          align: "center",
          key: "role"
        },
        {
          title: "帐号ID",
          key: "ownerId",
          align: "center"
        },
        {
          title: "帐号",
          key: "ownerName",
          align: "center"
        },
        {
          title: "昵称",
          key: "ownerNick",
          align: "center"
        },
        {
          title: "业务模式",
          key: "modeStr",
          align: "center"
        },
        {
          title: "总输赢",
          key: "winlose",
          align: "center"
        },
        {
          title: "存款费",
          key: "depositFee",
          align: "center"
        },
        {
          title: "取款费",
          key: "withdrawFee",
          align: "center"
        },
        {
          title: "平台费",
          key: "platformFee",
          align: "center"
        },
        {
          title: "红利返水",
          key: "commissionFee",
          align: "center"
        },
        {
          title: "净输赢",
          key: "profit",
          align: "center"
        },
        {
          title: "流水号",
          key: "billId",
          align: "center",
          minWidth: 70
        },
        {
          title: "发放时间",
          key: "profitAt",
          align: "center",
          minWidth: 45,
          render: (h, params) => {
            return params.row.profitAt == undefined ? '' : h("span", dayjs(params.row.profitAt).format("YY-MM-DD HH:mm"));
          }
        },
        {
          title: "操作",
          slot: "operate",
          align: "center",
          minWidth: 120
        }
      ],
      //分页相关
      totalPage: 200,
      pageSize: 50,//每页显示条数
      currentPage: 1,
      startKey: ''//用于分页
    };
  },
  mounted() {
    this.search()
  },
  methods: {
    //页码改变
    changepage(val) {
      this.currentPage = val
      if (this.startKey != null && this.currentPage % 4 == 0 && this.currentPage * this.pageSize >= this.data.length) {
        this.getList()
      } else {
        this.profitList = _.chunk(this.data, this.pageSize)[this.currentPage - 1]
      }
    },
    detail(row) {
      console.log(row)
      this.$store.commit('setProfitInfo', row)
      this.$store.commit("showOperateProfit", true);
    },
    getList() {
      this.spinShow = true
      let params = {
        ownerId: this.ownerId,
        ownerName: this.ownerName,
        ownerNick: this.ownerNick,
        startKey: this.startKey,
        status: this.status,
        role: this.role,
      }
      profitPage(params).then(res => {
        this.data = this.data.concat(res.res)
        this.totalPage = this.data.length
        this.profitList = _.chunk(this.data, this.pageSize)[this.currentPage - 1]
        this.startKey = res.startKey
        this.spinShow = false
      }).catch(err => {
         this.spinShow = false
      })
    },
    search() {
      this.initPage()
      this.getList()
    },
    reset() {
      this.ownerId = ""
      this.ownerName = ""
      this.ownerNick = ""
      this.status = 'all'
      this.role = 'all'
      this.initPage()
      this.search();
    },
    //重置分页
    initPage() {
      this.data = []
      this.startKey = null
      this.currentPage = 1
    },
    send(row) {
      let params = {
        id: row.id,
        status: '1'
      }
       this.$Modal.confirm({
        title: "业务管理",
        content: `确定发放?`,
        onOk: () => {
          profitUpdate(params).then(res => {
            this.$Message.success(`发放成功`);
            this.search()
        }).catch(err => {
          this.$Message.success(`发放成功`);
        })
        }
      });
      
    },
    isSend(row) {
      return row.status ? true : false
    }
  }
}
</script>

<style scpoed lang="less">
.playerCenter {
  /* position: absolute;
  width: 100%; */
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
  .page {
    margin-top: 20px;
    text-align: right;
  }
  .playerform {
    .ivu-table-small th {
      height: 26px;
    }
    .ivu-table-small td {
      height: 26px;
    }
    .btn {
      display: flex;
      justify-content: start;
      button {
        margin-right: 5px;
      }
    }
  }
}

.demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
</style>
