// message-retain-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const messageRetain = new Schema({
    topic: { type: String, required: true, unique: true },
    messageId: { type: Schema.Types.ObjectId, ref: 'message', required: true }
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://github.com/Automattic/mongoose/issues/1251
  try {
    return mongooseClient.model('message-retain');
  } catch (e) {
    return mongooseClient.model('message-retain', messageRetain);
  }
};
