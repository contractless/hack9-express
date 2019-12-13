const prod = false;

const fastify = require('fastify')({ logger: !prod})

fastify.post('/reset', async (req, res) => {
  return {reset: true}
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
