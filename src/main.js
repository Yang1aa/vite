/*
 * @Author: 杨柳岸 88012771+Yang1aa@users.noreply.github.com
 * @Date: 2023-12-20 22:14:47
 * @LastEditors: 杨柳岸 88012771+Yang1aa@users.noreply.github.com
 * @LastEditTime: 2024-05-27 09:17:14
 * @FilePath: \imageupload-vue\src\main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import axios from 'axios';
import 'element-ui/lib/theme-chalk/index.css';
import '@/styles/global.css'; // 引入全局样式


Vue.config.productionTip = false

Vue.prototype.$axios = axios
axios.defaults.baseURL = "http://116.63.15.173:8088" //后端服务器访问地址
// axios.defaults.baseURL = "http://localhost:8088" //后端服务器访问地址

//注册插件
Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
