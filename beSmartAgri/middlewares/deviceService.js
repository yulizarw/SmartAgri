const {
    Device,
    Sensor
} = require("../models");

const SimulatorService = require("./simulatorService");
const MQTTService = require("./geeService");

class DeviceService {

    //--------------------------------------------------
    // Cari Device
    //--------------------------------------------------

    static async getDevice(deviceId) {

        const device = await Device.findByPk(deviceId, {

            include: [
                {
                    model: Sensor
                }
            ]

        });

        if (!device) {
            throw new Error("Device tidak ditemukan");
        }

        return device;

    }

    //--------------------------------------------------
    // Ambil Realtime Data
    //--------------------------------------------------

    static async collect(deviceId) {

        const device = await this.getDevice(deviceId);

        switch (process.env.DATA_SOURCE) {

            case "SIMULATOR":

                return await SimulatorService.collect(device);

            case "MQTT":

                return await MQTTService.collect(device);

            case "ESP32":

                throw new Error("ESP32 Service belum dibuat");

            default:

                throw new Error("DATA_SOURCE tidak dikenal");

        }

    }

}

module.exports = DeviceService;