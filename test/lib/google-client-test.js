var assert = require('chai').assert;
var nock = require('nock');

describe('google-client', function() {
  var googleClient = require('../../lib/google-client');

  describe('#fetchCoordinates', function() {
    it('call the success function with status OK/non-approx location', function(done) {
      var address = '541 Cowper Street, Palo Alto, CA';

      var googleEndpoint = nock('https://fake-goog.com')
        .get('/maps/api/geocode/json')
        .query(true)
        .replyWithFile(200, __dirname + '/../../fixtures/google-maps/success.json');

      var longAndLat = {
        lat: 37.44793370000001,
        lng: -122.1584026
      };

      googleClient.fetchCoordinates(address, function(response) {
        assert.isTrue(googleEndpoint.isDone());
        assert.deepEqual(response, longAndLat);
        done();
      });
    });
  });
});
