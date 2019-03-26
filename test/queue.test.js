const supertest = require('supertest')
const {should, assert} = require('chai')
const {app, start} = require('../out/server')
const {reset, push} = require('../out/redis/db')
/* eslint-disable */
const request = supertest.agent(app.listen())

const QUEUE_NAME = 'test'
const COUNT = 9

should()

const getDrink = (i = 0) => ['Dr Pepper',
  'Coke',
  'Mr Pibb',
  'Fanta',
  'Kambucha',
  'Orange Juice',
  'Apple Juice',
  'Kool-Aid',
  'Water',
  'Chocolate Milk',
  'Hawaiian Punch',
  'Milk'][i]

const getItems = (n) => new Array(n).fill(6).map((item, index) => ({index, beverage: getDrink(index) }))

const items = getItems(10)
async function factorySetup(queueName = QUEUE_NAME) {
  await start
  await reset(queueName)
  await Promise.all(items.map((item) => push(QUEUE_NAME, item)))
}

describe('E2E Tests for Dr Queue', () => {
  beforeEach(() => factorySetup())

  it('should start off 10 items in the queue', (done) => {
    request
      .set('Authorization', 'Bearer Go')
      .set('Accept', 'application/json')
      .get(`/api/queue/${QUEUE_NAME}/length`)
      .expect(200, (err, res) => {
        console.log(res.body)
        res.body.data.should.equal(10)
        done()
      })
    })

  it('should return the last 10 items from the queue', (done) => {
    request
      .set('Authorization', 'Bearer Go')
      .set('Accept', 'application/json')
      .get(`/api/queue/${QUEUE_NAME}/last/10`)
      .expect(200, (err, res) => {
        res.body.data.length.should.equal(10)
        done()
      })
    })
    it('The last item should be Milk', (done) => {
      request
        .set('Authorization', 'Bearer Go')
        .set('Accept', 'application/json')
        .get(`/api/queue/${QUEUE_NAME}/last/10`)
        .expect(200, (err, res) => {
          console.log(res.body.data)
          res.body.data[9].beverage.should.equal('Chocolate Milk')
          done()
        })
      })

  it('should push an item to the end (right side) of the the queue', (done) => {
    const timestamp = new Date().toISOString()
    request
      .post(`/api/queue/${QUEUE_NAME}/push`)
      .set('Authorization', 'Bearer Go')
      .set('Accept', 'application/json')
      .send({
        beverage: 'Barqs',
        timestamp
      }).expect(200, (err, res) => {
        request.post(`/api/queue/${QUEUE_NAME}/pop_right`)
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer Go')
          .expect(200, (err, res) => {
            res.body.data.beverage.should.equal('Barqs')
            done()
          })
      })
    })
    it('should push an item to the front (to the left side) of the the queue', (done) => {
      const timestamp = new Date().toISOString()
      request
        .post(`/api/queue/${QUEUE_NAME}/push_right`)
        .set('Authorization', 'Bearer Go')
        .set('Accept', 'application/json')
        .send({
          beverage: 'Squirt',
          timestamp
        }).expect(200, (err, res) => {
          request.post(`/api/queue/${QUEUE_NAME}/pop`)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer Go')
            .expect(200, (err, res) => {
              assert.strictEqual(res.body.data.timestamp, timestamp)
              done()
            })
        })
      })
      it('should return the last element from the right', (done) => {
        const timestamp = new Date().toISOString()
        request
          .post(`/api/queue/${QUEUE_NAME}/push`)
          .set('Authorization', 'Bearer Go')
          .set('Accept', 'application/json')
          .send({
            beverage: 'Orange Crush',
            timestamp
          }).expect(200, (err, res) => {
            request.get(`/api/queue/${QUEUE_NAME}/last`)
              .set('Accept', 'application/json')
              .set('Authorization', 'Bearer Go')
              .expect(200, (err, res) => {
                console.log(res.body.data)
                assert.strictEqual(res.body.data[0].beverage, 'Orange Crush')
                done()
              })
        })
      })
      it('should select a range of items indices, 3, 6, sorted from the left as default', (done) => {
          request.get(`/api/queue/${QUEUE_NAME}/range/3/6`)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer Go')

            .expect(200, (err, res) => {
              console.log(res.body.data)
              res.body.data[0].index.should.equal(3)
              done()
            })
      })
})
