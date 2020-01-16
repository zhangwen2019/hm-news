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

// 导出路由
export default router
