import winston from 'winston'
import moment from 'moment-timezone'
import chalk from 'chalk'

const COLORS = {
  gray: 'gray',
  redBright: 'redBright',
  greenBright : 'greenBright',
  yellowBright: 'yellowBright',
  blueBright: 'blueBright',
  magentaBright :'magentaBright',
  whiteBright: 'whiteBright'
}


let alignColorsAndTime = winston.format.combine(
    winston.format.colorize({
      all:true
    }),
    winston.format.label({
      label: 'console-logger'
    }),
    /*eslint-disable */
    winston.format.printf(
      ({metadata, env, label, level, hostIp, hostname, appName, timestamp, message}, ...info) =>
        ` ${env}:${chalk[COLORS.gray](hostname)}:${appName}:${hostIp}:${level} GMT: ${chalk[COLORS.magentaBright](moment(timestamp))} US/PDX: ${chalk[COLORS.yellowBright](moment(info.timestamp).tz('America/Los_Angeles').format('hh:mm a'))} ${chalk[COLORS.whiteBright](message)} ${JSON.stringify({env, hostIp, appName, timestamp, env, ...metadata})}`
    )
    /*eslint-enable */
)

export const logger = winston.createLogger({
  level: "debug",
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
      new (winston.transports.Console)({
          format: winston.format.combine(winston.format.colorize(), alignColorsAndTime)
      })
  ],
})

export default logger
