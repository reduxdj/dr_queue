const supertest = require('supertest')
const {should, assert} = require('chai')
const {app} = require('./server')
const {reset, lastOne, length} = require('../out/redis/db')
/* eslint-disable */
const moment = require('moment')
const Router = require('koa-router')
const {loggerMiddleware} = require('../out/middleware')
const {port, protocol, hostIp} = { port: 8081, protocol: 'http', hostIp: '127.0.0.1'}
const upTime = moment().format('MMMM Do YYYY, h:mm:ss a')
const QUEUE_NAME = 'dev:queue'
const {dbs} = require('../out/redis/db')

should()

async function factorySetup(queueName = QUEUE_NAME) {
  return reset(queueName)
}

const request = supertest.agent(app.listen())
describe('Middleware Test', () => {
  beforeEach(() => factorySetup())
  it('should send trigger a middleware log event', (done) => {
    request
      .get(`/api/ping`)
      .set('Authorization', 'Bearer Go')
      .set('Accept', 'application/json')
      .expect(200, async (err, res) => {
        assert.strictEqual(await length(QUEUE_NAME), 1)
        done()
      })
    })
  it('should have log level of info', (done) => {
    request
      .get(`/api/ping`)
      .set('Authorization', 'Bearer Go')
      .set('Accept', 'application/json')
      .expect(200, async (err, res) => {
        assert.strictEqual((await lastOne(QUEUE_NAME)).level, 'info')
        done()
      })
    })
    it('should format an error log since a route doesnt exist', (done) => {
      request
        .post(`/api/pong`)
        .set('Authorization', 'Bearer Go')
        .set('Accept', 'application/json')
        .send({ username: 'Pokemon'})
        .expect(200, async (err, res) => {
          assert.strictEqual((await lastOne(QUEUE_NAME)).level, 'error')
          done()
        })
      })
      it('should have filterd a password out of the logging payload', (done) => {
        request
          .post(`/api/pong`)
          .set('Authorization', 'Bearer Go')
          .set('Accept', 'application/json')
          .send({ username: 'Pokemon', password: 'test'})
          .expect(200, async (err, res) => {
            assert.strictEqual(await lastOne(QUEUE_NAME).password, undefined)
            done()
          })
        })
})
