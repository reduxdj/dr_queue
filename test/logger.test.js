const {should, expect} = require('chai')
const winston = require('winston')
const {Logger} = require('../out')

const {printFormatter, colorFormatter, labelFormatter} = Logger
should()

const config = {
  hostIp : '127.0.0.1',
  appName: 'queue',
  timezone: 'America/Los_Angeles',
  hostname: 'localhost',
  errorIgnoreLevels: [401, 403],
  transports:[{
    filename: './info.log',
    format: 'txt'
    },{
      filename: './error.log',
      format: 'txt'
    }]
}

const simpleFormatter = winston.format.printf(
  ({message}) => `test ${message}`
)

/* eslint-disable */
should()

describe('Logger formatter', () => {
  it('should create a logger', (done) => {
    const logger = Logger.init(config, {}, printFormatter, colorFormatter, labelFormatter)
    logger.log('hello')
    expect(!!logger)
    done()
  })
  it('should console.log with test', (done) => {
    const logger =  Logger.init(config, {}, simpleFormatter)
    logger.log('hello')
    expect(!!logger)
    done()
  })
})
