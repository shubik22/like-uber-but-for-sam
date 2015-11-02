var request = require('request-promise');
var qs = require('qs');

var SUCCESS_CODE = 'OK';

function generateUrl(address) {
  var queryString = qs.stringify({ key: process.env.GOOGLE_API_KEY, address: address});
  return process.env.GOOGLE_GEOCODE_URL + queryString;
}

var googleClient = {
  fetchCoordinates: function(address) {
    var url = generateUrl(address);

    var options = {
      uri: url,
      json: true,
      resolveWithFullResponse: true
    };

    return request.get(options).then(function(resp) {
      if (resp.body.status !== SUCCESS_CODE) {
        throw new Error('Error from Google maps for address ' + address + '. Status: ' + resp.body.status);
      } else {
        return resp.body;
      }
    }).then(function(resp) {
      var geometry = resp.results[0].geometry;
      if (geometry.location_type === 'APPROXIMATE') {
        throw new Error('Google response was APPROXIMATE for address: ' + address);
      } else {
        return geometry.location;
      }
    });
  }
};

module.exports = googleClient;
