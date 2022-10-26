import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'
import './assets/fonts/iconfont.css'
import 'default-passive-events'
import TreeTable from 'vue-table-with-tree-grid'
import Bcrumb from '@/components/common/Bcrumb'
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor)
Vue.use(TreeTable)
Vue.use(Bcrumb)
Vue.component('tree-table', TreeTable)
Vue.component('BcrumbT', Bcrumb)

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use((config) => {
  config.headers.Authorization = sessionStorage.getItem('TOKEN')
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
