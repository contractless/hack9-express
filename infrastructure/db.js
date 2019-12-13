const fs  = require('fs')

const csv = require('csv-parser')

const records = []

// fs.createReadStream('../callingCodes.csv')
//   .pipe(csv())
//   .on('data', row => records.push(row))
//   .on('end', () => console.log('[SUCCESS] CSV Parsing done!'))

function getItemByPrefixFromCsv(prefix) {
  return records.find(r => {
    const dummyPrefix = prefix.slice(0, 3)
    return r.prefix.startsWith(dummyPrefix)
  })
}

function getItemByPrefixAndDateFromCsv(prefix, date) {
  return getItemByPrefixFromCsv(prefix);
}

module.exports = {
  getItemByPrefixFromCsv,
  getItemByPrefixAndDateFromCsv
}

