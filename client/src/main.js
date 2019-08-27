import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
// const moment = require('vue-moment')
import moment from 'vue-moment'

Vue.config.productionTip = false
Vue.use(moment)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
