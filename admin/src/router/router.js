import main from '@/pages/main'
import login from '@/pages/login'
import err404 from '@/pages/404'
//otherRouter
import home from '@/pages/Home'
import playerCenter from '@/pages/player/playerCenter'
import playerBill from '@/pages/player/playerBill'
import agentCenter from '@/pages/agent/agentCenter'
import agentBill from '@/pages/agent/agentBill'
import auditCenter from '@/pages/audit/auditCenter'
import adminList from '@/pages/admin/adminList'
import adminRole from '@/pages/admin/adminRole'
import configuration from '@/pages/admin/configuration'

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
  redirect: 'home',
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
      { path: 'agentCenter', title: '代理中心', name: 'agentCenter', component: agentCenter },
      { path: 'auditCenter', title: '审核中心', name: 'auditCenter', component: auditCenter },
      { path: 'playerBill', title: '玩家账单', name: 'playerBill', component: playerBill },
      { path: 'agentBill', title: '代理账单', name: 'agentBill', component: agentBill },
      { path: 'adminList', title: '管理员列表', name: 'adminList', component: adminList },
      { path: 'adminRole', title: '角色列表', name: 'adminRole', component: adminRole },
      { path: 'configuration', title: '配置中心', name: 'configuration', component: configuration }
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
