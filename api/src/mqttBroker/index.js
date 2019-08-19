const Broker = require('./Broker')

module.exports = function (app) {
  const _super = app.setup
  app.setup = function() {
    app.set('mqttBroker', new Broker({
      logger: app.get('logger'),
      mqtt: {
        host: app.get('host'),
        ...app.get('mqtt')
      }
    }))
    return _super.apply(this, arguments)
  }
}
