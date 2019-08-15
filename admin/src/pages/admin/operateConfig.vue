<template>
  <div>
    <Drawer
      title="修改配置"
      v-model="showDraw"
      width="320"
      :mask-closable="false"
      :styles="styles"
      @on-close="hideDraw"
    >
      <div>
        <Row class-name="content">
          <Col span="6" class-name="tc">编号:</Col>
          <Col span="18">
            {{id}}
          </Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">名称:</Col>
          <Col span="18">
            {{name}}
          </Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">数值:</Col>
          <Col span="18">
            <Input
              v-model="value"
              style="width: 100%"
            />
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
import { configUpdate } from "../../service/index";
import _ from "lodash";
export default {
  data() {
    return {
      showDraw: false,
      value: '',
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
      return this.$store.state.admin.operateConfig
    },
    id() {
      return this.$store.state.admin.configInfo.id
    },
    name() {
      return this.$store.state.admin.configInfo.name
    }
  },
  mounted() {},
  methods: {
    hideDraw() {
      this.initData();
    },
    cancle() {
      this.initData();
    },
    
    sub() {
      let params = {
          id: this.$store.state.admin.configInfo.id,
          value: this.value,
        };
      if (this.value != '') {
        configUpdate(params).then(res => {
          this.initData(params);
          this.$Message.success({ content: "修改成功" });
          this.$parent.getList();
        }).catch(err => {
          this.initData();
          this.$Message.error({ content: "修改失败" });
        })
      } else {
        this.$Message.error({ content: "数值不能为空" });
      }
    },
    initData() {
      this.value = ''
      this.$store.commit("setConfigInfo", {
        
      });
      this.$store.commit("showOperateConfig", false);
    }
  },
  watch: {
    listenshowDraw: {
      handler: function(val, oldVal) {
        this.showDraw = val;
        this.value = this.$store.state.admin.configInfo.value
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

