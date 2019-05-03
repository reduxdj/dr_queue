## PubSub
Publisher and Subscribers allow you to send and receive data, in realtime. Publishing to channels can be achieved by using the Dr Queue's the REST endpoints, in the included Dr Queue Koa webserver or by importing the  methods directly into your app/script, à la carte style.


### Publishing

##### Channel Paths

The channel paradigm is broken down into a simple string of parameters. For convenience, and easy filtering, the keys of the path are rolled up into the payload object.

```

```

The keys are: env, appName, resourceName and resourceKey, and any additional keys are captured into a variable called extraPaths and shuttled in the payload too.

```
<envName>:<appName>:<...optionalResourceName>:<...optionalResourceKey>
```

To publish to a user resource, at ID 123, you would formulate the message channel name would like this:

```js
prod:webapp
```

This is example would be scoped to the environment production, for all webapp listeners.

##### Using the webserver:

For instance, you might want to send a payload of IPs that the user with ID 123 has logged in from recently, maybe to control content per user, similar to how Spotify stops playback of music opened from multiple devices at the same time.

```sh
curl -X POST \
  http://localhost:8000/api/publisher/prod:iflipd:users:123 \
  -H 'Authorization: Bearer Go' \
  -H 'Content-Type: application/json' \
  -H 'cache-control: no-cache' \
  -d '{
	"ipList": ["193.37.252.62", "193.37.252.50", "193.37.252.119", "104.200.153.73"]
}'
```

##### Imports à la carte:

```js
import {Redis} from 'dr_queue'
Redis.setPublisher(redisPublisherConnection)
// connect to redis
Redis.publish('prod:iflipd:users:123', {hello: 'there'})
```

### Subscriptions

Subscriptions are easy to setup. The listen function takes one argument, the channel name and returns a promise. The payload of the resolved promise has any data along with the path name keys.

##### To get started:

First, configure your subscriber to connect to your environment correctly and create an async function to handle the payload.

```js
import {Redis} from 'dr_queue'

Redis.setSubcriber(redisSubscriberConnection)
// connect to redis

async function start() {
  const payload = await listen('prod:webapp')
}
```

#### Wildcards

Dr Queue automatically supports wildcards in channel names, making it easy subscribe to app level events. For instance, to broadcast to all users in your app, you might want to publish a general message like this:


##### Post a payload to your user (included webserver)
```sh
curl -X POST \
  http://localhost:8000/api/publisher/prod:iflipd:users:* \
  -H 'Authorization: Bearer Go' \
  -H 'Content-Type: application/json' \
  -H 'cache-control: no-cache' \
  -d '{
	"ipList": ["193.37.252.62", "193.37.252.50", "193.37.252.119", "104.200.153.73"]
}'
```

#### To see example of how streaming with log messages

To See a simple working test, modify your publisher and subscriber connection in the /config/default.json script.


<b>In a console window, type:</b>

```sh
CHANNEL=dev:queue npm run subscriber
```

<b>Open another console window, type:</b>

```sh
npm run test:grep Middleware
```
