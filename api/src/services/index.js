const user = require('./user/user.service.js')
const client = require('./client/client.service.js')
const retain = require('./retain/retain.service.js')
const retainMatch = require('./retain-match/retain-match.service.js')
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(user)
  app.configure(client)
  app.configure(retain)
  app.configure(retainMatch)
}
