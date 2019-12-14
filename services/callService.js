const { getItemByPrefixAndDateFromPostgres, 
    storeCallRecordToPostgres, 
    getListingCallingFromPostgres, 
    truncateTables, 
    generateInvoiceQuery,
    getInvoicesFromDb,
    getInvoiceFromDb } = require('../infrastructure/postgres')

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

const generateInvoice = async (start, end, callback) => {
    return generateInvoiceQuery(start, end, callback);
}

const getInvoices = async (start, end) => {
    return await getInvoicesFromDb(start, end);
    // return await getInvoiceFromDb();
}

const getInvoiceById = async(id) => {
    return await getInvoiceFromDb(id);
}



module.exports = {
    getInvoiceById,
    getInvoices,
    generateInvoice,
    getItemByPrefixAndDate,
    resetDbEntries,
    storeCallRecord,
    getListingCalling
}
