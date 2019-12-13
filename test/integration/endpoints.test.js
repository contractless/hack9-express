const chai = require('chai');
const expect = require('chai').expect;
chai.use(require('chai-json-schema'));

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
      var priceSchema = {
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
            type: 'string', //TODO should be number
          },
          increment: {
            type: 'string', //TODO should be number
          }
        }
      };
      const number = '44'
      const time = '2019-04-03T12:34:56.00Z'
      const res = await fastify.inject({
        method: 'GET',
        url: `/switch/price?number=${number}&time=${time}`,
      });
      expect(res.statusCode).to.equal(200);
      const body = JSON.parse(res.payload);
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
    });


    it('Returns 404 if number does not exist in DB', async () => {
      const number = 999999999;
      const time = '2019-04-03T12:34:56.00Z';
      const res = await fastify.inject({
        method: 'GET',
        url: `/switch/price?number=${number}&time=${time}`,
      });
      expect(res.statusCode).to.equal(404);
    });

  });

  //TODO
  xdescribe('/switch/call', () => {
    it('Returns call cost', async () => {
    
    })

  });


  xdescribe('/switch/call', () => {
    it('Returns call cost', async () => {
    
    })

  });

  xdescribe('/listing/{calling}', () => {
    it('Returns call cost', async () => {
    
    })
  });

  xdescribe('/financial/invoice', () => {
    it('Returns call cost', async () => {
    
    })
  });


  xdescribe('/financial/invoice/{id}', () => {
    it('Returns call cost', async () => {
    
    })
  });


  xdescribe('/financial/report/{calling}', () => {
    it('Returns call cost', async () => {
    
    })
  });

})

