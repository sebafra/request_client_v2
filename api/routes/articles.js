const helpers = require('./_helpers.js');
const express = require('express');
const router = express.Router();
const models = require('../models');
const Sequelize = require('sequelize');
// get all
// router.get('/', (req, res) => helpers.paginate(models.article, req, res));


// rubro y subrubro alfabeticamente
router.get('/', (req, res) => {
    models.article.findAll({
        where: { 
            'INVISIBL': 0,
            'SEVENDE': 1 
        },
        include: [{
            model: models.subcategory,
            where: { categoryId: { $col: 'article.subrubro'}}
        }, {
                model: models.category
            }],
        order: [
            ['categoryId'],
            ['name'],
            ['subcategory', 'name']
        ]
        
        
    })
    .then(response => {
        res.status(200).send(response);
    })
    .catch(error => {
        res.send(error);
    })
})


// router.get('/', (req, res) => {

//     models.article.findAll({
//             where: {
//                 'INVISIBL': 0,
//                 'SEVENDE': 1
//             },
//             include: [{
//                 model: models.subcategory,
//                 where: {
//                     'categoryId': 1
     
//                 }
//             }]
           
//         }).then(function (find) {
//                 res.json(find);
    
//         })
// })

// get by id
router.get('/:id', (req, res) => helpers.findById(models.article, req, res));

// post create 
router.post('/', (req, res) => helpers.save(models.article, req, res));


// update by id
router.put('/:id', (req, res) => helpers.save(models.article, req, res));

// delete by id
router.delete('/:id', (req, res) => helpers.delete(models.article, req, res));


module.exports = router;
