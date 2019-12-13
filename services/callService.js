const {getItemByPrefixAndDateFromCsv} = require('../infrastructure/db')

const getItemByPrefixAndDate = async (prefix, date) => {
    return await getItemByPrefixAndDateFromCsv(prefix, date);
}

module.exports = {
    getItemByPrefixAndDate,
}