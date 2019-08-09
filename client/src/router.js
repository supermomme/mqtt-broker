import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      name: 'Dashboard',
      path: '/dashboard',
      component: () => import('./views/Dashboard'),
      meta: {
        layout: 'DefaultLayout'
      }
    }
  ]
})
