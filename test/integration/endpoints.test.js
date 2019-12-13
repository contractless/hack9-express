const expect = require('chai').expect

const { fastify } = require('../../server')

describe('Verify calculation functions', () => {
  before(async () => {
    await (new Promise(resolve => setTimeout(resolve, 1000)))
  })

  after(() => {
    fastify.close()
  })

  describe('/switch/price', () => {

    it('Returns a potential call price for the given number', async () => {
      const number = '44'
      const time = '2019-04-03T12:34:56.00Z'
      const res = await fastify.inject({
        method: 'GET',
        url: `/switch/price?number=${number}&time=${time}`,
      })
      expect(res.statusCode).to.equal(200)

      const body = JSON.parse(res.payload)
      console.log(body);
    })

  })
})

