'use strict';

var vnd = exports,
  request = require('request-promise'),
  cheerio = require('cheerio'),
  _ = require('underscore');

function Rates(options) {
  var config = require('./config.json');

  var options = {
      uri: _.first(config).exchangeRatesUrl,
      transform: function (body) {
          return cheerio.load(body, {
            ignoreWhitespace: true,
            xmlMode: true
          });
      }
  };

  this.original = request(options);
}

Rates.prototype.getExchangeRate = function(currencyCode) {
  return this.original.then(function($) {
    var dateTime = $('DateTime').text(),
      exrates = $('Exrate'),
      exrateList = [];

    exrates.each(function(index, element) {
      exrateList.push(element.attribs);
    });

    var rate = _.filter(exrateList, function(rate) {
        return currencyCode === rate.CurrencyCode;
    })[0];

    return {
      code: rate.CurrencyCode,
      name: rate.CurrencyName,
      date: dateTime,
      buy: rate.Buy,
      transfer: rate.Transfer,
      sell: rate.Sell
    };
  })
  .catch(console.log);
};

Rates.prototype.convertToVND = function(transaction, amount, currencyCode) {
  return this.getExchangeRate(currencyCode)
    .then(function(rate) {
      return {
        date: rate.date,
        amount: amount*(new Number(rate[transaction])),
        exchangeFrom: currencyCode
      };
    })
    .catch(console.log);
};

Rates.prototype.convertFromVND = function(transaction, amount, currencyCode) {
  return this.getExchangeRate(currencyCode)
    .then(function(rate) {
      return {
        date: rate.date,
        amount: amount/(new Number(rate[transaction])),
      };
    })
    .catch(console.log);
};

vnd.Rates = Rates;
