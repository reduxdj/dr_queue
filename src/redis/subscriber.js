import config from 'config'
import {logger as Logger} from '../server/index'
import createConnection from '../redis'
import {argv} from 'process'

const {redis} = (config && config.has('db') && config.get('db') || {})
const index = argv.indexOf('--channel')
const isInScriptMode = argv.find((item) => item.includes('subscriber'))
const channel = argv[index+1]

export default async function listen(channel) {
  return new Promise(async (resolve) => {
    const config = redis.find(({name}) => name === 'subscriber')
    const {redisClient} = await createConnection(config)
    /* eslint-disable */
    redisClient
    .on('pmessage', (channel, name, message) => {
      const data = JSON.parse(message)
      Logger.logSilent(`messageReceived`, data) // will not publish messages back to itself
      resolve(data)
    })
    redisClient.psubscribe(channel)
  })
}
if (isInScriptMode) {
  listen(channel)
  Logger.log(`Subscriber Started ⏰ on ${channel}`)
}
