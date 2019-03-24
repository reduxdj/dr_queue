import config from 'config'
import logger from './logger'
import createConnection from './redis'
import Koa from 'koa'
import process from 'process'
import Router from 'koa-router'
import routing from './routes'
import websockify from 'koa-websocket'
import moment from 'moment'
import bodyParser from 'koa-bodyparser'

export const upTime = moment().format('MMMM Do YYYY, h:mm:ss a')
const router = new Router()
const {redis} = config.get('db')
const {appName, timezone, hostIp} = config.get('env')
const {hostname, port, protocol, useWebsockets} = config.get('webserver')
export const dbs = {
  // holds a reference to all our clients in a map
  // client, subscriber, publisher
}

export async function start() {
  return Promise.all(
    redis.map(async (config) => await createConnection(config))
  ).then((results) => {
    results.map(({redisClient, name}) => {
      dbs[name] = redisClient
      Logger.log('Connection Established')
    })
  })
}

export class Logger {
  static log (message, metadata) {
    logger
      .log({
      env: process.NODE_ENV || 'dev',
      hostIp: process.env.HOST_IP || hostIp,
      hostname: process.env.HOSTNAME || hostname,
      appName,
      timezone,
      level: 'info',
      message,
      metadata})
  }
  static error (message, metadata) {
    logger
      .log({
      env: process.NODE_ENV || 'dev',
      hostIp: process.env.HOST_IP || hostIp,
      hostname: process.env.HOSTNAME || hostname,
      appName,
      timezone,
      level: 'info',
      message,
      metadata})
  }
}

Logger.log(`App Started ⏰`, {result: 1})

const app = (useWebsockets
    ? websockify(new Koa())
    : new Koa())
  .use(async (ctx, next) => {
    Logger.log(`${ctx.method} ${ctx.path}`, {path: ctx.request.path, requestIp: ctx.request.ip, method: ctx.method, params: ctx.params })
    return next()
  })
  .use(bodyParser())
  .use(router.allowedMethods())
routing(app)
  app.listen(port, () => Logger.log(`✅ The server is running at ${protocol}://${hostIp}:${port}/`))

start()
