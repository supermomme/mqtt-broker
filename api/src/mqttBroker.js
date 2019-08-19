const mosca = require('mosca')
const bcrypt = require('bcrypt')
const mqttPacket = require('mqtt-packet')
const net = require('net')
const mqttCon = require('mqtt-connection')
const websocket = require('websocket-stream')
const WebSocketServer = require('ws').Server

module.exports = function (app) {
  const _super = app.setup
  app.setup = function() {
    // const server = new mosca.Server({
    //   port: app.get('mqtt').port,
    //   backend: {
    //     type: 'mongo',
    //     url: app.get('mongodb'),
    //     pubsubCollection: 'ascoltatori',
    //     mongo: {}
    //   },
    //   http: {
    //     port: app.get('mqtt').websocketPort
    //   }
    // })
    // app.set('mqttServer', server)
    // server.on('ready', () => {

    //   server.on('clientConnected', function({ id }) {
    //     app.get('logger').info('client connected', {id})
    //   })

    //   server.on('published', function({topic, payload, messageId}, client) {
    //     let clientId = client ? client.id : null
    //     app.get('logger').info('Published', {topic, payload, messageId, clientId})
    //   })

    //   server.authenticate = async (client, username, password, callback) => {
    //     try {
    //       const user = (await (app.service('user').find({ query: { username, $limit: 1 }}))).data[0]
    //       const authed = await bcrypt.compare(password.toString(), user.password)
    //       if (!authed) return callback(null, false)

    //       client.user = {
    //         username: user.username,
    //         avatarUrl: user.avatarUrl,
    //         email: user.email,
    //         firstname: user.firstname,
    //         lastname: user.lastname,
    //         role: user.role
    //       }
    //       callback(null, true)
    //     } catch (error) {
    //       // eslint-disable-next-line no-console
    //       console.log(error)
    //       callback(null, false)
    //     }
    //   }
    //   server.authorizePublish = (client, topic, payload, callback) => {
    //     if (client.user.role === 'ADMIN') callback(null, true)
    //     else {
    //       callback(null, false)
    //     }
    //   }
    //   server.authorizeSubscribe = (client, topic, callback) => {
    //     if (client.user.role === 'ADMIN') callback(null, true)
    //     else {
    //       callback(null, false)
    //     }
    //   }
    app.set('mqttBroker', new Broker({
      logger: app.get('logger'),
      mqtt: {
        host: app.get('host'),
        ...app.get('mqtt')
      }
    }))
    // })
    return _super.apply(this, arguments)
  }
}

class Broker {
  constructor (opts) {
    if (opts.logger) this.logger = opts.logger
    this.host = opts.mqtt.host
    this.port = opts.mqtt.port
    this.wsport = opts.mqtt.wsport

    this.isReadyMQ = false
    this.isReadyWS = false

    this.server = new net.Server()
    // this.wsServer = new net.Server()

    this.server.on('connection', socket => this.connectionHandler(socket))

    this.server.listen(this.port, () => this.readyMQ())
    // this.wsServer.listen(this.wsport, () => this.readyWS())

    this.clients = {} // Id:{state, stats, subscription, client}

    this.stats = {
      bytesSend: 0,
      bytesRecieved: 0
    }
    if (this.logger) setInterval(() => { // Debug
      this.logger.info('stats', this.stats)
    }, 5000)

  }

  readyMQ () {
    if (this.logger) this.logger.info('MQTT Broker started on %s:%d', this.host, this.port)

    this.isReadyMQ = true
    if (this.isReadyWS) this.ready()
  }

  readyWS () {
    if (this.logger) this.logger.info('MQTT Broker (Websocket) started on %s:%d', this.host, this.wsport)

    this.isReadyWS = true
    if (this.isReadyMQ) this.ready()
  }

  ready () { }

  addClient (clientId, client) { // TODO: save client in mongo
    if (this.clients[clientId != undefined]) {
      this.clients[clientId].state = 'CONNECTED'
      this.clients[clientId].client = client
    } else {
      this.clients[clientId] = {
        state: 'CONNECTED',
        stats: {
          bytesRecieved: 0,
          bytesSend: 0
        },
        subscriptions: [],
        // TODO: add will
        client // Don't save that in the mongo
      }
    }
  }

  removeClient (clientId) {
    this.clients[clientId].state = 'CONNECTED'
  }

  addClientSend (clientId, n = 0) {
    if (!clientId || n === 0) return
    this.clients[clientId].stats.bytesSend += n
  }

  addClientRecieved (clientId, n = 0) {
    if (!clientId || n === 0) return
    this.clients[clientId].stats.bytesRecieved += n
  }

  addClientSubscription (clientId, subs = []) {
    if (!(Array.isArray(subs) || typeof subs === 'string')) throw 'addClientSubscription: Array or String needed'
    if (subs.length === 0) return
    if (typeof subs === 'string') subs = [subs]
    subs = subs.map(value => ({
      topic: value.topic
      // TODO: add qos
    }))
    console.log(subs)
    this.clients[clientId].subscriptions.push(...subs)

  }

  removeClientSubscription (clientId, subs = []) {
    if (!(Array.isArray(subs) || typeof subs === 'string')) throw 'removeClientSubscription: Array or String needed'
    if (subs.length === 0) return
    if (typeof subs === 'string') subs = [subs]
    console.log(subs)
    // TODO: add remove subs
  }

  connectionHandler (stream) {
    var client = mqttCon(stream)
    let clientId = null

    client.on('connect', (packet) => {
      if (this.logger) this.logger.info('connect', packet.clientId)
      console.log(packet)
      client.connack({ returnCode: 0, messageId: packet.messageId });
      clientId = packet.clientId
      this.addClient(clientId, client)
    })

    client.on('publish', (packet) => {
      if (this.logger) this.logger.info('publish')
      // TODO: this.handlePublish(packet, client)
      if (packet.qos === 1) client.puback({ messageId: packet.messageId })
    })

    client.on('pingreq', () => {
      client.pingresp()
    })

    client.on('subscribe', (packet) => {
      if (this.logger) this.logger.info('subscribe')
      // TODO: this.handleSubscribe(packet, client)
      this.addClientSubscription(clientId, packet.subscriptions)
      client.suback({ granted: [0], messageId: packet.messageId })
    })

    client.on('unsubscribe', (packet) => {
      if (this.logger) this.logger.info('unsubscribe')
      // TODO: this.handleUnsubscribe(packet, client)
      this.removeClientSubscription(clientId, packet.unsubscriptions)
    })

    stream.setTimeout(1000 * 60 * 5)

    // connection error handling
    client.on('close', () => { client.destroy() })
    client.on('error', () => { client.destroy() })
    client.on('disconnect', () => { client.destroy() })

    // stream timeout
    stream.on('timeout', () => { client.destroy() })

    // Stats
    var bytesRead = 0
    var bytesWritten = 0
    var interval = setInterval(() => {
      let lastRecieved = stream.bytesRead - bytesRead
      let lastSend = stream.bytesWritten - bytesWritten

      this.stats.bytesSend += lastSend
      this.stats.bytesRecieved += lastRecieved
      if (clientId != null) {
        this.addClientRecieved(clientId, lastSend)
        this.addClientSend(clientId, lastRecieved)
      }

      bytesWritten = stream.bytesWritten
      bytesRead = stream.bytesRead
    }, 1000)
    stream.on('close', () => {
      clearInterval(interval)
      this.removeClient(clientId)
    })
  }
}
