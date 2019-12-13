const fs  = require('fs')

const csv = require('csv-parser')

const records = []

fs.createReadStream('../callingCodes.csv')
  .pipe(csv())
  .on('data', row => records.push(row))
  .on('end', () => console.log('[SUCCESS] CSV Parsing done!'))

function getItemByPrefix(prefix) {
  return records.filter(r => {
    return r.prefix.startsWith(prefix)
  })
}

module.exports = {
  getItemByPrefix,
}

