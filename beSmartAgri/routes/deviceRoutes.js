const routes = require('express').Router()
const deviceController = require ('../controller/deviceController')

// baca data dari reading sensor simulator lalu post
routes.get ('/device/:deviceId', deviceController.collect)

module.exports= routes