import Router from 'koa-router'
import {
  push,
  first,
  last,
  length,
  popLeft,
  popRight,
  pushRight,
  pushLeft,
  hasNext,
  reset,
  range,
  pop,
} from '../redis/db'
import {Logger} from '../server'
import rolesRequired from '../middleware'

const api = 'queue'
const router = new Router()

router.prefix(`/api/${api}`)

router.post('/:queueName/reset',
(ctx, next) => rolesRequired(ctx, next, 'admin', 'api'), async (ctx) => {
  try {
    ctx.body = {
      ok: true,
      data: await reset(ctx.params.queueName)
    }
  } catch (err) {
    Logger.error(err)
    ctx.throw(422)
  }
})

router.get('/:queueName/length',
(ctx, next) => rolesRequired(ctx, next, 'admin', 'api'), async (ctx) => {
  try {
    ctx.body = { ok: true,
      data: await length(ctx.params.queueName)
    }
  } catch (err) {
    Logger.error(err)
    ctx.throw(422)
  }
})

router.post('/:queueName/pop',
(ctx, next) => rolesRequired(ctx, next, 'admin', 'api'), async (ctx) => {
  try {
    ctx.body = {
      ok: true,
      data: await pop(ctx.params.queueName)
    }
  } catch (err) {
    Logger.error(err)
    ctx.throw(422)
  }
})

router.post('/:queueName/pop_left',
(ctx, next) => rolesRequired(ctx, next, 'admin', 'api'), async (ctx) => {
  try {
    ctx.body = {
      ok: true,
      data: await popLeft(ctx.params.queueName)
    }
  } catch (err) {
    Logger.error(err)
    ctx.throw(422)
  }
})

router.post('/:queueName/pop_right',
(ctx, next) => rolesRequired(ctx, next, 'admin', 'api'), async (ctx) => {
  try {
    ctx.body = {
      ok: true,
      data: await popRight(ctx.params.queueName)
    }
  } catch (err) {
    Logger.error(err)
    ctx.throw(422)
  }
})

router.get('/:queueName/last',
(ctx, next) => rolesRequired(ctx, next, 'admin', 'api'), async (ctx) => {
  try {
    ctx.body = { ok: true,
      data: await hasNext(ctx.params.queueName)
      ? await last(ctx.params.queueName)
      : Promise.resolve({})
    }
  } catch (err) {
    Logger.error(err)
    ctx.throw(422)
  }
})

router.get('/:queueName/first',
(ctx, next) => rolesRequired(ctx, next, 'admin', 'api'), async (ctx) => {
  try {
    ctx.body = { ok: true,
      data: await hasNext(ctx.params.queueName)
      ? await first(ctx.params.queueName)
      : Promise.resolve({})
    }
  } catch (err) {
    Logger.error(err)
    ctx.throw(422)
  }
})

router.get('/:queueName/first/:count',
(ctx, next) => rolesRequired(ctx, next, 'admin', 'api'), async (ctx) => {
  try {
    ctx.body = { ok: true,
      data: await hasNext(ctx.params.queueName)
        ? await first(ctx.params.queueName, ctx.params.count)
        : Promise.resolve({})
    }
  } catch (err) {
    Logger.error(err)
    ctx.throw(422)
  }
})

router.get('/:queueName/last/:count',
(ctx, next) => rolesRequired(ctx, next, 'admin', 'api'), async (ctx) => {
  try {
    ctx.body = { ok: true,
      data: await hasNext(ctx.params.queueName)
      ? await last(ctx.params.queueName, ctx.params.count)
      : Promise.resolve({})
    }
  } catch (err) {
    Logger.error(err)
    ctx.throw(422)
  }
})

router.post('/:queueName/push',
(ctx, next) => rolesRequired(ctx, next, 'admin', 'api'), async (ctx) => {
  try {
    ctx.body = { ok: true,
      data: await push(ctx.params.queueName, ctx.request.body)
    }
  } catch (err) {
    Logger.error(err)
    ctx.throw(422)
  }
})

router.post('/:queueName/push_left',
(ctx, next) => rolesRequired(ctx, next, 'admin', 'api'), async (ctx) => {
  try {
    ctx.body = { ok: true,
      data: await pushLeft(ctx.params.queueName, ctx.request.body)
    }
  } catch (err) {
    Logger.error(err)
    ctx.throw(422)
  }
})

router.post('/:queueName/push_right',
(ctx, next) => rolesRequired(ctx, next, 'admin', 'api'), async (ctx) => {
  try {
    ctx.body = { ok: true,
      data: await pushRight(ctx.params.queueName, ctx.request.body)
    }
  } catch (err) {
    Logger.error(err)
    ctx.throw(422)
  }
})


router.get('/:queueName/range/:start/:stop',
(ctx, next) => rolesRequired(ctx, next, 'admin', 'api'), async (ctx) => {
  try {
    ctx.body = { ok: true,
      data: await range(ctx.params.queueName, ctx.params.start, ctx.params.stop)
    }
  } catch (err) {
    Logger.error(err)
    ctx.throw(422)
  }
})


router.get('/:queueName',
(ctx, next) => rolesRequired(ctx, next, 'admin', 'api'), async (ctx) => {
  try {
    ctx.body = {
      ok: true,
      data: await range(ctx.params.queueName, await length(ctx.params.queueName))
    }
  } catch (err) {
    Logger.error(err)
    ctx.throw(422)
  }
})

export default router
