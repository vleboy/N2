<template>
  <div>
    <div class="content">
      <div class="fl">
        <Button size="small" type="info" ghost @click="createNewAgent()">创建一级代理</Button>
      </div>
      <div class="fl">
        <Input v-model="id" size="small">
          <span slot="prepend">代理ID</span>
        </Input>
      </div>
      <div class="fl">
        <Input v-model="userName" size="small">
          <span slot="prepend">代理账号</span>
        </Input>
      </div>
      <div class="fl">
        <Input v-model="userNick" size="small">
          <span slot="prepend">代理昵称</span>
        </Input>
      </div>

      <div class="fl">
        <Button type="primary" @click="search" size="small" class="search">搜索</Button>
        <Button @click="reset" size="small">重置</Button>
      </div>
    </div>
    <tree-table
      expand-key="userName"
      :expand-type="false"
      :selectable="false"
      :columns="columns"
      :data="data"
      tree-type
    >
      <template #userNick="{row}">
        <span>{{row.userNick}}</span>
      </template>
      <template #playerCount="{row}">
        <Tooltip content="前往玩家中心" placement="bottom" transfer>
          <span
            style="color:#20a0ff;cursor:pointer;"
            @click="toPlayerCenter(row)"
          >{{row.playerCount}}</span>
        </Tooltip>
      </template>
      <template #balance="{row}">
        <Tooltip content="前往代理账单" placement="bottom" transfer>
          <span style="color:#20a0ff;cursor:pointer;" @click="toAgentBill(row)">{{row.balance}}</span>
        </Tooltip>
      </template>
      <template #createAt="{row}">
        <span @click="setPoint">{{createAtConfig(row)}}</span>
      </template>
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
        <Button size="small" type="info" ghost @click="edit(row)" style="margin:0 5px">修改</Button>
        <Button size="small" type="info" ghost @click="setPoint(row)">加减点</Button>
        <Button size="small" type="info" ghost style="margin:0 5px" @click="createAgent(row)">创建代理</Button>
        <Button
          size="small"
          type="info"
          ghost
          style="margin-right:5px"
          @click="createplayer(row)"
        >创建玩家</Button>
        <Button size="small" type="info" ghost @click="agentDetail(row)">查看详情</Button>
      </template>
    </tree-table>
    <!-- 加减点 -->
    <agentPoint></agentPoint>
    <operateAgent></operateAgent>
    <createPlayer></createPlayer>
    <agentDetail></agentDetail>
    <Spin size="large" fix v-show="spinShow" style="z-index:200;">
      <Icon type="ios-loading" size="64" class="demo-spin-icon-load"></Icon>
      <div style>加载中...</div>
    </Spin>
  </div>
</template>

<script>
import dayjs from "dayjs";
import _ from "lodash";
import { queryAgent, agentStatus } from "../../service/index";

import agentPoint from "./agentPoint";
import operateAgent from "./operateAgent";
import createPlayer from "./createPlayer";
import agentDetail from "./agentDetail";
export default {
  components: {
    agentPoint,
    operateAgent,
    createPlayer,
    agentDetail
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name == "playerCenter" && vm.$route.params.id != undefined) {
        vm.id = vm.$route.params.id;
        vm.search();
      }
    });
  },
  data() {
    return {
      id: "",
      userName: "",
      userNick: "",
      columns: [
        {
          title: "代理账号",
          key: "userName",
          minWidth: "250"
        },
        {
          title: "代理ID",
          key: "id",
          minWidth: "auto",
          align: "center",
          headerAlign: "center"
        },
        {
          title: "昵称",
          slot: "userNick",
          minWidth: "auto",
          type: "template",
          template: "userNick",
          align: "center",
          headerAlign: "center"
        },
        {
          title: "玩家数量",
          slot: "playerCount",
          align: "center",
          type: "template",
          template: "playerCount",
          headerAlign: "center"
        },
        {
          title: "余额",
          slot: "balance",
          minWidth: "auto",
          headerAlign: "center",
          align: "center",
          type: "template",
          template: "balance"
        },
        {
          title: "业务模式",
          key: "modeStr",
          minWidth: "115",
          headerAlign: "center",
          align: "center",
        },
        {
          title: "状态",
          slot: "status",
          align: "center",
          headerAlign: "center",
          minWidth: "auto",
          type: "template",
          template: "status"
        },
        {
          title: "创建时间",
          slot: "createAt",
          minWidth: "80",
          type: "template",
          template: "createAt",
          align: "center",
          headerAlign: "center"
        },
        {
          title: "操作",
          slot: "operate",
          minWidth: "400",
          type: "template",
          template: "operate",
          align: "center",
          headerAlign: "center"
        }
      ],
      spinShow: false,
      data: []
    };
  },
  mounted() {
    this.search();
  },
  methods: {
    createAtConfig(row) {
      return dayjs(row.createdAt).format("YY-MM-DD");
    },
    search() {
      console.log('agent')
      this.getList();
    },
    reset() {
      this.id = "";
      this.userName = "";
      this.userNick = "";
      this.search();
    },
    //获取代理列表
    getList() {
      let params = {
        id: this.id,
        userName: this.userName,
        userNick: this.userNick
      };
      this.spinShow = true;
      queryAgent(params)
        .then(res => {
          this.data = res;
          this.spinShow = false;
        })
        .catch(err => {
          this.spinShow = false;
        });
    },
    toPlayerCenter(row) {
      this.$router.push({
        name: "playerCenter",
        params: {
          parentId: row.id
        }
      });
    },
    toAgentBill(row) {
      this.$router.push({
        name: "agentBill",
        params: {
          ownerId: row.id
        }
      });
    },
    //加点减点
    setPoint(row) {
      let params = {
        name: row.userName,
        id: row.id,
        role: row.role
      };
      this.$store.commit("showAgentPoint", true);
      this.$store.commit("setAgentPointInfo", params);
    },
     edit(row) {
      row.operate = 'edit'
      this.$store.commit("showDrawer", true);
      this.$store.commit("setDrawerInfo", row);
    },
    //创建直属代理
    createNewAgent() {
      let params = {
        id: undefined,
        operate: 'create'
      }
      this.$store.commit("showDrawer", true);
      this.$store.commit("setDrawerInfo", params);
    },
    //创建代理
    createAgent(row) {
      let params = {
        id: row.id,
        operate: 'create'
      }
      this.$store.commit("showDrawer", true);
      this.$store.commit("setDrawerInfo", params);
    },
    //查看代理详情
    agentDetail(row) {
      this.$store.commit("showAgentDetail", true);
      this.$store.commit("setAgentInfo", row);
    },
    //创建玩家
    createplayer(row) {
      this.$store.commit("showCreatePlayer", true);
      this.$store.commit("setAgentInfo", row);
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
        content: `${text}该代理?`,
        onOk: () => {
          agentStatus(params)
            .then(res => {
              this.$Message.success(`${text}成功`);
              this.getList();
            })
            .catch(err => {
              this.$Message.error(`${text}失败`);
            });
        }
      });
    }
  }
};
</script>
    
<style lang="less" scoped>
.content {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
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
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
/deep/.zk-table__body-row {
  height: 20px;
}
/deep/ .zk-table__cell-inner {
  padding: 0px 12px;
}
/deep/ .zk-table__footer-row,
/deep/.zk-table__header-row {
  height: 20px;
}
</style>
