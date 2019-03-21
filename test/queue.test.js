import supertest from 'supertest'
import { should } from 'chai'
import app from '../src/server'

/* eslint-disable */
const request = supertest.agent(app.listen())
const QUEUE_NAME = 'test'


should()

describe('E2E Tests for Queue', () => {
  it('should return 4 items from the queue', (done) => {
    request
      .get(`/api/queue/${QUEUE_NAME}/last/4`)
      .expect(200, (err, res) => {
        res.body.items.length.should.equal(4)
        done()
      })
    })

    it('should push and item to the right of the the queue', (done) => {
      request
        .post(`/api/queue/push/${QUEUE_NAME}`)
        .set('Accept', 'application/json')
        .send({
          name: 'Dr. Queue',
          beverage: 'Dr. Pepper'
        })
        .expect(200, (err, res) => {
          _id = res.body._id
          done()
        })
    })
    it('should push and item to the left of the the queue', (done) => {
      request
        .post(`/api/queue/push_left/${QUEUE_NAME}`)
        .set('Accept', 'application/json')
        .send({
          name: 'Dr. Queue',
          beverage: 'Dr. Pepper'
        })
        .expect(200, (err, res) => {
          _id = res.body._id
          done()
        })
    })
})
