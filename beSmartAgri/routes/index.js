const routes = require('express').Router()
const userRoutes = require('./userRoutes')
// const productRoutes = require('./productRoutes')
const deviceRoutes = require ('./deviceRoutes')
const adminRoutes = require ('./adminRoutes')
const iotRoutes = require('./iotRoutes')

//Admin
routes.use('/patriot', adminRoutes)

// user
routes.use('/user',userRoutes)
// simulator
routes.use('/devices',deviceRoutes)

//iotRoutes
routes.use('/iot', iotRoutes)






module.exports = routes