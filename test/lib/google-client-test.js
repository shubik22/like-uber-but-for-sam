var assert = require('chai').assert;
var nock = require('nock');

describe('google-client', function() {
  var googleClient = require('../../lib/google-client');

  describe('#fetchCoordinates', function() {
    it('returns long/lat for responses with status OK/non-approx location', function(done) {
      var address = '541 Cowper Street, Palo Alto, CA';

      var googleEndpoint = nock('https://fake-goog.com')
        .get('/maps/api/geocode/json')
        .query({ key: process.env.GOOGLE_API_KEY, address: address })
        .replyWithFile(200, __dirname + '/../../fixtures/google-maps/success.json');

      var longAndLat = {
        lat: 37.44793370000001,
        lng: -122.1584026
      };

      googleClient.fetchCoordinates(address).then(function(response) {
        assert.isTrue(googleEndpoint.isDone());
        assert.deepEqual(response, longAndLat);
        done();
      });
    });

    it('throws an error for a non-ok status', function(done) {
      var address = '541 Cowper Street, Palo Alto, CA';

      var googleEndpoint = nock('https://fake-goog.com')
        .get('/maps/api/geocode/json')
        .query({ key: process.env.GOOGLE_API_KEY, address: address })
        .replyWithFile(200, __dirname + '/../../fixtures/google-maps/failure.json');

      googleClient.fetchCoordinates(address).catch(function(err) {
        var expectedMsg = 'Error from Google maps for address 541 Cowper Street, Palo Alto, CA. Status: UNKNOWN_ERROR';

        assert.isTrue(googleEndpoint.isDone());
        assert.deepEqual(expectedMsg, err.message);
        done();
      });
    });

    it('throws an error for a non-200 status code', function(done) {
      var address = '541 Cowper Street, Palo Alto, CA';

      var googleEndpoint = nock('https://fake-goog.com')
        .get('/maps/api/geocode/json')
        .query({ key: process.env.GOOGLE_API_KEY, address: address })
        .reply(400, {});

      googleClient.fetchCoordinates(address).catch(function(err) {
        assert.isTrue(googleEndpoint.isDone());
        assert.isTrue(err.message.startsWith('400'));
        done();
      });
    });

    it('throws an error for an approximate response', function(done) {
      var address = '541 Cowper Street, Palo Alto, CA';

      var googleEndpoint = nock('https://fake-goog.com')
        .get('/maps/api/geocode/json')
        .query({ key: process.env.GOOGLE_API_KEY, address: address })
        .replyWithFile(200, __dirname + '/../../fixtures/google-maps/approximate.json');

      googleClient.fetchCoordinates(address).catch(function(err) {
        var expectedMsg = 'Google response was APPROXIMATE for address: 541 Cowper Street, Palo Alto, CA';

        assert.isTrue(googleEndpoint.isDone());
        assert.deepEqual(expectedMsg, err.message);
        done();
      });
    });
  });
});
