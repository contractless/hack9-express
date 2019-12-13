const Joi = require('@hapi/joi');
const {calculateCallCost, calculateDuration, isNumberValid} = require('./functions/callCostCalculator');
const {getItemByPrefixAndDate, resetDbEntries, storeCallRecord} = require('./services/callService');
require('dotenv').config();

const fastify = require('fastify')({ logger: false});

fastify.post('/reset', async (req, res) => {
  try{
    await resetDbEntries();
    return res.status(201).send({message: 'Success'});
  } catch (e) {
    return res.status(500).send({message: 'Something went wrong!'});
  }
})

// Get (potential) call price for the given called number, per minute. This will not initiate a call.
fastify.get('/switch/price', async (req, res) => {
  const {number, time} = req.query;

  if(!isNumberValid(number)) return res.status(400).send({message: 'Call number is not in valid format!'})

  const dbData = await getItemByPrefixAndDate(number, time);

  if(!dbData) return res.status(404).send({message: 'Price for the number cannot be calculated!'})

  const pricePerMinute = calculateCallCost(60, dbData.price);

  return res.status(200).send({
      prefix: dbData.prefix,
      price: parseFloat(pricePerMinute),
      from: dbData.start_date,
      initial: parseInt(dbData.initial, 10),
      increment: parseInt(dbData.increment, 10)
    })
})

// Register details of a call that was made and calcualte the cost of the call.
fastify.post('/switch/call', async (req, res) => {
  const schema = Joi.object().keys({
    calling: Joi.number().required(),
    called: Joi.number().required(),
    start: Joi.date().required(),
    duration: Joi.number().required()
  })

  const {error} = await schema.validate(req.body);
  if(error) return res.status(400).send({message: error.message})

  const {calling, called, start, duration} = req.body;
  try{
    const dbData = await getItemByPrefixAndDate(called, start);
    if(!dbData) return res.code(404).send({message: 'Prefix not found!'})
    const roundedDuration = calculateDuration(dbData.initial, duration, dbData.increment)
    const callCost = calculateCallCost(roundedDuration, dbData.price)
    await storeCallRecord(calling, called, start, duration, roundedDuration, dbData.price, callCost);
    return {
      calling,
      called,
      start,
      duration,
      rounded: roundedDuration,
      price: dbData.price,
      cost: callCost
    }
  } catch(e) {
    console.log(e)
    return res.status(500).send({message: 'Something bad happened!'})
  }
  
})

const start = async () => {
  try {
    await fastify.listen(process.env.PORT)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start();

module.exports = {
  fastify,
}
