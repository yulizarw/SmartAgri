const {
    Device,
    Sensor
} = require("../models");

class IoTService {

    //==================================================
    // DEVICE CONNECT
    //==================================================

    static async connectDevice(deviceCode, apiKey, ipAddress) {

        const device = await Device.findOne({
            where: {
                deviceCode,
                apiKey
            }
        });

        if (!device) {

            throw new Error(
                "Device tidak terdaftar atau API Key tidak valid"
            );

        }

        // Update informasi device

        await device.update({

            ipAddress: ipAddress || device.ipAddress,

            lastSeen: new Date(),

            status: true

        });

        return {

            id: device.id,

            deviceCode: device.deviceCode,

            deviceName: device.deviceName,

            farmId: device.farmId,

            status: device.status,

            lastSeen: device.lastSeen

        };

    }


    //==================================================
    // DEVICE INFO
    //==================================================

    static async getDeviceInfo(deviceCode, apiKey) {

        const device = await Device.findOne({

            where: {
                deviceCode,
                apiKey
            },

            include: [
                {
                    model: Sensor
                }
            ]

        });

        if (!device) {

            throw new Error(
                "Device tidak ditemukan"
            );

        }

        return device;

    }

}

module.exports = IoTService;