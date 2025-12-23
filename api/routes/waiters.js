const helpers = require('./_helpers.js');
const express = require('express');
const router = express.Router();
const models = require('../models');

// get all
router.get('/', (req, res) => helpers.paginate(models.waiter, req, res));

// get by id
router.get('/:id', (req, res) => helpers.findById(models.waiter, req, res));

// post create 
router.post('/', (req, res) => helpers.save(models.waiter, req, res));


// update by id
router.put('/:id', (req, res) => helpers.save(models.waiter, req, res));

// delete by id
router.delete('/:id', (req, res) => helpers.delete(models.waiter, req, res));


module.exports = router;
