/* global describe beforeEach it */

const {expect} = require('chai')
const request = require('supertest')
const db = require('../db')
const app = require('../index')
const User = db.model('user')

describe('User routes', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })

  describe('/api/users/', () => {
    const codysName = 'cody'
    const codysAddress = '123 street'
    const codysEmail = 'cody@puppybook.com'
    const userId = 1

    beforeEach(() => {
      return User.create({
        id: userId,
        name: codysName,
        email: codysEmail,
        shippingAddress: codysAddress,
        admin: true
      })
    })

    it('GET /api/users', async () => {
      const res = await request(app)
        .get('/api/users')
        .expect(200)

      expect(res.body).to.be.an('array')
      expect(res.body[0].email).to.be.equal(codysEmail)
    })

    it('GET /api/users/:userId', async () => {
      const res = await request(app)
        .get('/api/users/1')
        .expect(200)
      expect(res.body.id).to.equal(userId)
    })
  }) // end describe('/api/users')
}) // end describe('User routes')
