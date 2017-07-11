const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const customerRoutes = require('./routes/customer')
const vendorRoutes = require('./routes/vendor')
mongoose.Promise = require('bluebird')

app.use(bodyParser.json())

const nodeEnv = process.env.NODE_ENV || "development";
const config = require("./config")[nodeEnv]
mongoose.connect(config.mongoUrl)

app.use(customerRoutes)
app.use(vendorRoutes)

app.listen(3000, function() {
  console.log("App is live!");
})

module.exports = app
