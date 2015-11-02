var request = require('supertest');
var app = require('../app');
var assert = require('chai').assert;

describe('index', function() {
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
});
