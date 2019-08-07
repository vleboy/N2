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
            :color="row.status == 0 ? 'error' : 'primary'"
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
      columns: [
        {
          title: "玩家ID",
          key: "id",
          align: "center"
        },
        {
          title: "玩家账号",
          align: "center",
          key: "playerName"
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
            return h("span", dayjs(params.row.createAt).format("YYYY-MM-DD"));
          }
        },
        {
          title: "操作",
          slot: "operate",
          align: "center"
        }
      ]
    };
  },
  computed: {},
  mounted() {
    this.search();
  },
  methods: {
    getList() {
      let params = {
        id: this.playerId,
        playerName: this.playerName,
        playerNick: this.playerNick
      };
      this.spinShow = true;
      queryPlayer(params).then(res => {
        this.playerList = res;
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
      this.$store.commit('showPointDrawer', true)
      this.$store.commit('setPointInfo', row)
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
}
.demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
</style>
