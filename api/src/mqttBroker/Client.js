const mqttCon = require('mqtt-connection')
const MQTTPattern = require('mqtt-pattern')
const uuidv4 = require('uuid/v4')
const atob = require('atob')

module.exports = class Client {
  constructor (stream, Broker, app) {
    this.Broker = Broker
    this.app = app
    this.uuid = uuidv4()
    this.stream = stream
    this.client = mqttCon(stream)
    this.subscriptions = []
    // this.id = null
    this.dbId = null

    this.client.on('pingreq', () => { this.client.pingresp() })
    this.client.on('connect', (packet) => this.handleConnect(packet))
    this.client.on('publish', (packet) => this.handlePublish(packet))
    this.client.on('subscribe', (packet) => this.handleSubscribe(packet))
    this.client.on('unsubscribe', (packet) => this.handleUnsubscribe(packet))

    this.stream.setTimeout(1000 * 60 * 5)

    this.client.on('error', () => { this.client.destroy() })
    this.client.on('disconnect', () => { this.client.destroy() })
    this.stream.on('timeout', () => { this.client.destroy() })
    this.client.on('close', () => { this.client.destroy() })
    this.stream.on('close', async () => {
      clearInterval(this.statInterval)
      await this.app.service('client').patch(this.dbId, { status: 'DISCONNECTED', subscriptions: [] })
      let myIndex = this.Broker.clients.findIndex(c => c.uuid === this.client.uuid)
      this.Broker.removeClient(myIndex)
    })

    this.handleStats()
  }

  async amISubscrubedToThis (topic) {
    return this.subscriptions.filter((t) => {
      return MQTTPattern.matches(t.topic, topic)
    }).length !== 0
  }

  handleStats () {
    let totalBytesRecieved = 0
    let totalBytesSend = 0
    this.statInterval = setInterval(async () => {
      try {
        let lastBytesRecieved = this.stream.bytesWritten - totalBytesRecieved
        let lastBytesSend = this.stream.bytesRead - totalBytesSend
        totalBytesRecieved = this.stream.bytesWritten
        totalBytesSend = this.stream.bytesRead

        if (lastBytesRecieved != 0 || lastBytesSend != 0) {
          let { totalStats } = await this.app.service('client').get(this.dbId)
          totalStats.bytesRecieved += lastBytesRecieved
          totalStats.bytesSend += lastBytesSend
          await this.app.service('client').patch(this.dbId, { totalStats })
        }

        this.Broker.stats.bytesRecieved += lastBytesSend
        this.Broker.stats.bytesSend += lastBytesRecieved
      } catch (error) {
        console.error(error) // eslint-disable-line no-console
      }
    }, 1000)
  }

  async handleConnect (packet) {
    if (packet.clientId === 'BROKER') return this.client.connack({ returnCode: 5, messageId: packet.messageId })
    if (!packet.username || !packet.password) return this.client.connack({ returnCode: 4, messageId: packet.messageId })
    try {
      let { userId } = parseJwt((await this.app.service('authentication').create({
        strategy: 'local',
        username: packet.username,
        password: packet.password.toString()
      }, { provider: 'rest' })).accessToken)

      let clients = await this.app.service('client').find({ query: { clientId: packet.clientId }, paginate: false })
      let client
      if (clients.length !== 0) {
        client = await this.app.service('client').patch(clients[0]._id, {
          userId,
          status: 'CONNECTED'
        })
      } else {
        client = await this.app.service('client').create({
          clientId: packet.clientId,
          userId,
          status: 'CONNECTED'
        })
      }
      this.dbId = client._id

      this.client.connack({ returnCode: 0, messageId: packet.messageId })
    } catch (error) {
      if (error.code === 401 && error.name === 'NotAuthenticated') {
        this.client.connack({ returnCode: 4, messageId: packet.messageId })
      } else {
        console.error(error) // eslint-disable-line no-console
      }
    }
  }

  async handlePublish (packet) {
    if (packet.topic.includes('+') || packet.topic.includes('#')) return
    try {
      let { totalStats } = await this.app.service('client').get(this.dbId)
      totalStats.messagesSend++
      await this.app.service('client').patch(this.dbId, { totalStats })
      if (packet.retain) {
        let retains = await this.app.service('retain').find({
          query: {
            topic: { $in: [packet.topic] }
          },
          paginate: false
        })
        if (retains.length === 0) {
          await this.app.service('retain').create({
            topic: packet.topic,
            payload: packet.payload
          })
        } else {
          await this.app.service('retain').patch(retains[0]._id, {
            payload: packet.payload.toString()
          })
        }

      }
      this.Broker.distributeMessage(packet)
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    }
  }

  async updateSubs () {
    await this.app.service('client').patch(this.dbId, { subscriptions: this.subscriptions })

  }

  async handleSubscribe (packet) {
    try {
      for (let a = 0; a < packet.subscriptions.length; a++) {
        const { topic } = packet.subscriptions[a] // and qos
        if (this.subscriptions.findIndex(v => v.topic === topic) === -1) {
          this.subscriptions.push(...packet.subscriptions.map(value => ({
            topic: value.topic
            // TODO: add qos
          })))
        }
        this.updateSubs()
      }

      let retainedMessages = await this.app.service('retain-match').find({ topics: [...this.subscriptions.map(v => v.topic)] })
      for (let i = 0; i < retainedMessages.length; i++) {
        const retained = retainedMessages[i]
        let { totalStats } = await this.app.service('client').get(this.dbId)
        totalStats.messagesRecieved++
        await this.app.service('client').patch(this.dbId, { totalStats })
        await this.client.publish({
          retain: true,
          topic: retained.topic,
          qos: 0,
          payload: retained.payload
        })
      }

      this.client.suback({ granted: [packet.qos], messageId: packet.messageId })
    } catch (error) {
      let granted = []
      for (let i = 0; i < packet.subscriptions.length; i++) {
        granted.push('128')
      }
      this.client.suback({ granted, messageId: packet.messageId })
      console.error(error) // eslint-disable-line no-console
    }
  }

  async handleUnsubscribe (packet) {
    try {
      for (let i = 0; i < packet.unsubscriptions.length; i++) {
        let unsub = packet.unsubscriptions[i]
        this.subscriptions = this.subscriptions.filter(sub => {
          return !(sub.topic === unsub)
        })
      }
      this.updateSubs()
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    }
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
