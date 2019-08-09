<template>
  <div>
    <Button size="small" type="info" ghost style="margin:0 0 10px 0" @click="createRole">创建管理员角色</Button>
    <Table :columns="columns" :data="data" size="small">
     <template #operate="{row}">
        <Button size="small" type="info" ghost style="margin:0 5px" @click="editRole(row)">修改</Button>
        <Button size="small" type="error" ghost style="margin-right:5px" @click="deleteRole(row)">删除</Button>
     </template>
    </Table>
    <operateRole></operateRole>
    <Spin size="large" fix v-show="spinShow" style="z-index:200;">
      <Icon type="ios-loading" size=64 class="demo-spin-icon-load"></Icon>
      <div style>加载中...</div>
    </Spin>
  </div>
</template>

<script>
import dayjs from "dayjs";
import _ from "lodash";
import {queryRole, deleteRole} from '../../service/index'

import operateRole from './operateRole'
export default {
  components: {
    operateRole
  },
  data() {
    return {
       columns: [
        {
          title: "角色名",
          key: "roleName",
          align: "center"
        },
        {
          title: "权限",
          align: "center",
          key: "permissions"
        },
        {
          title: "创建时间",
          key: "createAt",
          align: "center",
          sortable: true,
          render: (h, params) => {
            return h("span", dayjs(params.row.createAt).format("YY-MM-DD"));
          },
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
      queryRole().then(res => {
        this.data = res
      })
    },
    //创建角色
    createRole() {
      let params = {
        rolename: '',
        permissions: [],
        operate: 'create'
      }
      this.$store.commit('showCreateRole', true)
      this.$store.commit('setRoleInfo', params)
    },
    //修改角色
    editRole(row) {
      let params = {
        roleName: row.roleName,
        permissions: row.permissions,
        operate: 'edit',
        id: row.id
      }
      this.$store.commit('showCreateRole', true)
      this.$store.commit('setRoleInfo', params)
    },
    //删除角色
    deleteRole(row) {
      let params = {
        id: row.id
      }
      this.$Modal.confirm({
          title: '角色管理',
          content: `确定删除该代理?`,
          onOk: () => {
            deleteRole(params).then(res => {
              this.$Message.success(`删除成功`);
              this.getList()
            }).catch(err => {
              this.$Message.error(`删除失败`);
            })
          },
      });
    }
  }
};

</script>
    
<style lang="less" scoped>
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
