// const supertest = require('supertest')
// const {should} = require('chai')
// const {app} = require('../out/server')
// /* eslint-disable */
// const request = supertest.agent(app.listen())
// const channel = 'app:test'
// const SUBSCRIBER = `CHANNEL=${channel} npm run subscriber`
// const QUEUE_NAME = 'users:123'
// const COUNT = 2
//
// const opts = {
//   stdio: 'inherit',
//   shell: true
// }
//
// should()
//
// const getOrderInfo = () => ({
//   orderId : '123',
//   orderStatus: 'SHIPPED'
// })
//
// describe('E2E Tests for workers', () => {
//   beforeEach(() => factorySetup())
//
//   it('should receive a redis channel message that a new order was shipped', (done) => {
//     request
//       .post(`/api/publisher/${channel}:${QUEUE_NAME}`)
//       .set('Authorization', 'Bearer Go')
//       .set('Accept', 'application/json')
//       .send({
//         orderId : '123',
//         orderStatus: 'SHIPPED'
//       }).expect(200, (err, res) => {
//         done()
//       })
//     })
// })
