const {
    Sensor,
    SensorReading
} = require('../models')

const simulatorService = require('../middlewares/simulatorService')
const axios = require("axios")


module.exports = class simulatorController {
    static async generateDataSensorSimulator(req, res) {
        try {

            const result =
                await simulatorService
                .generateAndSaveSensorData();

            return res.status(201).json({
                success: true,
                message: "Data simulator berhasil dibuat",
                data: result
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }
    }
}