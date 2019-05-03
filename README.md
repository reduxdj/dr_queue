# Dr Queue

Control your Redis Queues with a simple REST HTTP interface, or just use the middleware. Dr Queue, combines a Koa 2.0 web server with support for multiple Redis connections to give you visibility into Redis. Use Dr. Queue as a stand-alone app or use it as middleware to include in your current application.

#### Push, Pop, or inspect your Redis Lists
Queues (or Redis Lists) are dynamic. Add items to your queue the way you already use redis lists. Queues are assumed to originate from left to right, but there's options to change this order if necessary. [See Redis](https://github.com/reduxdj/dr_queue/blob/master/documentation/PUBSUB.md)

#### Use the webserver

Simply POST your payload on to your queue, then serialization will make your object into a JSON string, or GET an item off the queue, serialization back to an object is also automatic. Lists are dynamic

 Create a list, by posting a JSON body into a REST end point

```
/api/queue/<b>queueName
```

#### Or use Dr Queue à la carte
Bring your own connection, and import just the pieces you need.

![Redis](https://s3-us-west-2.amazonaws.com/iflipdgraphicsbucket/redis.png)

#### Logging, included
Add middleware with Redis connections to handle aggregation through streams and queues.

![Logging](https://s3-us-west-2.amazonaws.com/iflipdgraphicsbucket/logger.png)

#### Why?
Reasoning about what's in your queue is not easy, Dr Queue provides clear introspection to find what's in your queue.

#### Table of Contents

* [PubSub](https://github.com/reduxdj/dr_queue/blob/master/documentation/PUBSUB.md)
* [Logging](https://github.com/reduxdj/dr_queue/blob/master/documentation/LOGGING.md)
  * [Middleware](https://github.com/reduxdj/dr_queue/blob/master/documentation/MIDDLEWARE.md)
  * [Authentication](https://github.com/reduxdj/dr_queue/blob/master/documentation/AUTHENTICATION.md)
* Other Info
  * [CURL Examples](https://github.com/reduxdj/dr_queue/blob/master/documentation/EXAMPLES.md)
  * [Changelog](https://github.com/reduxdj/dr_queue/blob/master/documentation/CHANGELOG.md)
  * [Roadmap](https://github.com/reduxdj/dr_queue/blob/master/documentation/ROADMAP.md)
  * [Tests](https://github.com/reduxdj/dr_queue/blob/master/documentation/ROADMAP.md)

#### TL;DR
##### Quickstart

```
npm install
npm start
```

##### (In another console window) start the Dr Queue Subscriber script:
```
CHANNEL=<envName>:<appName> npm run subscriber
```

#### License

[MIT](https://github.com/reduxdj/dr_queue/blob/master/LICENSE.md)


##### Small Disclaimer
We're using this module in production, but as we have been breaking this out of a functioning app there's been a few issues we've been discovering. While we don't expect to see many changes to the underlying API some of the locations of modules might get moved around a bit. In making a tool usable for the general public while specific enough for our needs, there's always a few considerations to make.
