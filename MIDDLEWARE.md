## Middleware
Middleware for Koa 2.0

### Guidelines

Using Dr Queue as middleware is an option if you already have a webserver and want to connect the transport to you Redis cluster (or if you just want to send formatted log files to text files with or without Redis).

### Getting Started

To initialize the middleware logger, create an instance with a configuration object

```
import { Logger as LoggerUtil } from 'dr_queue
const config = {
  hostIp : "127.0.0.1",
  appName: "queue",
  timezone: "America/Los_Angeles",
  hostname: "localhost",
  useWebsockets: true,
  errorIgnoreLevels: [401, 403],
  transports :[
      {
      "filename": "./info.log",
      "format": "txt"
    },{
      "filename": "./error.log",
      "format": "txt"
    }] //can be empty
}
export const Logger = LoggerUtil.init(config)
```

To pass redis connections, you can  supply a second argument, like this:

```
LoggerUtil.init(config, {client: redisClient, publisher: redisPublisher})
```


Or, you can set your connections later if necessary:
```
export const Logger = LoggerUtil.init(config)
Logger.setRedisConnections({ publisher: dbs.redisPublisher, client: dbs.redisClient })
```


To add middleware you just add this line to your Koa middleware like this,

```
const app = new Koa()
app.use(LoggerUtil.init(config))
```

Or, just pass the instance

```
export const Logger = LoggerUtil.init(config)
const app = new Koa()
app.use(Logger)
```

Then setup your logging configuration to support the redisClients and redisPublishers.
(See [Logging](https://github.com/reduxdj/dr_queue/blob/master/LOGGING.md))
