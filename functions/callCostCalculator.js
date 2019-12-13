const calculateCallCost = (effectiveDuration, pricePerMinute) => effectiveDuration*(pricePerMinute/60)
const calculateDuration = (initial, reportedDuration, increment) => Math.ceil( (initial+reportedDuration)/increment )*increment

module.exports = {
    calculateCallCost,
    calculateDuration
}