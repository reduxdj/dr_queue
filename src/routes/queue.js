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
  sRange,
  pop,
} from '../redis/db'
import {logger} from '../server'

const api = 'queue'
const router = new Router()

router.prefix(`/api/${api}`)

router.post('/:queueName/reset', async (ctx) => {
  try {
    ctx.body = {
      ok: true,
      data: await reset(ctx.params.queueName)
    }
  } catch (err) {
    logger.error(err)
    ctx.throw(422)
  }
})

router.get('/:queueName/length', async (ctx) => {
  try {
    ctx.body = { ok: true,
      data: await length(ctx.params.queueName)
    }
  } catch (err) {
    logger.error(err)
    ctx.throw(422)
  }
})

router.post('/:queueName/pop', async (ctx) => {
  try {
    ctx.body = {
      ok: true,
      data: await pop(ctx.params.queueName)
    }
  } catch (err) {
    logger.error(err)
    ctx.throw(422)
  }
})

router.post('/:queueName/pop_left',
(ctx, next) => async (ctx) => {
  try {
    ctx.body = {
      ok: true,
      data: await popLeft(ctx.params.queueName)
    }
  } catch (err) {
    logger.error(err)
    ctx.throw(422)
  }
})

router.post('/:queueName/pop_right', async (ctx) => {
  try {
    ctx.body = {
      ok: true,
      data: await popRight(ctx.params.queueName)
    }
  } catch (err) {
    logger.error(err)
    ctx.throw(422)
  }
})

router.get('/:queueName/last', async (ctx) => {
  try {
    ctx.body = { ok: true,
      data: await hasNext(ctx.params.queueName)
      ? await last(ctx.params.queueName)
      : Promise.resolve({})
    }
  } catch (err) {
    logger.error(err)
    ctx.throw(422)
  }
})

router.get('/:queueName/first',
(ctx, next) => async (ctx) => {
  try {
    ctx.body = { ok: true,
      data: await hasNext(ctx.params.queueName)
      ? await first(ctx.params.queueName)
      : Promise.resolve({})
    }
  } catch (err) {
    logger.error(err)
    ctx.throw(422)
  }
})

router.get('/:queueName/first/:count',
(ctx, next) => async (ctx) => {
  try {
    ctx.body = { ok: true,
      data: await hasNext(ctx.params.queueName)
        ? await first(ctx.params.queueName, ctx.params.count)
        : Promise.resolve({})
    }
  } catch (err) {
    logger.error(err)
    ctx.throw(422)
  }
})

router.get('/:queueName/last/:count', async (ctx) => {
  try {
    ctx.body = { ok: true,
      data: await hasNext(ctx.params.queueName)
      ? await last(ctx.params.queueName, ctx.params.count)
      : Promise.resolve({})
    }
  } catch (err) {
    logger.error(err)
    ctx.throw(422)
  }
})

router.post('/:queueName/push', async (ctx) => {
  try {
    ctx.body = { ok: true,
      data: await push(ctx.params.queueName, ctx.request.body)
    }
  } catch (err) {
    logger.error(err)
    ctx.throw(422)
  }
})

router.post('/:queueName/push_left', async (ctx) => {
  try {
    ctx.body = { ok: true,
      data: await pushLeft(ctx.params.queueName, ctx.request.body)
    }
  } catch (err) {
    logger.error(err)
    ctx.throw(422)
  }
})

router.post('/:queueName/push_right', async (ctx) => {
  try {
    ctx.body = { ok: true,
      data: await pushRight(ctx.params.queueName, ctx.request.body)
    }
  } catch (err) {
    logger.error(err)
    ctx.throw(422)
  }
})


router.get('/:queueName/range/:start/:stop', async (ctx) => {
  try {
    ctx.body = { ok: true,
      data: await sRange(ctx.params.queueName, ctx.params.start, ctx.params.stop)
    }
  } catch (err) {
    logger.error(err)
    ctx.throw(422)
  }
})


router.get('/:queueName', async (ctx) => {
  try {
    ctx.body = {
      ok: true,
      data: await range(ctx.params.queueName, await length(ctx.params.queueName))
    }
  } catch (err) {
    logger.error(err)
    ctx.throw(422)
  }
})

export default router
