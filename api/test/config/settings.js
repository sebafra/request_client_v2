var path       = require('path');

var settings = {
  token      : {
    secret:     'ts$s38*jsjmjnT1',
    expires:    '1d', // expires in 24 hours
    noexpires:  '100y', // expires in 100 years
  },
  baseUrl    : 'http://localhost',
  uploadDir  : '/tmp',
  imagesDir  : './files/',
  url        : function() {
    return this.baseUrl + ':' + this.port;
  },
  path       : path.normalize(path.join(__dirname, '..')),
  port       : process.env.NODE_PORT,
  database   : {
    logging  : 'console.log',
    timezone : '-03:00',
    protocol : 'mysql',
    host     : '35.226.229.174',
    port     : 3306,
    name     : 'api',
    username : 'mobileapp',
    password : 'nfnKx2K]aPtR44t'
  },
  quiter: {
    API_QUITER_BASE_URL: 'https://qis.quiter.com/qis',
    API_QUITER_METHOD_GET_TOKEN: '/oauth/token',
    API_QUITER_METHOD_GET_CUSTOMER: '/api/appointments/v1/customers',
    API_QUITER_GRANT_TYPE: 'authorization_code',
    API_QUITER_CLIENT_ID: 'autocityar',
    API_QUITER_CLIENT_SECRET: '9cb723496c8a3da19d29dc41e5a323ba97776d12',
    API_QUITER_CODE: '6a721b095cda289d6374eae95b0c357620aa20ff'

  },
  pagging    : {
    itemsPerPage  : 10
  },
  storage    : {
    projectId : 'autocity-testing',
    bucketName: 'autocity-mobile-app-api-staging'
  }
};

module.exports = settings;
