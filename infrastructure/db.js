const records = []

function getItemByPrefixFromCsv(prefix) {
  return records.find(r => {
    const dummyPrefix = prefix.slice(0, 3)
    return r.prefix.startsWith(dummyPrefix)
  })
}

function getItemByPrefixAndDateFromCsv(prefix, date) {
  return getItemByPrefixFromCsv(prefix);
}

function getItemByPrefixAndDateFromCsv(prefix, date) {
  return getItemByPrefixFromCsv(prefix);
}

module.exports = {
  getItemByPrefixFromCsv,
  getItemByPrefixAndDateFromCsv
}

