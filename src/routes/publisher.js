import Router from 'koa-router'
import {
  publish
} from '../redis/db'
import rolesRequired from '../middleware'

const api = 'publisher'
const router = new Router()

router.prefix(`/api/${api}`)

router.post('/:channel',
(ctx, next) => rolesRequired(ctx, next, 'admin', 'api'), async (ctx) => {
  try {
  const paths = (ctx.params.channel || '').split(':')
  const [env, appName, resourceName, resourceKey, ...extraPaths] = paths
  if (!appName)
    throw('Error', 'Channel Name is undefined')
  const channelName = `${env}:${appName}`
    ctx.body = { ok: true,
      data: await publish(channelName,
        { env, appName, resourceName, ts: new Date(), resourceKey, ...extraPaths, ...ctx.request.body })
    }
  } catch (err) {
    ctx.throw(422)
  }
})

export default router
