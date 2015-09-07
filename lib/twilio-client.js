var twilio = require('twilio');

var twilioClient = {
  sendMessage: function(body) {
    twilio.sendMessage({
      to: process.env.SAMS_NUMBER,
      from: process.env.TWILIO_NUMBER,
      body: body
    })
  }
};

module.exports = twilioClient;
