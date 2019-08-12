import Vue from 'vue'
import Router from 'vue-router'
import authenticationGuard from './authenticationGuard'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '*', redirect: { name: 'Error', params: { errorCode: '404' } } },
    { path: '/', redirect: { name: 'Dashboard' } },
    {
      name: 'Error',
      path: '/error/:errorCode',
      component: () => import('./views/Error'),
      meta: {
        layout: 'CenterLayout'
      }
    },
    {
      name: 'Login',
      path: '/login',
      component: () => import('./views/Login'),
      meta: {
        layout: 'CenterLayout'
      }
    },
    {
      name: 'Dashboard',
      path: '/dashboard',
      component: () => import('./views/Dashboard'),
      meta: {
        layout: 'DefaultLayout'
      }
    },
    {
      name: 'UserList',
      path: '/admin/user',
      component: () => import('./views/UserList'),
      meta: {
        layout: 'DefaultLayout'
      }
    },
    {
      name: 'UserCreate',
      path: '/admin/user/create',
      component: () => import('./views/UserEdit'),
      meta: {
        layout: 'DefaultLayout',
        isCreate: true
      }
    },
    {
      name: 'UserEdit',
      path: '/admin/user/:userId',
      component: () => import('./views/UserEdit'),
      meta: {
        layout: 'DefaultLayout',
        isCreate: false
      }
    }
  ]
})
router.beforeEach(authenticationGuard)
export default router
