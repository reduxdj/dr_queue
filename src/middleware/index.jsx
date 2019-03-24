import config from 'config'
import {Logger} from '../server'

const {token} = config.get('credentials')

function getToken({ request: { header }, query: { token }} ) {
  if (header && header.authorization) {
    const parts = header.authorization.split(' ')
    if (parts.length === 2 && parts[0] === 'Bearer')
      return parts[1]
    return header.authorization
  }
  return token
}

export default async function rolesRequired(ctx, next, ...args) {
  try {
    const userToken = getToken(ctx)
    if (!userToken)
      ctx.throw(401)
    if (userToken !== token) {
      ctx.user = { token }
      ctx.throw(403, 'You are not Authorized')
    }
    // example roles logic
    // const roles = ['admin', 'api'] //this should be coming from a user API - just for example
    // const foundRole = args.some(arg => roles.find(role => role === arg))
    // foundRole ? next() : ctx.throw(403, 'You are not Authorized')
    return next()
  } catch (err) {
    Logger.error(err)
    ctx.throw(403, 'You are not Authorized')
  }
  return undefined
}
