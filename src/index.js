import {start, startServer} from './server'
import {argv} from 'process'
import {getLogger, setRedisConnections} from './logger'
import {loggerMiddleware} from './middleware'
import {Dbs} from './redis/db'
import {createRedisConnection} from './redis'
import listen from './redis/subscriber'

const isServer = argv.find((item) => item.includes('--server'))
if (isServer)
  start().then(startServer)

export const Logger = {
  init: (config, redisConnections) => getLogger(config, redisConnections),
  setRedisConnections: ({client, publisher}) => setRedisConnections({ client, publisher}),
  middleware: loggerMiddleware
}

export const Redis = {
  ...({Dbs}),
  listen,
  createRedisConnection
}
