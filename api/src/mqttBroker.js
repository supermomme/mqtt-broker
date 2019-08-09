const mosca = require('mosca')
const logger = require('./logger')

module.exports = function (app) {
  app.setup = function () {
    const server = new mosca.Server({ // TODO: implement config
      port: app.get('mqttBroker').port
    })
    app.set('mqttServer', server)
    server.on('ready', () => {

      server.on('clientConnected', function({ id }) {
        logger.info('client connected', {id})
      })
      
      // fired when a message is received
      server.on('published', function({topic, payload, messageId}, client) {
        let clientId = client ? client.id : null
        logger.info('Published', {topic, payload, messageId, clientId})
      })

      server.authenticate = (client, username, password, callback) => {
        callback(null, true)
      }
      server.authorizePublish = (client, topic, payload, callback) => {
        callback(null, true)
      }
      server.authorizeSubscribe = (client, topic, callback) => {
        callback(null, true)
      }
      logger.info('MQTT Broker started on %s:%d', app.get('host'), app.get('mqttBroker').port)
    })
  }
}
