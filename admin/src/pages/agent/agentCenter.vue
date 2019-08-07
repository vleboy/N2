<template>
  <div>
    <Button size="small" type="info" ghost style="margin:0 0 10px 0" @click="createNewAgent()">创建直属代理</Button>
    <tree-table
      show-index
      expand-key="userName"
      :expand-type="false"
      :selectable="false"
      :columns="columns"
      :data="data"
      tree-type
    >
      <template #userNick="{row}">
        <span style="color:#20a0ff">{{row.userNick}}</span>
      </template>
      <template #createAt="{row}">
        <span ref="nico" @click="setPoint">{{createAtConfig(row)}}</span>
      </template>
      <template #status="{row}">
        <Tag type="border" :color="row.status == 0 ? 'error' : 'primary'">{{row.status == 0 ? '已停用' : '已启用'}}</Tag>
      </template>
      <template #operate="{row}">
        <Button size="small" :type="row.status == 0 ? 'info' : 'error'" ghost style="margin-right:5px" @click="operateSatus(row)">{{row.status == 0 ? '启用' : '停用'}}</Button>
        <Button size="small" type="info" ghost @click="setPoint(row)">加减点</Button>
        <Button size="small" type="info" ghost style="margin:0 5px" @click="createAgent(row)">创建代理</Button>
        <Button size="small" type="info" ghost style="margin-right:5px" @click="createplayer(row)">创建玩家</Button>
        <Button size="small" type="info" ghost @click="agentDetail(row)">查看详情</Button>
      </template>
    </tree-table>
    <!-- 加减点 -->
    <operatePoint></operatePoint>
    <createAgent></createAgent>
    <createPlayer></createPlayer>
    <agentDetail></agentDetail>
    <Spin size="large" fix v-show="spinShow" style="z-index:200;">
      <Icon type="ios-loading" size=64 class="demo-spin-icon-load"></Icon>
      <div style>加载中...</div>
    </Spin>
  </div>
</template>

<script>
import dayjs from "dayjs";
import _ from "lodash";
import {queryAgent, agentStatus} from '../../service/index'

import operatePoint from '../../components/operatePoint'
import createAgent from './createAgent'
import createPlayer from './createPlayer'
import agentDetail from './agentDetail'
export default {
  components: {
    operatePoint,
    createAgent,
    createPlayer,
    agentDetail
  },
  data() {
    return {
      columns: [
        {
          title: "代理账号",
          key: "userName",
          minWidth: "auto"
        },
        {
          title: "代理昵称",
          slot: "userNick",
          minWidth: "auto",
          type: "template",
          template: "userNick",
          align: 'center',
          headerAlign: 'center'
        },
        {
          title: "上级代理",
          key: "parentName",
          minWidth: "auto",
          align: 'center',
          headerAlign: 'center'
        },
        /* {
          title: "代理游戏",
          key: "gameList",
          minWidth: "auto",
          align: 'center',
          headerAlign: 'center'
        }, */
        {
          title: "下级代理数量",
          key: "agentCount",
          minWidth: "auto",
          headerAlign: 'center'
        },
        {
          title: "玩家数量",
          key: "playerCount",
          align: 'center',
          headerAlign: 'center'
        },
        {
          title: "余额",
          key: "balance",
          minWidth: "auto",
          headerAlign: 'center'
        },
        {
          title: "创建时间",
          slot: "createAt",
          minWidth: "auto",
          type: "template",
          template: "createAt",
          align: 'center',
          headerAlign: 'center'
        },
        {
          title: "状态",
          slot: "status",
          align: 'center',
          headerAlign: 'center',
          minWidth: "auto",
          type: "template",
          template: "status",
        },
        {
          title: "操作",
          slot: "operate",
          minWidth: "350",
          type: "template",
          template: "operate",
          align: 'center',
          headerAlign: 'center'
        }
      ],
      spinShow: false,
      data: [],
    };
  },
  mounted() {
    this.getList()
  },
  methods: {
    createAtConfig(row) {
      return dayjs(row.createdAt).format('YYYY-MM-DD')
    },

    //获取代理列表
    getList() {
      this.spinShow = true
      queryAgent().then(res => {
        this.data = res
        this.spinShow = false
      })
    },
    //加点减点
    setPoint(row) {
      this.$store.commit('showPointDrawer', true)
      this.$store.commit('setPointInfo', row)
    },
    //创建直属代理
    createNewAgent() {
      this.$store.commit('showCreateAgent', true)
    },
    //创建代理
    createAgent(row) {
      this.$store.commit('showCreateAgent', true)
      this.$store.commit('setAgentInfo', row)
    },
    //查看代理详情
    agentDetail(row) {
      this.$store.commit('showAgentDetail', true)
      this.$store.commit('setAgentInfo', row)
    },
    //创建玩家
    createplayer(row) {
      this.$store.commit('showCreatePlayer', true)
      this.$store.commit('setAgentInfo', row)
    },
    //停用启用 
    operateSatus(row) {
      let text = row.status == 0 ? '启用' : '停用'
      let params = {
        id: row.id,
        status: row.status == 0 ? 1 : 0
      }
      this.$Modal.confirm({
          title: '状态管理',
          content: `${text}该代理?`,
          onOk: () => {
            agentStatus(params).then(res => {
              this.$Message.success(`${text}成功`);
              this.getList()
            }).catch(err => {
              this.$Message.error(`${text}失败`);
            })
          },
      });
    }
  }
};

</script>
    
<style lang="less" scoped>
  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
  /deep/.zk-table__body-row {
    height: 20px;
  }
  /deep/ .zk-table__cell-inner {
    padding: 0px 12px;
  }
  /deep/ .zk-table__footer-row, /deep/.zk-table__header-row {
    height: 20px;
  }
</style>
