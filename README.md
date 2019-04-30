# Dr Queue

Control your Redis Queues with a simple REST HTTP interface, or just use the middleware. Dr Queue, combines a Koa 2.0 web server with support for multiple Redis connections to give you visibility into Redis. Use Dr. Queue as a stand-alone app or use it as middleware to include into your current application.

#### Push, Pop, or inspect your Redis Lists
Simply POST your payload on to your queue, then serialization will make your object into a JSON string, or GET an item off the queue, serialization back to an object is also automatic. Lists are dynamic, just like Redis, to create a list, POST a JSON body into the /api/queue/<b>queueName</b>/push endpoint, or import the piece you need a la carte. Queues are assumed to originate from left to right,
but there's options to change this order if necessary.

![Redis](https://s3-us-west-2.amazonaws.com/iflipdgraphicsbucket/redis.png)

#### Logging, included
Add middleware with Redis connections to handle aggregation through streams and queues.

![Logging](https://s3-us-west-2.amazonaws.com/iflipdgraphicsbucket/logger.png)

#### Why?
Reasoning about what's in your queue is not easy, Dr Queue provides clear introspection to find what's in your queue.

#### Small Disclaimer
We're using this module in production, but as we have been breaking this out of a functioning app there's been a few issues we've been discovering. While we don't expect to see many changes to the underlying API some of the locations of modules might get moved around a bit. In making a tool usable for the general public while specific enough for our needs, there's always a few considerations to make.

#### Documentation
Just like REST interfaces, GET requests are non-destructive read operations of the queue, while POST commands mutate the list, either appending to it, removing an item, or resetting (removing the entire list).

- [CURL Examples](https://github.com/reduxdj/dr_queue/blob/master/documentation/EXAMPLES.md)

- [Logging](https://github.com/reduxdj/dr_queue/blob/master/documentation/LOGGING.md)

- [Authentication](https://github.com/reduxdj/dr_queue/blob/master/documentation/AUTHENTICATION.md)

- [PubSub](https://github.com/reduxdj/dr_queue/blob/master/documentation/PUBSUB.md)

- [Workers](https://github.com/reduxdj/dr_queue/blob/master/documentation/WORKERS.md)

- [Middleware](https://github.com/reduxdj/dr_queue/blob/master/documentation/MIDDLEWARE.md)

- [Roadmap](https://github.com/reduxdj/dr_queue/blob/master/documentation/ROADMAP.md)

- [Changelog](https://github.com/reduxdj/dr_queue/blob/master/documentation/CHANGELOG.md)

#### To Start the Dr Queue Server:

```
npm install
npm start
```

##### To Start the Dr Queue Subscriber script:
```
CHANNEL=<envName>:<appName> npm run subscriber
```

#### License

[MIT](https://github.com/reduxdj/dr_queue/blob/master/LICENSE.md)
