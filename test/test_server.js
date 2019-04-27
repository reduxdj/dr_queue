const config = require('config')
const Logger = require('../out/logger').default
const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const {loggerMiddleware} = require('../out/middleware')
const {getLogger} = require('../out/logger')
const moment = require('moment')
const createRedisConnection = require('./redis').default

const router = new Router()
const {port, protocol, hostIp} = { port: 8081, protocol: 'http', hostIp: '127.0.0.1'}
const upTime = moment().format('MMMM Do YYYY, h:mm:ss a')

router.get('/api/ping', async (ctx) => {
  ctx.body = { ok: true, data: { started: upTime }}
})

router.post('/api/ping', async (ctx) => {
  ctx.body = { ok: true, data: { started: upTime, ...ctx.request.body }}
})

const dbs = {}
const {redis} = config.get('db')
const app = new Koa()

function start() {
  return new Promise((resolve) => {
    return Promise.all(
      redis.map(async (config) => await createRedisConnection(config))
    ).then((results) => {
      results.map(({redisClient, name}) => {
        dbs[name] = redisClient
        Logger.log(`Connection Established to ${name}`)
      })
    }).then(resolve)
  })
}

function startServer() {
  Logger.log('Starting webserver')
  app.use(bodyParser())
    .use(loggerMiddleware(getLogger(config.get('env'), dbs)))
    .use(router.allowedMethods())
    .use(router.routes())
    app.listen(port, () => Logger.log(`✅ The server is running at ${protocol}://${hostIp}:${port}/`), {meta: 'test'})
  return app
}
start().then(startServer)
module.exports = app
