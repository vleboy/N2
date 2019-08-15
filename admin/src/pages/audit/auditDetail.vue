<template>
  <div>
    <Drawer
      title="审核详情"
      v-model="showDraw"
      width="320"
      :mask-closable="false"
      :styles="styles"
      @on-close="hideDraw"
    >
      <div>
        <Row class-name="content">
          <Col span="6" class-name="tc">申请人ID:</Col>
          <Col span="18">
            {{auditInfo.proposerId}}
          </Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">申请人账号:</Col>
          <Col span="18">
            {{auditInfo.proposerName}}
          </Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">申请人昵称:</Col>
          <Col span="18">
            {{auditInfo.proposerNick}}
          </Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">申请金额:</Col>
          <Col span="18">
            {{auditInfo.amount}}
          </Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">开户行:</Col>
          <Col span="18">
            {{auditInfo.cardBank}}
          </Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">持卡人:</Col>
          <Col span="18">
            {{auditInfo.cardName}}
          </Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">卡号:</Col>
          <Col span="18">
            {{auditInfo.cardNo}}
          </Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">申请日期:</Col>
          <Col span="18">
            {{createConfig(auditInfo.createAt)}}
          </Col>
        </Row>
      </div>
    </Drawer>
  </div>
</template>
<script>
import { createAdmin, updateAdmin, queryRole } from "../../service/index";
import _ from "lodash";
import dayjs from 'dayjs'
export default {
  data() {
    return {
      showDraw: false,
      styles: {
        height: "calc(100% - 55px)",
        overflow: "auto",
        paddingBottom: "53px",
        position: "static"
      }
    };
  },
  computed: {
    listenshowDraw() {
      return this.$store.state.admin.auditDetail;
    },
    auditInfo() {
      return this.$store.state.admin.auditInfo
    }
  },
  mounted() {},
  methods: {
    createConfig(row) {
      return dayjs(row).format('YY-MM-DD')
    },
    hideDraw() {
      this.initData();
    },
    initData() {
      this.$store.commit("setAuditInfo", {
        userName: "",
        userPwd: "",
        userNick: "",
        operate: ""
      });
      this.$store.commit("showAuditDetail", false);
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

