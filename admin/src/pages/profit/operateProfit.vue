<template>
  <div>
    <Drawer
      title="业务结算详情"
      v-model="showDraw"
      width="320"
      :mask-closable="false"
      :styles="styles"
      @on-close="hideDraw"
    >
      <div>
        <Row class-name="content">
          <Col span="6" class-name="tc">状态:</Col>
          <Col span="16" push="2">
            <span>{{statusConfig(profitInfo.status)}}</span>
          </Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">发放人ID:</Col>
          <Col span="16" push="2">
           <span>{{profitInfo.profitId}}</span>
          </Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">发放人帐号:</Col>
          <Col span="16" push="2">
            <span>{{profitInfo.profitName}}</span>
          </Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">发放人昵称:</Col>
          <Col span="16" push="2">
            <span>{{profitInfo.profitNick}}</span>
          </Col>
        </Row>
      </div>
    </Drawer>
  </div>
</template>
<script>
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
      return this.$store.state.admin.operateProfit;
    },
    profitInfo() {
      return this.$store.state.admin.profitInfo
    }
  },
  methods: {
    statusConfig(val) {
      return val == 0 ? '未发放' : '已发放'
    },
    hideDraw() {
      this.initData()
    },
    initData() {
      this.$store.commit('setProfitInfo', { 
      })
      this.$store.commit("showOperateProfit", false);
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

