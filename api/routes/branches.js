const helpers = require('./_helpers.js');
const express = require('express');
const router = express.Router();
const models = require('../models');

// get all
router.get('/', (req, res) => helpers.paginate(models.branch, req, res));

// get local branch
router.get('/local', (req, res) => helpers.findLocalBranch(models.branch, req, res));

// get by id
router.get('/:id', (req, res) => helpers.findById(models.branch, req, res));

// post create 
router.post('/', (req, res) => helpers.save(models.branch, req, res));

// update by id
router.put('/:id', (req, res) => helpers.save(models.branch, req, res));

// delete by id
router.delete('/:id', (req, res) => helpers.delete(models.branch, req, res));



module.exports = router;
