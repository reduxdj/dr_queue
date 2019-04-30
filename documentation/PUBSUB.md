## PubSub
Publish and Subscribe to a Redis channel. Publishing to channels can be achieved by using the Dr. Queue's Webserver and using the REST endpoint to publish a JSON body. You can also directly import the publish command if you choose not to use the server.

##### Example (using included webserver):

http://localhost:8000/api/publisher/<channel>

##### Channel Path
The channel is broken down into a string of parameters, for example, to publish to a user resource, ID of 123, you would formulate the message channel name like this:

###### prod:webapp:users:123
This is a scope example at the application level, the channel name is derived from the first key, which is a the environment followed by the app name, and any number of colon separated paths that you desire.


##### Start Your Subscriber:
To activate your subscriber script, start this script to listen to events

```sh
CHANNEL=prod:webapp npm run subscriber
```

##### Example (using included webserver):

You might want to send a payload of IPs that the user 123 has logged in from recently.

```sh
prod:users:123 npm run subscriber
```

```sh
curl -X POST \
  http://localhost:8000/api/publisher/prod:iflipd:users:123 \
  -H 'Authorization: Bearer Go' \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 31a17ac8-d83c-4b8a-b6e2-98ea06256b70' \
  -H 'cache-control: no-cache' \
  -d '{
	"ipList": ["193.37.252.62", "193.37.252.50", "193.37.252.119", "104.200.153.73"]
}'
```
##### Example (a la carte import)

```js
import {Redis} from 'dr_queue'
const {push, setClient} = Redis

//in your connection handler
//
setClient(yourRedsClient)
publish(channelName, {payload: 'some object'})
```
The keys of the path name are rolled up into the payload to make the handling of logic simplified, so you can subscribe to one app level channel message and handle the specific logic under one Redis subscription, everything beyond the first 4 keys: env, appName, resourceKey and resourceName, are captured into an array of extraPaths that you can access in the message object payload if needed.

#### Wildcards

Dr. Queue automatically supports wildcards in channel names, so you can subscribe to app level events. For instance, to broadcast to all thee users in your app, you
might want to publish a message like this.

##### Start your subscriber

```sh
CHANNEL=prod:webapp:users:* npm run subscriber
```

##### Post a payload to your user (included webserver)
curl -X POST \
  http://localhost:8000/api/publisher/prod:iflipd:users:* \
  -H 'Authorization: Bearer Go' \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 31a17ac8-d83c-4b8a-b6e2-98ea06256b70' \
  -H 'cache-control: no-cache' \
  -d '{
	"ipList": ["193.37.252.62", "193.37.252.50", "193.37.252.119", "104.200.153.73"]
}'

##### Example (a la carte import)

```js
import {Redis} from 'dr_queue'
const {push, setClient} = Redis

//in your connection handler
//
setClient(yourRedsClient)
publish(channelName, {payload: 'some object'})
```

Under the hood, Dr. Queue automatically uses <b>psubscribe</b> and <b>pmessage</b> to allow
for both wildcards and regular channels


##### Another Example (using included test)
###### In a console window, type:

```sh
npm start
```

###### Open another console window, type:

```sh
npm run subscriber dev:queue
```
