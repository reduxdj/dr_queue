import winston from 'winston'
import moment from 'moment-timezone'
import chalk from 'chalk'
import {dbs, publish, push, setPublisher, setClient} from '../redis/db'

export const COLORS = {
  gray: 'gray',
  redBright: 'redBright',
  greenBright : 'greenBright',
  yellowBright: 'yellowBright',
  blueBright: 'blueBright',
  magentaBright :'magentaBright',
  whiteBright: 'whiteBright'
}
export const colorFormatter = winston.format.colorize({
  all:true
})

export const labelFormatter = winston.format.label({
  label: 'console-logger'
})
/*eslint-disable */
export const printFormatter = winston.format.printf(
  ({metadata = {}, env = {}, label, level, hostIp, hostname, appName, timestamp, message, timezone}, ...info) =>
    ` ${env}:${chalk[COLORS.gray](hostname)}:${appName}:${hostIp}:${level} UTC: ${chalk[COLORS.magentaBright](moment(timestamp))} ${timezone}: ${chalk[COLORS.yellowBright](moment(info.timestamp).tz(timezone).format('hh:mm a'))} ${chalk[COLORS.whiteBright](message)} ${chalk[COLORS.gray](JSON.stringify({env, hostIp, appName, timestamp, ...info, ...(metadata && typeof metadata === 'object' ? metadata : {metadata})}))}`
)

/*eslint-enable */
const alignColorsAndTime = winston.format.combine(
  colorFormatter,
  labelFormatter,
  printFormatter
)

function createTransport({filename, level}) {
  return new winston.transports.File({filename, level})
}

function createLogger(transports = [], ...formatters) {
  return winston.createLogger({
    level: "info",
    transports: (transports ? transports.map(createTransport) : [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'info.log', level: 'info' }),
    ]).concat(new (winston.transports.Console)({
      format: formatters.length > 0
        ? winston.format.combine(...formatters)
        : winston.format.combine(alignColorsAndTime)
    })),
  })
}
let logger

export class Logger {
  constructor({env, appName, timezone, hostIp, hostname, errorIgnoreLevels = [], transports}, redisConnections = {}, ...formatters) {
    logger = createLogger(transports, ...formatters)
    this.env = env || 'dev'
    this.appName = appName
    this.timezone = timezone
    this.hostIp = process.env.HOST_IP || hostIp
    this.hostname = process.env.HOSTNAME || hostname
    this.errorIgnoreLevels = errorIgnoreLevels
    const {publisher, client} = redisConnections
    if (publisher) {
      dbs[publisher] = publisher
      this.publisher = publisher
    }
    if (client) {
      dbs[client] = client
      this.client = client
    }
  }

  static getLogger(config = {}, redisConnections = {}, ...formatters) {
    return new Logger(config, redisConnections, ...formatters)
  }
  getInoreLevels() {
    return this.errorIgnoreLevels
  }
  logSilent (message = '', metadata = {}) {
    const payload = {
    env: this.env,
    hostIp: this.hostIp,
    hostname: this.hostname,
    appName: this.appName,
    timezone: this.timezone,
    level: 'info',
    message,
    metadata}
    logger.log(payload)
  }
  log (message = '', metadata = {}) {
    const payload = {
    env: this.env,
    hostIp: this.hostIp,
    hostname: this.hostname,
    appName: this.appName,
    timezone: this.timezone,
    level: 'info',
    message,
    metadata}
    logger.log(payload)
    if (this.publisher)
      publish(`${this.env}:${this.appName}`, payload)
    if (this.client)
      push(`${this.env}:${this.appName}`, payload)
  }
  info(message = '', metadata ={}) {
    this.log(message, metadata)
  }
  error (message= '', metadata = {}) {
    const payload = {
      env: this.env,
      hostIp: this.hostIp,
      hostname: this.hostname,
      appName: this.appName,
      timezone: this.timezone,
      level: 'error',
      message,
      metadata
    }
    logger.error(payload)
    if (this.publisher)
      publish(`${this.env}:${this.appName}`, payload)
    if (this.client)
      push(`${this.env}:${this.appName}`, payload)
  }
  setRedisConnections({client, publisher}) {
    if (publisher) {
      setPublisher(publisher)
      this.publisher = publisher
    }
    if (client) {
      setClient(client)
      this.client = client
    }
  }
}
export default Logger
export const getLogger = (config, redisConnections, ...formatters) => {
  return new Logger(config, redisConnections, ...formatters)
}
