import redis from 'redis'
import {log} from '../server'

const createRedisConnection = async ({host, port}) => new Promise((resolve, reject) => {
  redis.createClient({ url: `//${host}:${port}` })
    .on('connect', (info) => {
    log(`//${host}:${port} Redis Connected`) //eslint-disable-line
  }).on('error', (err) => {
    log('Redis disconnected') //eslint-disable-line
    reject(err)
  })
  })
export default createRedisConnection
