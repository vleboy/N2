<template>
  <div class="adminList">
    <Table :columns="columns" :data="data" size="small">
     <template #operate="{row}">
        <Button size="small" type="info" ghost style="margin:0 5px" @click="edit(row)">修改</Button>
     </template>
    </Table>
    <operateConfig></operateConfig>
    <Spin size="large" fix v-show="spinShow" style="z-index:200;">
      <Icon type="ios-loading" size=64 class="demo-spin-icon-load"></Icon>
      <div style>加载中...</div>
    </Spin>
  </div>
</template>

<script>
import dayjs from "dayjs";
import _ from "lodash";
import {configQuery} from '../../service/index'
import operateConfig from './operateConfig'

export default {
  components: {
    operateConfig
  },
  data() {
    return {
      columns: [
        {
          title: "编号",
          key: "id",
          align: "center"
        },
        {
          title: "名称",
          align: "center",
          key: "name"
        },
        {
          title: "数值",
          key: "value",
          align: "center"
        },
        {
          title: "操作",
          slot: "operate",
          align: "center"
        }
      ],
      spinShow: false,
      data: [],
    };
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      configQuery().then(res => {
        this.data = res.res
      }).catch(err => {

      })
    },
    edit(row) {
      this.$store.commit('showOperateConfig', true)
      this.$store.commit('setConfigInfo', row)
    }
  }
};

</script>
    
<style lang="less" scoped>
  /deep/.ivu-table-small th {
      height: 26px;
    }
    /deep/.ivu-table-small td {
      height: 26px;
    }
  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
  /deep/.zk-table__body-row {
    height: 20px;
  }
  /deep/ .zk-table__cell-inner {
    padding: 0px 12px;
  }
  /deep/ .zk-table__footer-row, /deep/.zk-table__header-row {
    height: 20px;
  }
</style>
