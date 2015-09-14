var request = require('request');
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

function handlePriceEstResponse(body, success, failure) {
  var response = JSON.parse(body);
  var uberXPrice;

  for (var i = 0; i < response.prices.length; i++) {
    if (response.prices[i].display_name == 'uberX') {
      uberXPrice = response.prices[i];
      break;
    }
  }

  if (!uberXPrice) {
    failure('Sorry, no UberX available for this request');
  } else {
    var msg = 'UberX estimate: ' + uberXPrice.estimate +
              ', surge ' + uberXPrice.surge_multiplier +
              ', ' + uberXPrice.distance + ' miles. ' +
              'Request id: ' + '1234';
    success(msg);
  }
}

var uberClient = {
  getPriceEstimate: function(start, end, success, failure) {
    var url = generatePriceEstUrl(start, end);

    request.get(url, function(error, response, body) {
      if (error || response.statusCode !== 200) {
        failure('Sorry, there was an error for your price estimate request. Status code: ' +
                response.statusCode);
      } else {
        handlePriceEstResponse(body, success, failure);
      }
    });
  }
};

module.exports = uberClient;
