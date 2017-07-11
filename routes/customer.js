const express = require('express')
const router = express.Router()
const models = require('../models/Item')
const Item = models.Item
const Machine = models.Machine

router.get('/api/customer/items', function(req, res) {
  Item.find()
    .then(function(items) {
      res.json(items)
    }).catch(function(error) {
      res.status(422).json(error)
    })
})

router.post('/api/customer/items/:itemId/purchases', function(req, res) {
  const date = new Date()

  Item.findOne({
      _id: req.params.itemId
    })
    .then(function(item) {
      const change = req.body.money_given - item.cost
      item.quantity -= 1
      item.save()
        .then(function(item) {
          Machine.findOne({})
            .then(function(machine) {
              machine.money += item.cost
              machine.transactions.push({
                status: "Success",
                data: {
                  date: date,
                  item: item,
                  money_given: req.body.money_given,
                  change: change
                }
              })
              machine.save()
                .then(function(machine) {
                  res.json({
                    money: machine.money,
                    item: item,
                    change: change
                  })
                }).catch(function(error) {
                  res.status(422).json(error)
                })

            })
        })
    })
    .catch(function(error) {
      res.json({errorMessage: "Item is not in machine!!"})
    })
  })


module.exports = router
