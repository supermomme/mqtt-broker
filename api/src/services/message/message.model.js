// message-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const message = new Schema({
    topic: { type: String, required: true },
    retain: { type: Boolean, required: true, default: false },
    payload: { type: Schema.Types.Mixed, required: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'client', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'user' },
    messageId: { type: Number },
    qos: { type: Number }
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://github.com/Automattic/mongoose/issues/1251
  try {
    return mongooseClient.model('message');
  } catch (e) {
    return mongooseClient.model('message', message);
  }
};
