const IoTService = require("../middlewares/iotService");

class IoTController {

    //==================================================
    // DEVICE CONNECT
    //==================================================

    static async connect(req, res) {

        try {

            const {
                deviceCode,
                apiKey
            } = req.body;

            if (!deviceCode || !apiKey) {

                return res.status(400).json({

                    success: false,

                    message: "deviceCode dan apiKey wajib dikirim"

                });

            }

            const ipAddress =
                req.ip ||
                req.connection.remoteAddress;

            const device =
                await IoTService.connectDevice(
                    deviceCode,
                    apiKey,
                    ipAddress
                );

            res.status(200).json({

                success: true,

                message: "Device berhasil terhubung",

                data: device

            });

        } catch (error) {

            res.status(401).json({

                success: false,

                message: error.message

            });

        }

    }


    //==================================================
    // DEVICE INFO
    //==================================================

    static async info(req, res) {

        try {

            const {
                deviceCode,
                apiKey
            } = req.body;

            const device =
                await IoTService.getDeviceInfo(
                    deviceCode,
                    apiKey
                );

            res.status(200).json({

                success: true,

                data: device

            });

        } catch (error) {

            res.status(401).json({

                success: false,

                message: error.message

            });

        }

    }

    // ==================================================
    // POST /api/iot/sensor-reading
    // ==================================================

    static async sensorReading(req, res) {

        try {

            const {
                deviceCode,
                apiKey,
                readings,
                timestamp
            } = req.body;


            // ---------------------------------------------
            // Validasi request
            // ---------------------------------------------

            if (!deviceCode || !apiKey) {

                return res.status(400).json({

                    success: false,

                    message: "deviceCode dan apiKey wajib dikirim"

                });

            }


            if (
                !Array.isArray(readings) ||
                readings.length === 0
            ) {

                return res.status(400).json({

                    success: false,

                    message: "readings wajib berupa array dan tidak boleh kosong"

                });

            }


            // ---------------------------------------------
            // Simpan data
            // ---------------------------------------------

            const result =
                await IoTService.saveSensorReadings(

                    deviceCode,

                    apiKey,

                    readings,

                    timestamp

                );


            return res.status(201).json({

                success: true,

                message: "Data sensor berhasil diterima",

                data: result

            });


        } catch (error) {

            console.error(
                "SENSOR READING ERROR:",
                error
            );


            return res.status(401).json({

                success: false,

                message: error.message

            });

        }

    }

    // ==================================================
    // GET /api/iot/device/:deviceCode
    // ==================================================

    static async getDevice(req, res) {

        try {

            const {
                deviceCode
            } = req.params;


            if (!deviceCode) {

                return res.status(400).json({

                    success: false,

                    message: "deviceCode wajib diberikan"

                });

            }


            const device =
                await IoTService.getDeviceInfo(
                    deviceCode
                );


            return res.status(200).json({

                success: true,

                data: device

            });


        } catch (error) {

            console.error(
                "GET DEVICE ERROR:",
                error
            );


            return res.status(404).json({

                success: false,

                message: error.message

            });

        }

    }
}

module.exports = IoTController;