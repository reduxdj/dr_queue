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

const alignColorsAndTime = winston.format.combine(
    winston.format.colorize({
      all:true
    }),
    winston.format.label({
      label: 'console-logger'
    }),
    /*eslint-disable */
    winston.format.printf(
      ({metadata = {}, env = {}, label, level, hostIp, hostname, appName, timestamp, message, timezone}, ...info) =>
        ` ${env}:${chalk[COLORS.gray](hostname)}:${appName}:${hostIp}:${level} UTC: ${chalk[COLORS.magentaBright](moment(timestamp))} ${timezone}: ${chalk[COLORS.yellowBright](moment(info.timestamp).tz(timezone).format('hh:mm a'))} ${chalk[COLORS.whiteBright](message)} ${JSON.stringify({env, hostIp, appName, timestamp, ...info, ...(metadata && typeof metadata === 'object' ? metadata : {metadata})})}`

    )
    /*eslint-enable */
)

function createTransport({filename, level}) {
  return new winston.transports.File({filename, level})
}

function createLogger(transports = []) {
  return winston.createLogger({
    level: "info",
    transports: (transports ? transports.map(createTransport) : [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'info.log', level: 'info' }),
    ]).concat(new (winston.transports.Console)({
      format: winston.format.combine(winston.format.colorize(), alignColorsAndTime)
    })),
  })
}
let logger

export class Logger {
  constructor({env, appName, timezone, hostIp, hostname, errorIgnoreLevels = [], transports}, redisConnections = {}) {
    logger = createLogger(transports)
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
  static getLogger(config = {}, redisConnections = {}) {
    return new Logger(config, redisConnections)
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
export const getLogger = (config, redisConnections) => {
  return new Logger(config, redisConnections)
}
