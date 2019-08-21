// retained-message-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient')
  const { Schema } = mongooseClient
  const retainedMessage = new Schema({
    topic: { type: String },
    payload: { type: String }
  }, {
    timestamps: true
  })

  return mongooseClient.model('retained-message', retainedMessage)
}
