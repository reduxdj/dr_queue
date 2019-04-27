const supertest = require('supertest')
const {should, assert} = require('chai')
const app = require('./test_server')
const {reset, lastOne, length} = require('../out/redis/db')

/* eslint-disable */
const {getLogger} = require('../out/logger')
const {loggerMiddleware} = require('../out/middleware')
const QUEUE_NAME = 'dev:queue'

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
  it('should add the username pokemon to the data', (done) => {
    request
      .post(`/api/ping`)
      .set('Authorization', 'Bearer Go')
      .set('Accept', 'application/json')
      .send({ username: 'Pokemon'})
      .expect(200, async (err, res) => {
        console.log(await lastOne(QUEUE_NAME))
        assert.strictEqual((await lastOne(QUEUE_NAME)).metadata.username, 'Pokemon')
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
})
