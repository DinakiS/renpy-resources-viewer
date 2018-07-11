import Vue from 'vue'
import axios from 'axios'
import { shell } from 'electron'

import App from './App'
import store from './store'
import VueHotkey from 'v-hotkey'
import VTooltip from 'v-tooltip'

Vue.use(VueHotkey)
Vue.use(VTooltip)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  store,
  template: '<App/>'
}).$mount('#app')

document.addEventListener('click', function (event) {
  if (event.target.tagName === 'A' && event.target.href.startsWith('http')) {
    event.preventDefault()
    shell.openExternal(event.target.href)
  }
})
