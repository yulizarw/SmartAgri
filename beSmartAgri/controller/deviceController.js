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

const DeviceService = require("../middlewares/deviceService");
const SensorService = require("../middlewares/sensorService");
const { Device, Sensor } = require("../models");

module.exports = class DeviceController {
  static async collect(req, res) {
    try {
      const dto = await DeviceService.collect(req.params.deviceId);
      const save = await SensorService.save(dto);
      res.status(200).json({
        success: true,
        realtime: dto,
        database: save,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  static async fetchDevices(req, res) {
    try {
       const fetchAll=  await Device.findAll()
       if(!fetchAll){
        res.status(404).json("Belum ada Device Terdaftar")
       }
        res.status(200).json(fetchAll)
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  static async fetchSensorsDevice(req,res){
    try {
        const deviceId = req.params.deviceId
        const fetchSensorDevice = await Sensor.findAll({
            where:{
                deviceId
            }
        })
        if(!fetchSensorDevice){
            res.status(404).json("Tidak ada Sensor Terdaftar pada device ini")
        }
        res.status(200).json(fetchSensorDevice)
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  static async fetchAllSensors(req,res){
    try {
        const data = await Sensor.findAll()
        if(!data){
            res.status(404).json('--')
        }
        
        return res.status(200).json(data)
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
};
