// Initializes the `message-retain` service on path `/message-retain`
const createService = require('feathers-mongodb')
const hooks = require('./message-retain.hooks')

module.exports = function () {
  const app = this;
  const mongoClient = app.get('mongooseClient')
  const options = {
    paginate: {
      default: 15,
      max: 1000
    }}

  // Initialize our service with any options it requires
  app.use('/message-retain', createService(options))

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('message-retain')
  mongoClient.connection.then(async client => {
    await client.db.dropCollection('message-retain').catch(err => {
      // ignore not Exists error
      const alreadExists = err.code === 26
      if (!alreadExists) {
        throw err
      }
    })
    await client.db.command({
      create: 'message-retain',
      viewOn: 'messages',
      pipeline: [
        {
          '$match': { retain: true }
        },
        {
          '$project': {
              "_id": false,
              "topic": true,
              "qos": true,
              "payload": true,
              "clientId": true,
              "userId": true,
              "createdAt": true,
              "updatedAt": true
              
          }
        },
        {
          '$sort': { createdAt: -1 }
        },
        {
          '$group': {
              _id: "$topic", 
              topic: { $first: "$topic"},
              qos: { $first: "$qos"},
              payload: { $first: "$payload" },
              clientId: { $first: "$clientId"},
              userId: { $first: "$userId"},
              createdAt: { $first: "$createdAt"},
              updatedAt: { $first: "$updatedAt"}
          }
        }
      ]
    }).catch(err => {
      // ignore already Exists error
      const alreadExists = err.code === 48
      if (!alreadExists) {
        throw err
      }
    })
    service.Model = client.db.collection('message-retain')
  })

  service.hooks(hooks)
}