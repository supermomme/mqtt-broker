const mqttCon = require('mqtt-connection')
const MQTTPattern = require('mqtt-pattern')
const uuidv4 = require('uuid/v4')

module.exports = class Client {
  constructor (stream, Broker) {
    this.Broker = Broker
    this.uuid = uuidv4()
    this.stream = stream
    this.client = mqttCon(stream)
    this.subscriptions = []
    this.id = null

    this.client.on('pingreq', () => { this.client.pingresp() })
    this.client.on('connect', (packet) => this.handleConnect(packet))
    this.client.on('publish', (packet) => this.handlePublish(packet))
    this.client.on('subscribe', (packet) => this.handleSubscribe(packet))
    this.client.on('unsubscribe', (packet) => this.handleUnsubscribe(packet))

    this.stream.setTimeout(1000 * 60 * 5)

    // connection error handling
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
      messagesSend: 0
      // TODO: messagesRecieved: 0
    }
    this.handleStats()
  }

  amISubscrubedToThis (topic) {
    return this.subscriptions.filter((t) => {
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

  handleConnect (packet) {
    this.client.connack({ returnCode: 0, messageId: packet.messageId })
    this.id = packet.clientId
  }

  handlePublish (packet) {
    this.stats.messagesSend++
    this.Broker.distributeMessage(packet)
  }

  handleSubscribe (packet) {
    this.subscriptions.push(...packet.subscriptions.map(value => ({
      topic: value.topic
      // TODO: add qos
    })))
    this.client.suback({ granted: [packet.qos], messageId: packet.messageId })
  }

  handleUnsubscribe (packet) { // eslint-disable-line no-unused-vars
    // TODO: add remove subs
  }
}
