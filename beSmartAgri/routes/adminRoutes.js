const routes = require('express').Router()
const adminController = require('../controller/adminController')
const { authentication } = require('../middlewares/auth')

routes.use(authentication)
//put role ke user lain
routes.put('/editRole/:id',adminController.changeRole)

//create farm
routes.post('/create-farm',adminController.createFarm)

//list farm
routes.get('/list-farm', adminController.listFarm)

//update farm
routes.patch('/update-farm/:id', adminController.updateFarm)

//delete farm
routes.delete('/delete-farm/:id', adminController.deleteFarm)

//--DEVICE MANAGEMENT--
//create device
routes.post('/create-device', adminController.createDevice)


//create sensor
routes.post('/create-sensor', adminController.createSensor)


//create crops
routes.post('/create-crop', adminController.createCrop)

// list crops
routes.get('/list-crop',adminController.cropList)

// update crop
routes.patch('/update-crop/:id', adminController.updateCrop)
// delete crop
routes.delete('/delete-crop/:id', adminController.deleteCrop)

//assign device

//dan seluruh pembacaan sensor,battery,gee,pokoknya seluruh tabel yang ada


module.exports = routes