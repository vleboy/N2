import Home from '../views/home/Home.vue'
import Main from '../views/Main.vue'
import Service from '../views/service/Service.vue'
import Mine from '../views/mine/Mine.vue'
import Discount from '../views/discount/Discount.vue'
import Login from '../views/Login.vue'
import WithdrawalApplication from '../views/home/withdrawal/WithdrawalApplication.vue'
import AddBankCard from '../views/home/withdrawal/AddBankCard.vue'

const mainRouter = {
  path: '/',
  name: 'main',
  component: Main,
  redirect: 'mine',
  children: [
    {
      path: 'home',
      name: 'home',
      component: Home
    },
    {
      path: 'service',
      name: 'service',
      component: Service
    },
    {
      path: 'mine',
      name: 'mine',
      component: Mine
    },
    {
      path: 'discount',
      name: 'discount',
      component: Discount
    },
  ]
}

const otherRouter = [
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/withdrawalApplication',
    name: 'withdrawalApplication',
    component: WithdrawalApplication
  },
  {
    path: '/addBankCard',
    name: 'addBankCard',
    component: AddBankCard
  }
]

export const routers = [
  mainRouter,
  ...otherRouter
]
