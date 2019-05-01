import chalk from 'chalk'


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

export function rolesRequiredMiddleware(credentials = {}) {
  const {token} = credentials
  return async (ctx, next, ...args) => {
    try {
      const userToken = getToken(ctx)
      if (!userToken)
        ctx.throw(401)
      if (token && userToken !== token) {
        ctx.user = { token }
        ctx.throw(403, 'You are not Authorized')
      }
      return next()
    } catch (err) {
      ctx.throw(403, 'You are not Authorized')
    }
  }
}

export function loggerMiddleware(Logger) {
  const errorIgnoreLevels = Logger.getInoreLevels()
  return async (ctx, next, ...args) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    const bypassError = !!(errorIgnoreLevels.find((status) => ctx.status === status))
    const hasError = ctx.status >= 400 && !bypassError
    const message = `${ctx.request.origin} ${chalk['magentaBright'](ctx.method)} ${chalk['blueBright'](ctx.status)} ${chalk['yellowBright'](ctx.request.url)}`
    const payload = { url: ctx.request.url, ip: ctx.request.ip, query: {...ctx.query}, body: {...ctx.request.body}, userAgent: ctx.request.header['user-agent'], ms}
    if (hasError)
      Logger.error(message, payload)
    else
      Logger.log(message, payload)
  }
}
