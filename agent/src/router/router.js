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
import UserInfo from '../views/home/detail/UserInfo.vue'

import Login from '../views/Login.vue'

const mainRouter = {
  path: '/',
  name: 'main',
  component: Main,
  redirect: 'home',
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
}


const otherRouter = [
  {
    path: '/login',
    name: 'login',
    component: Login,
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
    path: '/userInfo',
    name: 'userInfo',
    component: UserInfo
  }
]


export const routers = [
  mainRouter,
  ...otherRouter
]

