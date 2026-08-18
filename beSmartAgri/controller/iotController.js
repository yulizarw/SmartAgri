const IoTService = require("../middlewares/iotService");
const { SensorReading, Sensor } = require("../models");

class IoTController {
  //==================================================
  // DEVICE CONNECT
  //==================================================

  static async connect(req, res) {
    try {
      const { deviceCode, apiKey } = req.body;

      if (!deviceCode || !apiKey) {
        return res.status(400).json({
          success: false,

          message: "deviceCode dan apiKey wajib dikirim",
        });
      }

      const ipAddress = req.ip || req.connection.remoteAddress;

      const device = await IoTService.connectDevice(
        deviceCode,
        apiKey,
        ipAddress,
      );

      res.status(200).json({
        success: true,

        message: "Device berhasil terhubung",

        data: device,
      });
    } catch (error) {
      res.status(401).json({
        success: false,

        message: error.message,
      });
    }
  }

  //==================================================
  // DEVICE INFO
  //==================================================

  static async info(req, res) {
    try {
      const { deviceCode, apiKey } = req.body;

      const device = await IoTService.getDeviceInfo(deviceCode, apiKey);

      res.status(200).json({
        success: true,

        data: device,
      });
    } catch (error) {
      res.status(401).json({
        success: false,

        message: error.message,
      });
    }
  }

  // ==================================================
  // POST /api/iot/sensor-reading
  // ==================================================

  static async sensorReading(req, res) {
    try {
      const { deviceCode, apiKey, readings, timestamp } = req.body;

      // ---------------------------------------------
      // Validasi request
      // ---------------------------------------------

      if (!deviceCode || !apiKey) {
        return res.status(400).json({
          success: false,

          message: "deviceCode dan apiKey wajib dikirim",
        });
      }

      console.log(readings, "dari raul");
      if (!Array.isArray(readings) || readings.length === 0) {
        return res.status(400).json({
          success: false,

          message: "readings wajib berupa array dan tidak boleh kosong",
        });
      }

      // ---------------------------------------------
      // Simpan data
      // ---------------------------------------------

      const result = await IoTService.saveSensorReadings(
        deviceCode,

        apiKey,

        readings,

        timestamp,
      );

      return res.status(201).json({
        success: true,

        message: "Data sensor berhasil diterima",

        data: result,
      });
    } catch (error) {
      console.error("SENSOR READING ERROR:", error);

      return res.status(401).json({
        success: false,

        message: error.message,
      });
    }
  }
  // ==================================================
  // Get /api/iot/get-reading
  // ==================================================
  static async fetchReading(req, res) {
    try {
      const data = await SensorReading.findAll({
        include: [
          {
            model: Sensor,
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      console.log(data);
      if (!data) {
        res.status(404).json("Tidak Ada Readings");
      }
      res.status(200).json(data);
    } catch (error) {
      console.error("SENSOR READING ERROR:", error);

      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }
  // debug
  // static async saveSensorReadings(
  //     deviceCode,
  //     apiKey,
  //     readings,
  //     timestamp
  // ) {

  //     console.log("================================");
  //     console.log("START SENSOR READING");
  //     console.log("deviceCode :", deviceCode);
  //     console.log("apiKey     :", apiKey);
  //     console.log("readings   :", readings);
  //     console.log("================================");

  //     // =========================================
  //     // CARI DEVICE
  //     // =========================================

  //     const device = await Device.findOne({
  //         where: {
  //             deviceCode: deviceCode
  //         }
  //     });

  //     console.log("DEVICE:", device);

  //     if (!device) {
  //         throw new Error("Device tidak terdaftar");
  //     }

  //     // =========================================
  //     // VALIDASI API KEY
  //     // =========================================

  //     if (device.apiKey !== apiKey) {

  //         console.log("API KEY DB      :", device.apiKey);
  //         console.log("API KEY REQUEST :", apiKey);

  //         throw new Error("API Key tidak valid");
  //     }

  //     // =========================================
  //     // VALIDASI READINGS
  //     // =========================================

  //     if (!Array.isArray(readings)) {
  //         throw new Error("readings harus berupa array");
  //     }

  //     // =========================================
  //     // LOOP SENSOR
  //     // =========================================

  //     const result = [];

  //     for (const reading of readings) {

  //         console.log("--------------------------------");
  //         console.log("READING:", reading);

  //         // =====================================
  //         // CARI SENSOR
  //         // =====================================

  //         const sensor = await Sensor.findOne({
  //             where: {
  //                 deviceId: device.id,
  //                 sensorType: reading.sensorType
  //             }
  //         });

  //         console.log("SENSOR:", sensor);

  //         if (!sensor) {

  //             console.log(
  //                 "Sensor tidak ditemukan:",
  //                 reading.sensorType
  //             );

  //             result.push({
  //                 sensorType: reading.sensorType,
  //                 value: reading.value,
  //                 status: "SENSOR_NOT_REGISTERED"
  //             });

  //             continue;
  //         }

  //         // =====================================
  //         // INSERT SENSOR READING
  //         // =====================================

  //         console.log("AKAN INSERT:");

  //         console.log({
  //             sensorId: sensor.id,
  //             value: Number(reading.value),
  //             recordedAt: timestamp ?
  //                 new Date(timestamp) :
  //                 new Date()
  //         });

  //         const sensorReading =
  //             await SensorReading.create({

  //                 sensorId: sensor.id,

  //                 value: Number(reading.value),

  //                 recordedAt: timestamp ?
  //                     new Date(timestamp) :
  //                     new Date()

  //             });

  //         console.log(
  //             "BERHASIL INSERT:",
  //             sensorReading.toJSON()
  //         );

  //         result.push({

  //             sensorId: sensor.id,

  //             sensorType: sensor.sensorType,

  //             value: sensorReading.value,

  //             recordedAt: sensorReading.recordedAt,

  //             status: "SUCCESS"

  //         });

  //     }

  //     // =========================================
  //     // UPDATE DEVICE
  //     // =========================================

  //     await device.update({

  //         lastSeen: new Date(),

  //         status: true

  //     });

  //     return {

  //         deviceId: device.id,

  //         deviceCode: device.deviceCode,

  //         farmId: device.farmId,

  //         readings: result

  //     };

  // }

  // ==================================================
  // GET /api/iot/device/:deviceCode
  // ==================================================

  static async getDevice(req, res) {
    try {
      const { deviceCode } = req.params;

      if (!deviceCode) {
        return res.status(400).json({
          success: false,

          message: "deviceCode wajib diberikan",
        });
      }

      const device = await IoTService.getDeviceInfo(deviceCode);

      return res.status(200).json({
        success: true,

        data: device,
      });
    } catch (error) {
      console.error("GET DEVICE ERROR:", error);

      return res.status(404).json({
        success: false,

        message: error.message,
      });
    }
  }

  //   get reading per device
  // static async getReadingPerDevice(req, res) {
  //   try {
  //       const id= req.params.deviceId
  //       const data = await SensorReading.findAll({
  //           where:{
  //               sensorId:id
  //           }
  //       })
  //       return res.status(200).json(data)
  //   } catch (error) {
  //     console.error("GET DEVICE ERROR:", error);

  //     return res.status(404).json({
  //       success: false,

  //       message: error.message,
  //     });
  //   }
  // }
  static async getReadingPerDevice(req, res) {
    try {
      const deviceId = req.params.deviceId;

      const data = await SensorReading.findAll({
        include: [
          {
            model: Sensor,
            where: {
              deviceId: deviceId,
            },
            required: true,
          },
        ],
        order: [["recordedAt", "DESC"]],
      });

      return res.status(200).json(data);
    } catch (error) {
      console.error("GET DEVICE ERROR:", error);

      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = IoTController;
