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
          <Col span="6" class-name="tc">代理密码:</Col>
          <Col span="18">
            <Input :maxlength="max20" v-model="userPwd" type="password" placeholder="6-20位" style="width: 100%" />
          </Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">代理昵称:</Col>
          <Col span="18">
            <Input :maxlength="max20" v-model="userNick" placeholder="3-20位" style="width: 100%" />
          </Col>
        </Row>
      </div>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="cancle">取消</Button>
        <Button type="primary" @click="sub">提交</Button>
      </div>
    </Drawer>
  </div>
</template>
<script>
import { createAgent } from "../../service/index";
export default {
  data() {
    return {
      max20: 20,
      showDraw: false,
      userName: '',
      userPwd: '',
      userNick: '',
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
      return this.$store.state.admin.createAgent;
    },
  },
  methods: {
    hideDraw() {
      this.initData()
    },
    cancle() {
      this.initData()
    },
    sub() {
      let prarms = {
        parentId: this.$store.state.admin.agentInfo.id,
        userName: this.userName,
        userPwd: this.userPwd,
        userNick: this.userNick
      };
      createAgent(prarms).then(res => {
        this.initData()
        this.$Message.success({content: '创建成功'})
        this.$parent.getList()
      });
    },
    initData() {
      this.userName = ''
      this.userPwd = ''
      this.userNick = ''
      this.$store.commit('setAgentInfo', {
        
      })
      this.$store.commit("showCreateAgent", false);
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

