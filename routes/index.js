'use strict';

var express = require('express');
var router = express.Router(); // eslint-disable-line new-cap
var googleClient = require('../lib/google-client');
var uberClient = require('../lib/uber-client');
var twilioClient = require('../lib/twilio-client');
var parser = require('../lib/message-parser');

function isValidRequest(req) {
  return req.params.To === process.env.TWILIO_NUMBER &&
      req.params.From === process.env.SAMS_NUMBER;
};

/* GET home page. */
router.get('/', function(req, res) {
  if (isValidRequest(req)) {
    twilioClient.sendMessage('It worked! ' + req.params.Body);
  }

  res.render('index', { title: 'Express' });
});

module.exports = router;
