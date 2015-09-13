var assert = require('chai').assert;
var proxyquire = require('proxyquire');
var sinon = require('sinon');

describe('twilio-client', function() {
  var sendMessageStub = sinon.stub();

  var client = proxyquire('../../lib/twilio-client', {
    twilio: function() {
      return {
        sendMessage: sendMessageStub
      };
    }
  });

  describe('#sendMessage', function() {
    it('should send a messsage to twilio', function() {
      client.sendMessage('foobar');
      assert.isTrue(sendMessageStub.calledOnce);
    });
  });
});
