import Home from '../views/home/Home.vue'
import Test from '../views/home/Test.vue'
import Main from '../views/Main.vue'
import Service from '../views/service/Service.vue'
import Mine from '../views/mine/Mine.vue'
import Discount from '../views/discount/Discount.vue'
import Login from '../views/Login.vue'


const mainRouter = {
  path: '/',
  name: 'main',
  component: Main,
  redirect: 'mine',
  children: [
    {
      path: 'test',
      name: 'test',
      component: Test
    },
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
    path: '/test',
    name: 'test',
    component: Test
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
]

export const routers = [
  mainRouter,
  ...otherRouter
]
