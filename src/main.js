// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import VueCodeMirror from 'vue-codemirror'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.config.productionTip = false

const API_BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : [window.location.protocol, '//', window.location.host].join('')
// axios.defaults.headers.common['Content-Type'] = 'application/json'
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'

Vue.use(Vuetify)
Vue.use(VueAxios, axios.create({
    baseURL: API_BASE_URL,
    headers: { 
	    'Accept': 'application/json',
	    'Content-Type': 'application/json',
    }
}))

import('vuetify/dist/vuetify.min.css')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
