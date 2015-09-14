'use strict';

var express = require('express');
var router = express.Router(); // eslint-disable-line new-cap
var googleClient = require('../lib/google-client');
var uberClient = require('../lib/uber-client');
var twilioClient = require('../lib/twilio-client');
var parser = require('../lib/message-parser');

function isValidRequest(req) {
  return req.body.To === process.env.TWILIO_NUMBER &&
      req.body.From === process.env.SAMS_NUMBER;
}

function sendPriceEstMessage(uberXPrice) {
  var msg = 'UberX estimate: ' + uberXPrice.estimate +
              ', surge ' + uberXPrice.surge_multiplier +
              ', ' + uberXPrice.distance + ' miles. ';
  twilioClient.sendMessage(msg);
}

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res) {
  if (isValidRequest(req)) {
    var parsed = parser.parseMessage(req.body.Body);
    if (parsed.type === 'EST') {
      // gross, refactor SOON
      googleClient.fetchCoordinates(parsed.start, function(start) {
        googleClient.fetchCoordinates(parsed.end, function(end) {
          uberClient(start, end, sendPriceEstMessage, twilioClient.sendMessage);
        }, twilioClient.sendMessage);
      }, twilioClient.sendMessage);
    }
  }

  res.render('index', { title: 'Express' });
});


module.exports = router;
