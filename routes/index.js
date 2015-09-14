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
};

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res) {
  if (isValidRequest(req)) {
    twilioClient.sendMessage('It worked! ' + req.body.Body);
  } else {
    twilioClient.sendMessage('Nope! From: ' + req.body.From + ', to: ' + req.body.To);
  }

  res.render('index', { title: 'Express' });
});


module.exports = router;
