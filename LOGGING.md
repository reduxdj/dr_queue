### Logging

One of Dr. Queue's aims, is helping to organize and aggregate logs for Koa using Redis. Dr. Queue piggybacks on an already popular transport module for logging called Winston. (See [Winston](https://www.npmjs.com/package/winston))

Dr. Queue installs and uses Winston ^3.21. Dr. Queue initializes Winston for you and adds some basic color formatting. Each log statement that Dr. Queue writes, assumes that this app might be part of a bigger system where it can subscribe to specific Redis channels to receive real time log events, if you want to ensure the log message is received you can use the the queue to manage acknowledging these logs messages and saving them to disk.

Dr. Queue uses the configuration module config to handle its configuration, however the initializing can just take an object.

Dr Queue requires Koa bodyParse middleware if you want to see the request body attributes.


##### Example: TLDR;

```
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

const config  = {
  hostIp : 127.0.0.1,
  appName: queue,
  timezone: America/Los_Angeles,
  hostname: localhost,
  useWebsockets: true,
  errorIgnoreLevels: [401, 403],
  transports:[
  {
    filename: "./info.log",
    format": "txt"
    },{
      filename: "./error.log",
      format": "txt"
    }]
}

const dbs = {
  client: redisClient, // for the queue`
  publisher: redisPublisher, // for the stream`
}

const LoggerUtil = LoggerUtil.init(config)
export const Logger = LoggerUtil.init(config, dbs)

const app = new Koa()
app.use(bodyParser())
  .use(LoggerUtil.middleware(Logger))
  .use(router.allowedMethods())
  .use(router.routes())
  app.listen(port, () => Logger.log(`✅ The server is running at ${protocol}://${hostIp}:${port}/`), {meta: 'test'})
return app
```

Sometimes, you don't want to see certain errors show up in your error Koa server logs, like bad logins, you can filter these errors out of the error log with the errorIgnoreLevels filter, which filters, out certain status codes from going to error logs.

#### Queue Messages
To allow queues (and/or publishing messages to a Redis subcriber), the second argument in the queue allows you to pass in both/either a client and/or subscriber connection, respectively. To see the subscriber work and receive log messages from middleware:


#### See Working stream example

<b>In a console window, type:</b>

```
npm run test:grep Middleware
```

<b>Open another console window, type:</b>

```
CHANNEL=dev:queue npm run subscriber
```
