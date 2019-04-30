import Router from 'koa-router'
import {upTime} from '../server'

const api = 'ping'
const router = new Router()

router.prefix(`/api/${api}`)

router.get('/', async (ctx) => {
  ctx.body = { ok: true, data: { started: upTime }}
})

router.post('/', async (ctx) => {
  ctx.body = { ok: true, data: { started: upTime, ...ctx.request.body }}
})
export default router
