## Workers
### Take one down pass it around

Workers pull things off queues and do tasks. For example, in our own use case, we use workers to pull a notification off of a queue, specifically to send an SMS to a user based on a shipping notification status change.

### Worker Types
What kind of worker suits you?
- <b>Iterator/Timer Worker</b> This worker uses an iterator based pattern and can be used easily combined with a timer to check for the existence of another task in the queue. (Simple timer utils are included in Dr Queue).

- <b>Pub/Sub Event Listener Worker</b> This worker can subscribe to a new event. For instance, a queue having pertinent info, perhaps with simple information how to process the item, like a broadcast message in the fire-and-forget style.

#### Getting Started

##### Iterator Worker Example - Confirmation of transaction

```js
import {hasNext, pop, delay, getNext} from '../redis/db'

const queueName = 'sms_queue'

async function checkQueue() {
  while async (await hasNext(queueName) => {
    const item = await getNext(queueName)
    await doSomeAsyncFunction(item)
    await pop(queueName)
    return checkQueue()
    await delay(10)
  }).then(() => {
    checkQueue()
  })
  await delay(10)
  checkQueue()
}
```
In the above example, we're awaiting until the doSomeAsyncFunction executes before popping the next item off of the queue and processing it.

#### Broadcast Listener Style - sh example

Create a function handle your async subscription event

```js
import listen from subscriber

async function orderUpdate() {
  const {resourceName, resourceKey, orderStatus, orderId, orderStatus} = await listen('prod:webapp')
  await sendOrderNotification(orderId)
  await pop(queueName)
}
```

The above example is scoped to listen to the environment prod and the app name <b>webapp<b>. If you care about all the messages in the prod scope, wildcards are supported too, for example:

```sh
npm run subscriber prod:*
```

To see this work, post into your API to send a message

```sh
curl -X POST \
  http://localhost:8000/api/publisher/prod:webapp:users:123 \
  -H 'Authorization: Bearer Go' \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 1ea09cc8-a924-4b9e-83cd-906352c72087' \
  -H 'cache-control: no-cache' \
  -d '{
	"orderStatus": "SHIPPED",
	"orderId": "123"
}'
```

You'll see a log message result like this

dev:localhost:queue:127.0.0.1:info UTC: Sat Apr 20 2019 09:12:04 GMT-0700 America/Los_Angeles: 09:12 am ack {"env":"dev","hostIp":"127.0.0.1","appName":"queue","channel":"prod:webapp","message":"{\"env\":\"prod\",\"appName\":\"iflipd\",\"resourceName\":\"users\",\"resourcKey\":\"123\",\"orderStatus\":\"SHIPPED\",\"orderId\":\"123\",\"createdAt\":\"2019-04-20T16:12:04.448Z\"}"}
```

##### Receive Fire and Forget Event - al la cart style

Sometimes you don't need to confirm an acknowledgement of an item that a worker does, you just want to subscribe to an event broadcast.

```js
import listen from subscriber

async function orderUpdate() {
  Logger.log(await listen('prod:webapp'))
}
```
### Choose the worker type best for the task at hand
Both worker types have advantages and disadvantages and need to be considered with thought. The <b>iterator/timer</b> worker requires more memory, but gives you ability to do one task at a time. For instance, you might need to wait till the current task is done before doing the next task. Maybe your worker is dealing with a a temperamental HTTP service, you could make sure your task resolves before checking the queue to do the next task. Conversely, maybe you care about a broadcast like a trivial birthday announcement? The subscriber method might be fine for that.
