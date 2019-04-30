import config from 'config'
import {getLogger} from '../logger'
import createConnection from '../redis'
import Koa from 'koa'
import Router from 'koa-router'
import routing from '../routes'
import websockify from 'koa-websocket'
import moment from 'moment'
import bodyParser from 'koa-bodyparser'
import {loggerMiddleware} from '../middleware'
import {dbs} from '../redis/db'

const configEnv = (config && config.has('env') && config.get('env') || {})

export const logger = getLogger(configEnv)
export const upTime = moment().format('MMMM Do YYYY, h:mm:ss a')

const router = new Router()
const {redis} = ((config && config.has('db') && config.get('db')) || [])
const {port, protocol, useWebsockets, hostIp} = (config && config.has('webserver') && config.get('webserver') || {})


export const app = (useWebsockets
    ? websockify(new Koa())
    : new Koa())

export async function start() {
  return new Promise((resolve) => {
    return Promise.all(
      redis.map(async (config) => await createConnection(config))
    ).then((results = []) => {
      results.map(({redisClient, name}) => {
        dbs[name] = redisClient
        logger.log(`Connection Established to ${name}`)
      })
    }).then(resolve)
  })
}

export function startServer() {
  logger.log('Starting Server')
  app.use(bodyParser())
  .use(loggerMiddleware(getLogger(configEnv, dbs)))
  .use(router.allowedMethods())
    app.listen(port, () => logger.log(`✅ The server is running at ${protocol}://${hostIp}:${port}/`), {meta: 'test'})
  routing(app)
  return app
}
