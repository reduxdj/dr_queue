import redis from 'redis'
import {Logger} from '../server'

const redisRetryStrategy = ({ attempt }) => {
  if (attempt < 8) {
    const nextDelay = Math.min(attempt * 500, 3000)
    Logger.log(`Reattempting Redis connection after ${nextDelay}ms`)
    return nextDelay
  }
  return undefined
}
let redisClient

const createRedisConnection = async ({host, port, name}) => new Promise((resolve, reject) => {
  Logger.log(`Attempting to connect ${name} to //${host}:${port}`) //eslint-disable-line
  redisClient = redis.createClient({ url: `//${host}:${port}`, retry_strategy: redisRetryStrategy})
    .on('connect', (info) => {
    Logger.log(`//${host}:${port} Redis Connected`) //eslint-disable-line
    resolve({name, redisClient})
  }).on('error', (err) => {
    Logger.log('Redis disconnected') //eslint-disable-line
    reject(err)
  })
})
export default createRedisConnection
