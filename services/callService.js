const { getItemByPrefixAndDateFromPostgres, storeCallRecordToPostgres, getListingCallingFromPostgres, generateInvoiceQuery } = require('../infrastructure/postgres')

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
    return true;
}

const generateInvoice = async (start, end, callback) => {
    return generateInvoiceQuery(start, end, callback);
}

module.exports = {
    generateInvoice,
    getItemByPrefixAndDate,
    resetDbEntries,
    storeCallRecord,
    getListingCalling
}