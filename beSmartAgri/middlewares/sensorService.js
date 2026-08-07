const {
    Sensor,
    SensorReading
} = require("../models");

class SensorService {

    static async save(dto) {

        const result = [];

        for (const reading of dto.readings) {

            const sensor = await Sensor.findOne({

                where: {

                    deviceId: dto.device.id,

                    sensorType: reading.sensorType

                }

            });

            if (!sensor) {

                result.push({

                    sensor: reading.sensorType,

                    status: "NOT FOUND"

                });

                continue;

            }

            const save = await SensorReading.create({

                sensorId: sensor.id,

                value: reading.value,

                recordedAt: dto.timestamp

            });

            result.push({

                sensor: reading.sensorType,

                value: reading.value,

                status: "SUCCESS"

            });

        }

        return result;

    }

}

module.exports = SensorService;