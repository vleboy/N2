<template>
  <div>
    <Drawer
      :title="title"
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
            <Input
              :maxlength="max20"
              v-model="userName"
              placeholder="3-20位"
              style="width: 100%"
              :disabled="inputDisabled"
            />
          </Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">代理昵称:</Col>
          <Col span="18">
            <Input
              :maxlength="max20"
              v-model="userNick"
              placeholder="3-20位"
              style="width: 100%"
              :disabled="inputDisabled"
            />
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
              :disabled="inputDisabled"
            />
          </Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">手机号:</Col>
          <Col span="18">
            <Input :maxlength="11" v-model="mobile" placeholder="11位" style="width: 100%" />
          </Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">邮箱:</Col>
          <Col span="18">
            <Input v-model="email" placeholder="请输入邮箱" style="width: 100%" />
          </Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">业务模式:</Col>
          <Col span="18">
            <RadioGroup v-model="mode" @on-change="changeRadio">
              <Radio label="rebate" :disabled="rebateDisabled">
                <span>返利</span>
              </Radio>
              <Radio label="commission" :disabled="commissionDisabled">
                <span>返佣</span>
              </Radio>
              <Radio label="ratio" :disabled="ratioDisabled">
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
import { commissionGameList } from "../../config/getGameList";
import { createAgent, editAgent, queryConfig } from "../../service/index";
import { log } from "util";
export default {
  data() {
    return {
      title: '',
      max20: 20,
      showDraw: false,
      userName: "",
      userPwd: "",
      userNick: "",
      modeValue: "",
      mode: "rebate",
      mobile: "",
      email: "",
      rate: "",
      rebateDisabled: false,
      commissionDisabled: false,
      ratioDisabled: false,
      inputDisabled: false,
      pass: true,
      disabled: true,
      styles: {
        height: "calc(100% - 55px)",
        overflow: "auto",
        paddingBottom: "53px",
        position: "static"
      },
      gameList: []
    };
  },
  computed: {
    listenshowDraw() {
      return this.$store.state.admin.operateAgent;
    },
    rateConfig() {
      let radioGroup = {
        rebate: "返利",
        commission: "返佣",
        ratio: "占成"
      };
      return radioGroup[this.mode];
    },
    showGameList() {
      return this.mode == "commission" ? true : false;
    }
  },
  mounted() {
    this.getConfig();
  },
  methods: {
    //获取游戏返佣配置
    getConfig() {
      let params = {
        id: "commission"
      };
      queryConfig(params).then(res => {
        this.rate = res.res[0].value;
      });
    },
    hideDraw() {
      this.initData();
    },
    cancle() {
      this.initData();
    },
    formatMode() {
      let regex = /^\d+\.?\d{0,2}$/;
      if (!regex.test(this.modeValue)) {
        this.pass = false;
      } else {
        this.pass = true;
      }
    },
    sub() {
      this.formatMode();
      let params = {
        mobile: this.mobile,
        email: this.email,
        modeValue: this.modeValue
      };

      if (this.$store.state.admin.agentInfo.operate == "create") {
        params.userPwd = this.userPwd
        params.userName = this.userName
        params.userNick = this.userNick
        params.mode = this.mode
        params.parentId = this.$store.state.admin.agentInfo.id
        //返佣传入游戏列表
        if (this.mode == "commission") {
        params.gameList = this.gameList
      }
        createAgent(params).then(res => {
          this.initData();
          this.$Message.success({ content: "创建成功" });
          this.$parent.getList();
        });
      } else {
        editAgent(params).then(res => {
          this.initData();
          this.$Message.success({ content: "修改成功" });
          this.$parent.getList();
        })
      }
    },
    initData() {
      this.userName = "";
      this.userPwd = "";
      this.userNick = "";
      this.modeValue = "";
      this.mobile = "";
      this.email = "";
      this.mode = 'rebate'
      this.rebateDisabled = false;
      this.commissionDisabled = false;
      this.ratioDisabled = false;
      this.inputDisabled = false;
      this.getConfig();
      this.$store.commit("setAgentInfo", {});
      this.$store.commit("showOperateAgent", false);
    },
    changeRadio(val) {
      this.modeValue = val == "commission" ? this.rate : "";
    }
  },
  watch: {
    listenshowDraw: {
      handler: function(val, oldVal) {
        this.showDraw = val;
        //判断 创建 / 修改
        if (this.showDraw == true) {
          if (this.$store.state.admin.agentInfo.operate == "create") {
            this.ratioDisabled = this.$store.state.admin.agentInfo.id == undefined ? false : true;
            this.gameList = commissionGameList();
            this.inputDisabled = false;
            this.title = '创建代理'
          } else {
            this.userName = this.$store.state.admin.agentInfo.userName;
            this.userPwd = "******";
            this.userNick = this.$store.state.admin.agentInfo.userNick;
            this.mobile = this.$store.state.admin.agentInfo.mobile;
            this.email = this.$store.state.admin.agentInfo.email;
            this.inputDisabled = true;
            this.title = '修改代理'
            switch (this.$store.state.admin.agentInfo.mode) {
              case "rebate":
                this.commissionDisabled = true;                                                                                                                                                                                                        
                this.ratioDisabled = true;
                this.mode = "rebate";
                break;
              case "commission":
                this.rebateDisabled = true;
                this.ratioDisabled = true;
                this.mode = "commission";
                this.gameList = this.$store.state.admin.agentInfo.gameList;
                break;
              default:
                this.rebateDisabled = true;
                this.commissionDisabled = true;
                this.mode = "ratio";
                break;
            }
            this.modeValue = this.$store.state.admin.agentInfo.modeValue;
          }
        }
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

