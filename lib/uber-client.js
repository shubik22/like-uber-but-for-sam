var request = require('request-promise');
var qs = require('qs');
var PRICE_ENDPOINT = '/v1/estimates/price';

function generatePriceEstUrl(start, end) {
  var baseUrl = process.env.UBER_URL + PRICE_ENDPOINT;
  var queryString = qs.stringify({
    server_token: process.env.UBER_TOKEN,
    start_latitude: start.lat,
    start_longitude: start.lng,
    end_latitude: end.lat,
    end_longitude: end.lng
  });

  return baseUrl + '?' + queryString;
}

function parsePriceEstResponse(response) {
  var uberXPrice;

  for (var i = 0; i < response.prices.length; i++) {
    if (response.prices[i].display_name == 'uberX') {
      uberXPrice = response.prices[i];
      break;
    }
  }

  return uberXPrice;
}

var uberClient = {
  getPriceEstimate: function(start, end) {
    var url = generatePriceEstUrl(start, end);

    var options = {
      uri: url,
      json: true
    };

    return request.get(options).then(function(resp) {
      var price = parsePriceEstResponse(resp);

      if (!price) {
        throw new Error('Sorry, no UberX available for this request');
      } else {
        return price;
      }
    });
  }
};

module.exports = uberClient;
