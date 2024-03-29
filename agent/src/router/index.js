import Vue from 'vue'
import Router from 'vue-router'
import { routers } from './router'

Vue.use(Router)


const RouterConfig = {
  // mode: 'history',
  routes: routers
}

export const router = new Router(RouterConfig)

router.beforeEach((to, from, next) => {
  let token = window.localStorage.getItem('agentToken')
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