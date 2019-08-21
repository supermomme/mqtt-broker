// Initializes the `retained-message` service on path `/retained-message`
const createService = require('feathers-mongoose')
const createModel = require('./retained-message.model')
const hooks = require('./retained-message.hooks')

module.exports = function (app) {
  const Model = createModel(app)
  const paginate = app.get('paginate')

  const options = {
    Model,
    paginate
  }

  // Initialize our service with any options it requires
  app.use('/retained-message', createService(options))

  // Get our initialized service so that we can register hooks
  const service = app.service('retained-message')

  service.hooks(hooks)
}
