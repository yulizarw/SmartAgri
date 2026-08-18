const routes = require('express').Router()
const deviceController = require ('../controller/deviceController')

// baca data dari reading sensor simulator lalu post
routes.get ('/device/:deviceId', deviceController.collect)

// get all device
routes.get('/fetch',deviceController.fetchDevices)

// get sensor dari device id tertentu
routes.get('/fetch-sensors/:deviceId', deviceController.fetchSensorsDevice)

// get all sensor untuk header
routes.get('/fetch-sensors', deviceController.fetchAllSensors)

module.exports= routes