const routes = require('express').Router()
const userRoutes = require('./userRoutes')
// const productRoutes = require('./productRoutes')
const simulatorRoutes = require ('./simulatorRoutes')


// user
routes.use('/user',userRoutes)
// simulator
routes.use('/simulators',simulatorRoutes)

// routes.use('/products', productRoutes)

module.exports = routes