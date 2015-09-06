'use strict';

var express = require('express');
var router = express.Router(); // eslint-disable-line new-cap

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

module.exports = router;
