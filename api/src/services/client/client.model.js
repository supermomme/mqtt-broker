// client-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient')
  const { Schema } = mongooseClient
  const client = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'user', autopopulate: true },
    clientId: { type: String, default: '' },
    subscriptions: [{
      topic: { type: String }
    }],
    status: { type: String, default: 'DISCONNECTED', enum: [ 'CONNECTED', 'DISCONNECTED' ] },
    totalStats: {
      bytesSend: { type: Number, default: 0 },
      bytesRecieved: { type: Number, default: 0 },
      messagesSend: { type: Number, default: 0 },
      messagesRecieved: { type: Number, default: 0 }
    }
  }, {
    timestamps: true
  })

  return mongooseClient.model('client', client)
}
