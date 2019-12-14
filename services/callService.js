<<<<<<< HEAD
const { getItemByPrefixAndDateFromPostgres, storeCallRecordToPostgres, getListingCallingFromPostgres, truncateTables, generateInvoiceQuery } = require('../infrastructure/postgres')
=======
const { getItemByPrefixAndDateFromPostgres, storeCallRecordToPostgres, getListingCallingFromPostgres,  } = require('../infrastructure/postgres')
>>>>>>> a787db1633b65aa0102075d2825cc861cf00048e

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
    return await truncateTables();
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