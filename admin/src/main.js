// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import { appRouter } from "./router/router";
import { router } from "./router/index";
import { store } from "./store";
import iView from "iview";
import "../my-theme/index.less";
import axios from "axios";
import TreeTable from "tree-table-vue";

Vue.prototype.axios = axios;
Vue.config.productionTip = false;

Vue.use(iView);
Vue.use(TreeTable);

new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App),
  data: {
    currentPageName: ""
  },
  mounted() {
    this.currentPageName = this.$route.name;
    // // 显示打开的页面的列表
    this.$store.commit("setOpenedList", { currentPageName: this.currentPageName });
  },
  created() {
    let tagsList = [];
    appRouter.map(item => {
      if (item.children.length <= 1) {
        tagsList.push(item.children[0]);
      } else {
        tagsList.push(...item.children);
      }
    });
    this.$store.commit("setTagsList", tagsList);
    this.$Message.config({
      top: 50,
      duration: 4
    });
  }
});
