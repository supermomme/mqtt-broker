const mongoose = require('mongoose')

module.exports = function (app) {
  const mongoConfig = app.get('mongo')
  let user = (mongoConfig.username && mongoConfig.password) ? `${mongoConfig.username}:${mongoConfig.password}@` : ''
  let mongoUrl = `mongodb://${user}${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.db}?authSource=admin`
  console.log(mongoUrl)
  mongoose.connect(
    mongoUrl,
    { useCreateIndex: true, useNewUrlParser: true },
    function(err) {
      console.log(err)
      if (!err) console.log('succ')
    }
  )
  mongoose.Promise = global.Promise

  app.set('mongooseClient', mongoose)
}
