const prod = false;
const {calculateCallCost,calculateDuration} = require('./functions/callCostCalculator');

const fastify = require('fastify')({ logger: !prod})

fastify.post('/reset', async (req, res) => {
  return {reset: true}
})

fastify.get('/switch/price', async (req, res) => {
  const reportedDuration = 123;
  const dbData = {
    prefix: '381 21',
    from: '2019-01-01T00:00:00.00Z',
    initial: 10,
    increment: 1,
    pricePerMinute: 60
  }

  const duration = calculateDuration(dbData.initial, reportedDuration, dbData.increment);
  const price = calculateCallCost(duration, dbData.pricePerMinute);

  return {body: {
    'prefix': dbData.prefix,
    price,
    'from': dbData.from,
    'initial': dbData.initial,
    'increment': dbData.increment
  }}

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
