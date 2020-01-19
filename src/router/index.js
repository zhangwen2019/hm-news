import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Profile from '../pages/Profile'
import Index from '../pages/Index'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    // 输入为'/'重定向到login界面(使用命名路由)
    // 如果使用path跳转，只能通过query
    // 如果使用name跳转， 可以通过params或者query(缺点:是写在url路径中的)传参
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login, name: 'login' },
    { path: '/register', component: Register, name: 'register' },
    { path: '/index', component: Index, name: 'index' },
    { path: '/profile', component: Profile, name: 'profile' }
  ]
})

// 设置路由导航守卫
router.beforeEach((to, from, next) => {
  // 如果访问的是login和register页面直接放行
  if (to.path === '/login' || to.path === '/register') return next()
  const tokenStr = localStorage.getItem('token')
  // 如果localStorage中有了token就放行,没有就直接跳转到登陆界面(有权限的页面)
  // 但是有一个问题(token会过期,或者token被造假)
  if (!tokenStr) return next('/login')
  next()
})

// 导出路由
export default router
