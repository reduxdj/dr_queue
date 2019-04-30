import {start, startServer} from './server'
import {argv} from 'process'
import {getLogger, setRedisConnections} from './logger'
import {loggerMiddleware} from './middleware'
import {createRedisConnection, redisRetryStrategy} from './redis'
import {dbs,
  push,
  pop,
  popLeft,
  pushRight,
  length,
  pushLeft,
  hasNext,
  range,
  sRange,
  clearDelay,
  popRight,
  lastOne,
  firstOne,
  setPublisher,
  setSubscriber,
  setClient,
  reset,
  delay,
  pause} from './redis/db'

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
  dbs,
  redisRetryStrategy,
  listen,
  createRedisConnection,
  length,
  clearDelay,
  push,
  pop,
  popLeft,
  popRight,
  pushRight,
  pushLeft,
  hasNext,
  range,
  reset,
  delay,
  pause,
  sRange,
  firstOne,
  lastOne,
  setPublisher,
  setClient,
  setSubscriber
}

export const Koa = {
  startServer,
  start
}
