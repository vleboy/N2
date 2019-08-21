<template>
  <div>
    <Drawer
      title="玩家详情"
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
        <Row class-name="content" v-if="showMode">
          <Col span="6" class-name="tc">返佣比例:</Col>
          <Col span="18">
            <Input disabled v-model="playerInfo.modeValue" placeholder="最多2位小数" :number="true">
              <span slot="append">%</span>
            </Input>
          </Col>
        </Row>
        <Row class-name="content1" v-for="(item, index) in gameList" :key="index" v-if="showMode">
          <Col span="6" class-name="tc">{{item.name}}:</Col>
          <Col span="18">
            <Input disabled v-model="item.value" placeholder="最多2位小数" :number="true">
              <span slot="append">%</span>
            </Input>
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
      return this.$store.state.admin.playerDetail;
    },
    playerInfo() {
      return this.$store.state.admin.playerInfo
    },
    showMode() {
      return this.$store.state.admin.playerInfo.mode == 'commission' ? true : false
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
        this.gameList = this.$store.state.admin.playerInfo.gameList
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

