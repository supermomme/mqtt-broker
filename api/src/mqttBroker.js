const mosca = require('mosca')
const logger = require('./logger')

module.exports = function (app) {
  const _super = app.setup
  app.setup = function() {
    const server = new mosca.Server({
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
        app.service('authentication').create({
          strategy: 'local',
          username,
          password
        })
          .then(() => app.service('user').find({ query: { username, $limit: 1 }}))
          .then(x => x.data[0])
          .then(user => ({
            username: user.username,
            avatarUrl: user.avatarUrl,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            role: user.role
          }))
          .then(x => client.user = x)
          .then(() => callback(null, true))
          .catch(() => callback(null, false))
      }
      server.authorizePublish = (client, topic, payload, callback) => {
        if (client.user.role === 'ADMIN') callback(null, true)
        else {
          callback(null, false)
        }
      }
      server.authorizeSubscribe = (client, topic, callback) => {
        if (client.user.role === 'ADMIN') callback(null, true)
        else {
          callback(null, false)
        }
      }
      logger.info('MQTT Broker started on %s:%d', app.get('host'), app.get('mqttBroker').port)
    })
    return _super.apply(this, arguments)
  }
}

function parseJwt (token) {
  var base64Url = token.split('.')[1]
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join(''))

  return JSON.parse(jsonPayload)
}
