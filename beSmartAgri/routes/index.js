const routes = require('express').Router()
const userRoutes = require('./userRoutes')
// const productRoutes = require('./productRoutes')
const deviceRoutes = require('./deviceRoutes')
const adminRoutes = require('./adminRoutes')
const iotRoutes = require('./iotRoutes')
const geeRoutes = require('./geeRoutes')
const cropHealthRoutes = require('./cropHealthRoutes')
const recommendationRoutes = require('./recommendationRoutes')
const decisionLogRoutes = require('./decisionLogRoutes')
const irrigationRoutes = require ('./irrigationRoutes')
//Admin
routes.use('/patriot', adminRoutes)

// user
routes.use('/user', userRoutes)
// simulator
routes.use('/devices', deviceRoutes)

//iotRoutes
routes.use('/iot', iotRoutes)

//geeRoutes

routes.use('/gee', geeRoutes)

routes.use('/cropHealth', cropHealthRoutes)
routes.use('/recommendations', recommendationRoutes)
routes.use('/decision', decisionLogRoutes)
routes.use("/irrigation", irrigationRoutes);




module.exports = routes