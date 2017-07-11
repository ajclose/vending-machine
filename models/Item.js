const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
  description: {type: String, required: true},
  cost: {type: Number, required: true},
  quantity: {type: Number, required: true},
  createdAt: {type: Date, required: true, default: Date.now},
  updatedAt: {type: Date, required: true, default: Date.now}
})

const machineSchema = new mongoose.Schema({
  money: {type: Number, required: true, default: 5000},
  transactions: []
})

const Item = mongoose.model('Item', itemSchema)
const Machine = mongoose.model('Machine', machineSchema)

module.exports = {
  Item: Item,
  Machine: Machine
}
