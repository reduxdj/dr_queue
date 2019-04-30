import {start, startServer} from './server'
import {argv} from 'process'
import {getLogger, setRedisConnections} from './logger'
import {loggerMiddleware} from './middleware'
const isServer = argv.find((item) => item.includes('--server'))
if (isServer)
  start().then(startServer)

export const Logger = {
  init: (config, redisConnections) => getLogger(config, redisConnections),
  setRedisConnections: ({client, publisher}) => setRedisConnections({ client, publisher}),
  middleware: loggerMiddleware
}
