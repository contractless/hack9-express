const {calculateCallCost} = require('./functions/callCostCalculator');
const {getItemByPrefixAndDate} = require('./services/callService')
const prod = false;

const fastify = require('fastify')({ logger: !prod})

fastify.post('/reset', async (req, res) => {
  return {reset: true}
})

// Get (potential) call price for the given called number, per minute. This will not initiate a call.
fastify.get('/switch/price', async (req, res) => {
  const {number, time} = req.query;

  const dbData = await getItemByPrefixAndDate(number, time);

  const pricePerMinute = calculateCallCost(60, dbData.price);

  return {
      prefix: dbData.prefix,
      price: pricePerMinute,
      from: dbData.start_date,
      initial: dbData.initial,
      increment: dbData.increment
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

module.exports = {
  fastify,
}
