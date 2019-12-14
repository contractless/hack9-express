const { getItemByPrefixAndDateFromPostgres, storeCallRecordToPostgres, getListingCallingFromPostgres, truncateTables } = require('../infrastructure/postgres')

const getItemByPrefixAndDate = async (prefix, date) => {
    return await getItemByPrefixAndDateFromPostgres(prefix, date);
}

const storeCallRecord = async(calling, called, start, duration, rounded, price, cost) => {
    return await storeCallRecordToPostgres(calling, called, start, duration, rounded, price, cost)
}

const getListingCalling = async(calling, from, to) => {
    return await getListingCallingFromPostgres(calling, from, to);
}

const resetDbEntries = async () => {
  return await truncateTables()
}

module.exports = {
    getItemByPrefixAndDate,
    resetDbEntries,
    storeCallRecord,
    getListingCalling
}
