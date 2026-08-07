// // pengatur proses simulasi.
// // Meminta data dari simulator.
// // Menyimpan data ke database.
// // Menjalankan logic keputusan.
// // Menghasilkan data berulang setiap beberapa detik.

// // initiate data
// const sensorSimulator = require("../simulator/sensorSimulator")

// // initiate model
// const {
//     Sensor,
//     SensorReading,
//     Device
// } = require("../models");

// // const generateAndSaveSensorData = async () => {

// //     // 1. Ambil data dari simulator
// //     const data =
// //         sensorSimulator.generateSensorData();

// //     // 2. Simpan ke database
// //     const result =
// //         await SensorReading.create({
// //             sensorId: 1,
// //             farmId: 1,
// //             timestamp: new Date(),
// //             soilMoisture: data.soilMoisture,
// //             temperature: data.temperature,
// //             humidity: data.humidity,
// //             lux: data.lux,
// //             ph: data.ph,
// //             waterLevel: data.waterLevel,
// //             battery: data.battery
// //         });

// //     return result;
// // };

// const generateAndSaveSensorData = async () => {

//     const data =
//         sensorSimulator.getSensorData();
        
//     const sensors = await Sensor.findAll({
//         include: [{
//             model: Device,
//             // where: {
//             //     farmId: 1
//             // }
//         }]
//     });
//     return (data)
//     console.log(sensors)
//     for (const sensor of sensors) {
//         console.log('aa')
//         console.log({
//             sensorId: sensor.id,
//             sensorType: sensor.sensorType,
//             deviceId: sensor.deviceId,
//             farmId: sensor.Device?.farmId,
//             sensorType:sensor.type
//         });

//             let value;

//             switch (sensor.type) {

//                 case "SOIL_MOISTURE":
//                     value = data.soilMoisture;
//                     break;

//                 case "TEMPERATURE":
//                     value = data.temperature;
//                     break;

//                 case "HUMIDITY":
//                     value = data.humidity;
//                     break;

//                 case "LIGHT":
//                     value = data.lux;
//                     break;

//                 case "PH":
//                     value = data.ph;
//                     break;

//                 case "WATER_LEVEL":
//                     value = data.waterLevel;
//                     break;

//                 case "BATTERY":
//                     value = data.battery;
//                     break;
//             }

//             if (value !== undefined) {

//                 await SensorReading.create({
//                     sensorId: sensor.id,
//                     value: value,
//                     recordedAt: new Date()
//                 });

//             }

//     }

// };


// module.exports = {
//     generateAndSaveSensorData
// };


//// final
class SimulatorService {

    static random(min, max, decimal = 2) {
        return Number((Math.random() * (max - min) + min).toFixed(decimal));
    }

    static async collect(device) {

        return {

            device: {
                id: device.id,
                code: device.deviceCode,
                farmId: device.farmId
            },

            timestamp: new Date(),

            readings: [

                {
                    sensorType: "SOIL_MOISTURE",
                    value: this.random(55, 75),
                    unit: "%"
                },

                {
                    sensorType: "TEMPERATURE",
                    value: this.random(25, 35),
                    unit: "°C"
                },

                {
                    sensorType: "HUMIDITY",
                    value: this.random(65, 95),
                    unit: "%"
                },

                {
                    sensorType: "LIGHT",
                    value: this.random(5000, 12000),
                    unit: "Lux"
                },

                {
                    sensorType: "PH",
                    value: this.random(6.0, 7.5),
                    unit: "pH"
                },

                {
                    sensorType: "WATER_LEVEL",
                    value: this.random(40, 100),
                    unit: "%"
                },

                {
                    sensorType: "BATTERY",
                    value: this.random(70, 100),
                    unit: "%"
                }

            ]

        };

    }

}

module.exports = SimulatorService;