const helpers = require('./_helpers.js');
const express = require('express');
const router = express.Router();
const models = require('../models');

// get all
//router.get('/', (req, res) => helpers.paginate(models.combo_article, req, res));

router.get('/', (req, res) => {
    models.combo_article.findAll({
        include: [{
            model: models.article,
            //attributes: ["name"],
            //where: { id: { $col: 'article.name' } }
            //where: { id: { $col: models.combo_article.article_id }},
            as: "article"
        }]
    })
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.send(error);
        })
})

router.get('/:id', (req, res) => {
    console.log(req.params.id);
    models.combo_article.findAll({
        where: {
            combo_id: req.params.id,
            disabled: 0
        },
        include: [{
            model: models.article,
            attributes: ["name"],
            as: "article"
        }]
    })
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.send(error);
        })
})

// get by id
//router.get('/:id', (req, res) => helpers.findById(models.combo_article, req, res));

// post create 
router.post('/', (req, res) => helpers.save(models.combo_article, req, res));

// update by id
router.put('/:id', (req, res) => helpers.save(models.combo_article, req, res));

// delete by id
router.delete('/:id', (req, res) => helpers.delete(models.combo_article, req, res));


module.exports = router;
