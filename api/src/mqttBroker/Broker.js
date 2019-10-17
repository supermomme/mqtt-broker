const net = require('net')
const Client = require('./Client')
const isJSON = require('is-json')

module.exports = class Broker {
  constructor (opts, app) {
    this.host = opts.mqtt.host
    this.mqPort = Number(opts.mqtt.mqPort)
    this.app = app

    this.isMQReady = false

    if (this.mqPort) {
      this.mqServer = new net.Server()
      this.mqServer.on('connection', socket => this.connectionHandler(socket, false))
      this.mqServer.listen(this.mqPort, () => {
        this.isMQReady = true
        this.ready(this.host, this.mqPort)
      })
    }

    this.clients = []

    this.stats = {
      bytesSend: 0,
      bytesRecieved: 0,
      messagesDistributed: 0
    }
    setInterval(async () => await this.cleanup(), 30000)
  }

  async cleanup () {
    try {
      let dbClients = await this.app.service('client').find({
        paginate: false,
        query: {
          $or: [
            { status: { $nin: ['DISCONNECTED'] } },
            { subscriptions: { $ne: [] } }
          ]
        }
      })
      for (let i = 0; i < dbClients.length; i++) {
        const dbClient = dbClients[i]
        if (this.clients.findIndex(client => {
          if (!client.dbId || !dbClient._id) return false
          return client.dbId.toString() === dbClient._id.toString()
        }) === -1) {
          await this.app.service('client').patch(dbClient._id, { status: 'DISCONNECTED', subscriptions: [] })
        }
      }
      for (let g = 0; g < this.clients.length; g++) {
        let subscriptions = this.clients[g].subscriptions.reduce((prev, cur) => {
          if (prev.findIndex(v => v.topic === cur.topic) === -1) prev.push(cur)
          return prev
        }, [])
        if (subscriptions.length !== this.clients[g].subscriptions) {
          this.clients[g].subscriptions = subscriptions
          this.clients[g].updateSubscription()
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  ready () { }

  addClient (stream) {
    this.clients.push(new Client(stream, this, this.app))
  }

  removeClient (index) {
    delete this.clients[index]
    this.clients.splice(index, 1)
  }

  async distributeMessage (packet, fromClient) {
    console.log(packet.payload)
    let parsedPayload;
    if (isJSON(packet.payload.toString())) {
      parsedPayload = JSON.parse(packet.payload.toString())
    } else {
      parsedPayload = { val: packet.payload.toString() }
    }
    if(parsedPayload.ts == undefined) parsedPayload.ts = Date.now()

    try {
      await this.app.service('message').create({
        topic: packet.topic,
        retain: packet.retain,
        payload: parsedPayload,
        clientId: fromClient.dbId,
        userId: fromClient.userId,
        messageId: packet.messageId,
        qos: packet.qos
      })
      this.stats.messagesDistributed++
      for (let i = 0; i < this.clients.length; i++) {
        const client = this.clients[i]
        if (!await client.amISubscrubedToThis(packet.topic)) continue
        let { totalStats } = await this.app.service('client').get(client.dbId)
        totalStats.messagesRecieved++
        await this.app.service('client').patch(client.dbId, { totalStats })
        let parsedPacket = packet
        parsedPacket.payload = Buffer.from(JSON.stringify(parsedPayload))
        client.client.publish(parsedPacket)
      }
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    }
  }

  connectionHandler (stream) {
    this.addClient(stream)
  }
}
