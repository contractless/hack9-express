var assert = require('chai').assert
const { calculateCallCost, calculateDuration } = require('../../functions/callCostCalculator');


describe('Verify calculation functions', () => {
    it('Calculates call cost', () => {
        const callCost = calculateCallCost(60, 4)
        assert.equal(callCost, 4)
    })

    it('Calculates call duration', () => {
        const callDuration = calculateDuration(10, 30, 10)
        assert.equal(callDuration, 40)
    })
})
