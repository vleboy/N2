<template>
  <div class="adminList">
    <Button size="small" type="info" ghost style="margin:0 0 10px 0" @click="createAdmin()">创建管理员</Button>
    <Table :columns="columns" :data="data" size="small">
     <template #operate="{row}">
        <Button size="small" type="info" ghost style="margin:0 5px" @click="editAdmin(row)">修改</Button>
        <Button size="small" type="error" ghost style="margin-right:5px" @click="deleteAdmin(row)">删除</Button>
     </template>
    </Table>
    <operateAdmin></operateAdmin>
    <Spin size="large" fix v-show="spinShow" style="z-index:200;">
      <Icon type="ios-loading" size=64 class="demo-spin-icon-load"></Icon>
      <div style>加载中...</div>
    </Spin>
  </div>
</template>

<script>
import dayjs from "dayjs";
import _ from "lodash";
import {queryAdmin, deleteAdmin} from '../../service/index'
import operateAdmin from './operateAdmin'

export default {
  components: {
    operateAdmin
  },
  data() {
    return {
      columns: [
        {
          title: "管理员账号",
          key: "userName",
          align: "center"
        },
        {
          title: "管理员昵称",
          align: "center",
          key: "userNick"
        },
        {
          title: "管理员角色",
          key: "subrole",
          align: "center"
        },
        {
          title: "创建时间",
          key: "createAt",
          align: "center",
          sortable: true,
          render: (h, params) => {
            return h("span", dayjs(params.row.createAt).format("YY-MM-DD"));
          }
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
      let params = {
        role: 'admin'
      }
      queryAdmin(params).then(res => {
        this.data = res
      })
    },
    createAdmin() {
      let params = {
        operate: 'create'
      }
      this.$store.commit('showOperateAdmin', true)
      this.$store.commit('setAdminInfo', params)
    },
    editAdmin(row) {
      let params = {
        id: row.id,
        userName: row.userName,
        userPwd: row.userPwd,
        userNick: row.userName,
        subRole: row.subrole,
        operate: 'edit'
      }
      this.$store.commit('showOperateAdmin', true)
      this.$store.commit('setAdminInfo', params)
    },
    //删除管理员
    deleteAdmin(row) {
      let params = {
        id: row.id
      }
      console.log(params);
      
      this.$Modal.confirm({
          title: '管理员管理',
          content: `确定删除该管理员?`,
          onOk: () => {
            deleteAdmin(params).then(res => {
              this.$Message.success(`删除成功`);
              this.getList()
            }).catch(err => {
              this.$Message.error(`删除失败`);
            })
          },
      });
    }
    /* operateSatus(row) {
      let text = row.status == 0 ? '启用' : '停用'
      let params = {
        id: row.id,
        status: row.status == 0 ? 1 : 0
      }
      
    } */
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
