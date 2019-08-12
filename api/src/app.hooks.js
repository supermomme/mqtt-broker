// Application hooks that run for every service
const log = require('./hooks/log')
const { Forbidden } = require('@feathersjs/errors')

module.exports = {
  before: {
    all: [
      (hook) => { // TODO: better permission/role system  :)
        if (
          hook.params.provider == undefined ||
          hook.params.provider == 'mqtt' ||
          hook.path === 'authentication' ||
          !!(hook.params.user && hook.params.user.role === 'ADMIN')
        ) {
          return Promise.resolve(hook)
        } else {
          return Promise.reject(new Forbidden('You are not allowed to take this action.'))
        }
      },
      log()
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [ log() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [ log() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
