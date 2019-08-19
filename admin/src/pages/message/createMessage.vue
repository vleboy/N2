<template>
  <div>
    <Drawer
      title="创建消息"
      v-model="showDraw"
      width="320"
      :mask-closable="false"
      :styles="styles"
      @on-close="hideDraw"
    >
      <div>
        <Row class-name="content">
          <Col span="6" class-name="tc">消息类型:</Col>
          <Col span="18">
            <Select v-model="project" style="width:200px">
                <Option v-for="item in projectList" :value="item.label" :key="item.value">{{ item.value }}</Option>
            </Select>
          </Col>
        </Row>
        <Row class-name="content" v-if="showPrivate">
          <Col span="6" class-name="tc">私信人类型:</Col>
          <Col span="18">
            <RadioGroup v-model="role">
              <Radio label="agent">代理</Radio>
              <Radio label="player">玩家</Radio>
            </RadioGroup>
          </Col>
        </Row>
        <Row class-name="content" v-if="showPrivate">
          <Col span="6" class-name="tc">私信人ID:</Col>
          <Col span="18">
            <Input v-model="ownerId" placeholder="请输入用户ID" style="width: 200px" />
          </Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">消息内容:</Col>
          <Col span="18">
            <Input v-model="msg" type="textarea" :maxlength="255" :autosize="true" style="width: 200px"/>
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
import { createMessage } from "../../service/index";
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
      project: 'noticeAll',
      projectList: [
        {
          value: '全体',
          label: 'noticeAll'
        },
        {
          value: '全体代理',
          label: 'noticeAgent'
        },
        {
          value: '全体玩家',
          label: 'noticePlayer'
        },
        {
          value: '私信',
          label: 'private'
        },
      ],
      role: 'agent',
      ownerId: '',
      msg: ''
    };
  },
  computed: {
    listenshowDraw() {
      return this.$store.state.admin.isShowDrawer;
    },
    showPrivate() {
      return this.project == 'private' ? true : false
    }
  },
  methods: {
    hideDraw() {
      this.initData();
    },
    cancle() {
      this.initData();
    },
   
    sub() {
      let params = {}
      
      if (this.project == 'private') {
        params = {
          project: this.project,
          role: this.role,
          ownerId: this.ownerId,
          msg: this.msg,
        }
      } else {
        params = {
          project: this.project,
          msg: this.msg,
        }
      }
    
      createMessage(params).then(res => {
        this.initData();
        this.$Message.success({ content: "创建成功" });
        this.$parent.search();
      })
      
    },
    initData() {
      this.project = "noticeAll";
      this.role = "agent";
      this.ownerId = "";
      this.msg = "";
      this.$store.commit("setDrawerInfo", {});
      this.$store.commit("showDrawer", false);
    },
    
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
.ivu-input-wrapper {
  width: 80%;
}
/deep/.ivu-input-number {
  width: 80%;
}
</style>

