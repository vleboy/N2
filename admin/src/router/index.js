import Vue from 'vue'
import VueRouter from 'vue-router'
import {routers} from './router'
Vue.use(VueRouter)
// 路由配置

const RouterConfig = {
  // mode: 'history',
  routes: routers
};
export const router = new VueRouter(RouterConfig);
router.beforeEach((to, from, next) => {
  let token = window.localStorage.getItem('Token')
  console.log(token)
  if (token) {
    next()
  } else {
    if (to.name == 'login') {
      next();
    } else {
      next({
        name: 'login',
        query: {
          redirect: to.fullPath
        }
      })
    }
  }

});

router.afterEach((to) => {
  window.scrollTo(0, 0);
});
