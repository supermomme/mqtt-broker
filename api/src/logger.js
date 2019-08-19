const { createLogger, format, transports } = require('winston')

module.exports = function (app) {
  const logger = createLogger({
    // To see more detailed errors, change this to 'debug'
    level: app.get('loggerType'),
    format: format.combine(
      format.splat(),
      format.simple()
    ),
    transports: [
      new transports.Console()
    ],
  })
  logger.info(`Logger Type ${app.get('loggerType')}`)
  app.set('logger', logger)
}
