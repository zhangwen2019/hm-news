import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Profile from '../pages/Profile'
import Index from '../pages/Index'
import EditProfile from '../pages/EditProfile'
import Follow from '../pages/Follow'
import Comment from '../pages/Comment'
import Test from '../pages/Test'
import Star from '../pages/Star'
import PostDetail from '../pages/PostDetail'
import TabManager from '../pages/TabManager'
import Search from '../pages/Search'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    // 输入为'/'重定向到login界面(使用命名路由)
    // 如果使用path跳转，只能通过query
    // 如果使用name跳转， 可以通过params或者query(缺点:是写在url路径中的)传参
    // { path: '/', redirect: '/index' },
    { path: '/', component: Index, name: '/' },
    { path: '/index', component: Index, name: 'index' },
    { path: '/login', component: Login, name: 'login' },
    { path: '/register', component: Register, name: 'register' },
    { path: '/profile', component: Profile, name: 'profile' },
    { path: '/edit-profile', component: EditProfile, name: 'edit-profile' },
    { path: '/follow', component: Follow, name: 'follow' },
    { path: '/comment', component: Comment, name: 'comment' },
    { path: '/test', component: Test, name: 'test' },
    { path: '/star', component: Star, name: 'star' },
    // 跳转详情页,根据新闻(文章,视频)id的不同获取不同数据,渲染不同的结构
    { path: '/postDetail/:id', component: PostDetail, name: 'postDetail' },
    { path: '/tab-manager', component: TabManager, name: 'tab-manager' },
    { path: '/search', component: Search, name: 'search' }
  ]
})

// 设置一个需要授权的路径
const AuthUrls = [
  '/profile',
  '/edit-profile',
  '/follow',
  '/comment',
  '/test',
  '/star',
  '/tab-manager'
]
// 设置路由导航守卫

router.beforeEach((to, from, next) => {
  // if (to.path === '/login' || to.path === '/register') return next()
  if (AuthUrls.includes(to.path)) {
    const tokenStr = localStorage.getItem('token')
    // 注意点: next('/login) 代表跳转到 '/login'
    // (如果在首页跳转到(未登录)profile页面,发现没有token会强制跳转到login,会报错)
    // 使用 router.push('/login) 就不会报错
    if (!tokenStr) return router.push('/login')
    // 有token信息直接放行
    next()
  } else {
    next()
  }
})

// router.beforeEach((to, from, next) => {
//   // 如果访问的是login和register页面直接放行
//   if (to.path === '/login' || to.path === '/register') return next()
//   const tokenStr = localStorage.getItem('token')
//   // 如果localStorage中有了token就放行,没有就直接跳转到登陆界面(有权限的页面)
//   // 但是有一个问题(token会过期,或者token被造假)
//   if (!tokenStr) return next('/login')
//   next()
// })

// 导出路由
export default router
