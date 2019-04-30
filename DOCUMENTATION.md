## Dr Queue
Control your Redis Queues with a simple REST HTTP interface.
Dr Queue, combines a Koa 2.0 web server with multiple Redis connections.

Simply POST your payload on to your queue, serialization will make your object into a JSON string, or GET an item off the queue, serialization back to an object is also automatic.

Lists are dynamic, just like Redis, to create a list, POST a JSON body into the /api/queue/<queueName> endpoint.

Queues, are assumed to be going left to right.

This is a brand new repo, it's getting tests soon.
Also, websocket publish/subscribe framework is coming soon too.

### Why?
Why This? Reasoning about queues is not easy, especially because we think of them like arrays, but Redis can make this confusing, especially with its indices in its commands.

### Documentation
Just like REST interfaces, GET requests are non destructive read operations of the queue,
while POST commands mutate the list

#### Logging
[Logging](https://github.com/redux_dj/dr_queue/LOGGING.md)

####Authentication - Roll Your Own
[Authentication](https://github.com/redux_dj/dr_queue/AUTHENTICATION.md)


### Examples
[Examples](https://github.com/redux_dj/dr_queue/EXAMPLES.md)

### Getting Started
The app is written in es6, a babel transpiled entry point is added to /out directory

To build app:
```
npm install
npm run build
```

To Start Dr Queue (also builds the app):

```
npm start
```

###License

[MIT](https://github.com/redux_dj/dr_queue/EXAMPLES.md)

When using the Atom or other GitHub logos, be sure to follow the [GitHub logo guidelines](https://github.com/logos).
