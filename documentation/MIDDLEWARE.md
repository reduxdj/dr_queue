## Middleware
Middleware for Koa ^2.0

### Guidelines

Using Dr Queue as middleware is an option if you already have a webserver and want to connect the Redis transport to your Redis connections (or if you just want to send formatted log files to text files without Redis), that option is available too.

### Getting Started

To initialize the middleware logger, create an instance with a configuration object

##### Example:
```js
import {Logger as LoggerUtil} from 'dr_queue'
import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'

const config = require('config')
const Logger = require('../out/logger').default
const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const moment = require('moment')

const config = {
  hostIp : '127.0.0.1',
  appName: 'queue',
  timezone: 'America/Los_Angeles',
  hostname: 'localhost',
  errorIgnoreLevels: [401, 403],
  transports:[{
    filename: './info.log',
    format: 'txt'
    },{
      filename: './error.log',
      format: 'txt'
    }]
}

const dbs = {
  client: redisClient, // for the queue`
  publisher: redisPublisher, // for the stream`
}

const LoggerUtil = LoggerUtil.init(config)
const Logger = LoggerUtil.init(config, dbs)

const app = new Koa()
app.use(bodyParser())
  .use(LoggerUtil.middleware(Logger))
  .use(router.allowedMethods())
  .use(router.routes())
  app.listen(port, () => Logger.log(`✅ The server is running at ${protocol}://${hostIp}:${port}/`), {meta: 'test'})
return app
```

Or, you can set your connections later if necessary:
```js
export const Logger = LoggerUtil.init(config)
Logger.setRedisConnections({ publisher: dbs.redisPublisher, client: dbs.redisClient })
```

To add middleware you just add this line to your Koa middleware like this,

```js
const app = new Koa()
app.use(LoggerUtil.init(config))
```

Or, just pass the instance

```js
export const Logger = LoggerUtil.init(config)
const app = new Koa()
app.use(Logger)
```


If you need to do any filtering on your logger, or add or remove request properties like to remove passwords or other sensitive information, write a middleware function similar to the one like this one
for Koa

```js
export function loggerMiddleware(Logger) {
  const errorIgnoreLevels = Logger.getInoreLevels()
  return async (ctx, next, ...args) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    const bypassError = !!(errorIgnoreLevels.find((status) => ctx.status === status))
    const hasError = ctx.status >= 400 && !bypassError
    const message = `${ctx.request.origin} ${chalk['magentaBright'](ctx.method)} ${chalk['blueBright'](ctx.status)} ${chalk['yellowBright'](ctx.request.url)}`
    const payload = { ip: ctx.request.ip, query: {...ctx.query}, body: {...ctx.request.body}, userAgent: ctx.request.header['user-agent'], ms}
    if (hasError)
      Logger.error(message, payload)
    else
      Logger.log(message, payload)
  }
}
```

Then setup your logging configuration to support the Redis clients and Redis publishers.
(See [Logging](https://github.com/reduxdj/dr_queue/documentation/blob/master/LOGGING.md))
