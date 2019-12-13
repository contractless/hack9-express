const {calculateCallCost, calculateDuration} = require('./functions/callCostCalculator');
const {getItemByPrefixAndDate, resetDbEntries} = require('./services/callService')
const prod = false;

const fastify = require('fastify')({ logger: !prod})

fastify.post('/reset', async (req, res) => {
  return await resetDbEntries();
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

// Register details of a call that was made and calcualte the cost of the call.
fastify.post('/switch/call', async (req, res) => {
  const {calling, called, start, duration} = req.body;
  const dbData = await getItemByPrefixAndDate(called, start);
  const roundedDuration = calculateDuration(dbData.initial, duration, dbData.increment)
  const callCost = calculateCallCost(roundedDuration, dbData.price)
  
  return {
    calling,
    called,
    start,
    duration,
    rounded: roundedDuration,
    price: dbData.price,
    cost: callCost
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
