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
    // this.subscriptions = []
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
    this.client.on('close', () => {
      clearInterval(this.statInterval)
      this.client.destroy()
      let myIndex = this.Broker.clients.findIndex(c => c.uuid === this.client.uuid)
      this.Broker.removeClient(myIndex)
    })

    this.stats = {
      bytesSend: 0,
      bytesRecieved: 0,
      messagesSend: 0,
      messagesRecieved: 0
    }
    this.handleStats()
  }

  async amISubscrubedToThis (topic) {
    let { subscriptions } = await this.app.service('client').get(this.dbId)
    return subscriptions.filter((t) => {
      return MQTTPattern.matches(t.topic, topic)
    }).length !== 0
  }

  handleStats () {
    let totalBytesRecieved = 0
    let totalBytesSend = 0
    this.statInterval = setInterval(() => {
      let lastBytesRecieved = this.stream.bytesWritten - totalBytesRecieved
      let lastBytesSend = this.stream.bytesRead - totalBytesSend
      totalBytesRecieved = this.stream.bytesWritten
      totalBytesSend = this.stream.bytesRead

      this.stats.bytesRecieved += lastBytesRecieved
      this.stats.bytesSend += lastBytesSend
      this.Broker.stats.bytesRecieved += lastBytesSend
      this.Broker.stats.bytesSend += lastBytesRecieved
    }, 1000)
  }

  async handleConnect (packet) {
    if (packet.clientId === 'BROKER') return this.client.connack({ returnCode: 5, messageId: packet.messageId })
    console.log(packet)
    try {
      let { userId } = parseJwt((await this.app.service('authentication').create({
        strategy: 'local',
        username: packet.username,
        password: packet.password.toString()
      }, { provider: 'rest' })).accessToken)

      let clients = await this.app.service('client').find({ clientId: packet.clientId })
      let client
      if (clients.length !== 0) {
        client = await this.app.service('client').patch(clients[0]._id, {
          userId
        })
      } else {
        client = await this.app.service('client').create({
          clientId: packet.clientId,
          userId
        })
      }
      this.dbId = client._id

      this.client.connack({ returnCode: 0, messageId: packet.messageId })
    } catch (error) {
      if (error.code === 401 && error.name === 'NotAuthenticated') {
        this.client.connack({ returnCode: 4, messageId: packet.messageId })
      } else {
        console.error(error)
      }
    }
  }

  handlePublish (packet) {
    this.stats.messagesSend++
    this.Broker.distributeMessage(packet)
  }

  async handleSubscribe (packet) {
    try {
      let { subscriptions } = await this.app.service('client').get(this.dbId)
      if (subscriptions.findIndex(v => v.topic === packet.topic) === -1) {
        subscriptions.push(...packet.subscriptions.map(value => ({
          topic: value.topic
          // TODO: add qos
        })))
      }
      await this.app.service('client').patch(this.dbId, { subscriptions })
      let retainedMessages = await this.app.service('retained-message').find({
        query: {
          topic: {
            $in: [ ...subscriptions.map(v => v.topic) ]
          }
        }
      })
      for (let i = 0; i < retainedMessages.length; i++) {
        const retained = retainedMessages[i]
        this.client.publish({
          retain: true,
          topic: retained.topic,
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
      console.error(error)
    }
  }

  async handleUnsubscribe (packet) {
    try {
      let { subscriptions } = await this.app.service('client').get(this.dbId)
      for (let i = 0; i < packet.unsubscriptions.length; i++) {
        let unsub = packet.unsubscriptions[i]
        subscriptions = subscriptions.filter(sub => {
          return !(sub.topic === unsub)
        })
      }
      await this.app.service('client').patch(this.dbId, { subscriptions })
    } catch (error) {
      console.error(error)
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
