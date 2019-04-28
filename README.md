# Dr Queue

Control your Redis Queues with a simple REST HTTP interface, or just use the middleware. Dr Queue, combines a Koa 2.0 web server with support for multiple Redis connections to give you visibility into Redis.

#### Push, Pop, or inspect your Redis Lists
Simply POST your payload on to your queue, then serialization will make your object into a JSON string,
or GET an item off the queue, serialization back to an object is also automatic. Use Dr. Queue as a stand-alone app or use it as middleware to include into your current application

Lists are dynamic, just like Redis, to create a list, POST a JSON body into the /api/queue/<b>queueName</b>/push endpoint. Queues are assumed to originate from left to right.

### Why?
Reasoning about queues is not easy, especially because we tend think of them like arrays, but Redis can make this a little confusing, especially with its index complexity in its commands. Say for example, you want to build a simple pagination API with items in your Redis list, for loading more items, you have to first reason about the range command and its subtle differences to array.slice for example.

#### Documentation
Just like REST interfaces, GET requests are non-destructive read operations of the queue, while POST commands mutate the list, either appending to it, removing an item, or resetting (removing the entire list).

- [CURL Examples](https://github.com/reduxdj/dr_queue/blob/master/EXAMPLES.md)

- [Logging](https://github.com/reduxdj/dr_queue/blob/master/LOGGING.md)

- [Authentication](https://github.com/reduxdj/dr_queue/blob/master/AUTHENTICATION.md)

- [PubSub](https://github.com/reduxdj/dr_queue/blob/master/PUBSUB.md)

- [Workers](https://github.com/reduxdj/dr_queue/blob/master/WORKERS.md)

- [Middleware](https://github.com/reduxdj/dr_queue/blob/master/MIDDLEWARE.md)

- [Roadmap](https://github.com/reduxdj/dr_queue/blob/master/ROADMAP.md)

- [Changelog](https://github.com/reduxdj/dr_queue/blob/master/CHANGELOG.md)

#### Getting Started
To build app:
```
npm install
npm run build
```

#### To Start the Dr Queue Server:
```
npm start
```

##### To Start the Dr Queue Subscriber script:
```
CHANNEL=<envName>:<appName> npm run subsriber
```

#### License

[MIT](https://github.com/reduxdj/dr_queue/blob/master/LICENSE.md)
