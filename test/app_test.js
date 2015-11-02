var request = require('supertest');
var assert = require('chai').assert;
var nock = require('nock');
var proxyquire = require('proxyquire');
var sinon = require('sinon');

describe('app', function() {
  var sendMessageStub = sinon.stub();

  var app = proxyquire('../app', {
    './lib/twilio-client': { // TODO: make this work
      sendMessage: sendMessageStub,
      '@global': true
    }
  });

  describe('GET /', function(){
    it('responds with homepage', function(done){
      request(app)
        .get('/')
        .expect('Content-Type', /html/)
        .expect()
        .expect(200)
        .end(function(err, res) {
          assert.isTrue(res.text.indexOf('Welcome to Express') !== -1);
          done();
        });
    });
  });

  describe('POST /', function() {
    describe('EST', function () {
      it('sends a response to Twilio', function(done) {
        var address1 = '541 Cowper Street, Palo Alto, CA';
        var address2 = '321 California Ave, Palo Alto, CA 94306';

        var googleEndpoint = nock('https://fake-goog.com')
          .get('/maps/api/geocode/json')
          .query({ key: process.env.GOOGLE_API_KEY, address: address1 })
          .replyWithFile(200, __dirname + '/../fixtures/google-maps/success.json')
          .get('/maps/api/geocode/json')
          .query({ key: process.env.GOOGLE_API_KEY, address: address2 })
          .replyWithFile(200, __dirname + '/../fixtures/google-maps/success_nut_house.json');

        var uberEndpoint = nock('https://api.fake-uber.com')
          .get('/v1/estimates/price')
          .query({
            server_token: process.env.UBER_TOKEN,
            start_latitude: 37.44793370000001,
            start_longitude: -122.1584026,
            end_latitude: 37.427074,
            end_longitude: -122.1439166
          })
          .replyWithFile(200, __dirname + '/../fixtures/uber/price_estimate.json');

        var payload = {
          To: process.env.TWILIO_NUMBER,
          From: process.env.SAMS_NUMBER,
          Body: 'Est: ' + address1 + '//' + address2
        };

        request(app)
          .post('/')
          .send(payload)
          .expect(200)
          .end(function() {
            assert.isTrue(googleEndpoint.isDone());
            // assert.isTrue(uberEndpoint.isDone());
            console.log('pending google mocks: %j', googleEndpoint.pendingMocks());
            console.log('pending uber mocks: %j', uberEndpoint.pendingMocks());
            // assert.isTrue(sendMessageStub.calledWith('UberX estimate: $7-9, surge 1, 2.42 miles.'));
            // done();
          });
      });
    });
  });
});
