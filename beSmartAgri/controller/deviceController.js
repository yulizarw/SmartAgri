// const {
//     Sensor,
//     SensorReading
// } = require('../models')

// const simulatorService = require('../middlewares/simulatorService')
// const axios = require("axios")


// module.exports = class simulatorController {
//     static async generateDataSensorSimulator(req, res) {
//         try {

//             const result =
//                 await simulatorService
//                 .generateAndSaveSensorData();

//             return res.status(201).json({
//                 success: true,
//                 message: "Data simulator berhasil dibuat",
//                 data: result
//             });

//         } catch (error) {

//             return res.status(500).json({
//                 success: false,
//                 message: error.message
//             });

//         }
//     }
// }


const DeviceService=require("../middlewares/deviceService");
const SensorService=require("../middlewares/sensorService");

module.exports = class DeviceController{

    static async collect(req,res){

        try{

            const dto=await DeviceService.collect(req.params.deviceId);

            const save=await SensorService.save(dto);

            res.status(200).json({

                success:true,

                realtime:dto,

                database:save

            });

        }catch(err){

            res.status(500).json({

                success:false,

                message:err.message

            });

        }

    }

}

