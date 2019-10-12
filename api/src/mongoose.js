const mongoose = require('mongoose')

module.exports = function (app) {
  const mongoConfig = app.get('mongo')
  let user = (mongoConfig.username && mongoConfig.password) ? `${mongoConfig.username}:${mongoConfig.password}@` : ''

  mongoose.connect(
    `mongodb://${user}${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.db}`,
    { useCreateIndex: true, useNewUrlParser: true }
  )
  mongoose.Promise = global.Promise

  app.set('mongooseClient', mongoose)
}
