var expect = require('chai').expect;
var exrates = require('./index.js').exrates;

describe('exrates', function() {

  describe('#getExchangeRate()', function () {
    it('should return an object', function (done) {
      exrates.getExchangeRate('USD')
        .then(function(rateObj) {
          expect(rateObj).to.be.an('object');
          done();
        })
        .catch(console.log);
    });
  });

  describe('#convertToVND()', function() {
    it('should return an object', function (done) {
      exrates.convertToVND('sell', 2, 'USD')
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
      exrates.convertFromVND('buy', 200000, 'USD')
        .then(function(rate) {
          console.log(`200000 VND = ${rate.amount} USD. Updated at ${rate.date}.`);
          expect(rate).to.be.an('object');
          done();
        })
        .catch(console.log);
    });
  });
});
