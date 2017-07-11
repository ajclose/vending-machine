const chai = require("chai");
const assert = chai.assert;
const supertest = require("supertest");
const app = require("../app")
const model = require("../models/Item")
const Item = model.Item
const Machine = model.Machine

describe('display money in machine', function() {

  afterEach(function(done){
  Machine.deleteMany().then( function(){
    done()
  })
})
beforeEach(function(done){
  const machine = new Machine()
  machine.save()
  .then( function(machine){

    done();
  })
})

it("displays the current amount of money in the machine", function(done) {
  supertest(app)
  .get('/api/vendor/money')
  .expect(200)
  .expect(function(res) {
  assert.equal(res.body.money, 5000)
  })

  .end(done)
})
})

describe('add item to machine', function() {
  it("adds an item to the items", function(done) {
    supertest(app)
    .post('/api/vendor/items')
    .send({
      description: "beef jerky",
      cost: 100,
      quantity: 5
    })
    .expect(200)
    .expect(function(res) {
      assert.equal(res.body.description, "beef jerky")
      assert.equal(res.body.cost, 100)
      assert.equal(res.body.quantity, 5)
    })
    .end(done)
  })
})

describe('display transaction', function() {

  afterEach(function(done){
  Machine.deleteMany().then( function(){
    done()
  })
})
beforeEach(function(done){
  const machine = new Machine()
  machine.save()
  .then( function(machine){

    done();
  })
})

  const date = new Date()
  Machine.findOne({})
  .then(function(machine) {
    machine.transactions.push({
      status: "Success",
      date: date,
      data: {
        item: {
          description: "Chips",
          cost: 35,
          quantity: 9
        },
        money_given: 35
      }
    })
    machine.save()
    .then(function(machine) {

    })
  })

  it('displays all the of the information from the machine transactions', function(done) {
    supertest(app)
    .get("/api/vendor/purchases")
    .expect(200)
    .expect(function(res) {
      assert.exists(res.body.transactions)
    })
    .end(done)
  })

})

describe('update item', function() {
  let item;
  afterEach(function(done){
  Item.deleteMany().then( function(){
    Machine.deleteMany().then( function() {
          done()
    })

  })
})
beforeEach(function(done){
  const i = new Item()
  i.description = "chips"
  i.cost = 35
  i.quantity = 10
  i.save()
  .then( function(i){
    item = i
    const machine = new Machine()
    machine.save()
    .then(function(machine) {
          done();
    })

  })
})

it('updates the specified field', function(done) {
  supertest(app)
  .put(`/api/vendor/items/${item._id}`)
  .send({
    description: "cookies",
    cost: 35,
    quantity: 10
  })
  .expect(200)
  .expect(function(res) {
    assert.equal(res.body.description, "cookies")
  })
  .end(done)
})

})
