var jwt       = require('jsonwebtoken');
var fs        = require('fs');
var path      = require('path');
var express   = require('express');
var router    = express.Router();
var models    = require('../models');


router.use(function(req, res, next) {

  if (req.method == 'OPTIONS') {
    return next();
  }

  req.originalUrl = req.originalUrl.replace('//', '/');

  return next();

});


fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file !== '_helpers.js');
  })
  .forEach(function(file) {
    file = file.replace('.js', '');
    router.use('/' + file.replace('.js', ''), require(path.join(__dirname, file)));
  });

module.exports = router;
