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
          <Col span="16" push="2">
            <span>{{agentInfo.userName}}</span>
          </Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">代理密码:</Col>
          <Col span="16" push="2">
            <span v-if="showPwd">{{agentInfo.userPwd}}</span>
            <span v-else>******</span>
            <span style="margin-left:5px" @click="pwdShow">{{showPwd ? '隐藏' : '显示'}}</span>
          </Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">代理昵称:</Col>
          <Col span="16" push="2">
            <span>{{agentInfo.userNick}}</span>
          </Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">上级代理:</Col>
          <Col span="16" push="2">
            <span>{{agentInfo.parentName}}</span>
          </Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">下级代理:</Col>
          <Col span="16" push="2">
            {{agentInfo.agentCount}}
          </Col>
        </Row> 
        <Row class-name="content">
          <Col span="6" class-name="tc">余额:</Col>
          <Col span="16" push="2">
            <span>{{agentInfo.balance || 0}}</span>
          </Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">创建时间:</Col>
          <Col span="16" push="2">
            <span>{{createAtConfig(agentInfo.createAt)}}</span>
          </Col>
        </Row>
        <Row class-name="content" v-if="showMode">
          <Col span="6" class-name="tc">返佣比例:</Col>
          <Col span="18">
            <Input disabled v-model="agentInfo.modeValue" placeholder="最多2位小数" :number="true">
              <span slot="append">%</span>
            </Input>
          </Col>
        </Row>
        <Row class-name="content1" v-for="(item, index) in gameList" :key="index" v-if="showMode">
          <Col span="6" class-name="tc">{{item.name}}:</Col>
          <Col span="18">
            <Input disabled v-model="item.value" :number="true">
              <span slot="append">%</span>
            </Input>
          </Col>
        </Row>
        <div class-name="content" v-for="(item, index) in agentInfo.bankCards" :key="index" style="border-top:1px solid #fff">
          <Row class-name="content">
            <Col span="6" class-name="tc">开户行:</Col>
            <Col span="16" push="2">
              <span>{{item.cardBank}}</span>
            </Col>
          </Row>
          <Row class-name="content">
            <Col span="6" class-name="tc">持卡人:</Col>
            <Col span="16" push="2">
              <span>{{item.cardName}}</span>
            </Col>
          </Row>
          <Row class-name="content">
            <Col span="6" class-name="tc">卡号:</Col>
            <Col span="16" push="2">
              <span>{{item.cardNo}}</span>
            </Col>
          </Row>
        </div>
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
      gameList: [],
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
    },
    showMode() {
      return this.$store.state.admin.agentInfo.mode == 'commission' ? true : false
    }
  },
  methods: {
    createAtConfig(val) {
      return dayjs(val).format('YY-MM-DD')
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
        this.gameList = this.$store.state.admin.agentInfo.gameList
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
.content1 {
  margin: 10px 0;
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

