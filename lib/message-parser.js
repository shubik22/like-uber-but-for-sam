var parser = {
  parseMessage: function(fullMessage) {
    var typeAndMessage = fullMessage.split(/: (.+)/);
    var type = typeAndMessage[0];
    var addresses = typeAndMessage[1];
    return {
      type: type.toUpperCase(),
      start: addresses.split('\/\/')[0],
      end: addresses.split('\/\/')[1]
    };
  }
};

module.exports = parser;
