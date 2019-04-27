const supertest = require('supertest')
const {should} = require('chai')
const {app} = require('./server')
/* eslint-disable */
const request = supertest.agent(app.listen())
const channel = 'app:test'
const QUEUE_NAME = 'users:123'

const opts = {
  stdio: 'inherit',
  shell: true
}

should()

const getOrderInfo = () => ({
  orderId : '123',
  orderStatus: 'SHIPPED'
})

describe('Publisher Test', () => {
  it('should send a publish event', (done) => {
    request
      .post(`/api/publisher/${channel}:${QUEUE_NAME}`)
      .set('Authorization', 'Bearer Go')
      .set('Accept', 'application/json')
      .send({
        orderId : '123',
        orderStatus: 'SHIPPED'
      }).expect(200, (err, res) => {
        done()
      })
    })
})
