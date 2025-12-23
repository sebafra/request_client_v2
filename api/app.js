var express         = require('express');
var path            = require('path');

var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');

var models          = require('./models/');
var routes          = require('./routes/');

var multipart       = require('connect-multiparty');


var app             = express();
var server          = require('http').Server(app);


// http://stackoverflow.com/questions/18811286/nodejs-express-cache-and-304-status-code
// disable cache
app.disable('etag');

app.use(function (req, res, next) {
  // if (process.env.NODE_ENV && process.env.NODE_ENV == 'test') {
  //   req.settings = require('./test/config/settings');
  // } else if (process.env.NODE_ENV && process.env.NODE_ENV == 'local') {
  //     req.settings = require('./local/config/settings');
  // } else {
    req.settings = require('./config/settings');
  //}

  return next();
});


models.sequelize.sync().then(function () {
});


// CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-accepted-format');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
});

app.use(multipart({
  uploadDir: '/tmp/'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


/*
 * @static content
 * app.use('/speechToText', express.static(path.join(__dirname, './static/speechToText.html')));
 * app.use('/files', express.static(path.join(__dirname, './static/files/')));
 */
app.use('/files', express.static(path.join(__dirname, './files/')));

app.use('/', express.static(path.join(__dirname, '../adm/dist/')));

/*
* Routes
*/
app.use('/api', routes);


module.exports = { app : app, server : server };
