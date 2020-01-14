import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../pages/Login.vue'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    // 输入为'/'重定向到login界面
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login }
  ]
})

// 导出路由
export default router
