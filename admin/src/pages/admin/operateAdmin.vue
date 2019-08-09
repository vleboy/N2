<template>
  <div>
    <Drawer
      title="创建管理员"
      v-model="showDraw"
      width="320"
      :mask-closable="false"
      :styles="styles"
      @on-close="hideDraw"
    >
      <div>
        <Row class-name="content">
          <Col span="6" class-name="tc">管理员账号:</Col>
          <Col span="18">
            <Input
              :disabled="disabledInput"
              :maxlength="max20"
              v-model="userName"
              placeholder="3-20位"
              style="width: 100%"
            />
          </Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">管理员密码:</Col>
          <Col span="18">
            <Input
              :maxlength="max20"
              type="password"
              v-model="userPwd"
              placeholder="3-20位"
              style="width: 100%"
            />
          </Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">管理员昵称:</Col>
          <Col span="18">
            <Input
              :disabled="disabledInput"
              :maxlength="max20"
              v-model="userNick"
              placeholder="3-20位"
              style="width: 100%"
            />
          </Col>
        </Row>
        <Row class-name="content">
          <Col span="6" class-name="tc">管理员角色:</Col>
          <Col span="18">
            <Select :disabled="disabledInput" v-model="subRole" style="width:200px" @on-change="selectRole">
              <Option
                v-for="item in roleArr"
                :value="item.roleName"
                :key="item.roleName"
              >{{ item.roleName }}</Option>
            </Select>
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
import { createAdmin, updateAdmin, queryRole } from "../../service/index";
import _ from "lodash";
export default {
  data() {
    return {
      max20: 20,
      showDraw: false,
      userName: "",
      disabledInput: false,
      userPwd: "",
      userNick: "",
      subRole: "",
      roleArr: [],
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
      return this.$store.state.admin.operateAdmin;
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
    selectRole(val) {
      this.subRole = val;
    },
    sub() {
      if (this.$store.state.admin.adminInfo.operate == "create") {
        let params = {
          userName: this.userName,
          userPwd: this.userPwd,
          userNick: this.userNick,
          subrole: this.subRole
        };
        createAdmin(params)
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
          id: this.$store.state.admin.adminInfo.id,
          userPwd: this.userPwd,
        };
        updateAdmin(params)
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
      this.userName = "";
      this.disabledInput = false;
      this.userPwd = "";
      this.userNick = "";
      this.$store.commit("setAdminInfo", {
        userName: "",
        userPwd: "",
        userNick: "",
        operate: ""
      });
      this.$store.commit("showOperateAdmin", false);
    }
  },
  watch: {
    listenshowDraw: {
      handler: function(val, oldVal) {
        this.showDraw = val;
        queryRole().then(res => {
          this.roleArr = res;
          if (this.$store.state.admin.adminInfo.operate == "create") {
            this.subRole = res[0].roleName;
          } else {
            this.subRole = this.$store.state.admin.adminInfo.subRole;
            this.userName = this.$store.state.admin.adminInfo.userName;
            this.userPwd = this.$store.state.admin.adminInfo.userPwd;
            this.userNick = this.$store.state.admin.adminInfo.userNick;
            this.disabledInput = true
          }
        });
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

