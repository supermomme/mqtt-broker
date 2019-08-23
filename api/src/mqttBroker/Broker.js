const net = require('net')
const Client = require('./Client')

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
  }

  ready () { }

  addClient (stream) {
    this.clients.push(new Client(stream, this, this.app))
  }

  removeClient (index) {
    delete this.clients[index]
    this.clients.splice(index, 1)
  }

  async distributeMessage (packet) {
    try {
      this.stats.messagesDistributed++
      for (let i = 0; i < this.clients.length; i++) {
        const client = this.clients[i]
        if (!await client.amISubscrubedToThis(packet.topic)) continue
        let { totalStats } = await this.app.service('client').get(client.dbId)
        totalStats.messagesRecieved++
        await this.app.service('client').patch(client.dbId, { totalStats })
        client.client.publish(packet)
      }
      if (packet.retain) {
        let retaineds = await this.app.service('retained-message').find({
          query: {
            topic: { $in: [packet.topic] }
          },
          paginate: false
        })
        if (retaineds.length === 0) {
          await this.app.service('retained-message').create({
            topic: packet.topic,
            payload: packet.payload
          })
        } else {
          await this.app.service('retained-message').patch(retaineds[0]._id, {
            payload: packet.payload.toString()
          })
        }
      }
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    }
  }

  connectionHandler (stream) {
    this.addClient(stream)
  }
}
