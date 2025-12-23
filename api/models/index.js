'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var env       = process.env.NODE_ENV || 'development';
var models    = require('../models');
var settings;

if (process.env.NODE_ENV && process.env.NODE_ENV == 'test') {
  settings = require('../test/config/settings');
} else if (process.env.NODE_ENV && process.env.NODE_ENV == 'local') {
    settings = require('../local/config/settings');
} else {
  settings = require('../config/settings');
}

var options = {
  dialect: settings.database.protocol,
  define    : {
    charset: 'utf8',
    collate: 'utf8_general_ci',
  },
  timezone  : settings.database.timezone,
  host      : settings.database.host,
  port      : settings.database.port
};
if (settings.database.cert) {
  console.log(__dirname);
  options.dialectOptions =  {
    encrypt: true,
    ssl : {
       ca: fs.readFileSync(__dirname + '/../config/' + settings.database.cert)
    }
 }
}
if (settings.database.logging === false) {
  options.logging = false;
}

var sequelize = new Sequelize(settings.database.name,
                              settings.database.username,
                              settings.database.password,
                              options);

var db        = { };

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
    //db[model.name].sync( { force :true} );
    //db[model.name].sync( );
  });

// sequelize.query("set FOREIGN_KEY_CHECKS=0");

Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
    //db[modelName].sync( { force :true} );
    //db[modelName].sync();
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
