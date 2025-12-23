const helpers = require('./_helpers.js');
const express = require('express');
const router = express.Router();
const models = require('../models');
const trae = require('trae');
const settings = require('../config/settings.js').request

// get all
router.get('/', (req, res) => helpers.paginate(models.order, req, res));

// get by id
router.get('/:id', (req, res) => helpers.findById(models.order, req, res));

// post create 
//router.post('/', (req, res) => helpers.save(models.order, req, res));
router.post('/', (req, res) => {
    let model = models.order;

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
          // peticion a la api para estadisticas
          //TODO: Implementar en supabase
          // trae.post(settings.manager.base + settings.manager.orders,params)
        return res.status(200).send( data );
      }).catch(function(err) {
        console.log(err);
        return res.status(400).send( { errors: _self.formatErrors(err) } );
      });
    }
});




// update by id
router.put('/:id', (req, res) => helpers.save(models.order, req, res));

// delete by id
router.delete('/:id', (req, res) => helpers.delete(models.order, req, res));


module.exports = router;
