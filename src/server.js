import config from 'config'
import Logger, {getLogger} from './logger'
import createConnection from './redis'
import Koa from 'koa'
import Router from 'koa-router'
import routing from './routes'
import websockify from 'koa-websocket'
import moment from 'moment'
import bodyParser from 'koa-bodyparser'
import {loggerMiddleware} from './middleware'
import {dbs} from './redis/db'
import {argv} from 'process'

const isRunningSubscriber = argv.find((item) => item.includes('subscriber'))


export const upTime = moment().format('MMMM Do YYYY, h:mm:ss a')
const router = new Router()
const {redis} = config.get('db')
const {port, protocol, useWebsockets, hostIp} = config.get('webserver')
export const app = (useWebsockets
    ? websockify(new Koa())
    : new Koa())

export async function start() {
  return new Promise((resolve) => {
    return Promise.all(
      redis.map(async (config) => await createConnection(config))
    ).then((results) => {
      results.map(({redisClient, name}) => {
        dbs[name] = redisClient
        Logger.log(`Connection Established to ${name}`)
      })
    }).then(resolve)
  })
}

function startServer() {
  Logger.log('Starting Server')
  app.use(bodyParser())
  .use(bodyParser())
  .use(loggerMiddleware(getLogger(config.get('env'))))
  .use(router.allowedMethods())
    app.listen(port, () => Logger.log(`✅ The server is running at ${protocol}://${hostIp}:${port}/`), {meta: 'test'})
  routing(app)
  return app
}

if (!isRunningSubscriber)
  start().then(startServer)
export default app
