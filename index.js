'use strict';

const request = require('request-promise'),
  cheerio = require('cheerio'),
  _ = require('underscore'),
  config = require('./config.json');

exports.exrates = (function () {
  let opts = {
      uri: _.first(config).exchangeRatesUrl,
      transform: function (body) {
        return cheerio.load(body, {
          ignoreWhitespace: true,
          xmlMode: true
        });
      }
    }
    , promise = request(opts)

    , getExchangeRate = (currencyCode) => {
      return promise.then(function($) {
        let dateTime = $('DateTime').text(),
          exrates = $('Exrate'),
          exrateList = [];

        exrates.each(function(index, element) {
          exrateList.push(element.attribs);
        });

        let rate = _.filter(exrateList, function(rate) {
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
    }

    , convertToVND = (transaction, amount, currencyCode) => {
      return getExchangeRate(currencyCode)
        .then(function(rate) {
          return {
            date: rate.date,
            amount: amount*(new Number(rate[transaction])),
            exchangeFrom: currencyCode
          };
        })
        .catch(console.log);
    }

    , convertFromVND = (transaction, amount, currencyCode) => {
      return getExchangeRate(currencyCode)
        .then(function(rate) {
          return {
            date: rate.date,
            amount: amount/(new Number(rate[transaction])),
          };
        })
        .catch(console.log);
    };

  return {
    getExchangeRate: getExchangeRate,
    convertToVND: convertToVND,
    convertFromVND: convertFromVND
  };
})();
