// Initializes the `retain` service on path `/retain`
const createService = require('feathers-mongoose')
const createModel = require('./retain.model')
const hooks = require('./retain.hooks')

module.exports = function (app) {
  const Model = createModel(app)
  const paginate = app.get('paginate')

  const options = {
    Model,
    paginate
  }

  // Initialize our service with any options it requires
  app.use('/retain', createService(options))

  // Get our initialized service so that we can register hooks
  const service = app.service('retain')

  service.hooks(hooks)
}
