import Vue from 'vue'
import Router from 'vue-router'
import Main from '../views/Main.vue'

import Setting from '../views/setting/Setting.vue'
import Personal from '../views/setting/Personal.vue'
import ChangePwd from '../views/setting/ChangePwd.vue'
import Simulator from '../views/setting/Simulator.vue'

import Agent from '../views/agent/Agent.vue'

import Vip from '../views/vip/Vip.vue'

import Home from '../views/home/Home.vue'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main,
      redirect: 'setting',
      children: [
        {
          path: 'home',
          name: 'home',
          component: Home,
        },
        {
          path: 'setting',
          name: 'setting',
          component: Setting,
        },
        {
          path: 'agent',
          name: 'agent',
          component: Agent,
        },
        {
          path: 'vip',
          name: 'vip',
          component: Vip,
        }
      ]
    },

    /* 设置 */
    {
      path: '/personal',
      name: 'personal',
      component: Personal,
    },
    {
      path: '/changePwd',
      name: 'changePwd',
      component: ChangePwd,
    },
    {
      path: '/simulator',
      name: 'simulator',
      component: Simulator,
    }
    /* {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about"  './views/About.vue')
    } */
  ]
})
