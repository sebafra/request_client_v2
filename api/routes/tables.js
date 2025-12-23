const helpers = require('./_helpers.js');
const express = require('express');
const router = express.Router();
const models = require('../models');

// get all
router.get('/', (req, res) => helpers.paginate(models.table, req, res));

// get by id
router.get('/:id', (req, res) => helpers.findById(models.table, req, res));

// post create 
router.post('/', (req, res) => helpers.save(models.table, req, res));


// update by id
router.put('/:id', (req, res) => helpers.save(models.table, req, res));
// router.put('/:id', function (req, res, next) {

//     models.table.update(
//         { status: "Abierta", waiter: 1 , local: 1 },
//         {
//             where: { table: 1 }
//         }
//     ).then(function (data) {
//         return res.status(200).send(data);
//     }).catch(function (err) {
//         console.log(err);
//         return res.status(400).send({ errors: "error" });
//     });
// });

// delete by id
router.delete('/:id', (req, res) => helpers.delete(models.table, req, res));


module.exports = router;
