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
          <Col span="6" class-name="tc">玩家ID:</Col>
          <Col span="18">
            <span>{{playerInfo.id}}</span>
          </Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">玩家账号:</Col>
          <Col span="18">
            <span>{{playerInfo.playerName}}</span>
          </Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">玩家昵称:</Col>
          <Col span="18">
            <span>{{playerInfo.playerNick}}</span>
          </Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">创建时间:</Col>
          <Col span="18">
            <span>{{createAtConfig(playerInfo.createAt)}}</span>
          </Col>
        </Row>
        <div class-name="content" v-for="(item, index) in playerInfo.bankCards" :key="index" style="border-top:1px solid #fff">
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
      return this.$store.state.admin.playerDetail;
    },
    playerInfo() {
      return this.$store.state.admin.playerInfo
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
      this.$store.commit('setPlayerInfo', {
        
      })
      this.$store.commit("showPlayerDetail", false);
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

