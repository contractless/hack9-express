const { getItemByPrefixAndDateFromPostgres, storeCallRecordToPostgres } = require('../infrastructure/postgres')

const getItemByPrefixAndDate = async (prefix, date) => {
    return await getItemByPrefixAndDateFromPostgres(prefix, date);
}

const storeCallRecord = async(calling, called, start, duration, rounded, price, cost) => {
    return await storeCallRecordToPostgres(calling, called, start, duration, rounded, price, cost)
}

const resetDbEntries = async () => {
    return true;
}

module.exports = {
    getItemByPrefixAndDate,
    resetDbEntries,
    storeCallRecord
}