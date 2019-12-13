const { getItemByPrefixAndDateFromPostgres } = require('../infrastructure/postgres')

const getItemByPrefixAndDate = async (prefix, date) => {
    return await getItemByPrefixAndDateFromPostgres(prefix, date);
}

const resetDbEntries = async () => {
    return true;
}

module.exports = {
    getItemByPrefixAndDate,
    resetDbEntries
}