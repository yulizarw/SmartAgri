// const {
//     Device,
//     Sensor
// } = require("../models");

// class IoTService {

//     //==================================================
//     // DEVICE CONNECT
//     //==================================================

//     static async connectDevice(deviceCode, apiKey, ipAddress) {

//         const device = await Device.findOne({
//             where: {
//                 deviceCode,
//                 apiKey
//             }
//         });

//         if (!device) {

//             throw new Error(
//                 "Device tidak terdaftar atau API Key tidak valid"
//             );

//         }

//         // Update informasi device

//         await device.update({

//             ipAddress: ipAddress || device.ipAddress,

//             lastSeen: new Date(),

//             status: true

//         });

//         return {

//             id: device.id,

//             deviceCode: device.deviceCode,

//             deviceName: device.deviceName,

//             farmId: device.farmId,

//             status: device.status,

//             lastSeen: device.lastSeen

//         };

//     }


//     //==================================================
//     // DEVICE INFO
//     //==================================================

//     static async getDeviceInfo(deviceCode, apiKey) {

//         const device = await Device.findOne({

//             where: {
//                 deviceCode,
//                 apiKey
//             },

//             include: [
//                 {
//                     model: Sensor
//                 }
//             ]

//         });

//         if (!device) {

//             throw new Error(
//                 "Device tidak ditemukan"
//             );

//         }

//         return device;

//     }

// }

// module.exports = IoTService;

const {
    Device,
    Sensor,
    SensorReading
} = require("../models");

class IoTService {

    // ==================================================
    // DEVICE CONNECT
    // ==================================================

    static async connectDevice(deviceCode, apiKey, ipAddress) {

        const device = await Device.findOne({
            where: {
                deviceCode: deviceCode
            }
        });

        if (!device) {
            throw new Error("Device tidak terdaftar");
        }

        if (device.apiKey !== apiKey) {
            throw new Error("API Key tidak valid");
        }

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


    // ==================================================
    // DEVICE INFO
    // ==================================================

    static async getDeviceInfo(deviceCode) {

        const device = await Device.findOne({

            where: {
                deviceCode: deviceCode
            },

            include: [{
                model: Sensor
            }]

        });

        if (!device) {
            throw new Error("Device tidak ditemukan");
        }

        return device;
    }


    // ==================================================
    // SENSOR READING
    // ==================================================

    static async saveSensorReadings(
        deviceCode,
        apiKey,
        readings,
        timestamp
    ) {

        // -----------------------------------------------
        // 1. Cari Device
        // -----------------------------------------------

        const device = await Device.findOne({

            where: {
                deviceCode: deviceCode
            }

        });


        if (!device) {

            throw new Error(
                "Device tidak terdaftar"
            );

        }


        // -----------------------------------------------
        // 2. Validasi API Key
        // -----------------------------------------------

        if (device.apiKey !== apiKey) {

            throw new Error(
                "API Key tidak valid"
            );

        }


        // -----------------------------------------------
        // 3. Validasi readings
        // -----------------------------------------------

        if (
            !Array.isArray(readings) ||
            readings.length === 0
        ) {

            throw new Error(
                "Data readings tidak boleh kosong"
            );

        }


        // -----------------------------------------------
        // 4. Timestamp
        // -----------------------------------------------

        const recordedAt =
            timestamp ?
            new Date(timestamp) :
            new Date();


        // -----------------------------------------------
        // 5. Simpan setiap sensor
        // -----------------------------------------------

        const savedReadings = [];

        for (const reading of readings) {

            if (
                !reading.sensorType ||
                reading.value === undefined
            ) {

                continue;

            }


            // Cari sensor berdasarkan device
            // dan sensorType

            const sensor = await Sensor.findOne({

                where: {

                    deviceId: device.id,

                    sensorType: reading.sensorType

                }

            });


            // Sensor belum didaftarkan
            if (!sensor) {

                savedReadings.push({

                    sensorType: reading.sensorType,

                    status: "SENSOR_NOT_REGISTERED"

                });

                continue;

            }


            // -------------------------------------------
            // Simpan Sensor Reading
            // -------------------------------------------

            const sensorReading =
                await SensorReading.create({

                    sensorId: sensor.id,

                    value: reading.value,

                    recordedAt: recordedAt

                });


            savedReadings.push({

                sensorId: sensor.id,

                sensorType: reading.sensorType,

                value: reading.value,

                status: "SUCCESS"

            });

        }


        // -----------------------------------------------
        // 6. Update Device
        // -----------------------------------------------

        await device.update({

            lastSeen: new Date(),

            status: true

        });


        return {

            deviceId: device.id,

            deviceCode: device.deviceCode,

            recordedAt: recordedAt,

            readings: savedReadings

        };

    }

    static async getDeviceInfo(deviceCode) {

        const device = await Device.findOne({

            where: {
                deviceCode: deviceCode
            },

            attributes: {
                exclude: [
                    "apiKey"
                ]
            },

            include: [{
                model: Sensor,

                attributes: {
                    exclude: [
                        "createdAt",
                        "updatedAt"
                    ]
                }
            }]

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