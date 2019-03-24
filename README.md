## Dr Queue
Control your Redis Queues with a simple REST HTTP interface.
Dr Queue, combines a Koa 2.0 web server with multiple Redis connections.

Simply POST your payload on to your queue, serialization will make your object into a JSON string, or GET an item off the queue, serialization back to an object is also automatic.

Lists are dynamic, just like Redis, to create a list, POST a JSON body into the /api/queue/<queueName> endpoint.

Queues, are assumed to be going left to right.

This is a brand new repo, it's getting tests soon.
Also, websocket publish/subscribe framework is coming soon too.

###Why?
Why This? Reasoning about queues is not easy, especially because we think of them like arrays, but Redis can make this confusing, especially with its indices in its commands.

###Documentation
Just like REST interfaces, GET requests are non destructive read operations of the queue,
while POST commands mutate the list

####Logging
Logging is provided with Winston logger

####Authentication - Roll Your Own
An example middleware has been included which can be implemented with
Redis or your database


####Examples

To create a new queue named test and push an item onto that queue:

```
curl -X POST \
  http://localhost:8000/api/queue/test \
  -H 'Authorization: Bearer Go' \
  -H 'Content-Type: application/json' \
  -H 'cache-control: no-cache' \
  -d '{
	"asin": "B07DJ1SS29"
}'
```
Get the last item off a queue named test:
```
curl -X GET \
  http://localhost:8000/api/queue/test \
  -H 'Authorization: Bearer Go' \
  -H 'Content-Type: application/json'
```

Get the last 3 items off a queue named test:
```
curl -X POST \
  http://localhost:8000/api/queue/test/last/3 \
  -H 'Authorization: Bearer Go' \
  -H 'Content-Type: application/json'
```

To empty out a the test queue:
```
curl -X POST \
  http://localhost:8000/api/queue/test/reset \
  -H 'Authorization: Bearer Go' \
  -H 'Content-Type: application/json'
```

Pop an item off the queue named test:
```
curl -X POST \
  http://localhost:8000/api/queue/test/pop \
  -H 'Authorization: Bearer Go' \
  -H 'Content-Type: application/json'
```

Pop an item off the left side of the queue named test:
```
curl -X POST \
  http://localhost:8000/api/queue/test/pop_left \
  -H 'Authorization: Bearer Go' \
  -H 'Content-Type: application/json'
```

To find the length of test queue:
```
curl -X GET \
  http://localhost:8000/api/queue/test/length \
  -H 'Authorization: Bearer Go' \
  -H 'Content-Type: application/json'
```

To add ah item to the right side of the test queue:
```
curl -X GET \
  http://localhost:8000/api/queue/test/push_right \
  -H 'Authorization: Bearer Go' \
  -H 'Content-Type: application/json'
```

To find the length of the queue:
```
curl -X GET \
  http://localhost:8000/api/queue/test/length \
  -H 'Authorization: Bearer Go' \
  -H 'Content-Type: application/json' \
  -H 'cache-control: no-cache'
```

To get the first item (to the left) in test queue:
```
curl -X GET \
  http://localhost:8000/api/queue/test/length \
  -H 'Authorization: Bearer Go' \
  -H 'Content-Type: application/json'
```

To get the first 3 items (to the left) of queue:
```
curl -X GET \
  http://localhost:8000/api/queue/test/first/3 \
  -H 'Authorization: Bearer Go' \
  -H 'Content-Type: application/json'
```

### Getting Started

To build app:
```
npm install
npm run build
```

To Start Dr Queue:

```
npm start
```
