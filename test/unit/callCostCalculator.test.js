var expect = require('chai').expect
const { calculateCallCost, calculateDuration, isNumberValid } = require('../../functions/callCostCalculator');


describe('Verify calculation functions', () => {
    it('Calculates call cost', () => {
        const callCost = calculateCallCost(60, 4);
        expect(callCost).to.equal(4);
        //assert.equal(callCost, 4)
    })

    it('Calculates call duration', () => {
        const callDuration = calculateDuration(10, 30, 10);
        expect(callDuration).to.equal(40);
    })

    it('Validates number', () => {
        expect(isNumberValid('stringy')).to.equal(false);
        expect(isNumberValid(000)).to.equal(false);
        expect(isNumberValid(2345)).to.equal(true);
        expect(isNumberValid('2345')).to.equal(true);
        expect(isNumberValid('+2345')).to.equal(false);
        expect(isNumberValid(1234578987654)).to.equal(true);
    })


})
