const url = require('url');
const fs = require('fs');
const _ = require('lodash');
const models = require('../models');
const path = require('path');
const moment = require('moment');
const uuid = require('uuid');
const Storage = require('@google-cloud/storage');
const settings = require('../config/settings.js')

module.exports = {

  toMysqlDate: function (date) {
    return moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');
  },


  toHumanDate: function (date) {
    return moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY');
  },

  deleteFilesOri: function (req, res) {
    console.log('entro', req.body)
    if (req.body && Array.isArray(req.body)) {
      req.body.forEach(el => {
        fs.unlink(`${req.settings.imagesDir}/${el}`, err => {
          console.log(`error al borrar el archivo. ${err}`)
        })
        fs.unlink(`${req.settings.imagesDir}/small-${el}`, err => {
          if (err) {
            console.log(`error al borrar el archivo. ${err}`)
          }
        })
      })
      res.status(200).send({
        message: 'Archivos borrados con exito'
      })
    } else {
      res.status(400).send({
        message: 'bad request',
        body: req.body
      })
    }
  },

  uploadOri: function (req, res, next, cb) {

    var prefix = '';
    if (req.originalUrl) {
      var p = req.originalUrl.split('/');
      if (p.length >= 3) {
        prefix = p[1] + '_';
      }
    }

    var _self = this;
    if (req.files && req.files.file) {
      var file = req.files.file;
      var tmp = file.type.split('/');
      if (tmp.length == 2) {
        var newFileName = prefix + uuid.v4() + '.' + tmp[1];
        console.log('filesdir file name ', req.settings.imagesDir + newFileName)
        console.log('File path ', file.path)
        fs.rename(file.path, req.settings.imagesDir + newFileName, function(err) {
          console.log(err);
          if (err) {
            return res.status(400).send( { errors: _self.formatErrors(err) } );
          } else {
            if (cb) {
              cb(newFileName);
            }
            return res.status(200).send({ file : newFileName });
          }
        });
      } else {
        return res.status(400).send( { errors: 'No files uploaded' } );
      }
    } else {
      return res.status(400).send( { errors: 'No file uploaded' } );
    }
  },

  deleteFiles: function (req, res) {
    console.log('entro', req.body)
    if (req.body) {

      var promises = [];
      const storage = new Storage({
        projectId: req.settings.storage.projectId,
      });

      req.body.forEach(el => {
        fs.unlink(`${req.settings.imagesDir}/${el}`, err => {
          console.log(`error al borrar el archivo. ${err}`)
        });
        fs.unlink(`${req.settings.imagesDir}/small-${el}`, err => {
          if (err) {
            console.log(`error al borrar el archivo. ${err}`)
          }
        });

        promises.push(
          storage
            .bucket(req.settings.storage.bucketName)
            .file(el)
            .delete()
        );
      });

      Promise.all(promises)
          .then(() => {
            res.status(200).send({message: 'Archivos borrados con exito'})
          })
          .catch((e) => {
            console.error('ERROR:', e);
            return res.status(400).send( { errors: e.message } );
          });


    } else {
      res.status(400).send({
        message: 'bad request',
        body: req.body
      })
    }
  },


  upload: function (req, res, next, cb) {

    var prefix = '';
    if (req.originalUrl) {
      var p = req.originalUrl.split('/');
      if (p.length >= 3) {
        prefix = p[1] + '_';
      }
    }

    var _self = this;
    if (req.files && req.files.file) {
      var file = req.files.file;
      var tmp = file.type.split('/');
      if (tmp.length == 2) {
        var newFileName = prefix + uuid.v4() + '.' + tmp[1];
        fs.rename(file.path, req.settings.imagesDir + newFileName, function(err) {
          console.log(err);
          if (err) {
            return res.status(400).send( { errors: _self.formatErrors(err) } );
          } else {

            const storage = new Storage({
              projectId: req.settings.storage.projectId,
            });

            const filename = req.settings.imagesDir + newFileName;
            storage
              .bucket(req.settings.storage.bucketName)
              .upload(filename,{public:true})
              .then(() => {
                console.log(`${filename} uploaded to ${req.settings.storage.bucketName}.`);
                return res.status(200).send({ file : newFileName });
              })
              .catch(err => {
                console.error('ERROR:', err);
                return res.status(400).send( { errors: 'No file uploaded' } );
              });
          }
        });
      } else {
        return res.status(400).send( { errors: 'No files uploaded' } );
      }
    } else {
      return res.status(400).send( { errors: 'No file uploaded' } );
    }



    /*
    // Your Google Cloud Platform project ID
    const projectId = 'autocity-testing';

    // Creates a client
    const storage = new Storage({
      projectId: projectId,
    });

    // The name for the new bucket
    const bucketName = 'autocity-mobile-app-api-staging';

    // The name for the new bucket
    const filename = '/Users/macbook/Downloads/diproach2.jpg';

    const options = {
       public: true
    };

    storage
      .bucket(bucketName)
      .upload(filename,options)
      .then(() => {
        console.log(`${filename} uploaded to ${bucketName}.`);
      })
      .catch(err => {
        console.error('ERROR:', err);
      });
    */
  },

  findById: function(model, req, res) {
    let _self = this;
    // var options = {};
    // if (req.extraOptions) {
    //   if (req.extraOptions.include) {
    //     options.include = req.extraOptions.include;
    //   }
    // }
    var options = _self.getOptions(model, req);
    console.log(options);
    model.findById(req.params.id, options).then(function(item) {
      if(item) {
        if (typeof res === 'function') {
          res(item);
        } else {
          res.json(item);
        }
      } else {
        return res.status(404).send( { errors : _self.formatErrors({'name': 'Item Not Found', 'message': 'Item ID: '+ req.params.id +' Not Found'}) } );
      }
    });
  },
  findLocalBranch: function(model, req, res) {
    console.log("Find local branch method in");
    let _self = this;
    // var options = {};
    // if (req.extraOptions) {
    //   if (req.extraOptions.include) {
    //     options.include = req.extraOptions.include;
    //   }
    // }
    var options = _self.getOptions(model, req);
    console.log(options);
    console.log("settings.request.branch : " + settings.request.branch);
    model.findById(settings.request.branch, options).then(function(item) {
      if(item) {
        if (typeof res === 'function') {
          res(item);
        } else {
          res.json(item);
        }
      } else {
        return res.status(404).send( { errors : _self.formatErrors({'name': 'Item Not Found', 'message': 'Item ID: '+ req.params.id +' Not Found'}) } );
      }
    });
  },

  delete: function(model, req, res) {
    let _self = this;
    model.findById(req.params.id).then(function(item) {
      if (item) {
        item.destroy().then(function() {
          return res.status(200).json({
            message: `item con id: ${item.id} eliminado con exito`
          });
        }).catch(function(err) {
          return res.status(400).send( { errors : _self.formatErrors(err) } );
        });
      } else {
        return res.status(404).send( { errors : _self.formatErrors({'name': 'Item Not Found', 'message': 'Item ID: '+ req.params.id +' Not Found'}) } );
      }
    })
  },

  paginate: function(model, req, res) {

    console.log("******************");
    console.log(req.userLoggedIn);
    console.log("******************");

    var _self = this;
    var options = _self.getOptions(model, req);
    model.findAll(options).then(function(find) {
      // ving includes to avoid being counted
      // options.include = null;
      model.count(options).then(function(count) {
        console.log(count);
        if (typeof res === 'function') {
          //console.log(find[0].get());
          res(find, count);
        } else {
          res.set({
            'Access-Control-Expose-Headers' :   'X-Total-Count,X-User-Logged-In,X-User-Code',
            'X-Total-Count' :                   count,
            'X-User-Logged-In' :                req.userLoggedIn,
            'X-User-Code' :                     req.userCode
          });
          res.json(find);
        }
      })
    });
  },

  paginateSearch: function(model, req, res) {
    var _self = this;
    var options = _self.getOptionsSearch(model, req);
    model.findAll(options).then(function(find) {
      // removing includes to avoid being counted
      // options.include = null;
      model.count(options).then(function(count) {
        console.log(count);
        if (typeof res === 'function') {
          //console.log(find[0].get());
          res(find, count);
        } else {
          res.set({
            'Access-Control-Expose-Headers' :   'X-Total-Count',
            'X-Total-Count' :                   count
          });
          res.json(find);
        }
      })
    });


  },

  save: function(model, req, res) {

    var _self = this;

    var params = req.body;
    if (req.params.id) {
      params.id = req.params.id;
    }

    if (params.id) {
      model.update( params, { where: { id : params.id } } ).then(function(data) {
        return res.status(200).send( data );
      }).catch(function(err) {
        return res.status(400).send( { errors: _self.formatErrors(err) } );
      });
    } else {
      model.create(params).then(function(data) {
        return res.status(200).send( data );
      }).catch(function(err) {
        console.log(err);
        return res.status(400).send( { errors: _self.formatErrors(err) } );
      });
    }
  },

  getDateConditions: function(req, model) {
    let alias = '';
    if (model) {
      alias = model + '.';
    }
    let params = this.parseQueryString(req);
    let where = null;
    if (params && params._filters) {
      params._filters = JSON.parse(params._filters);
      if (params._filters.dateFrom && params._filters.dateTo) {
        where = models.sequelize.literal('DATE(' + alias + 'date) >= "' + params._filters.dateFrom + '" AND DATE(' + alias + 'date) <= "' + params._filters.dateTo + '"');
      } else {
        if (params._filters.dateFrom) {
          where = models.sequelize.literal('DATE(' + alias + 'date) >= "' + params._filters.dateFrom + '"');
        }
        if (params._filters.dateTo) {
          where = models.sequelize.literal('DATE(' + alias + 'date) <= "' + params._filters.dateTo + '"');
        }
      }
    }
    return where;
  },

  getOptionsSearch: function(model, req) {

    var urlParts = url.parse(req.url, true);
    var queryParams = urlParts.query;

    var options = {};
    var filters = {};

    console.log("================= SEARCH ===================");
    console.log(queryParams._filters_serach);
    console.log("================= SEARCH ===================");

    if (queryParams._filters_serach) {
      var criterias = JSON.parse(queryParams._filters_serach);

      console.log("================= FOR ===================");
      var filters_like = [];
      for(var i = 0 ; i < criterias.length ; i++){
        console.log(criterias[i]);
        var f = { $like : '%' + criterias[i] + '%' };
        filters_like.push(f);
      }
      filters.art_descripcion = { $or : filters_like };

      // RUBROS
      /*var where = {};
      where.rub_descripcion = { $or : filters_like };
      req.extraOptions.include.push({
            model: models.rubros,
            where: where
        });*/
      console.log("================= FOR ===================");

      /*if (criterias.art_descripcion) {
        filters.art_descripcion = { $like : '%' + criterias.art_descripcion + '%' };
        delete criterias.art_descripcion;
      }*/

      /*for (var field in criterias) {
        filters[field] = criterias[field];
      }*/

      //if (Object.keys(filters).length > 0) {
      console.log("================= WHERE ===================");
      console.log(filters);
        options.where = filters;
      console.log("================= WHERE ===================");
      //}

    }

    if (queryParams._page && queryParams._perPage) {
      var page = null;
      if (queryParams._perPage) {
        page = parseInt(queryParams._page);
      } else {
        page = 1
      }
      page--;

      var perPage = null;
      if (queryParams._perPage) {
        perPage = parseInt(queryParams._perPage);
      } else {
        perPage = req.settings.pagging.itemsPerPage;
      }
      options.limit = perPage;
      options.offset = page * perPage;
    }

    var sort = null;
    if (queryParams._sortField) {
      sort = queryParams._sortField;
    }
    if (sort && queryParams._sortDir) {
      sort = [ [ sort, queryParams._sortDir ] ];
    }
    options.order = sort;

    if (req.extraOptions) {
      if (req.extraOptions.where) {
        if (options.where) {
          options.where = _.flatten([options.where, req.extraOptions.where]);
        } else {
          options.where = req.extraOptions.where;
        }
      }

      if (req.extraOptions.order) {
        if (options.order) {
          options.order = _.flatten([options.order, req.extraOptions.order]);
        } else {
          options.order = req.extraOptions.order;
        }
      }

      if (req.extraOptions.include) {
        options.include = req.extraOptions.include;
      }
    }

    return options;

  },

  getOptions: function (model, req) {

    var urlParts = url.parse(req.url, true);
    var queryParams = urlParts.query;

    console.log('query Params ', queryParams);

    var options = {};
    var filters = {};

    console.log("====================================");
    console.log(queryParams._filters);
    console.log("====================================");

    if (queryParams._filters) {
      var criterias = JSON.parse(queryParams._filters);

      if (criterias.dateFrom && criterias.dateTo) {
        filters.date = { $between: [criterias.dateFrom, criterias.dateTo] };
        delete criterias.dateFrom;
        delete criterias.dateTo;
      }

      if (criterias.dateFrom) {
        filters.date = { $gte: "'" + criterias.dateFrom + "'" };
        delete criterias.dateFrom;
      }

      if (criterias.dateTo) {
        filters.date = { $lte: "'" + criterias.dateTo + "'" };
        delete criterias.dateTo;
      }

      if (criterias.email) {
        filters.email = { $like: '%' + criterias.email + '%' };
        delete criterias.email;
      }

      if (criterias.name) {
        filters.name = { $like: '%' + criterias.name + '%' };
        delete criterias.name;
      }

      if (criterias.value) {
        filters.value = { $like: '%' + criterias.value + '%' };
        delete criterias.value;
      }

      if (criterias.data) {
        filters.data = { $like: '%' + criterias.data + '%' };
        delete criterias.data;
      }

      for (var field in criterias) {
        filters[field] = criterias[field];
      }

      if (Object.keys(filters).length > 0) {
        options.where = filters;
      }

    }

    if (queryParams._page && queryParams._perPage) {
      var page = null;
      if (queryParams._perPage) {
        page = parseInt(queryParams._page);
      } else {
        page = 1
      }
      page--;

      var perPage = null;
      if (queryParams._perPage) {
        perPage = parseInt(queryParams._perPage);
      } else {
        perPage = req.settings.pagging.itemsPerPage;
      }
      options.limit = perPage;
      options.offset = page * perPage;
    }

    var sort = null;
    // if (queryParams._sortField) {
    //   sort = queryParams._sortField;
    // }
    // if (sort && queryParams._sortDir) {
    //   sort = [ [ sort, queryParams._sortDir ] ];
    // }



    if (queryParams._sort) {
      try {
        sort = JSON.parse(queryParams._sort);
      } catch (error) {
        console.error(error);
      }
    }

    options.order = Array.isArray(sort) ? sort : null;

    console.log('@@@@@@@@@@@@ order ', options.order);

    // options.order = sort;

    if (req.query._populates) {
      console.log('POPULATESSSSSS ', req.query._populates)
      var populates = JSON.parse(req.query._populates);
      req.extraOptions = { include: populates };
      console.log('POPULATESSSS: REQ', req.extraOptions)
    }


    if (req.extraOptions) {
      if (req.extraOptions.where) {
        if (options.where) {
          options.where = _.flatten([options.where, req.extraOptions.where]);
        } else {
          options.where = req.extraOptions.where;
        }
      }

      if (req.extraOptions.order) {
        if (options.order) {
          options.order = _.flatten([options.order, req.extraOptions.order]);
        } else {
          options.order = req.extraOptions.order;
        }
      }

      if (req.extraOptions.include) {
        options.include = req.extraOptions.include;
      }


    }

    return options;

  },

  getOptions_old: function(model, req) {

    var urlParts = url.parse(req.url, true);
    var queryParams = urlParts.query;

    var options = {};
    var filters = {};

    console.log("====================================");
    console.log(queryParams._filters);
    console.log("====================================");

    if (queryParams._filters) {
      var criterias = JSON.parse(queryParams._filters);

      if (criterias.dateFrom && criterias.dateTo) {
        filters.date = { $between : [ criterias.dateFrom, criterias.dateTo ] };
        delete criterias.dateFrom;
        delete criterias.dateTo;
      }

      if (criterias.dateFrom) {
        filters.date = { $gte : "'" + criterias.dateFrom + "'" };
        delete criterias.dateFrom;
      }

      if (criterias.dateTo) {
        filters.date = { $lte : "'" + criterias.dateTo + "'" };
        delete criterias.dateTo;
      }

      if (criterias.email) {
        filters.email = { $like : '%' + criterias.email + '%' };
        delete criterias.email;
      }

      if (criterias.name) {
        filters.name = { $like : '%' + criterias.name + '%' };
        delete criterias.name;
      }

      if (criterias.value) {
        filters.value = { $like : '%' + criterias.value + '%' };
        delete criterias.value;
      }

      if (criterias.data) {
        filters.data = { $like : '%' + criterias.data + '%' };
        delete criterias.data;
      }

      for (var field in criterias) {
        filters[field] = criterias[field];
      }

      if (Object.keys(filters).length > 0) {
        options.where = filters;
      }

    }

    if (queryParams._page && queryParams._perPage) {
      var page = null;
      if (queryParams._perPage) {
        page = parseInt(queryParams._page);
      } else {
        page = 1
      }
      page--;

      var perPage = null;
      if (queryParams._perPage) {
        perPage = parseInt(queryParams._perPage);
      } else {
        perPage = req.settings.pagging.itemsPerPage;
      }
      options.limit = perPage;
      options.offset = page * perPage;
    }

    var sort = null;
    if (queryParams._sortField) {
      sort = queryParams._sortField;
    }
    if (sort && queryParams._sortDir) {
      sort = [ [ sort, queryParams._sortDir ] ];
    }
    options.order = sort;

    if(req.query._populates){
      var populates = JSON.parse(req.query._populates);
      req.extraOptions = { include : populates };
    }


    if (req.extraOptions) {
      if (req.extraOptions.where) {
        if (options.where) {
          options.where = _.flatten([options.where, req.extraOptions.where]);
        } else {
          options.where = req.extraOptions.where;
        }
      }

      if (req.extraOptions.order) {
        if (options.order) {
          options.order = _.flatten([options.order, req.extraOptions.order]);
        } else {
          options.order = req.extraOptions.order;
        }
      }

      if (req.extraOptions.include) {
        options.include = req.extraOptions.include;
      }


    }

    return options;

  },

  parseQueryString: function(req) {
    var urlParts = url.parse(req.url, true);
    return urlParts.query;
  },


  formatErrors: function(errorsIn) {
    var errors = [ ];

    if (typeof errorsIn == 'object') {
      var error = {
        name      : errorsIn['name'],
        message   : errorsIn['message'],
      };

      if (errorsIn.fields) {
        error.extra = errorsIn.fields;
      }

      if (errorsIn.sql) {
        error.sql = errorsIn.sql;
      }
      errors.push( error );
    } else if (typeof errorsIn == 'array') {
    }

    return errors;
  }
};
