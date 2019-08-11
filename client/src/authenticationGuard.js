import store from './store'
const publicPageNames = [
  'Login'
]

export default async function authenticationGuard (to, from, next) {
  const { auth } = store.state
  const isLoggedIn = !!auth.user
  const toPublicPage = publicPageNames.includes(to.name)

  if (isLoggedIn) {
    if (toPublicPage) return next({ name: 'Dashboard' })
    return next()
  }

  try {
    await store.dispatch('auth/authenticate')
    return next()
  } catch (exception) {
    if (toPublicPage) return next()
    return next({ name: 'Login' })
  }
}
