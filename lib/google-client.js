require('request');

var SUCCESS_CODE = 'OK';

function parseResponse(response) {
  if (response.status != SUCCESS_CODE) {
    return {
      status: response.status
    };
  } else {
    var geometry = response.results[0].geometry;
    return {
      status: response.status,
      locationType: geometry.location_type,
      coordinates: geometry.location
    };
  }
}

var googleClient = {
  fetchCoordinates: function(address, success, failure) {
  }
};

module.exports = googleClient;
