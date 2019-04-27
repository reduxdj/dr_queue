## PubSub
Publishing and subcribing to a redis channel.

### Guidelines

Publishing to a REST endpoint with a channel name in the URL is how you send messages to your subscribers. Channels are derived from some pre-conceived notions. For instance, each channel name has a colon-separated string containing the environment and app name in the string path, the rest of the path holds the information about the resource name, keys and whatever else you want.

##### Example:

http://localhost:8000/api/publisher/<channel>

### Channel Subscriber name

The channel is broken down into a string path of any number keys that you desire. for example, if you want to publish information about a user resource in your production app named webapp, you might formulate the channel name like this:

#### prod:webapp:users:123

Publish a channel payload to <b>prod:webapp:users</b>, and then internally in your subscriber logic handle the event,  there's a subscriber script included.

##### Example:

You might want to send a payload of IPs that the user has logged in from recently.

```
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

To activate your subscriber script, start this script to listen to events

```
<envName>:<appName> npm run subsriber
```

##### Example:

```
CHANNEL=prod:webapp npm run subscriber
```

The keys of the array created by the subscription are rolled up into the payload to make the handling of logic simplified, so you can subscribe to one app level channel message that you want and handle the resource logic under one Redis subscription, everything beyond the first 4 keys: envName, appName, resourceKey and resourceName, are captured into an array of extraPaths that you can access in the message object payload if needed.

#### Subscription Logic Example
