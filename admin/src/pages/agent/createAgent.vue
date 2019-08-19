<template>
  <div>
    <Drawer
      title="创建代理"
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
            <Input :maxlength="max20" v-model="userName" placeholder="3-20位" style="width: 100%" />
          </Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">代理昵称:</Col>
          <Col span="18">
            <Input :maxlength="max20" v-model="userNick" placeholder="3-20位" style="width: 100%" />
          </Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">代理密码:</Col>
          <Col span="18">
            <Input
              :maxlength="max20"
              v-model="userPwd"
              type="password"
              placeholder="6-20位"
              style="width: 100%"
            />
          </Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">业务模式:</Col>
          <Col span="18">
            <RadioGroup v-model="mode" @on-change="changeRadio">
              <Radio label="rebate">
                <span>返利</span>
              </Radio>
              <Radio label="commission">
                <span>返佣</span>
              </Radio>
              <Radio label="ratio" v-if="showMode">
                <span>占成</span>
              </Radio>
            </RadioGroup>
          </Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">{{rateConfig}}比例:</Col>
          <Col span="18" style="position:relative;">
            <Input v-model="modeValue" placeholder="最多2位小数" :number="true">
                <span slot="append">%</span>
            </Input>
            <p v-if="!pass" :class="{'regex': !pass}">最多2位小数</p>
          </Col>
        </Row>
        <!-- 返佣游戏 -->
        <div v-if="showGameList">
          <Row class-name="content1" v-for="(item, index) in gameList" :key="index">
            <Col span="6">{{item.name}}:</Col>
            <Col span="18">
              <Input v-model="item.value" placeholder="最多2位小数" :number="true">
                  <span slot="append">%</span>
              </Input>
              <p v-if="!pass" :class="{'regex': !pass}">最多2位小数</p>
            </Col>
          </Row>
        </div>
      </div>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="cancle">取消</Button>
        <Button type="primary" @click="sub">提交</Button>
      </div>
    </Drawer>
  </div>
</template>
<script>
import { createAgent, queryConfig } from "../../service/index";
import { log } from 'util';
export default {
  data() {
    return {
      max20: 20,
      showDraw: false,
      userName: "",
      userPwd: "",
      userNick: "",
      modeValue: '',
      mode: "rebate",
      showMode: false,
      pass: true,
      styles: {
        height: "calc(100% - 55px)",
        overflow: "auto",
        paddingBottom: "53px",
        position: "static"
      },
      gameList: [
        {code:70000,name:'NA电子',value:''},
        {code:10300000,name:'MG电子',value:''},
        {code:1080000,name:'SUN电子',value:''},
        {code:1160000,name:'PP电子',value:''},
        {code:1050000,name:'AG真人',value:''},
        {code:1120000,name:'SUN真人',value:''},
        {code:1130000,name:'YSB体育',value:''},
        {code:1170000,name:'NA电竞',value:''},
        {code:1100000,name:'VG棋牌',value:''}
      ]
    };
  },
  computed: {
    listenshowDraw() {
      return this.$store.state.admin.createAgent;
    },
    rateConfig() {
      let radioGroup = {
        rebate: '返利',
        commission: '返佣',
        ratio: '占成'
      }
      return radioGroup[this.mode]
    },
    showGameList() {
      return this.mode == 'commission' ? true : false
    }
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    //获取游戏返佣配置
    getConfig() {
      let params = {
        id: 'commission'
      }
      queryConfig(params).then(res => {
        //console.log(res)
      })
    },
    hideDraw() {
      this.initData();
    },
    cancle() {
      this.initData();
    },
    formatMode() {
      let regex = /^\d+\.?\d{0,2}$/
      if(!regex.test(this.modeValue)){
        this.pass = false
      } else {
        this.pass = true
      }
    },
    sub() {
      this.formatMode()
      let prarms = {
        parentId: this.$store.state.admin.agentInfo.id,
        userName: this.userName,
        userPwd: this.userPwd,
        userNick: this.userNick,
        mode: this.mode,
        modeValue: this.modeValue
      };
      if (this.mode == 'commission') {
        prarms.gameList = this.gameList
      }
      console.log(prarms)
      /* createAgent(prarms).then(res => {
        this.initData();
        this.$Message.success({ content: "创建成功" });
        this.$parent.getList();
      }) */
      
    },
    initData() {
      this.userName = "";
      this.userPwd = "";
      this.userNick = "";
      this.modeValue = ""
      this.getConfig()
      this.$store.commit("setAgentInfo", {});
      this.$store.commit("showCreateAgent", false);
    },
    changeRadio(val) {
      this.mode = val
    }
  },
  watch: {
    listenshowDraw: {
      handler: function(val, oldVal) {
        this.showDraw = val;
        this.showMode = Object.keys(this.$store.state.admin.agentInfo).length == 0 ? true : false
      }
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.demo-drawer-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}
.regex {
  color: red;
  z-index: 100;
  left: 0;
  position: absolute;
}
.content {
  margin: 20px 0;
  display: flex;
  align-items: center;
  .tr {
    text-align: right;
  }
  .tc {
    display: flex;
    align-items: center;
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
    display: flex;
    align-items: center;
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

