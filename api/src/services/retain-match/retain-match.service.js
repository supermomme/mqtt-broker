// Initializes the `retain-match` service on path `/retain-match`
const createService = require('./retain-match.class.js');
const hooks = require('./retain-match.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/retain-match', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('retain-match');

  service.hooks(hooks);
};
