const net = require('net')
const websocket = require('websocket-stream') // eslint-disable-line no-unused-vars
const WebSocketServer = require('ws').Server // eslint-disable-line no-unused-vars
const Client = require('./Client')

module.exports = class Broker {
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

    this.clients = []

    this.stats = {
      bytesSend: 0,
      bytesRecieved: 0,
      messagesDistributed: 0
    }
    if (this.logger) setInterval(() => { // Debug
      this.logger.info('stats', this.stats)
      this.logger.info('clientCount '+this.clients.length)
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

  addClient (stream) {
    this.clients.push(new Client(stream, this))
  }

  removeClient (index) {
    delete this.clients[index]
    this.clients.splice(index, 1)
  }

  distributeMessage (packet) {
    this.stats.messagesDistributed++
    let interestedClients = this.clients.filter(client => {
      return client.amISubscrubedToThis(packet.topic)
    })
    for (let i = 0; i < interestedClients.length; i++) {
      const client = interestedClients[i]
      client.client.publish(packet)
    }
  }

  connectionHandler (stream) {
    this.addClient(stream)
  }
}
