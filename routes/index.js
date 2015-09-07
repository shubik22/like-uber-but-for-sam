'use strict';

var express = require('express');
var router = express.Router(); // eslint-disable-line new-cap
var twilioClient = require('../lib/twilio-client');

/* GET home page. */
router.get('/', function(req, res) {
  var msg = req.query[process.env.SECRET_KEY];

  if (msg) {
    twilioClient.sendMessage(msg);
  }

  res.render('index', { title: 'Express' });
});

module.exports = router;
