### Logging
One of Dr. Queue's aims, is helping to organize and aggregate logs using Redis. Dr. Queue piggybacks on an already popular transport module for logging called Winston. (See [Winston](https://www.npmjs.com/package/winston))

Each log statement that Dr. Queue writes, assumes that this app might be part of a bigger system where it can subscribe to specific Redis channels to receive real time log events, if you want to ensure the log message is received you can use the the queue to manage acknowledging these logs messages and saving them to disk.


In the config you'll see a list of transports in the env configuration key.


#### Transport files

##### Example: (config.json)

```
"env": {
  "hostIp" : "127.0.0.1",
  "appName": "queue",
  "timezone": "America/Los_Angeles",
  "hostname": "localhost",
  "errorIgnoreLevels": [401, 403],
  "transports":[
    {
    "filename": "./info.log",
    "format": "txt"
  },{
    "filename": "./error.log",
    "format": "txt"
  }]
},
```

If you don't supply a list of transports a default is created. Sometimes, you don't want to see certain errors show up in your error logs, like bad logins, you can filter these errors out of the error log with the errorIgnoreLevels filter, which filters
out certain status codes.


#### Queue Messages
To allow queues (and/or publishing messages to a Redis subcriber), the second argument in the queue allows you to pass in both/either a client and/or subscriber connection, respectively.


##### TLDR: Short example

The second parameter is a an object with 1 or 2 redis connections named, <b>client</b> for the queue type logging,
or <b>publisher</b> for a log stream.

```

const dbs = {
  client,
  publisher
}
app.use(bodyParser())
  .use(loggerMiddleware(getLogger(config.get('env'), dbs)))
  .use(router.allowedMethods())
  .use(router.routes())
  app.listen(port, () => Logger.log(`✅ The server is running at ${protocol}://${hostIp}:${port}/`), {meta: 'test'})
return app
```

##### Full Example: (server.js)

```
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
```
A full working test server is located here: ([See Server](https://github.com/reduxdj/dr_queue/blob/master/test/test_server))


To see the subscriber work and receive log messages from middleware:

<b>In a console window, type:</b>
```
npm run test:grep Middleware
```

<b>Open another console window, type:</b>

```
CHANNEL=dev:queue npm run subscriber
```
