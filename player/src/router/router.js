import Home from '../views/home/Home.vue'
import Main from '../views/Main.vue'
import Service from '../views/service/Service.vue'
import Mine from '../views/mine/Mine.vue'
import Discount from '../views/discount/Discount.vue'
import Login from '../views/Login.vue'
import WithdrawalApplication from '../views/home/withdrawal/WithdrawalApplication.vue'
import AddBankCard from '../views/home/withdrawal/AddBankCard.vue'
import DepositApplication from '../views/home/deposit/DepositApplication.vue'
import Message from '../views/home/message/Message.vue'
import ShowBankCard from '../views/mine/ShowBankCard.vue'
import TransactionRecord from '../views/mine/TransactionRecord.vue'
import DepositRecord from '../views/mine/DepositRecord.vue'
import WithdrawalRecord from '../views/mine/WithdrawalRecord.vue'

const mainRouter = {
  path: '/',
  name: 'main',
  component: Main,
  redirect: 'home',
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
  },
  {
    path: '/depositApplication',
    name: 'depositApplication',
    component: DepositApplication
  },
  {
    path: '/message',
    name: 'message',
    component: Message
  },
  {
    path: '/showBankCard',
    name: 'showBankCard',
    component: ShowBankCard
  },
  {
    path: '/transactionRecord',
    name: 'transactionRecord',
    component: TransactionRecord
  },
  {
    path: '/depositRecord',
    name: 'depositRecord',
    component: DepositRecord
  },
  {
    path: '/withdrawalRecord',
    name: 'withdrawalRecord',
    component: WithdrawalRecord
  }
]

export const routers = [
  mainRouter,
  ...otherRouter
]
