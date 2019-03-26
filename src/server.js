import config from 'config'
import Logger from './logger'
import createConnection from './redis'
import Koa from 'koa'
import Router from 'koa-router'
import routing from './routes'
import websockify from 'koa-websocket'
import moment from 'moment'
import bodyParser from 'koa-bodyparser'
import koaLogger from './middleware/logger'

export const upTime = moment().format('MMMM Do YYYY, h:mm:ss a')
const router = new Router()
const {redis} = config.get('db')
const {port, protocol, useWebsockets, hostIp} = config.get('webserver')
export const dbs = {
  // holds a reference to all our clients in a map
  // client, subscriber, publisher
}

export async function start() {
  return new Promise((resolve) => {
    return Promise.all(
      redis.map(async (config) => await createConnection(config))
    ).then((results) => {
      results.map(({redisClient, name}) => {
        dbs[name] = redisClient
        Logger.log('Connection Established')
      })
    }).then(resolve)
  })
}

export const app = (useWebsockets
    ? websockify(new Koa())
    : new Koa())
  .use(bodyParser())
  .use(koaLogger)
  .use(router.allowedMethods())
routing(app)
  app.listen(port, () => Logger.log(`✅ The server is running at ${protocol}://${hostIp}:${port}/`), {meta: 'test'})

start()

Logger.log(`App Started ⏰`, {result: 1})
