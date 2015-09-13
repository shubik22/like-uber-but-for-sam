var assert = require('chai').assert;
var sinon = require('sinon');
var nock = require('nock');

describe('google-client', function() {
  var googleClient = require('../../lib/google-client');

  describe('#fetchCoordinates', function() {
    it('call the success function with status OK/non-approx location', function() {
      var successStub = sinon.stub();
      var address = '541 Cowper Street, Palo Alto, CA';

      nock(process.env.GOOGLE_GEOCODE_URL)
        .get('/')
        .query({ key: process.env.GOOGLE_API_KEY, address: address})
        .replyWithFile(200, __dirname + '../fixtures/google-maps/success.json');

      var longAndLat = {
        lat: 37.44793370000001,
        lng: -122.1584026
      };

      googleClient.fetchCoordinates(address);

      assert.isTrue(successStub.withArgs(longAndLat).calledOnce);
    });
  });
});
