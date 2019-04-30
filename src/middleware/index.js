import config from 'config'


export function getToken({ request: { header }, query: { token }} ) {
  if (header && header.authorization) {
    const parts = header.authorization.split(' ')
    if (parts.length === 2 && parts[0] === 'Bearer')
      return parts[1]
    return header.authorization
  }
  return token
}

// example roles logic
// const roles = ['admin', 'api'] //this should be coming from a user API - just for example
// const foundRole = args.some(arg => roles.find(role => role === arg))
// foundRole ? next() : ctx.throw(403, 'You are not Authorized')

export default async function rolesRequiredMiddleware(ctx, next, ...args) {
  try {
    const {token} = config.get('credentials')
    const userToken = getToken(ctx)
    if (!userToken)
      ctx.throw(401)
    if (userToken !== token) {
      ctx.user = { token }
      ctx.throw(403, 'You are not Authorized')
    }
    return next()
  } catch (err) {
    //Logger.error(err)
    ctx.throw(403, 'You are not Authorized')
  }
  return undefined
}

export function loggerMiddleware(Logger) {
  const errorIgnoreLevels = Logger.getInoreLevels()
  return async (ctx, next, ...args) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    const bypassError = !!(errorIgnoreLevels.find((status) => ctx.status === status))
    const hasError = ctx.status >= 400 && !bypassError
    if (hasError)
      Logger.error(`${ctx.request.origin} ${ctx.method} ${ctx.status} ${ctx.request.path} `, {...ctx.request.body, ms: ms})
    else
      Logger.log(`${ctx.request.origin} ${ctx.method} ${ctx.status} ${ctx.request.path} `, {...ctx.request.body, ms: ms})
  }
}
