const user = require('./user/user.service.js')
const client = require('./client/client.service.js')
const retainedMessage = require('./retained-message/retained-message.service.js')
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(user)
  app.configure(client)
  app.configure(retainedMessage)
}
