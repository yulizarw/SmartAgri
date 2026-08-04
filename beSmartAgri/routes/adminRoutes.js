const routes = require('express').Router()
const adminController = require('../controller/adminController')
const { authentication } = require('../middlewares/auth')

routes.use(authentication)
//put role ke user lain
routes.put('/editRole/:id',adminController.changeRole)
// patch role user lain

//create farm
routes.post('/create-farm',adminController.createFarm)

//list farm
routes.get('/list-farm', adminController.listFarm)

//create sensor



//assign device

//dan seluruh pembacaan sensor,battery,gee,pokoknya seluruh tabel yang ada


module.exports = routes