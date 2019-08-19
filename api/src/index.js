/* eslint-disable no-console */
const app = require('./app')
const port = app.get('port')
const server = app.listen(port)

process.on('unhandledRejection', (reason, p) =>
  app.get('logger').error('Unhandled Rejection at: Promise ', p, reason)
)

server.on('listening', () => {
  app.get('logger').info('FeathersJS started on %s:%d', app.get('host'), port)
})
