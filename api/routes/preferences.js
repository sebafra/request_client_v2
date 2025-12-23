const helpers = require('./_helpers.js');
const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/:code', (req, res) => {
    console.log("PARAMS " + JSON.stringify(req.params));
    
    models.preference.findAll({
        where: {
            'local': 0,
            'codigo': req.params.code
        },
        // group: [
        //     'codigo', 
        //     'descrip'
        // ]
        order: [
            ['description']
        ]
    })
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.send(error);
        })
})

// get all
// router.get('/', (req, res) => helpers.paginate(models.preference, req, res));

// get by id
router.get('/:id', (req, res) => helpers.findById(models.preference, req, res));

// post create 
router.post('/', (req, res) => helpers.save(models.preference, req, res));


// update by id
router.put('/:id', (req, res) => helpers.save(models.preference, req, res));

// delete by id
router.delete('/:id', (req, res) => helpers.delete(models.preference, req, res));


module.exports = router;
