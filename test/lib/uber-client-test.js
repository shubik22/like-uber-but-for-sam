var assert = require('chai').assert;
var sinon = require('sinon');
var nock = require('nock');

describe('uber-client', function() {
  var uberClient = require('../../lib/uber-client');

  describe('#getPriceEstimate', function() {
    var startLat = 37.44793370000001;
    var startLong = -122.1584026;
    var endLat = 37.427074;
    var endLong = -122.1439166;

    var start = { lat: startLat, lng: startLong };
    var end = { lat: endLat, lng: endLong };

    it('should call success function with message on success', function(done) {
      var uberEndpoint = nock('https://api.fake-uber.com')
        .get('/v1/estimates/price')
        .query({
          server_token: process.env.UBER_TOKEN,
          start_latitude: startLat,
          start_longitude: startLong,
          end_latitude: endLat,
          end_longitude: endLong
        })
        .replyWithFile(200, __dirname + '/../../fixtures/uber/price_estimate.json');

      var uberXEstimate = {
        'localized_display_name': 'uberX',
        'high_estimate': 9,
        'minimum': 5,
        'duration': 552,
        'estimate': '$7-9',
        'distance': 2.42,
        'display_name': 'uberX',
        'product_id': '04a497f5-380d-47f2-bf1b-ad4cfdcb51f2',
        'low_estimate': 7,
        'surge_multiplier': 1,
        'currency_code': 'USD'
      };

      uberClient.getPriceEstimate(start, end, function(estimate) {
        assert.isTrue(uberEndpoint.isDone());
        assert.deepEqual(uberXEstimate, estimate);
        done();
      });
    });

    it('should call failure function with message if no UberX available', function(done) {
      var successStub = sinon.stub();
      var uberEndpoint = nock('https://api.fake-uber.com')
        .get('/v1/estimates/price')
        .query({
          server_token: process.env.UBER_TOKEN,
          start_latitude: startLat,
          start_longitude: startLong,
          end_latitude: endLat,
          end_longitude: endLong
        })
        .replyWithFile(200, __dirname + '/../../fixtures/uber/price_estimate_no_uberx.json');

      uberClient.getPriceEstimate(start, end, successStub, function(msg) {
        assert.isFalse(successStub.called);
        assert.isTrue(uberEndpoint.isDone());
        assert.equal('Sorry, no UberX available for this request', msg);
        done();
      });
    });

    it('should call failure function with message for non-200 response', function(done) {
      var successStub = sinon.stub();
      var uberEndpoint = nock('https://api.fake-uber.com')
        .get('/v1/estimates/price')
        .query({
          server_token: process.env.UBER_TOKEN,
          start_latitude: startLat,
          start_longitude: startLong,
          end_latitude: endLat,
          end_longitude: endLong
        })
        .reply(401, {});

      uberClient.getPriceEstimate(start, end, successStub, function(msg) {
        assert.isFalse(successStub.called);
        assert.isTrue(uberEndpoint.isDone());
        assert.equal('Sorry, there was an error for your price estimate request. Status code: 401', msg);
        done();
      });
    });
  });
});
