const {calculateCallCost} = require('./functions/callCostCalculator');
const prod = false;

const fastify = require('fastify')({ logger: !prod})

fastify.post('/reset', async (req, res) => {
  return {reset: true}
})

// Get (potential) call price for the given called number, per minute. This will not initiate a call.
fastify.get('/switch/price', async (req, res) => {
  const {number, time} = req.query;

  const dbData = {
    prefix: '381 21',
    from: '2019-01-01T00:00:00.00Z',
    initial: 10,
    increment: 1,
    pricePerMinute: 60
  }

  const pricePerMinute = calculateCallCost(60, dbData.pricePerMinute);

  return {
    body: {
      prefix: dbData.prefix,
      price: pricePerMinute,
      from: dbData.from,
      initial: dbData.initial,
      increment: dbData.increment
    }
  }
})

const start = async () => {
  try {
    await fastify.listen(3000)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
