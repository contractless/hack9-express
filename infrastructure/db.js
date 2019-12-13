const fs  = require('fs')

const csv = require('csv-parser')

const records = []

fs.createReadStream('../callingCodes.csv')
  .pipe(csv())
  .on('data', row => records.push(row))
  .on('end', () => console.log('[SUCCESS] CSV Parsing done!'))

function getItemByPrefix(prefix) {
  return records.find(r => {
    const dummyPrefix = prefix.slice(0, 3)
    return r.prefix.startsWith(dummyPrefix)
  })
}

function getItemByPrefixAndDate(prefix, date) {
  return getItemByPrefix(prefix);
}

module.exports = {
  getItemByPrefix,
  getItemByPrefixAndDate
}

