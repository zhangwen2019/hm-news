import Vue from 'vue'
import App from './App.vue'
// 导入路由
import router from './router'

// 导入rem的js,动态的设置了不同屏幕的html根元素的font-size
import 'lib-flexible'
// 导入通用的样式
import './styles/base.css'
// 导入字体图标文件
import './styles/iconfont.css'
// 全局导入自己的组件
import AuthInput from './components/AuthInput'
import AuthButton from './components/AuthButton'
// 导入hm-nav组件
import HmNav from './components/hm-nav'
// 返回上一级的组件
import HmBack from './components/hm-back'
// 用户公共头部组件
import HmHeader from './components/hm-header'

// 导入vant的button组件
import { Button, Toast, Dialog, Field, CellGroup, RadioGroup, Radio, Cell, Uploader } from 'vant'
// 全局导入axios组件(注意它不是vue的插件)
import axios from 'axios'
import moment from 'moment'

// 注册到Vue的实例上(注册全局组件)
Vue.component('AuthInput', AuthInput)
Vue.component('AuthButton', AuthButton)
Vue.component('HmNav', HmNav)
Vue.component('HmBack', HmBack)
Vue.component('HmHeader', HmHeader)

// 在vue原型上注册(全局注册组件)
Vue.use(Button)
Vue.use(Toast)
Vue.use(Dialog)
Vue.use(Field)
Vue.use(CellGroup)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Cell)
Vue.use(Uploader)

Vue.config.productionTip = false

// 设置全局axios
Vue.prototype.$axios = axios
// 设置全局的axios默认值(baseURL,基准路径会自动拼接url的参数,可以保证上线或者修改路径不会麻烦)
axios.defaults.baseURL = 'http://localhost:3000'

// 增加一个拦截器(响应)，怎请求或响应被then或者catch处理前进行拦截
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  if (response.data.statusCode === 401 && response.data.message === '用户信息验证失败') {
    // 信息验证失败,直接跳转到login界面
    router.push('/login')
    // 删除过期的信息
    localStorage.removeItem('token')
    localStorage.removeItem('user_id')
    // 给一个错误的信息
    Toast.fail('登录信息失效')
  }
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

// 添加请求拦截器(如果有token带上token发送请求)
axios.interceptors.request.use(function (config) {
  // config:请求的配置参数,通过config.headers来设置请求头
  // console.log('拦截到了请求', config)
  // 添加token信息
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = token
  }
  // 需要返回config
  return config
})

// 设置全局的filter过滤器
Vue.filter('filter-time', input => {
  return moment(input).format('YYYY-MM-DD')
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
