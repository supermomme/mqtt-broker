import Vue from 'vue'
import Vuex from 'vuex'
import feathers from './api'
import feathersVuex from 'feathers-vuex'
import UserDefaults from '@/defaults/UserDefaults'
// eslint-disable-next-line no-unused-vars
const { service, auth, FeathersVuex } = feathersVuex(feathers, { idField: '_id' })

Vue.use(Vuex)
Vue.use(FeathersVuex)

export default new Vuex.Store({
  plugins: [
    auth({ userService: 'user' }),
    service('user', {
      instanceDefaults: UserDefaults
    })
  ],
  state: {
    sidebarOpened: true,
    dialog: null,
    snackbar: {
      color: 'info',
      text: 'Hallo!'
    },
    isLoading: false
  },
  mutations: {
    setLoading (state, n) {
      state.isLoading = n
    },
    toggleSidebar (state) {
      state.sidebarOpened = !state.sidebarOpened
    },
    setSidebar (state, n) {
      state.sidebarOpened = n
    },
    closeDialog (state) {
      state.dialog = null
    },
    openDialog (state, n) {
      state.dialog = n
    },
    openSnackbar (state, n) {
      state.snackbar.color = n.color
      state.snackbar.text = n.text
    },
    closeSnackbar (state) {
      state.snackbar.color = null
      state.snackbar.text = null
    }
  },
  getters: {
    isSnackbarOpened (state) {
      return (state.snackbar.color != null && state.snackbar.text)
    }
  },
  actions: {

  }
})
