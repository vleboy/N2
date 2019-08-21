<template>
  <div class="playerCenter">
    <div>
      <div class="content">
        <div class="fl">
          <Input v-model="parentId" size="small">
            <span slot="prepend">代理ID</span>
          </Input>
        </div>
        <div class="fl">
          <Input v-model="playerId" size="small">
            <span slot="prepend">玩家ID</span>
          </Input>
        </div>
        <div class="fl">
          <Input v-model="playerName" size="small">
            <span slot="prepend">玩家账号</span>
          </Input>
        </div>
        <div class="fl">
          <Input v-model="playerNick" size="small">
            <span slot="prepend">玩家昵称</span>
          </Input>
        </div>
        <div class="fl">
          <Select v-model="status" style="width:100px" size="small">
              <Option v-for="item in statusList" :value="item.label" :key="item.value">{{ item.value }}</Option>
          </Select>
        </div>
        <div class="fl">
          <Button type="primary" @click="search" size="small" class="search">搜索</Button>
          <Button @click="reset" size="small">重置</Button>
        </div>
      </div>
    </div>
    <div class="playerform">
      <Table :columns="columns" :data="playerList" size="small">
        <template #parentId="{row}">
          <Tooltip content="前往代理中心" placement="bottom" transfer>
            <span style="color:#20a0ff;cursor:pointer;" @click="toAgentCenter(row)">{{row.parentId}}</span>
          </Tooltip>
        </template>
        <template #balance="{row}">
          <Tooltip content="前往玩家账单" placement="bottom" transfer>
            <span style="color:#20a0ff;cursor:pointer;" @click="toPlayerBill(row)">{{row.balance}}</span>
          </Tooltip>
        </template>
        <template #status="{row}">
          <Tag
            type="border"
            :color="row.status == 0 ? 'error' : 'success'"
          >{{row.status == 0 ? '已停用' : '已启用'}}</Tag>
        </template>
        <template #operate="{row}">
          <div class="btn">
            <Button
            size="small"
            :type="row.status == 0 ? 'info' : 'error'"
            ghost
            @click="operateSatus(row)"
          >{{row.status == 0 ? '启用' : '停用'}}</Button>
          <Button size="small" type="info" ghost @click="setPoint(row)" >加减点</Button>
          <Button size="small" type="info" ghost @click="playerDetail(row)">查看详情</Button>
          <Button size="small" type="info" ghost  @click="edit(row) "v-if="row.mode == 'commission'">修改</Button>
          </div>
        </template>
      </Table>
    </div>
    <div class="page">
      <Page :current="currentPage" :total="totalPage" :page-size="pageSize" @on-change="changepage"/>
    </div>
    <playerPoint></playerPoint>
    <editPlayer></editPlayer>
    <playerDetail></playerDetail>
    <Spin size="large" fix v-show="spinShow" style="z-index:200;">
      <Icon type="ios-loading" size="64" class="demo-spin-icon-load"></Icon>
      <div style>加载中...</div>
    </Spin>
  </div>
</template>

<script type="text/ecmascript-6">
import dayjs from "dayjs";
import { queryPlayer, playerStatus } from "../../service/index";
import playerDetail from './playerDetail'
import playerPoint from './playerPoint'
import editPlayer from './editPlayer'
import _ from 'lodash'
export default {
  components: {
    playerDetail,
    playerPoint,
    editPlayer
  },
  beforeRouteEnter(to, from, next) {

    next(vm => {


      if (from.name == 'agentCenter' && vm.$route.params.parentId != undefined) {
        vm.parentId = vm.$route.params.parentId
        vm.search()
      }
    })
  },
  data() {
    return {
      parentId: "",
      spinShow: false,
      playerId: "",
      playerName: "",
      playerNick: "",
      startKey: null,
      status: 'all',
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
      playerList: [],
      data: [],
      columns: [
        {
          title: "代理ID",
          align: "center",
          slot: "parentId"
        },
        {
          title: "玩家账号",
          align: "center",
          key: "playerName"
        },
        {
          title: "玩家ID",
          key: "id",
          align: "center"
        },
        {
          title: "昵称",
          key: "playerNick",
          align: "center"
        },
        {
          title: "余额",
          slot: "balance",
          align: "center"
        },
        {
          title: "状态",
          slot: "status",
          align: "center"
        },
        {
          title: "创建时间",
          key: "createAt",
          align: "center",
          sortable: true,
          render: (h, params) => {
            return h("span", dayjs(params.row.createAt).format("YY-MM-DD"));
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
  methods: {
    //页码改变
    changepage(val) {
      this.currentPage = val
      if (this.startKey != null && this.currentPage % 4 == 0 && this.currentPage * this.pageSize >= this.data.length) {
        this.getList()
      } else {
        this.playerList = _.chunk(this.data, this.pageSize)[this.currentPage - 1]
      }
    },
    getList() {
      let params = {
        id: this.playerId,
        playerName: this.playerName,
        playerNick: this.playerNick,
        parentId: this.parentId,
        startKey: this.startKey,
        status: this.status
      };
      this.spinShow = true;
      queryPlayer(params).then(res => {
        this.data = this.data.concat(res.res)
        this.totalPage = this.data.length
        this.playerList = _.chunk(this.data, this.pageSize)[this.currentPage - 1]
        this.startKey = res.startKey
        this.spinShow = false;
      }).catch(err => {
        this.spinShow = false
      })
    },
    toAgentCenter(row) {
      this.$router.push({
        name: 'agentCenter',
        params: {
          id: row.parentId
        }
      })
    },
    toPlayerBill(row) {
      this.$router.push({
        name: 'playerBill',
        params: {
          ownerId: row.id
        }
      })
    },
    search() {
      this.initPage()
      this.getList()
    },
    reset() {
      this.playerId = "";
      this.playerName = "";
      this.playerNick = "";
      this.parentId = "",
      this.status = 'all'
      this.search();
    },
    //重置分页
    initPage() {
      this.data = []
      this.startKey = null
      this.currentPage = 1
    },
    //停用启用
    operateSatus(row) {
      let text = row.status == 0 ? "启用" : "停用";
      let params = {
        id: row.id,
        status: row.status == 0 ? 1 : 0
      };
      this.$Modal.confirm({
        title: "状态管理",
        content: `${text}该玩家?`,
        onOk: () => {
          playerStatus(params)
            .then(res => {
              this.$Message.success(`${text}成功`);
              this.search();
            })
            .catch(err => {
              this.$Message.error(`${text}失败`);
            });
        }
      });
    },
    //加减点
    setPoint(row) {
      let params = {
        name: row.playerName,
        id: row.id,
        role: row.role,
      }
      this.$store.commit('showPlayerPoint', true)
      this.$store.commit('setPlayerPointInfo', params)
    },
    //查看玩家详情
    playerDetail(row) {
      this.$store.commit('showPlayerDetail', true)
      this.$store.commit('setPlayerInfo', row)
    },
    edit(row) {
      this.$store.commit('showEditPlayer', true)
      this.$store.commit('setPlayerInfo', row)
    }
  }
}
</script>

<style scpoed lang="less">
.playerCenter {
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
