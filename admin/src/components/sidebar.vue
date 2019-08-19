<template>
  <div class="sider">
    <Sider :width="menuWidth" collapsible hide-trigger :style="{overflow:'auto',position:'fixed',height: '100vh', left: 0,backgroundColor:'#111'}" class="showMenu">
      <div id="logo" :class="flodMenu ? 'flodMuenS' : 'class-b' ">
        <p class="logoimg" v-if="unFlodMenu">
          <img src="../../public/logo.png" alt="">
        </p>
        <p class="arrow" >
          <div v-if="foldIcon" @click="fold" class="foldIcon">
            <Icon type="md-swap" size="28"/>
          </div> 
          <Icon type="md-swap" size="32" v-else @click="unfold" style="padding-top:.7rem"/>
        </p>
      </div>
      <transition name="fade">
        <Menu ref="sideMenu" :active-name="$route.name" :open-names="openName" width="auto" @on-select='selectMenu' :style="{backgroundColor:'#111',color:'#fff',marginTop:'.3rem'}">
          <MenuItem name="agentCenter" :class="flodMenu ? 'flodMuenS' : 'class-b' ">
            <Icon type="md-people" />
            <span v-if="unFlodMenu" class="ml">代理中心</span>
          </MenuItem>
          <MenuItem name="playerCenter" :class="flodMenu ? 'flodMuenS' : 'class-b' ">
            <Icon type="md-ionitron" />
            <span v-if="unFlodMenu" class="ml">玩家中心</span>
          </MenuItem>
          <MenuItem name="agentBill" :class="flodMenu ? 'flodMuenS' : 'class-b' ">
            <Icon type="md-paper" />
            <span v-if="unFlodMenu" class="ml">代理账单</span>
          </MenuItem>
          <MenuItem name="playerBill" :class="flodMenu ? 'flodMuenS' : 'class-b' ">
            <Icon type="md-paper" />
            <span v-if="unFlodMenu" class="ml">玩家账单</span>
          </MenuItem>
          <MenuItem name="auditCenter" :class="flodMenu ? 'flodMuenS' : 'class-b' ">
            <Icon type="md-checkbox-outline" />
            <span v-if="unFlodMenu" class="ml">审核中心</span>
          </MenuItem>
          <MenuItem name="messageCenter" :class="flodMenu ? 'flodMuenS' : 'class-b' ">
            <Icon type="logo-twitch" />
            <span v-if="unFlodMenu" class="ml">消息中心</span>
          </MenuItem>
          <MenuItem name="adminList" v-if='flodMenu' :class="flodMenu ? 'flodMuenS' : 'class-b' ">
            <Icon type="md-key" @click="unfold"/>
          </MenuItem>
          <Submenu name="adminCenter" v-if='unFlodMenu' class="sideMenu">
            <template slot="title">
              <Icon type="md-key" />
              <span>管理中心</span>
            </template>
            <MenuItem name="adminList">管理员列表</MenuItem>
            <MenuItem name="adminRole">角色列表</MenuItem>
            <MenuItem name="configuration">配置中心</MenuItem>
          </Submenu>  
        </Menu>
      </transition>
    </Sider>
  </div>
</template>
<script>
export default {
  data() {
    return {
      menuWidth: '180px',
      foldIcon: true,
      //默认不折叠
      unFlodMenu: true,
      //折叠
      flodMenu: false,
    };
  },
  created() {
    
  },
  methods: {
    selectMenu(name) {
      this.$router.push({ name: name });
    },
    //折叠菜单栏
    fold() {
      this.unFlodMenu = false
      this.flodMenu = true
      this.foldIcon = false
      this.menuWidth = '50px'
      this.$store.commit("changeWidth", '50px');
    },
    //展开菜单栏
    unfold() {
      this.unFlodMenu = true
      this.flodMenu = false
      this.foldIcon = true
      this.menuWidth = '180px'
      this.$store.commit("changeWidth", '180px');
    }
  },
  computed: {
    
  },
  props: ["openName"],
  updated() {
    this.$nextTick(() => {
      if (this.$refs.sideMenu) {
        this.$refs.sideMenu.updateOpened();
      }
    });
  }
};
</script>

<style scoped lang="less">
/deep/ .ivu-menu {
  color:#fff;
}

/deep/ .ivu-menu-vertical .ivu-menu-item:hover, .ivu-menu-vertical .ivu-menu-submenu-title :hover {
  
  color: #20c1dc;
  background: #192028
}
/deep/ .ivu-menu-submenu-title:hover {
  background: #192028;
  color: #20c1dc !important;
}



/deep/ .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
  background: #20c1dc;
  color:#fff;
}
.showMenu {
  transition: all 0.2s ease;
}
.flodMuenS {
  display: flex;
  justify-content: center;
  font-size: 28px;
  cursor: pointer;
}
#logo {
  color: #fff;
  display: flex;
}
.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
#logo .logoimg {
  display: flex;
  width: 90%;
  height: 50px;
  justify-content: center;
}
#logo .arrow {
  display: flex;
  align-items: center;
}
#logo .logoimg img {
  margin: 0;
  display: block;
  width: 50%;
  height: 100%;
}
.foldIcon {
  cursor: pointer;
  margin-right:1.5rem;
  display: flex;
  align-items: center;
}
.ml{
  margin-left: .3rem;
}
/deep/ .ivu-tooltip {
  z-index: 999;
 
}
/deep/ .ivu-tooltip-popper .ivu-tooltip-dark {
  z-index: 999;
}
/deep/ .ivu-tooltip-content {
  z-index: 9999;
}
/deep/ .ivu-tooltip-inner {

   z-index: 999;
}

/dee/ .ivu-tooltip-rel {
   z-index: 999;

}
</style>
