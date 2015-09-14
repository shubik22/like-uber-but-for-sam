var assert = require('chai').assert;

describe('message-parser', function() {
  var messageParser = require('../../lib/message-parser');

  describe('#parseMessage', function() {
    it('should correctly parse a price estimate message', function() {
      var message = 'est: 541 Cowper St, Palo Alto, CA//' +
                    '321 California Ave, Palo Alto, CA';
      var expected = {
        type: 'EST',
        start: '541 Cowper St, Palo Alto, CA',
        end: '321 California Ave, Palo Alto, CA'
      };

      assert.deepEqual(expected, messageParser.parseMessage(message));
    });
  });
});
