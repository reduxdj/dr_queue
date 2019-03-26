import winston from 'winston'
import moment from 'moment-timezone'
import chalk from 'chalk'
import config from 'config'

const COLORS = {
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
        ` ${env}:${chalk[COLORS.gray](hostname)}:${appName}:${hostIp}:${level} UTC: ${chalk[COLORS.magentaBright](moment(timestamp))} ${timezone}: ${chalk[COLORS.yellowBright](moment(info.timestamp).tz(timezone).format('hh:mm a'))} ${chalk[COLORS.whiteBright](message)} ${JSON.stringify({env, hostIp, appName, timestamp, ...info, ...metadata})}`

    )
    /*eslint-enable */
)

const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
      new (winston.transports.Console)({
          format: winston.format.combine(winston.format.colorize(), alignColorsAndTime)
      })
  ],
})

export class Logger {
  constructor({appName, timezone, hostIp, hostname}) {
    this.env = process.NODE_ENV || 'dev',
    this.appName = appName
    this.timezone = timezone
    this.hostIp = process.env.HOST_IP || hostIp
    this.hostname = process.env.HOSTNAME || hostname
  }
  log (message = '', metadata = {}) {
    logger
      .log({
      env: this.env,
      hostIp: this.hostIp,
      hostname: this.hostname,
      appName: this.appName,
      timezone: this.timezone,
      level: 'info',
      message,
      metadata})
  }
  error (message= '', metadata = {}) {
    logger
      .error({
      env: process.NODE_ENV || 'dev',
      hostIp: this.hostIp,
      hostname: this.hostname,
      appName: this.appName,
      timezone: this.timezone,
      level: 'error',
      message,
      metadata
      })
  }
}
export default new Logger(config.get('env'))
