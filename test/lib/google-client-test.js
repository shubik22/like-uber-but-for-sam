var assert = require('chai').assert;
var sinon = require('sinon');
var nock = require('nock');

describe('google-client', function() {
  var googleClient = require('../../lib/google-client');

  describe('#fetchCoordinates', function() {
    it('calls the success function with status OK/non-approx location', function(done) {
      var address = '541 Cowper Street, Palo Alto, CA';

      var googleEndpoint = nock('https://fake-goog.com')
        .get('/maps/api/geocode/json')
        .query({ key: process.env.GOOGLE_API_KEY, address: address })
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

    it('calls the failure function for a non-ok status', function(done) {
      var address = '541 Cowper Street, Palo Alto, CA';
      var successStub = sinon.stub();

      var googleEndpoint = nock('https://fake-goog.com')
        .get('/maps/api/geocode/json')
        .query({ key: process.env.GOOGLE_API_KEY, address: address })
        .replyWithFile(200, __dirname + '/../../fixtures/google-maps/failure.json');

      googleClient.fetchCoordinates(address, successStub, function() {
        assert.isTrue(googleEndpoint.isDone());
        assert.isFalse(successStub.called);
        done();
      });
    });

    it('calls the failure function for a non-200 status code', function(done) {
      var address = '541 Cowper Street, Palo Alto, CA';
      var successStub = sinon.stub();

      var googleEndpoint = nock('https://fake-goog.com')
        .get('/maps/api/geocode/json')
        .query({ key: process.env.GOOGLE_API_KEY, address: address })
        .reply(400, {});

      googleClient.fetchCoordinates(address, successStub, function() {
        assert.isTrue(googleEndpoint.isDone());
        assert.isFalse(successStub.called);
        done();
      });
    });

    it('calls the failure function for an approximate response', function(done) {
      var address = '541 Cowper Street, Palo Alto, CA';
      var successStub = sinon.stub();

      var googleEndpoint = nock('https://fake-goog.com')
        .get('/maps/api/geocode/json')
        .query({ key: process.env.GOOGLE_API_KEY, address: address })
        .replyWithFile(200, __dirname + '/../../fixtures/google-maps/approximate.json');

      googleClient.fetchCoordinates(address, successStub, function() {
        assert.isTrue(googleEndpoint.isDone());
        assert.isFalse(successStub.called);
        done();
      });
    });
  });
});
