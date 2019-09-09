import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
// const moment = require('vue-moment')
import moment from 'vue-moment'
import cubejs from '@cubejs-client/core'
import { QueryBuilder } from '@cubejs-client/vue'

const cubejsApi = cubejs(
  '170fbc18b658007ae159e96304d7203685af246238c771f2e364a145568c19fb89ef4f01aa546c59b95eabac137b0b689c4bd6ac943e3fd30d00c650eca84048',
  { apiUrl: 'http://localhost:4000/cubejs-api/v1' }
)

Vue.config.productionTip = false
Vue.use(moment)

new Vue({
  router,
  store,
  cube: cubejsApi,
  vuetify,
  components: {
    QueryBuilder
  },
  render: h => h(App)
}).$mount('#app')
