<template>
  <div>
    <Drawer
      title="创建角色"
      v-model="showDraw"
      width="320"
      :mask-closable="false"
      :styles="styles"
      @on-close="hideDraw"
    >
      <div>
        <Row class-name="content">
          <Col span="6" class-name="tc">角色名:</Col>
          <Col span="18">
            <Input :maxlength="max20" v-model="roleName" placeholder="3-20位" style="width: 100%" />
          </Col>
        </Row>
        <Row class-name="content">
          <Tree :data="newTree" show-checkbox @on-check-change="checkRole"></Tree>
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
import { createRole, updateRole } from "../../service/index";
import _ from "lodash";
import { setTimeout } from "timers";
export default {
  data() {
    return {
      max20: 20,
      showDraw: false,
      roleName: "",
      permissions: [],
      styles: {
        height: "calc(100% - 55px)",
        overflow: "auto",
        paddingBottom: "53px",
        position: "static"
      },
      newTree: [
        {
          title: "所有权限",
          expand: true,
          checked: false,
          children: [
            {
              title: "代理中心",
              expand: false,
              checked: false
            },
            {
              title: "玩家中心",
              expand: false,
              checked: false
            },
            {
              title: "代理流水",
              expand: false,
              checked: false
            },
            {
              title: "玩家流水",
              expand: false,
              checked: false
            },
            {
              title: "审核中心",
              expand: false,
              checked: false
            },
            {
              title: "消息中心",
              expand: false,
              checked: false
            },
            {
              title: "管理中心",
              expand: false,
              checked: false,
              children: [
                {
                  title: "管理员列表",
                  expand: false,
                  checked: false
                },
                {
                  title: "角色列表",
                  expand: false,
                  checked: false
                },
                {
                  title: "配置中心",
                  expand: false,
                  checked: false
                }
              ]
            }
          ]
        }
      ]
    };
  },
  computed: {
    listenshowDraw() {
      return this.$store.state.admin.createRole;
    }
  },
  mounted() {},
  methods: {
    getInfo() {
      this.permissions = this.$store.state.admin.roleInfo.permissions;
      this.roleName = this.$store.state.admin.roleInfo.roleName;
      if (this.permissions.length > 0) {
        this.permissionsConfig(this.newTree);
      }
    },
    permissionsConfig(tree) {
      for (let node of tree) {
        if (node.children && node.children.length > 0) {
          this.permissionsConfig(node.children);
        }
        if (this.permissions.find(o => o == node.title)) {
          node.checked = true;
        }
      }
    },
    hideDraw() {
      this.initData();
    },
    cancle() {
      this.initData();
    },
    checkRole(arr) {
      this.permissions = [];
      for (let i = 0; i < arr.length; i++) {
        this.permissions.push(arr[i].title);
      }
    },
    sub() {
      if (this.$store.state.admin.roleInfo.operate == "create") {
        let params = {
          roleName: this.roleName,
          permissions: this.permissions
        };
        createRole(params)
          .then(res => {
            this.initData();
            this.$Message.success({ content: "创建成功" });
            this.$parent.getList();
          })
          .catch(err => {
            this.initData();
            this.$Message.error({ content: "创建失败" });
          });
      } else {
        let params = {
          id: this.$store.state.admin.roleInfo.id,
          roleName: this.roleName,
          permissions: this.permissions
        };
        updateRole(params)
          .then(res => {
            this.initData();
            this.$Message.success({ content: "修改成功" });
            this.$parent.getList();
          })
          .catch(err => {
            this.initData();
            this.$Message.error({ content: "修改失败" });
          });
      }
    },
    initData() {
      this.roleName = "";
      this.permissions = [];
      this.$store.commit("setRoleInfo", {
        rolename: "",
        permissions: [],
        operate: ""
      });
      this.$store.commit("showCreateRole", false);
    }
  },
  watch: {
    listenshowDraw: {
      handler: function(val, oldVal) {
        this.showDraw = val;
        this.getInfo();
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

