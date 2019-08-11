import Vue from 'vue'
import Router from 'vue-router'
import authenticationGuard from './authenticationGuard'

Vue.use(Router)

const router = new Router({
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
    },
    {
      name: 'Login',
      path: '/login',
      component: () => import('./views/Login'),
      meta: {
        layout: 'CenterLayout'
      }
    }
  ]
})
router.beforeEach(authenticationGuard)
export default router
