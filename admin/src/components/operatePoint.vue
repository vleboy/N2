<template>
  <div>
    <Drawer
      title="加减点"
      v-model="showDraw"
      width="320"
      :mask-closable="false"
      :styles="styles"
      @on-close="hideDraw"
    >
      <div>
        <Row class-name="content">
          <Col span="6" class-name="tc">账户:</Col>
          <Col span="18">{{userName}}</Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">操作:</Col>
          <Col span="18">
            <RadioGroup v-model="project">
              <Radio label="1">
                <span>加点</span>
              </Radio>
              <Radio label="-1">
                <span>减点</span>
              </Radio>
            </RadioGroup>
          </Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">点数:</Col>
          <Col span="18">
            <InputNumber 
              :max="9999999" 
              :min="0" v-model="point"
              :precision="precision"
            >
            </InputNumber>
          </Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">备注:</Col>
          <Col span="18">
            <Input v-model="remark" type="textarea" :autosize="true" placeholder="随便输点什么..." />
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
import {setPoints} from '../service/index'
export default {
  data() {
    return {
      showDraw: false,
      project: '1',//判断加减点
      point: 0,
      remark: '',
      precision: 0,//点数精度
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
      return this.$store.state.admin.pointDrawer;
    },
    userName() {
      return this.$store.state.admin.pointInfo.name;
    }
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
        id: this.$store.state.admin.pointInfo.id,
        project: this.project,
        role: this.$store.state.admin.pointInfo.role,
        amount: this.point,
        remark: this.remark
      }
      setPoints(prarms).then(res => {
        this.initData()
        this.$Message.success({content: res.res})
        this.$parent.search()
      })
    },
    //初始化数据
    initData() {
      this.project = '1'
      this.point = 0
      this.remark = ''
      this.$store.commit('setPointInfo', {
        
      })
      this.$store.commit("showPointDrawer", false);
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

