// Initializes the `message-retain` service on path `/message-retain`
const { MessageRetain } = require('./message-retain.class');
const createModel = require('./message-retain.model');
const hooks = require('./message-retain.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/message-retain', new MessageRetain(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('message-retain');

  service.hooks(hooks);
};
