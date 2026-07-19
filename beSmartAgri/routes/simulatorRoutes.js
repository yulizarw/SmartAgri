const routes = require('express').Router()
const simulatorController = require ('../controller/simulatorController')

// baca data dari reading sensor simulator lalu post
routes.get ('/generateData', simulatorController.generateDataSensorSimulator)

module.exports= routes