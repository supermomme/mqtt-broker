// user-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient')
  const user = new mongooseClient.Schema({

    username: { type: String, unique: true, lowercase: true },
    password: { type: String },

    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, unique: false, required: false },

    role: { type: String, enum: [ 'ADMIN', 'USER' ], default: 'USER' }

  }, {
    timestamps: true
  })

  return mongooseClient.model('user', user)
}
