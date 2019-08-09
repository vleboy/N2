<template>
  <div class="playerCenter">
    <div>
      <div class="content">
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
          <Button type="primary" @click="search" size="small" class="search">搜索</Button>
          <Button @click="reset" size="small">重置</Button>
        </div>
      </div>
    </div>
    <div class="playerform">
      <Table :columns="columns" :data="playerList" size="small">
        <template #status="{row}">
          <Tag
            type="border"
            :color="row.status == 0 ? 'error' : 'success'"
          >{{row.status == 0 ? '已停用' : '已启用'}}</Tag>
        </template>
        <template #operate="{row}">
          <Button
            size="small"
            :type="row.status == 0 ? 'info' : 'error'"
            ghost
            style="margin-right:5px"
            @click="operateSatus(row)"
          >{{row.status == 0 ? '启用' : '停用'}}</Button>
          <Button size="small" type="info" ghost @click="setPoint(row)" style="margin-right:5px">加减点</Button>
          <Button size="small" type="info" ghost @click="playerDetail(row)">查看详情</Button>
        </template>
      </Table>
    </div>
    <div class="page">
      <Page :current="currentPage" :total="totalPage" :page-size="pageSize" @on-change="changepage"/>
    </div>
    <operatePoint></operatePoint>
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
import operatePoint from '../../components/operatePoint'
import _ from 'lodash'
export default {
  components: {
    playerDetail,
    operatePoint
  },
  data() {
    return {
      spinShow: false,
      playerId: "",
      playerName: "",
      playerNick: "",
      playerList: [],
      data: [],
      columns: [
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
          title: "玩家昵称",
          key: "playerNick",
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
          minWidth: 60
        }
      ],
      //分页相关
      totalPage: 100,
      pageSize: 2,//每页显示条数
      currentPage: 1,
      startKey: ''//用于分页
    };
  },
  computed: {},
  mounted() {
    let arr = [1,2,3,4,5,6]
    let newArr = _.chunk(arr, 2)

    this.search();
  },
  methods: {
    //页码改变
    changepage(val) {
      this.currentPage = val
      this.playerList = _.chunk(this.data, this.pageSize)[this.currentPage - 1]
    },
    getList() {
      let params = {
        id: this.playerId,
        playerName: this.playerName,
        playerNick: this.playerNick
      };
      this.spinShow = true;
      queryPlayer(params).then(res => {
       
        this.data = this.data.concat(res)
        this.totalPage = this.data.length
        this.playerList = _.chunk(this.data, this.pageSize)[this.currentPage - 1]
        this.spinShow = false;
      });
    },
    search() {
      this.getList()
    },
    reset() {
      this.playerId = "";
      this.playerName = "";
      this.playerNick = "";
      this.search();
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
      this.$store.commit('showPointDrawer', true)
      this.$store.commit('setPointInfo', params)
    },
    //查看玩家详情
    playerDetail(row) {
      this.$store.commit('showPlayerDetail', true)
      this.$store.commit('setPlayerInfo', row)
    },
  }
};
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
  }
}

.demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
</style>
