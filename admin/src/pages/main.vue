<template>
  <div class="home">
    <!-- 左侧菜单列表 -->
    <sidebar :openName='openName'/>
    <!-- 右侧显示内容 -->
    <Layout :style="{marginLeft:layoutWidth}">
      <Header class="main_header">
        <div class="tags-con">
          <tag-close :pageTagsList="pageTagsList"/>
        </div>
        <div class="user-dropdown-menu-con">
          <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
            <Avatar icon="md-person" size="small" style="background: #619fe7;margin-right: 10px;"></Avatar>
            <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown" placement="bottom-start">
              <a href="javascript:void(0)">
                <span class="main-user-name">{{ `${userName}(${subrole})` }}</span>
                <Icon type="ios-arrow-down"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem name="loginout" >退出登录</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Row>
        </div>
      </Header>
      <Content>
        <Card style="overflow:auto">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </Card>
      </Content>
    </Layout>
  </div>
</template>
<script>
import sidebar from "@/components/sidebar";
import tagClose from "@/components/tags-close.vue";
import util from "@/libs/util.js";
import {menuOpen} from '@/config/menuOpen'
export default {
  data() {
    return {
      // avatorPath: "",
      userName: localStorage.displayName,
      subrole: localStorage.subrole,
      openName: []
    };
  },
  computed: {
    pageTagsList() {
      return this.$store.state.home.pageOpenedList; //打开的页面的页面对象
    },
    layoutWidth() {
      return this.$store.state.home.menuSize
    }
  },
  methods: {
    init() {
      this.checkTag(this.$route.name);
    },
    checkTag(name) {
      let openpageHasTag = this.pageTagsList.some(item => {
        if (item.name === name) {
          return true;
        }
      });
      if (!openpageHasTag) {
        //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
        util.openNewPage(
          this,
          name,
          this.$route.params || {},
          this.$route.query || {}
        );
      }
    },
    handleClickUserDropdown(name) {
      this.$Modal.confirm({
        title: "提示",
        content: "<p>是否确认退出</p>",
        onOk: () => {
          localStorage.clear();
          this.$store.commit('clearAllTag')
          this.$router.push({ name: "login" });
          this.$store.commit('changeLoading',{params:false});
        }
      });
    }
  },
  components: { sidebar, tagClose },
  mounted() {
    this.init();
  },
  created() {
    // 显示打开的页面的列表
    // this.$store.commit("setOpenedList");
  },
  watch: {
    $route(to) {
      let name = to.name;
      this.$store.commit("setCurrentPageName", name);
      this.checkTag(name);
      this.openName = menuOpen(name);
      //console.log(this.openName);
      
      // this.$store.commit("addOpenSubmenu", pathArr[1].name);
    }
  }
};
</script>
<style lang="less" scoped>
/deep/ .ivu-layout-header[data-v-73309bbd] {
  padding: 0;
  
}
/deep/ .user-dropdown-menu-con {
  display: flex;
  .ivu-layout-header {
    line-height: 0;
  }
}

/deep/ .ivu-layout-header {
  padding: 0;
}
.tags-con {
  height: 50px;
  z-index: -1;
  //: hidden;
  //   background: #f0f0f0;
}

.main_header {
  height: 50px;
  background: #fff;
  box-shadow: 0 2px 1px 1px rgba(100, 100, 100, 0.1);
  position: relative;
  z-index: 11;
  display: flex;
  justify-content: space-between;
}
.user-dropdown-menu-con {
  box-sizing: border-box;
  text-align: center;
  height: 100%;
  background: white;
  z-index: 10;
  padding-right: 20px;
}
/deep/.ivu-card-body {
  height: calc(100vh - 52px);
}
</style>
