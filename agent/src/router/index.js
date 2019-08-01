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
import CommissionReport from '../views/home/detail/CommissionReport.vue'
import WithdrawalRecord from '../views/home/detail/WithdrawalRecord.vue'
import News from '../views/home/detail/News.vue'
import WithdrawalApplication from '../views/home/detail/WithdrawalApplication.vue'
import FinanceReport from '../views/home/detail/FinanceReport.vue'


import Table from '../components/Table.vue'


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

    /* 设置相关 */
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
    },

    /* 首页相关 */
    {
      path: '/commissionReport',
      name: 'commissionReport',
      component: CommissionReport,
    },
    {
      path: '/commissionReport',
      name: 'commissionReport',
      component: WithdrawalRecord,
    },
    {
      path: '/news',
      name: 'news',
      component: News,
    },
    {
      path: '/withdrawalApplication',
      name: 'withdrawalApplication',
      component: WithdrawalApplication
    },
    {
      path: '/withdrawalRecord',
      name: 'withdrawalRecord',
      component: WithdrawalRecord
    },
    {
      path: '/financeReport',
      name: 'financeReport',
      component: FinanceReport
    },

    {
      path: '/table',
      name: 'table',
      component: Table
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
