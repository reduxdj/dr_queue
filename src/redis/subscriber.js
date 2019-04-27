import config from 'config'
import Logger from '../logger'
import createConnection from '../redis'
import {argv} from 'process'

const {redis} = config.get('db')
const index = argv.indexOf('--channel')
const isInScriptMode = argv.find((item) => item.includes('subscriber'))
const channel = argv[index+1]

export async function listen(channel) {
  return new Promise(async (resolve) => {
      const config = redis.find(({name}) => name === 'subscriber')
      const {redisClient} = await createConnection(config)
      /* eslint-disable */
      redisClient
      .on('message', (channel, message) => Logger.log('messageReceived', {channel, message}))
        redisClient.subscribe(channel)
    }).then(() => {
      resolve(message)
    })
    /* eslint-enable */
}
if (isInScriptMode) {
  listen(channel)
  Logger.log(`Subscriber Started ⏰ on ${channel}`)
}
