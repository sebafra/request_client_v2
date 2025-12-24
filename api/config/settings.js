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
  port       : 3076, //process.env.NODE_PORT || 3076,
  database   : {
    logging  : 'console.log',
    timezone : '-03:00',
    protocol : 'mssql',
    host     : 'intranet01.dyndns.org', //'172.20.16.124'
    port     :  1436, //11438,
    name     : 'mrccentral',
    username : 'sa',
    password : 'Panicafe2018',//'MLC_2012',
    instanceName: "stk"
  },
  pagging    : {
    itemsPerPage  : 10
  },
  storage    : {
    projectId : 'autocity-testing',
    bucketName: 'autocity-mobile-app-api-staging'
  },
  request: {
    branchId: "68273f1116893267c0bd256a", //process.env.BRANCH_ID //5cb0bd1e062f521ed8b4044c //5cb0c21f062f521ed8b4044e
    manager: {
      offline: false,
      base: "http://vps-1060583-x.dattaweb.com:3075/api", //http://localhost:3075/api
      users: "/users/check",
      orders: "/orders",
      supabase: {
        baseUrl: "https://pweaipgadbuaofaonpge.supabase.co/rest/v1",
        headers: {
          "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3ZWFpcGdhZGJ1YW9mYW9ucGdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDU5OTMsImV4cCI6MjA3MTI4MTk5M30.M31qw9lTMD2Xm2GG_5bk1RVzvkcsYGV3Yb-YHWGhfA0",
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3ZWFpcGdhZGJ1YW9mYW9ucGdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDU5OTMsImV4cCI6MjA3MTI4MTk5M30.M31qw9lTMD2Xm2GG_5bk1RVzvkcsYGV3Yb-YHWGhfA0",
          "Content-Type": "application/json"
        }
      }
    }
  }
};

module.exports = settings;
