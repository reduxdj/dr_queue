import Logger from '../Logger'

export default async function (ctx, next, ...args) {
  Logger.log(`${ctx.method} ${ctx.path}`,
    {path: ctx.request.path, requestIp: ctx.request.ip, method: ctx.method, ...(ctx.request.body && { body: ctx.request.body, timestamp: new Date().toISOString()}) })
  return next()
}
