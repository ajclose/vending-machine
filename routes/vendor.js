const express = require('express')
const router = express.Router()
const models = require('../models/Item')
const Item = models.Item
const Machine = models.Machine

router.get('/api/vendor/money', function(req, res) {
  Machine.findOne()
  .then(function(machine) {
    console.log(machine);
    res.json(machine)
  })
})

router.post('/api/vendor/items', function(req, res) {
  const item = new Item()
  item.description = req.body.description
  item.cost = req.body.cost
  item.quantity = req.body.quantity
  item.save()
  .then(function(item) {
    res.json(item)
  })
  .catch(function(error) {
    res.status(422).json(error)
  })
})

router.put('/api/vendor/items/:itemId', function(req, res) {
  const date = new Date()
  Item.findOne({
    _id: req.params.itemId
  })
  .then(function(item) {
    item.description = req.body.description
    item.cost = req.body.cost
    item.quantity = req.body.quantity
    item.updatedAt = date
    item.save()
    .then(function(item) {
      res.json(item)
    })
    .catch(function(error) {
      res.status(422).json(error)
    })
  })
})

router.get('/api/vendor/purchases', function(req, res) {
  Machine.findOne({})
  .then(function(machine) {
    const purchases = machine.transactions
    res.json({transactions: purchases})
  }).catch(function(error) {
    res.status(422).json(error)
  })
})



module.exports = router
