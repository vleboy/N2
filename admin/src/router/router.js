import main from '@/pages/main'
import login from '@/pages/login'
import err404 from '@/pages/404'
//otherRouter
import home from '@/pages/Home'
import playerCenter from '@/pages/player/playerCenter'
import agentCenter from '@/pages/agent/agentCenter'

const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    requireAuth: false
  },
  component: login
}
const page404 = {
  path: '*',
  name: 'error-404',
  meta: {
    title: '404-页面不存在',
    requireAuth: false
  },
  component: err404
}
// 作为main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
  path: '/',
  name: 'otherRouter',

  title: 'other',
  component: main,
  children: [
    { path: 'home', name: 'home', title: '首页', component: home },
  ]
}
// 作为main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
  {
    path: '/main',
    title: 'main',
    name: 'main',
    component: main,
    children: [
      { path: 'playerCenter', title: '玩家中心', name: 'playerCenter', component: playerCenter },
      { path: 'agentCenter', title: '代理中心', name: 'agentCenter', component: agentCenter }
    ]
  },
]
// 所有上面定义的路由都要写在下面的routers里
export const routers = [
  page404,
  loginRouter,
  otherRouter,
  ...appRouter,
]