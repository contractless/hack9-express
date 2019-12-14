const Joi = require('@hapi/joi');
const axios = require('axios');

const {calculateCallCost, calculateDuration, isNumberValid} = require('./functions/callCostCalculator');
const {getItemByPrefixAndDate, resetDbEntries, storeCallRecord, getListingCalling, generateInvoice, getInvoices, getInvoiceById, getReports } = require('./services/callService');
require('dotenv').config();

const fastify = require('fastify')({ logger: true});

fastify.get('/', async (_, res) => res.status(200).send({ message: 'Hello world!' }))

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
  const {number} = req.query;
  let { time } = req.query;

  time = time || new Date().toISOString();

  if(!isNumberValid(number)) return res.status(400).send({message: 'Call number is not in valid format!'})
  const dbData = await getItemByPrefixAndDate(number, time);

  if(!dbData) return res.status(404).send({message: 'Price for the number cannot be calculated!'});

  const pricePerMinute = calculateCallCost(60, dbData.price);

  return res.status(200).send({
      prefix: dbData.prefix,
      price: parseFloat(pricePerMinute),
      from: dbData.start_date,
      initial: parseInt(dbData.initial, 10),
      increment: parseInt(dbData.increment, 10)
    })
});

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
    const roundedDuration = calculateDuration(+dbData.initial, +duration, +dbData.increment)
    const callCost = calculateCallCost(roundedDuration, dbData.price)
    await storeCallRecord(calling, called, start, duration, roundedDuration, dbData.price, callCost);
    return {
      calling,
      called,
      start,
      duration: parseInt(duration, 10),
      rounded: +roundedDuration,
      price: +dbData.price,
      cost: +callCost.toFixed(2)
    }
  } catch(e) {
    console.log(e)
    return res.status(500).send({message: 'Something bad happened!'})
  }
  
});

fastify.get('/listing/:calling', async (req, res) => {
  const { calling } = req.params;
  const {from, to} = req.query;
  
  const callHistory = await getListingCalling(calling, from, to);
  
  return res.status(200).send(callHistory);
});

fastify.post('/financial/invoice', async (req, res) => {
  const schema = Joi.object().keys({
    start: Joi.date().required(),
    end: Joi.date().required(),
    callback: Joi.string().required()
  })

  const {error} = await schema.validate(req.body);

  if (error) return res.status(400).send({ message: error.message });

  const { start, end, callback } = req.body;

  try {
    const promiseArray = generateInvoice(start, end, callback);
    res.status(202).send();
    await promiseArray[1];    
    const invoices = await getInvoices(start, end);
    await axios.post(callback, invoices);
    return true;    
  } catch (error) {
    console.log('ERROR WHILE GENERATING INVOICE', error);
    res.status(500).send();
  }
  
})

fastify.get('/financial/invoice/:id', async (req, res) => {
  const { id } = req.params;

  const invoice = await getInvoiceById(id);
  
  return res.status(200).send(invoice);

});

fastify.get('/financial/report/:calling', async (req, res) => {
  const { calling } = req.params;

  const reports = await getReports(calling);

  console.log('FC', +reports[0].full_costs);
  console.log('MAP', reports.map(report => report.sum).reduce((acc, cur) => {console.log('acc', acc); return +acc + cur}));

  const remaining = +reports[0].full_costs - reports.map(report => report.sum).reduce((acc, cur) => parseFloat(acc) + parseFloat(cur));

  const invoices = reports.map(report => {
    return {
    id: report.id,
    sum: report.sum
  }});
  
  return res.status(200).send({
    calling,
    invoices,
    remaining
  });

});



const start = async () => {
  try {
    await fastify.listen(process.env.PORT, '0.0.0.0')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start();

module.exports = {
  fastify,
}
