const calculateCallCost = (effectiveDuration, pricePerMinute) => effectiveDuration*(pricePerMinute/60)
const calculateDuration = (initial, reportedDuration, increment) => Math.ceil( (initial+reportedDuration)/increment )*increment
const isNumberValid = (number) => {
    const match =  number.toString().match(/^[1-9][0-9]*$/);
    return match ? match.length > 0 : false;
}

module.exports = {
    calculateCallCost,
    calculateDuration,
    isNumberValid
}