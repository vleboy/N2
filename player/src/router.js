import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Carousel from './views/Carousel.vue'
import Index from './views/Index.vue'
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
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/carousel',
      name: 'carousel',
      component: Carousel
    },
    
  ]
})
