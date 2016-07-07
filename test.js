var expect = require('chai').expect;
var Rates = require('./index.js').Rates;

describe('Rates', function() {
  var rates = new Rates();

  describe('#getExchangeRate()', function () {
    it('should return an object', function (done) {
      rates.getExchangeRate('USD')
        .then(function(rateObj) {
            expect(rateObj).to.be.an('object');
            done();
        })
        .catch(console.log);
    });
  });

  describe('#convertToVND()', function() {
    it('should return an object', function (done) {
      rates.convertToVND('sell', 2, 'USD')
        .then(function(rate) {
            console.log(`2 USD = ${rate.amount} VND. Updated at ${rate.date}.`);
            expect(rate).to.be.an('object');
            done();
        })
        .catch(console.log);
    });
  });

  describe('#convertFromVND()', function() {
    it('should return an object', function (done) {
      rates.convertFromVND('buy', 200000, 'USD')
        .then(function(rate) {
            console.log(`200000 VND = ${rate.amount} USD. Updated at ${rate.date}.`);
            expect(rate).to.be.an('object');
            done();
        })
        .catch(console.log);
    });
  });
});
