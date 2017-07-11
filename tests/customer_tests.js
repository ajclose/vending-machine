const chai = require("chai");
const assert = chai.assert;
const supertest = require("supertest");
const app = require("../app")
const model = require("../models/Item")
const Item = model.Item
const Machine = model.Machine

describe('displaying items in machine', function() {

  afterEach(function(done){
  Item.deleteMany().then( function(){
    done()
  })
})
beforeEach(function(done){
  const item = new Item()
  item.description = "chips"
  item.cost = 35
  item.quantity = 10
  item.save()
  .then( function(item){

    done();
  })
})

  it("displays all the items in the machine", function(done) {
    supertest(app)
    .get('/api/customer/items')
    .expect(200)
    .end(done)
  })
})

describe('customer purchases item', function() {
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

  it("allows customer to purchase item with money", function(done) {
    supertest(app)
    .post(`/api/customer/items/${item._id}/purchases`)
    .send({
      money_given: 35
    })
    .expect(200)
    .expect(function(res) {
      assert.equal(res.body.money, 5035)
      assert.equal(res.body.item.quantity, 9)
    })
    .end(done)
  })

  it("displays error message if item doesn't exist", function(done) {
    supertest(app)
    .post('/api/customer/items/${item._id}/purchases')
    .expect(200)
    .expect(function(res) {
      assert.equal(res.body.errorMessage, "Item is not in machine!!")
    })
    .end(done)
  })

  it("should give change if the customer gives more money than the cost", function(done) {
    supertest(app)
    .post(`/api/customer/items/${item._id}/purchases`)
    .send({
      money_given: 50
    })
    .expect(200)
    .expect(function(res) {
      assert.equal(res.body.money, 5035)
      assert.equal(res.body.item.quantity, 9)
      assert.equal(res.body.change, 15)
    })
    .end(done)
  })
})
