// import dump from 'redis-dump'
import _ from 'lodash'
import { dbs, log } from '../server'

const DB_CONSTANTS = {
  LEFT: 0,
  RIGHT: 1
}

export const LEFT = 'LEFT'
export const RIGHT = 'RIGHT'

function getJsonString(data) {
  if (typeof data === 'object')
    return JSON.stringify(data)
  else return data
}

function parseResult(result) {
  if ((typeof result === 'string' && result).match(/^\{/)) // Pass along strings, maybe something is expecting a string?
    return Promise.resolve(JSON.parse(result))
  else if (result)
    return Promise.resolve(result)
  else
    return Promise.resolve()
}

export function parseList(item = '[]') {
  return Promise.resolve(item)
}

export async function pop(queueName, direction = DB_CONSTANTS.RIGHT) {
  return new Promise(resolve => {
    dbs.client[direction > 0 ? 'rpop' : 'lpop' ](queueName, (err, data) => {
      resolve(parseResult(data))
    })
  }).catch(log)
}

export async function push(queueName='bad-queue', item, direction = DB_CONSTANTS.LEFT) {
  return (new Promise(resolve =>
  dbs.client[ direction > 0 ? 'rpush' : 'lpush' ](queueName,
    getJsonString(item), (err, data) =>
      resolve(data))).catch(log))
}

export async function popLeft(queueName) {
  return new Promise(resolve => {
    dbs.client.lpop(queueName, (err, data) => {
      resolve(parseResult(data))
    })
  }).catch(log)
}

export async function popRight(queueName) {
  return pop(queueName, DB_CONSTANTS.LEFT) //we transpose this r
}

export async function pushLeft(queueName, item, direction = DB_CONSTANTS.LEFT) {
  return push(queueName, item, direction )
}

export async function pushRight(queueName, item, direction = DB_CONSTANTS.RIGHT){
  return push(queueName, item, direction)
}

export function hasNext(queueName) {
  return new Promise(resolve =>
    dbs.client.lrange(queueName, -1, -1, (err, data) => {
      resolve(!!data)
      })
    )
  }

export async function range(queueName, start, stop) {
  return new Promise(resolve =>
    dbs.client.lrange(queueName, start, stop, (err, data) => {
      const results = (data && Array.isArray(data) ? data : []).filter(item => item.match(/\{"/g)).map(JSON.parse)
      resolve(results.reverse())
    })
  )
}

export async function lastOne(queueName, count = 1) {
  return _.get(await range(queueName, 0, count - 1), '[0]')
}


export async function firstOne(queueName, count = 1) {
  return _.get((await range(queueName, count * -1, -1)).reverse(), '[0]')
}

export async function length(queueName) {
  return new Promise(resolve =>
    dbs.client.llen(queueName, (err, data) =>
      resolve(data)
    )).catch(log)
}

export async function reset(queueName) {
  return new Promise(resolve =>
    dbs.client.del(queueName, 0, -1, (err, data) =>
      resolve(data)
    )).catch(log)
}

export async function last(queueName, count = 1) {
  return await range(queueName, 0, count - 1)
}

export async function first(queueName, count = 1) {
  return (await range(queueName, count * -1, -1))
}

/*
 * Timer Functions
 */
export async function pause(mins = 1) {
  return new Promise(resolve => {
    const timeout = setTimeout(() => {
      return resolve(timeout)
    }, 1000 * mins)
  })
}

export async function delay(secs = 1) {
  return new Promise(resolve => {
    const timeout = setTimeout(() => {
      return resolve(timeout)
    }, 1000 * secs)
  })
}

export async function clearDelay(timeout) {
  Promise.resolve(() => clearTimeout(timeout)) //eslint-disable-line
}
