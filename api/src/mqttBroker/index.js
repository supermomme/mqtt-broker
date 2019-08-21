const Broker = require('./Broker')

module.exports = function (app) {
  const _super = app.setup
  app.setup = function() {
    let logger = app.get('logger')
    const broker = new Broker({
      logger,
      mqtt: {
        host: app.get('host'),
        ...app.get('mqtt')
      }
    }, app)
    broker.ready = (host, mqPort) => {
      if (mqPort) logger.info('MQTT Broker (MQTT) started on %s:%d', host, mqPort)
    }
    app.set('mqttBroker', broker)
    return _super.apply(this, arguments)
  }
}
