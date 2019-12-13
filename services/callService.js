const {getItemByPrefixAndDateFromCsv} = require('../infrastructure/db')

const getItemByPrefixAndDate = async (prefix, date) => {
    return await getItemByPrefixAndDateFromCsv(prefix, date);
}

const resetDbEntries = async () => {
    return true;
}

module.exports = {
    getItemByPrefixAndDate,
    resetDbEntries
}