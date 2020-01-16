const log4js = require('log4js')


log4js.configure({
  appenders: {
    everything: { type: 'file', filename: `logs/all-the-logs.log` }
  },
  categories: {
    default: { appenders: ['everything'], level: 'info' }
  }
})

let logger = log4js.getLogger() // logger.info()

module.exports = logger