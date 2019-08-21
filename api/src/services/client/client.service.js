// Initializes the `client` service on path `/client`
const createService = require('feathers-mongoose')
const createModel = require('./client.model')
const hooks = require('./client.hooks')

module.exports = function (app) {
  const Model = createModel(app)

  const options = {
    Model,
    paginate: false
  }

  // Initialize our service with any options it requires
  app.use('/client', createService(options))

  // Get our initialized service so that we can register hooks
  const service = app.service('client')

  service.hooks(hooks)
}
