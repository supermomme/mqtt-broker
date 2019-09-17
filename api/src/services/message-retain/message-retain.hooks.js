const { authenticate } = require('@feathersjs/authentication').hooks
const { populate } = require('feathers-hooks-common')

const schema = {
  include: [
    { service: 'message',
      nameAs: 'message',
      parentField: 'messageId',
      childField: '_id'
    }
  ],
};

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [ populate({schema}) ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
