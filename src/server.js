import config from 'config'
import Logger from './logger'
import createConnection from './redis'
import Koa from 'koa'
import process from 'process'

const {redis} = config.get('db')
const {appName} = config.get('env')

export async function start() {
  Promise.all(
    await createConnection(redis)
  )
}

export const log = (message, metadata) =>
  Logger
    .log({
    env: process.NODE_ENV || 'dev',
    hostIp: process.env.HOST_IP || '127.0.0.1',
    hostname: process.env.HOSTNAME || 'localhost',
    appName: appName,
    level: 'info',
    message: message,
    metadata})

log(`App Started ⏰`, {result: 1})

const app = (new Koa())
  .use(async (ctx, next) => {
    ctx.dbs = {
      redis: redis
    }
    return next()
  })
  app.listen(8000, () => log(`✅ The server is running at http://localhost:${800}/`))
start()
