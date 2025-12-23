const helpers = require('./_helpers.js');
const express = require('express');
const router = express.Router();
const models = require('../models');

// get all
router.get('/', (req, res) => helpers.paginate(models.combo, req, res));

// get by id
router.get('/:id', (req, res) => helpers.findById(models.combo, req, res));

// post create 
router.post('/', (req, res) => helpers.save(models.combo, req, res));

// update by id
router.put('/:id', (req, res) => helpers.save(models.combo, req, res));

// delete by id
router.delete('/:id', (req, res) => helpers.delete(models.combo, req, res));


module.exports = router;
