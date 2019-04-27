## Workers
Workers pull things off queues and do tasks. For example, in our own use case, we use workers to pull a notification off a queue to send an SMS to a user based on a shipping notification about a product from our warehouse.

### Guidelines

To setup a worker there's two ways to handle processing a work task
- <b>Iterator/Timer Worker</b> This  worker can use iterators (and timers) to check for the existence of another task in the queue, then pop one off when the task is processed
- <b>Pub/Sub Event Listener Worker</b> This worker can subscribe to an event about a queue having pertinent info, information about the queue to pull a task off can be rolled up into the channel name of queue event.

#### Getting Started

##### Iterator Worker Example - Confirmation of transaction

Here's a contrived oversimplified example of how to handle a queue message and do some work and then an handle the acknowledgement of the message by removing the element from the queue.

```
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

<sub>In the above example, we're awaiting until the doSomeAsyncFunction executes before popping the first item off the queue</sub>

Create a function handle your async subscription event

```
import listen from subscriber

async function orderUpdate() {
  const {resourceName, resourceKey, orderStatus, orderId, orderStatus} = await listen('prod:webapp')
  await sendOrderNotification(orderId)
  await pop(queueName)
}
```
Then post into your API to send a message
```
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

```
dev:localhost:queue:127.0.0.1:info UTC: Sat Apr 20 2019 09:12:04 GMT-0700 America/Los_Angeles: 09:12 am messageReceived {"env":"dev","hostIp":"127.0.0.1","appName":"queue","channel":"prod:webapp","message":"{\"env\":\"prod\",\"appName\":\"iflipd\",\"resourceName\":\"users\",\"resourcKey\":\"123\",\"orderStatus\":\"SHIPPED\",\"orderId\":\"123\",\"createdAt\":\"2019-04-20T16:12:04.448Z\"}"}
```

##### Receive Fire and Forget - (No Confirmation)

Sometimes you don't need to confirm that you receive a message, an example would be a real time console logger that just receives log streams displays messages.

```
import listen from subscriber

async function orderUpdate() {
  Logger.log(await listen('prod:webapp'))
}
```

Either worker type, a confirmation handler or fire and forget, has advantages/disadvantages, the <b>iterator/timer</b> example requires more memory to manage timers, while the subscription example requires more traffic/memory on your Redis connection.
