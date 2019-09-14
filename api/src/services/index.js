const user = require('./user/user.service.js')
const client = require('./client/client.service.js')
const message = require('./message/message.service.js');
const messageRetain = require('./message-retain/message-retain.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(user)
  app.configure(client)
  app.configure(message);
  app.configure(messageRetain);
}
