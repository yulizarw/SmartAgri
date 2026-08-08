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

                    message:
                        "deviceCode dan apiKey wajib dikirim"

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

}

module.exports = IoTController;