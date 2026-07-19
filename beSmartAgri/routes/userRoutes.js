const routes = require('express').Router()
const userController = require('../controller/userController')
const { authentication } = require('../middlewares/auth')
// routes.get('/', userController)

// register per role
routes.post('/register', userController.registerUser)
// login per role
routes.post('/login', userController.loginRole)

module.exports = routes