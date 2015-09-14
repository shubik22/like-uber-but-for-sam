var request = require('request');
var qs = require('qs');

var SUCCESS_CODE = 'OK';

function parseResponse(response) {
  var responseObj = JSON.parse(response);
  if (responseObj.status != SUCCESS_CODE) {
    return {
      status: responseObj.status
    };
  } else {
    var geometry = responseObj.results[0].geometry;
    return {
      status: responseObj.status,
      locationType: geometry.location_type,
      coordinates: geometry.location
    };
  }
}

function handleResponse(address, response, success, failure) {
  var parsed = parseResponse(response);
  if (parsed.status != SUCCESS_CODE) {
    failure('Google status code was ' + parsed.status + ' for address: ' + address);
  } else if (parsed.locationType === 'APPROXIMATE') {
    failure('Google response was APPROXIMATE for address: ' + address);
  } else {
    success(parsed.coordinates);
  }
}

function generateUrl(address) {
  var queryString = qs.stringify({ key: process.env.GOOGLE_API_KEY, address: address});
  return process.env.GOOGLE_GEOCODE_URL + queryString;
}

var googleClient = {
  fetchCoordinates: function(address, success, failure) {
    var url = generateUrl(address);

    request.get(url, function(error, response, body) {
      if (error || response.statusCode !== 200) {
        failure('Error from Google maps for address ' +
                address + '. Error: ' + error + '. Status code: ' +
                response.statusCode);
      } else {
        handleResponse(address, body, success, failure);
      }
    });
  }
};

module.exports = googleClient;
