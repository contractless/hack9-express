const chai = require('chai');
const expect = require('chai').expect;
chai.use(require('chai-json-schema'));

const { fastify } = require('../../server')


describe('Verify endpoints', () => {

  const schema40X = {
    title: 'priceSchema400',
    type: 'object',
    required: ['message'],
    properties: {
      messages: {
        type: 'string',
      }
    }
  };

  const acceptedCallSchema = {
    title: 'acceptedCallSchema',
    type: 'object',
    required: ['calling', 'called', 'start','duration', 'rounded', 'price', 'cost'],
    properties: {
      calling: {
        type: 'string',
      },
      called: {
        type: 'string'
      },
      start: {
        type: 'string',
      },
      duration: {
        type: 'integer',
      },
      rounded: {
        type: 'integer',
      },
      price: {
        type: 'number',
      },
      cost: {
        type: 'number',
      }
    }
  };
  before(async () => {
    await (new Promise(resolve => setTimeout(resolve, 1000)))
  })

  after(() => {
    fastify.close()
  })

  describe('/switch/price', () => {

    it('Returns a potential call price for the given number', async () => {
      const priceSchema = {
        title: 'priceSchema',
        type: 'object',
        required: ['prefix', 'price', 'from','initial', 'increment'],
        properties: {
          prefix: {
            type: 'string',
          },
          price: {
            type: 'number'
          },
          from: {
            type: 'string',
          },
          initial: {
            type: 'number',
          },
          increment: {
            type: 'number', 
          }
        }
      };
      const number = '44'
      const time = '2019-04-03T12:34:56.00Z'
      const res = await fastify.inject({
        method: 'GET',
        url: `/switch/price?number=${number}&time=${time}`,
      });
      const body = JSON.parse(res.payload);
      expect(res.statusCode).to.equal(200);
      expect(body).to.be.jsonSchema(priceSchema);
    });

    it('Returns 400 if number is not in valid format', async () => {

      const number = '00';
      const time = '2019-04-03T12:34:56.00Z';
      const res = await fastify.inject({
        method: 'GET',
        url: `/switch/price?number=${number}&time=${time}`,
      });
      const body = JSON.parse(res.payload);
      expect(res.statusCode).to.equal(400);
      expect(body).to.be.jsonSchema(schema40X);
    });


    it('Returns 404 if number does not exist in DB', async () => {

      const number = 999999999;
      const time = '2019-04-03T12:34:56.00Z';
      const res = await fastify.inject({
        method: 'GET',
        url: `/switch/price?number=${number}&time=${time}`,
      });
      const body = JSON.parse(res.payload);
      expect(res.statusCode).to.equal(404);
      expect(body).to.be.jsonSchema(schema40X);
    });

  });

  //TODO validate response output
  describe('/switch/call', () => {
  
    const calling = "381211234567";
    const called = "38164111222333";
    const start = "2019-05-23T21:03:33.30Z";
    const duration = "450";
    const invalidDuration = 'duration string';

    it('Returns call cost', async () => {
      const res = await fastify.inject({
        method: 'POST',
        url: `/switch/call`,
        payload:{
          "calling": `${calling}`,
          "called": `${called}`,
          "start": `${start}`,
          "duration": `${duration}`
        },
      });
      const body = JSON.parse(res.payload);
      expect(body).to.be.jsonSchema(acceptedCallSchema);
      expect(res.statusCode).to.equal(200);
    });

    it('Return 400 if input is incorrect', async () => {
      const res = await fastify.inject({
        method: 'POST',
        url: `/switch/call`,
        payload:{
          "calling": `${calling}`,
          "called": `${called}`,
          "start": `${start}`,
          "duration": `${invalidDuration}`
        },
      });
      const body = JSON.parse(res.payload);
      expect(body).to.be.jsonSchema(schema40X);
      expect(res.statusCode).to.equal(400);
    });

  });

})

