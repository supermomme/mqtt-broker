/* eslint-disable no-unused-vars */
const mqtt_regex = require('mqtt-regex')
console.log(mqtt_regex('#').regex)

class Service {
  constructor (options) {
    this.options = options || {}
  }

  setup (app) {
    this.app = app
  }

  async find ({ topics }) {
    let res = []
    for (let i = 0; i < topics.length; i++) {
      let data = (await this.app.service('retain').find({ paginate: false, query: { topic: { $regex: mqtt_regex(topics[i]).regex } }}))
      res.push(...data)
    }
    return res
  }
}

module.exports = function (options) {
  return new Service(options)
}

module.exports.Service = Service
