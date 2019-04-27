## Middleware
Middleware for Koa 2.0

### Guidelines

Using Dr Queue as middleware is an option if you already have a webserver and want to connect the transport to you Redis cluster (or if you just want to send formatted log files to text files with or without Redis).

### Getting Started

In your koa server code add the middleware

```
import {logger} from 'dr_queue'
import config from 'config'


const redisPublisher // your Redis publisher connection
const redisClient // your Redis client connection

//in your app code
app.use(logger(config, {publisher: redisPublisher, client: redisClient}))
```


Then setup your logging configuration to support the redisClients and redisPublishers.
(See [Logging](https://github.com/reduxdj/dr_queue/blob/master/LOGGING.md))
