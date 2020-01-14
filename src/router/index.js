import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../pages/Login.vue'
import Register from '../pages/Register'
import Index from '../pages/Index'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    // 输入为'/'重定向到login界面
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/index', component: Index }
  ]
})

// 导出路由
export default router
