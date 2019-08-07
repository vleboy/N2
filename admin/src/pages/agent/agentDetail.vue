<template>
  <div>
    <Drawer
      title="代理详情"
      v-model="showDraw"
      width="320"
      :mask-closable="false"
      :styles="styles"
      @on-close="hideDraw"
    >
      <div>
        <Row class-name="content">
          <Col span="6" class-name="tc">代理账号:</Col>
          <Col span="18">
            <span>{{agentInfo.userName}}</span>
          </Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">代理密码:</Col>
          <Col span="18">
            <span v-if="showPwd">{{agentInfo.userPwd}}</span>
            <span v-else>******</span>
            <span style="margin-left:5px" @click="pwdShow">{{showPwd ? '隐藏' : '显示'}}</span>
          </Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">代理昵称:</Col>
          <Col span="18">
            <span>{{agentInfo.userNick}}</span>
          </Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">上级代理:</Col>
          <Col span="18">
            <span>{{agentInfo.parentName}}</span>
          </Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">余额:</Col>
          <Col span="18">
            <span>{{agentInfo.balance || 0}}</span>
          </Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">创建时间:</Col>
          <Col span="18">
            <span>{{createAtConfig(agentInfo.createAt)}}</span>
          </Col>
        </Row>
      </div>
    </Drawer>
  </div>
</template>
<script>
import dayjs from "dayjs";
import { createAgent } from "../../service/index";
export default {
  data() {
    return {
      showPwd: false,
      showDraw: false,
      styles: {
        height: "calc(100% - 55px)",
        overflow: "auto",
        paddingBottom: "53px",
        position: "static"
      },
    };
  },
  computed: {
    listenshowDraw() {
      return this.$store.state.admin.agentDetail;
    },
    agentInfo() {
      return this.$store.state.admin.agentInfo
    }
  },
  methods: {
    createAtConfig(val) {
      return dayjs(val).format('YYYY-MM-DD')
    },
    pwdShow() {
      this.showPwd = !this.showPwd
    },
    hideDraw() {
      this.initData()
    },
    initData() {
      this.userName = ''
      this.userPwd = ''
      this.userNick = ''
      this.$store.commit('setAgentInfo', {
        
      })
      this.$store.commit("showAgentDetail", false);
    }
  },
  watch: {
    listenshowDraw: {
      handler: function(val, oldVal) {
        this.showDraw = val;
      }
    }
  }
};
</script>

<style lang="less" scoped>

.content {
  margin: 20px 0;
  display: flex;
  align-items: center;
  .tr {
    text-align: right;
  }
  .tc {
    text-align: center;
  }
}
.ivu-input-wrapper {
  width: 80%;
}
/deep/.ivu-input-number {
  width: 80%;
}
</style>

