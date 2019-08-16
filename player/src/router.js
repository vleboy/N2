import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Test from './views/Test.vue'
import Main from './views/Main.vue'
import Service from './views/Service.vue'
import Mine from './views/Mine.vue'
import Discount from './views/Discount.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
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
    },
    {
      path: '/test',
      name: 'test',
      component: Test
    },
  ]
})
