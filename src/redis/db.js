// import dump from 'redis-dump'
import _ from 'lodash'
import { dbs, log } from '../server'

const DB_CONSTANTS = {
  LEFT: 0,
  RIGHTL: 1
}

function getJsonString(data) {
  if (typeof data === 'object')
    return JSON.stringify(data)
  else return data
}

function parseResult(result) {
  if (result.match(/^"/))
    return Promise.resolve(JSON.parse(result))
  else if (result)
    return Promise.resolve(result)
  else
    return Promise.resolve()
}

export function parseList(item = '[]') {
  return Promise.resolve(item)
}

export async function pop(ctx, queueName) {
  return new Promise(resolve => {
    dbs.client.rpop(queueName, (err, data) => {
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
  return pop(queueName)
}

export async function pushLeft(queueName, item, direction = DB_CONSTANTS.LEFT) {
  //console.log(new Date(), { f: 'pushLeft', item, direction })
  return push(queueName, item, direction )
}

export async function pushRight(queueName, item, direction = DB_CONSTANTS.RIGHT){
  //console.log(new Date(), { f: 'pushRight', item, direction })
  return push(queueName, item, direction )
}

export async function hasNext(queueName) {
  //console.log(new Date(), { f: 'hasNext', queueName })
  return new Promise(resolve =>
    dbs.client.lrange(queueName, -1, -1, async (err, data) => {
      resolve( Promise.resolve(true) || Promise.resolve())
      })
    )
  }

export async function range(queueName, start, stop) {
  // console.log(new Date(), { f: 'range', queueName,  start, stop })
  return new Promise(resolve =>
    dbs.client.lrange(queueName, start, stop, (err, data) =>
      resolve(data.filter(item => item.match(/\{"/g)).map(JSON.parse))
    )
  )
}

export async function lastOne(queueName, count = 1) {
  //console.log(new Date(), { f: 'last', queueName })
  return _.get(await range(queueName, 0, count - 1), '[0]')
}


export async function firstOne(queueName, count = 1) {
  //console.log(new Date(), { f: 'first', queueName })
  return _.get((await range(queueName, count * -1, -1)).reverse(), '[0]')
}

export async function length(queueName) {
  //console.log(new Date(), { f: 'length', queueName })
  return new Promise(resolve =>
    dbs.client.llen(queueName, (err, data) =>
      resolve(data)
    )).catch(log)
}

export async function reset(queueName) {
  //console.log(new Date(), { f: 'reset', queueName })
  return new Promise(resolve =>
    dbs.client.del(queueName, 0, -1, (err, data) =>
      resolve(data)
    )).catch(log)
}

export async function last(queueName, count = 1) {
  //console.log(new Date(), { f: 'last', queueName })
  return await range(queueName, 0, count - 1)
}

export async function first(queueName, count = 1) {
  //console.log(new Date(), { f: 'first', queueName })
  return (await range(queueName, count * -1, -1)).reverse()
}

/*
 * Timer Functions
 */
export async function pause(mins = 1) {
  //console.log(new Date(), { f: 'pause', mins })
  return new Promise(resolve => {
    const timeout = setTimeout(() => {
      return resolve(timeout)
    }, 1000 * mins)
  })
}

export async function delay(secs = 1) {
  //console.log(new Date(), { f: 'delay', secs })
  return new Promise(resolve => {
    const timeout = setTimeout(() => {
      return resolve(timeout)
    }, 1000 * secs)
  })
}

export async function clearDelay(timeout) {
  //console.log(new Date(), { f: 'clearDelay', secs })
  Promise.resolve(() => clearTimeout(timeout)) //eslint-disable-line
}
