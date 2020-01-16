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

// 导入vant的button组件
import { Button, Toast } from 'vant'
// 全局导入axios组件(注意它不是vue的插件)
import axios from 'axios'

// 注册到Vue的实例上
Vue.component('AuthInput', AuthInput)
Vue.component('AuthButton', AuthButton)

// 在vue原型上注册
Vue.use(Button)
Vue.use(Toast)
Vue.config.productionTip = false
// 设置全局axios
Vue.prototype.$axios = axios
// 设置全局的axios默认值(baseURL,基准路径会自动拼接url的参数,可以保证上线或者修改路径不会麻烦)
axios.defaults.baseURL = 'http://localhost:3000'

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
