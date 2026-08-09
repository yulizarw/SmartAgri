// const {
//     Crop,
//     GeeHistory,
//     WeatherForecast,
//     CropHealth
// } = require("../models");

// const {
//     Op
// } = require("sequelize");

// // ini masih pake statistik dlu belum ada riset mendetail ttg crop health ini
// class CropHealthService {


//     // =====================================================
//     // HELPER
//     // Mendapatkan range tanggal 1 hari
//     // =====================================================

//     static getDateRange(targetDate) {

//         const dateRegex =
//             /^\d{4}-\d{2}-\d{2}$/;

//         if (!dateRegex.test(targetDate)) {

//             throw new Error(
//                 "Format tanggal harus YYYY-MM-DD"
//             );

//         }

//         // Indonesia / WIB
//         const startDate =
//             new Date(
//                 `${targetDate}T00:00:00.000+07:00`
//             );

//         const endDate =
//             new Date(startDate);

//         endDate.setDate(
//             endDate.getDate() + 1
//         );

//         return {
//             startDate,
//             endDate
//         };

//     }


//     // =====================================================
//     // HELPER
//     // Membatasi nilai score 0 - 100
//     // =====================================================

//     static clampScore(value) {

//         if (
//             value === null ||
//             value === undefined ||
//             Number.isNaN(Number(value))
//         ) {

//             return null;

//         }

//         return Math.max(
//             0,
//             Math.min(
//                 100,
//                 Number(value)
//             )
//         );

//     }


//     // =====================================================
//     // HELPER
//     // Konversi NDVI menjadi score
//     // =====================================================

//     static calculateNDVIScore(ndvi) {

//         if (
//             ndvi === null ||
//             ndvi === undefined
//         ) {

//             return null;

//         }

//         /*
//          * NDVI generic interpretation:
//          *
//          * < 0.20  = sangat rendah
//          * 0.20-0.40 = rendah
//          * 0.40-0.60 = sedang
//          * 0.60-0.80 = baik
//          * > 0.80 = sangat baik
//          */

//         let score;

//         if (ndvi < 0.20) {

//             score = 20;

//         } else if (ndvi < 0.40) {

//             score = 40;

//         } else if (ndvi < 0.60) {

//             score = 65;

//         } else if (ndvi < 0.80) {

//             score = 85;

//         } else {

//             score = 100;

//         }

//         return score;

//     }


//     // =====================================================
//     // VEGETATION SCORE
//     // =====================================================

//     static calculateVegetationScore(
//         gee
//     ) {

//         const scores = [];


//         // ---------------------------------------------
//         // NDVI
//         // ---------------------------------------------

//         if (
//             gee.ndvi !== null &&
//             gee.ndvi !== undefined
//         ) {

//             scores.push(
//                 this.calculateNDVIScore(
//                     gee.ndvi
//                 )
//             );

//         }


//         // ---------------------------------------------
//         // EVI
//         // ---------------------------------------------

//         if (
//             gee.evi !== null &&
//             gee.evi !== undefined
//         ) {

//             let eviScore;

//             if (gee.evi < 0.10) {

//                 eviScore = 20;

//             } else if (gee.evi < 0.25) {

//                 eviScore = 40;

//             } else if (gee.evi < 0.40) {

//                 eviScore = 65;

//             } else if (gee.evi < 0.60) {

//                 eviScore = 85;

//             } else {

//                 eviScore = 100;

//             }

//             scores.push(eviScore);

//         }


//         // ---------------------------------------------
//         // GNDVI
//         // ---------------------------------------------

//         if (
//             gee.gndvi !== null &&
//             gee.gndvi !== undefined
//         ) {

//             let gndviScore;

//             if (gee.gndvi < 0.15) {

//                 gndviScore = 20;

//             } else if (gee.gndvi < 0.30) {

//                 gndviScore = 40;

//             } else if (gee.gndvi < 0.50) {

//                 gndviScore = 65;

//             } else if (gee.gndvi < 0.70) {

//                 gndviScore = 85;

//             } else {

//                 gndviScore = 100;

//             }

//             scores.push(gndviScore);

//         }


//         // ---------------------------------------------
//         // NDMI
//         // ---------------------------------------------

//         if (
//             gee.ndmi !== null &&
//             gee.ndmi !== undefined
//         ) {

//             let ndmiScore;

//             if (gee.ndmi < -0.20) {

//                 ndmiScore = 20;

//             } else if (gee.ndmi < 0.00) {

//                 ndmiScore = 40;

//             } else if (gee.ndmi < 0.20) {

//                 ndmiScore = 65;

//             } else if (gee.ndmi < 0.40) {

//                 ndmiScore = 85;

//             } else {

//                 ndmiScore = 100;

//             }

//             scores.push(ndmiScore);

//         }


//         if (scores.length === 0) {

//             return null;

//         }


//         const average =
//             scores.reduce(
//                 (sum, value) =>
//                 sum + value,
//                 0
//             ) / scores.length;


//         return Math.round(
//             average
//         );

//     }


//     // =====================================================
//     // SOIL SCORE
//     // =====================================================

//     static calculateSoilScore(
//         weather
//     ) {

//         const scores = [];


//         // ---------------------------------------------
//         // Soil Moisture
//         // ---------------------------------------------

//         if (
//             weather.soilMoisture !== null &&
//             weather.soilMoisture !== undefined
//         ) {

//             const moisture =
//                 Number(
//                     weather.soilMoisture
//                 );

//             let moistureScore;


//             /*
//              * Generic volumetric soil water interpretation.
//              *
//              * Ini bukan threshold spesifik tanaman.
//              * Nanti bisa kita sesuaikan dengan crop.
//              */

//             if (moisture < 0.10) {

//                 moistureScore = 20;

//             } else if (moisture < 0.20) {

//                 moistureScore = 45;

//             } else if (moisture < 0.35) {

//                 moistureScore = 80;

//             } else if (moisture < 0.45) {

//                 moistureScore = 90;

//             } else {

//                 moistureScore = 70;

//             }


//             scores.push(
//                 moistureScore
//             );

//         }


//         if (scores.length === 0) {

//             return null;

//         }


//         const average =
//             scores.reduce(
//                 (sum, value) =>
//                 sum + value,
//                 0
//             ) / scores.length;


//         return Math.round(
//             average
//         );

//     }


//     // =====================================================
//     // CLIMATE SCORE
//     // =====================================================

//     static calculateClimateScore(
//         weather
//     ) {

//         const scores = [];


//         // ---------------------------------------------
//         // Temperature
//         // ---------------------------------------------

//         if (
//             weather.temperature !== null &&
//             weather.temperature !== undefined
//         ) {

//             const temperature =
//                 Number(
//                     weather.temperature
//                 );

//             let temperatureScore;


//             /*
//              * Generic agricultural temperature range.
//              * Nanti dapat dibuat crop-specific.
//              */

//             if (
//                 temperature < 15
//             ) {

//                 temperatureScore = 30;

//             } else if (
//                 temperature < 20
//             ) {

//                 temperatureScore = 60;

//             } else if (
//                 temperature <= 30
//             ) {

//                 temperatureScore = 100;

//             } else if (
//                 temperature <= 35
//             ) {

//                 temperatureScore = 65;

//             } else {

//                 temperatureScore = 30;

//             }


//             scores.push(
//                 temperatureScore
//             );

//         }


//         // ---------------------------------------------
//         // Rainfall
//         // ---------------------------------------------

//         if (
//             weather.rainfall !== null &&
//             weather.rainfall !== undefined
//         ) {

//             const rainfall =
//                 Number(
//                     weather.rainfall
//                 );

//             let rainfallScore;


//             if (rainfall < 2) {

//                 rainfallScore = 40;

//             } else if (rainfall < 10) {

//                 rainfallScore = 70;

//             } else if (rainfall <= 50) {

//                 rainfallScore = 90;

//             } else if (rainfall <= 100) {

//                 rainfallScore = 70;

//             } else {

//                 rainfallScore = 40;

//             }


//             scores.push(
//                 rainfallScore
//             );

//         }


//         // ---------------------------------------------
//         // Radiation
//         // ---------------------------------------------

//         if (
//             weather.radiation !== null &&
//             weather.radiation !== undefined
//         ) {

//             const radiation =
//                 Number(
//                     weather.radiation
//                 );

//             let radiationScore;


//             /*
//              * ERA5 radiation dalam J/m2.
//              * Threshold sementara bersifat generic.
//              */

//             if (radiation < 500000) {

//                 radiationScore = 40;

//             } else if (radiation < 1000000) {

//                 radiationScore = 65;

//             } else if (radiation < 2500000) {

//                 radiationScore = 90;

//             } else {

//                 radiationScore = 75;

//             }


//             scores.push(
//                 radiationScore
//             );

//         }


//         if (scores.length === 0) {

//             return null;

//         }


//         const average =
//             scores.reduce(
//                 (sum, value) =>
//                 sum + value,
//                 0
//             ) / scores.length;


//         return Math.round(
//             average
//         );

//     }


//     // =====================================================
//     // OVERALL SCORE
//     // =====================================================

//     static calculateOverallScore({

//         vegetationScore,

//         climateScore,

//         soilScore,

//         iotScore = null

//     }) {

//         const components = [];


//         /*
//          * Bobot sementara:
//          *
//          * Vegetation = 40%
//          * Climate    = 30%
//          * Soil       = 30%
//          *
//          * IoT belum dimasukkan
//          * karena sensor belum aktif.
//          */

//         if (
//             vegetationScore !== null &&
//             vegetationScore !== undefined
//         ) {

//             components.push({
//                 score: vegetationScore,
//                 weight: 0.40
//             });

//         }


//         if (
//             climateScore !== null &&
//             climateScore !== undefined
//         ) {

//             components.push({
//                 score: climateScore,
//                 weight: 0.30
//             });

//         }


//         if (
//             soilScore !== null &&
//             soilScore !== undefined
//         ) {

//             components.push({
//                 score: soilScore,
//                 weight: 0.30
//             });

//         }


//         /*
//          * Kalau nanti IoT sudah tersedia,
//          * kita bisa aktifkan bobot IoT.
//          */


//         if (components.length === 0) {

//             return null;

//         }


//         const totalWeight =
//             components.reduce(
//                 (sum, item) =>
//                 sum + item.weight,
//                 0
//             );


//         const weightedScore =
//             components.reduce(
//                 (sum, item) =>
//                 sum +
//                 (
//                     item.score *
//                     item.weight
//                 ),
//                 0
//             );


//         return Math.round(
//             weightedScore /
//             totalWeight
//         );

//     }


//     // =====================================================
//     // STATUS
//     // =====================================================

//     static determineStatus(
//         overallScore
//     ) {

//         if (
//             overallScore === null ||
//             overallScore === undefined
//         ) {

//             return "UNKNOWN";

//         }


//         if (
//             overallScore >= 80
//         ) {

//             return "HEALTHY";

//         }


//         if (
//             overallScore >= 60
//         ) {

//             return "MODERATE";

//         }


//         if (
//             overallScore >= 40
//         ) {

//             return "WARNING";

//         }


//         return "CRITICAL";

//     }


//     // =====================================================
//     // ANALYZE CROP HEALTH
//     // =====================================================

//     static async analyzeCropHealth(
//         farmId,
//         cropId,
//         targetDate
//     ) {

//         try {


//             // =============================================
//             // 1. VALIDASI PARAMETER
//             // =============================================

//             if (!farmId) {

//                 throw new Error(
//                     "farmId wajib diisi"
//                 );

//             }


//             if (!cropId) {

//                 throw new Error(
//                     "cropId wajib diisi"
//                 );

//             }


//             if (!targetDate) {

//                 throw new Error(
//                     "targetDate wajib diisi"
//                 );

//             }


//             // =============================================
//             // 2. VALIDASI CROP
//             // =============================================

//             const crop =
//                 await Crop.findByPk(
//                     cropId
//                 );


//             if (!crop) {

//                 throw new Error(
//                     "Crop tidak ditemukan"
//                 );

//             }


//             // =============================================
//             // 3. PASTIKAN CROP MILIK FARM
//             // =============================================

//             if (
//                 Number(crop.farmId) !==
//                 Number(farmId)
//             ) {

//                 throw new Error(
//                     "Crop tidak terdaftar pada farm tersebut"
//                 );

//             }


//             // =============================================
//             // 4. DATE RANGE
//             // =============================================

//             const {
//                 startDate,
//                 endDate
//             } =
//             this.getDateRange(
//                 targetDate
//             );


//             console.log(
//                 "CropHealth date range:",
//                 startDate,
//                 endDate
//             );


//             // =============================================
//             // 5. AMBIL GEE HISTORY
//             // =============================================

//             const geeHistory =
//                 await GeeHistory.findOne({

//                     where: {

//                         farmId: farmId,

//                         cropId: cropId,

//                         date: {

//                             [Op.gte]: startDate,

//                             [Op.lt]: endDate

//                         }

//                     },

//                     order: [
//                         [
//                             "date",
//                             "DESC"
//                         ]
//                     ]

//                 });


//             if (!geeHistory) {

//                 throw new Error(
//                     `GeeHistory tidak ditemukan untuk crop ${cropId} pada tanggal ${targetDate}`
//                 );

//             }


//             // =============================================
//             // 6. AMBIL WEATHER FORECAST
//             // =============================================

//             const weatherForecast =
//                 await WeatherForecast.findOne({

//                     where: {

//                         farmId: farmId,

//                         date: {

//                             [Op.gte]: startDate,

//                             [Op.lt]: endDate

//                         }

//                     },

//                     order: [
//                         [
//                             "date",
//                             "DESC"
//                         ]
//                     ]

//                 });


//             if (!weatherForecast) {

//                 throw new Error(
//                     `WeatherForecast tidak ditemukan untuk tanggal ${targetDate}`
//                 );

//             }


//             // =============================================
//             // 7. LOG DATA
//             // =============================================

//             console.log(
//                 "GeeHistory:",
//                 geeHistory.toJSON()
//             );


//             console.log(
//                 "WeatherForecast:",
//                 weatherForecast.toJSON()
//             );


//             // =============================================
//             // 8. VEGETATION SCORE
//             // =============================================

//             const vegetationScore =
//                 this.calculateVegetationScore({

//                     ndvi: geeHistory.ndvi,

//                     evi: geeHistory.evi,

//                     gndvi: geeHistory.gndvi,

//                     ndmi: geeHistory.ndmi

//                 });


//             // =============================================
//             // 9. SOIL SCORE
//             // =============================================

//             const soilScore =
//                 this.calculateSoilScore({

//                     soilMoisture: weatherForecast.soilMoisture

//                 });


//             // =============================================
//             // 10. CLIMATE SCORE
//             // =============================================

//             const climateScore =
//                 this.calculateClimateScore({

//                     rainfall: weatherForecast.rain,

//                     temperature: weatherForecast.temperature,

//                     radiation: weatherForecast.radiation

//                 });


//             // =============================================
//             // 11. IoT
//             // =============================================

//             const iotScore = null;


//             // =============================================
//             // 12. OVERALL
//             // =============================================

//             const overallScore =
//                 this.calculateOverallScore({

//                     vegetationScore,

//                     climateScore,

//                     soilScore,

//                     iotScore

//                 });


//             // =============================================
//             // 13. STATUS
//             // =============================================

//             const status =
//                 this.determineStatus(
//                     overallScore
//                 );


//             // =============================================
//             // 14. SIAPKAN DATA
//             // =============================================

//             const healthData = {

//                 date: targetDate,

//                 vegetationScore: this.clampScore(
//                     vegetationScore
//                 ),

//                 climateScore: this.clampScore(
//                     climateScore
//                 ),

//                 soilScore: this.clampScore(
//                     soilScore
//                 ),

//                 iotScore: this.clampScore(
//                     iotScore
//                 ),

//                 overallScore: this.clampScore(
//                     overallScore
//                 ),

//                 farmId: farmId,

//                 cropId: cropId

//             };


//             console.log(
//                 "CropHealth data:",
//                 healthData
//             );


//             // =============================================
//             // 15. CEK DATA LAMA
//             // =============================================

//             const existing =
//                 await CropHealth.findOne({

//                     where: {

//                         farmId: farmId,

//                         cropId: cropId,

//                         date: {

//                             [Op.gte]: startDate,

//                             [Op.lt]: endDate

//                         }

//                     }

//                 });


//             // =============================================
//             // 16. UPDATE
//             // =============================================

//             if (existing) {

//                 await existing.update(
//                     healthData
//                 );


//                 return {

//                     action: "updated",

//                     status: status,

//                     data: existing

//                 };

//             }


//             // =============================================
//             // 17. CREATE
//             // =============================================

//             const result =
//                 await CropHealth.create(
//                     healthData
//                 );


//             // =============================================
//             // 18. RETURN
//             // =============================================

//             return {

//                 action: "created",

//                 status: status,

//                 data: result

//             };


//         } catch (error) {

//             console.error(
//                 "CropHealthService analyzeCropHealth error:",
//                 error
//             );

//             throw error;

//         }

//     }

// }


// module.exports =
//     CropHealthService;


// ini dia fix nya

const {
    Crop,
    GeeHistory,
    WeatherForecast,
    CropHealth,
    Sensor,
    SensorReading,
    Device
} = require("../models");

const {
    Op
} = require("sequelize");


// =====================================================
// Crop Health Service
// =====================================================
//
// Sumber data:
//
// 1. GeeHistory
//    - NDVI
//    - EVI
//    - GNDVI
//    - SAVI
//    - NDMI
//    - NDWI
//    - MSI
//    - rainfall
//    - soilMoisture
//    - temperature
//    - radiation
//
// 2. WeatherForecast
//    - forecast environment
//
// 3. SensorReading
//    - SOIL_MOISTURE
//    - TEMPERATURE
//    - HUMIDITY
//
// Saat ini menggunakan pendekatan statistik/rule-based.
// AI dapat ditambahkan kemudian setelah data historis
// CropHealth sudah terkumpul cukup banyak.
// =====================================================


class CropHealthService {


    // =====================================================
    // HELPER
    // Mendapatkan range tanggal 1 hari
    // =====================================================

    static getDateRange(targetDate) {

        const dateRegex =
            /^\d{4}-\d{2}-\d{2}$/;


        if (!dateRegex.test(targetDate)) {

            throw new Error(
                "Format tanggal harus YYYY-MM-DD"
            );

        }


        const startDate =
            new Date(
                `${targetDate}T00:00:00.000+07:00`
            );


        const endDate =
            new Date(startDate);


        endDate.setDate(
            endDate.getDate() + 1
        );


        return {
            startDate,
            endDate
        };

    }
    // =====================================================
// IoT SCORE
// Menghitung score berdasarkan SensorReading terbaru
// =====================================================

// static calculateIoTScore(readings) {

//     const scores = [];

//     for (const reading of readings) {

//         if (!reading.Sensor) {
//             continue;
//         }

//         const sensorType =
//             String(
//                 reading.Sensor.sensorType || ""
//             ).toLowerCase();

//         const value =
//             Number(
//                 reading.value
//             );

//         if (
//             Number.isNaN(value)
//         ) {
//             continue;
//         }

//         let score = null;


//         // =================================================
//         // SOIL MOISTURE
//         // =================================================

//         if (
//             sensorType.includes("soil") &&
//             sensorType.includes("moisture")
//         ) {

//             if (value < 10) {

//                 score = 20;

//             } else if (value < 20) {

//                 score = 45;

//             } else if (value < 35) {

//                 score = 80;

//             } else if (value < 45) {

//                 score = 90;

//             } else {

//                 score = 70;

//             }

//         }


//         // =================================================
//         // TEMPERATURE
//         // =================================================

//         else if (
//             sensorType.includes("temperature") ||
//             sensorType.includes("temp")
//         ) {

//             if (value < 15) {

//                 score = 30;

//             } else if (value < 20) {

//                 score = 60;

//             } else if (value <= 30) {

//                 score = 100;

//             } else if (value <= 35) {

//                 score = 65;

//             } else {

//                 score = 30;

//             }

//         }


//         // =================================================
//         // HUMIDITY
//         // =================================================

//         else if (
//             sensorType.includes("humidity")
//         ) {

//             if (value < 30) {

//                 score = 40;

//             } else if (value < 40) {

//                 score = 60;

//             } else if (value <= 80) {

//                 score = 90;

//             } else {

//                 score = 60;

//             }

//         }


//         // =================================================
//         // RAINFALL
//         // =================================================

//         else if (
//             sensorType.includes("rain")
//         ) {

//             if (value < 2) {

//                 score = 40;

//             } else if (value < 10) {

//                 score = 70;

//             } else if (value <= 50) {

//                 score = 90;

//             } else if (value <= 100) {

//                 score = 70;

//             } else {

//                 score = 40;

//             }

//         }


//         // =================================================
//         // LIGHT / SOLAR
//         // =================================================

//         else if (
//             sensorType.includes("light") ||
//             sensorType.includes("solar") ||
//             sensorType.includes("lux")
//         ) {

//             if (value < 1000) {

//                 score = 40;

//             } else if (value < 5000) {

//                 score = 65;

//             } else if (value < 10000) {

//                 score = 90;

//             } else {

//                 score = 75;

//             }

//         }


//         // =================================================
//         // MASUKKAN SCORE
//         // =================================================

//         if (
//             score !== null
//         ) {

//             scores.push(score);

//         }

//     }


//     // Tidak ada sensor yang
//     // bisa dihitung

//     if (
//         scores.length === 0
//     ) {

//         return null;

//     }


//     const average =
//         scores.reduce(
//             (sum, value) =>
//                 sum + value,
//             0
//         ) /
//         scores.length;


//     return Math.round(
//         average
//     );

// }

    // =====================================================
    // HELPER
    // Membatasi score 0 - 100
    // =====================================================

    static clampScore(value) {

        if (
            value === null ||
            value === undefined ||
            Number.isNaN(Number(value))
        ) {

            return null;

        }


        return Math.max(
            0,
            Math.min(
                100,
                Number(value)
            )
        );

    }


    // =====================================================
    // NDVI SCORE
    // =====================================================

    static calculateNDVIScore(ndvi) {

        if (
            ndvi === null ||
            ndvi === undefined
        ) {

            return null;

        }


        ndvi = Number(ndvi);


        let score;


        if (ndvi < 0.20) {

            score = 20;

        } else if (ndvi < 0.40) {

            score = 40;

        } else if (ndvi < 0.60) {

            score = 65;

        } else if (ndvi < 0.80) {

            score = 85;

        } else {

            score = 100;

        }


        return score;

    }


    // =====================================================
    // VEGETATION SCORE
    // =====================================================

    static calculateVegetationScore(
        gee
    ) {

        const scores = [];


        // -------------------------------------------------
        // NDVI
        // -------------------------------------------------

        if (
            gee.ndvi !== null &&
            gee.ndvi !== undefined
        ) {

            scores.push(
                this.calculateNDVIScore(
                    gee.ndvi
                )
            );

        }


        // -------------------------------------------------
        // EVI
        // -------------------------------------------------

        if (
            gee.evi !== null &&
            gee.evi !== undefined
        ) {

            const evi =
                Number(gee.evi);


            let eviScore;


            if (evi < 0.10) {

                eviScore = 20;

            } else if (evi < 0.25) {

                eviScore = 40;

            } else if (evi < 0.40) {

                eviScore = 65;

            } else if (evi < 0.60) {

                eviScore = 85;

            } else {

                eviScore = 100;

            }


            scores.push(
                eviScore
            );

        }


        // -------------------------------------------------
        // GNDVI
        // -------------------------------------------------

        if (
            gee.gndvi !== null &&
            gee.gndvi !== undefined
        ) {

            const gndvi =
                Number(gee.gndvi);


            let gndviScore;


            if (gndvi < 0.15) {

                gndviScore = 20;

            } else if (gndvi < 0.30) {

                gndviScore = 40;

            } else if (gndvi < 0.50) {

                gndviScore = 65;

            } else if (gndvi < 0.70) {

                gndviScore = 85;

            } else {

                gndviScore = 100;

            }


            scores.push(
                gndviScore
            );

        }


        // -------------------------------------------------
        // NDMI
        // -------------------------------------------------

        if (
            gee.ndmi !== null &&
            gee.ndmi !== undefined
        ) {

            const ndmi =
                Number(gee.ndmi);


            let ndmiScore;


            if (ndmi < -0.20) {

                ndmiScore = 20;

            } else if (ndmi < 0.00) {

                ndmiScore = 40;

            } else if (ndmi < 0.20) {

                ndmiScore = 65;

            } else if (ndmi < 0.40) {

                ndmiScore = 85;

            } else {

                ndmiScore = 100;

            }


            scores.push(
                ndmiScore
            );

        }


        if (scores.length === 0) {

            return null;

        }


        const average =
            scores.reduce(
                (sum, value) =>
                sum + value,
                0
            ) / scores.length;


        return Math.round(
            average
        );

    }


    // =====================================================
    // SOIL SCORE
    // =====================================================

    static calculateSoilScore(
        weather
    ) {

        const scores = [];


        if (
            weather.soilMoisture !== null &&
            weather.soilMoisture !== undefined
        ) {

            const moisture =
                Number(
                    weather.soilMoisture
                );


            let moistureScore;


            if (moisture < 0.10) {

                moistureScore = 20;

            } else if (moisture < 0.20) {

                moistureScore = 45;

            } else if (moisture < 0.35) {

                moistureScore = 80;

            } else if (moisture < 0.45) {

                moistureScore = 90;

            } else {

                moistureScore = 70;

            }


            scores.push(
                moistureScore
            );

        }


        if (scores.length === 0) {

            return null;

        }


        const average =
            scores.reduce(
                (sum, value) =>
                sum + value,
                0
            ) / scores.length;


        return Math.round(
            average
        );

    }


    // =====================================================
    // CLIMATE SCORE
    // =====================================================

    static calculateClimateScore(
        weather
    ) {

        const scores = [];


        // -------------------------------------------------
        // Temperature
        // -------------------------------------------------

        if (
            weather.temperature !== null &&
            weather.temperature !== undefined
        ) {

            const temperature =
                Number(
                    weather.temperature
                );


            let temperatureScore;


            if (temperature < 15) {

                temperatureScore = 30;

            } else if (temperature < 20) {

                temperatureScore = 60;

            } else if (temperature <= 30) {

                temperatureScore = 100;

            } else if (temperature <= 35) {

                temperatureScore = 65;

            } else {

                temperatureScore = 30;

            }


            scores.push(
                temperatureScore
            );

        }


        // -------------------------------------------------
        // Rainfall
        // -------------------------------------------------

        if (
            weather.rainfall !== null &&
            weather.rainfall !== undefined
        ) {

            const rainfall =
                Number(
                    weather.rainfall
                );


            let rainfallScore;


            if (rainfall < 2) {

                rainfallScore = 40;

            } else if (rainfall < 10) {

                rainfallScore = 70;

            } else if (rainfall <= 50) {

                rainfallScore = 90;

            } else if (rainfall <= 100) {

                rainfallScore = 70;

            } else {

                rainfallScore = 40;

            }


            scores.push(
                rainfallScore
            );

        }


        // -------------------------------------------------
        // Radiation
        // -------------------------------------------------

        if (
            weather.radiation !== null &&
            weather.radiation !== undefined
        ) {

            const radiation =
                Number(
                    weather.radiation
                );


            let radiationScore;


            if (radiation < 500000) {

                radiationScore = 40;

            } else if (radiation < 1000000) {

                radiationScore = 65;

            } else if (radiation < 2500000) {

                radiationScore = 90;

            } else {

                radiationScore = 75;

            }


            scores.push(
                radiationScore
            );

        }


        if (scores.length === 0) {

            return null;

        }


        const average =
            scores.reduce(
                (sum, value) =>
                sum + value,
                0
            ) / scores.length;


        return Math.round(
            average
        );

    }


    // =====================================================
    // SENSOR READING
    // Mengambil rata-rata sensor pada tanggal tertentu
    // =====================================================

   // =====================================================
   // SENSOR READING
   // Mengambil rata-rata SensorReading pada tanggal tertentu
   // =====================================================

  // =====================================================
  // SENSOR READING
  // Mengambil rata-rata SensorReading pada farm
  // berdasarkan relasi:
  //
  // Farm
  //   ↓
  // Device
  //   ↓
  // Sensor
  //   ↓
  // SensorReading
  // =====================================================

    // =====================================================
    // SENSOR READING
    //
    // Logika:
    // 1. Cari sensor berdasarkan farm
    // 2. Cari SensorReading TERAKHIR
    // 3. Tidak harus pada tanggal request
    // 4. Cek umur reading terakhir
    // 5. Jika <= 5 menit  -> ONLINE
    // 6. Jika > 5 menit   -> OFFLINE
    // 7. Jika ONLINE      -> hitung rata-rata reading terakhir
    // =====================================================

    static async getSensorData(
        farmId,
        startDate,
        endDate
    ) {

        try {

            console.log(
                "===================================="
            );

            console.log(
                "GET SENSOR DATA"
            );

            console.log(
                "Farm ID:",
                farmId
            );

            console.log(
                "Requested Date:",
                startDate,
                "->",
                endDate
            );


            // =================================================
            // 1. CARI DEVICE MILIK FARM
            // =================================================

            const devices =
                await Device.findAll({

                    where: {

                        farmId: farmId

                    }

                });


            console.log(
                "Jumlah Device:",
                devices.length
            );


            if (
                !devices ||
                devices.length === 0
            ) {

                return {

                    sensorStatus: "OFFLINE",

                    message: "Tidak ada device yang terhubung dengan farm",

                    lastReadingAt: null,

                    minutesSinceLastReading: null,

                    soilMoisture: null,

                    temperature: null,

                    humidity: null,

                    totalReadings: 0,

                    soilMoistureReadings: 0,

                    temperatureReadings: 0,

                    humidityReadings: 0

                };

            }


            // =================================================
            // 2. DEVICE IDS
            // =================================================

            const deviceIds =
                devices.map(
                    device => device.id
                );


            console.log(
                "Device IDs:",
                deviceIds
            );


            // =================================================
            // 3. CARI SENSOR MILIK DEVICE
            // =================================================

            const sensors =
                await Sensor.findAll({

                    where: {

                        deviceId: {

                            [Op.in]: deviceIds

                        }

                    }

                });


            console.log(
                "Jumlah Sensor:",
                sensors.length
            );


            if (
                !sensors ||
                sensors.length === 0
            ) {

                return {

                    sensorStatus: "OFFLINE",

                    message: "Tidak ada sensor yang terdaftar pada device",

                    lastReadingAt: null,

                    minutesSinceLastReading: null,

                    soilMoisture: null,

                    temperature: null,

                    humidity: null,

                    totalReadings: 0,

                    soilMoistureReadings: 0,

                    temperatureReadings: 0,

                    humidityReadings: 0

                };

            }


            // =================================================
            // 4. SENSOR IDS
            // =================================================

            const sensorIds =
                sensors.map(
                    sensor => sensor.id
                );


            console.log(
                "Sensor IDs:",
                sensorIds
            );


            // =================================================
            // 5. CARI READING TERAKHIR
            //
            // TIDAK DIBATASI TANGGAL REQUEST
            //
            // Karena perangkat bisa sedang offline.
            // =================================================

            const lastReading =
                await SensorReading.findOne({

                    where: {

                        sensorId: {

                            [Op.in]: sensorIds

                        }

                    },

                    include: [

                        {

                            model: Sensor,

                            required: false

                        }

                    ],

                    order: [

                        [

                            "recordedAt",

                            "DESC"

                        ]

                    ]

                });


            // =================================================
            // 6. BELUM PERNAH ADA SENSOR READING
            // =================================================

            if (
                !lastReading
            ) {

                console.log(
                    "BELUM ADA SENSOR READING"
                );


                return {

                    sensorStatus: "OFFLINE",

                    message: "Sensor belum pernah mengirim data",

                    lastReadingAt: null,

                    minutesSinceLastReading: null,

                    soilMoisture: null,

                    temperature: null,

                    humidity: null,

                    totalReadings: 0,

                    soilMoistureReadings: 0,

                    temperatureReadings: 0,

                    humidityReadings: 0

                };

            }


            // =================================================
            // 7. CEK WAKTU READING TERAKHIR
            // =================================================

            const lastReadingAt =
                new Date(
                    lastReading.recordedAt
                );


            const now =
                new Date();


            const differenceMs =
                now.getTime() -
                lastReadingAt.getTime();


            const minutesSinceLastReading =
                Math.floor(
                    differenceMs /
                    (
                        1000 *
                        60
                    )
                );


            console.log(
                "Last Reading:",
                lastReadingAt
            );

            console.log(
                "Current Time:",
                now
            );

            console.log(
                "Minutes Since Last Reading:",
                minutesSinceLastReading
            );


            // =================================================
            // 8. SENSOR OFFLINE
            //
            // Jika reading terakhir lebih dari 5 menit
            // =================================================

            if (
                differenceMs >
                (
                    5 *
                    60 *
                    1000
                )
            ) {

                console.log(
                    "SENSOR OFFLINE"
                );


                return {

                    sensorStatus: "OFFLINE",

                    message: "Sensor sedang offline. Data terakhir lebih dari 5 menit yang lalu.",

                    lastReadingAt: lastReadingAt,

                    minutesSinceLastReading: minutesSinceLastReading,

                    soilMoisture: null,

                    temperature: null,

                    humidity: null,

                    totalReadings: 0,

                    soilMoistureReadings: 0,

                    temperatureReadings: 0,

                    humidityReadings: 0

                };

            }


            // =================================================
            // 9. SENSOR ONLINE
            // =================================================

            console.log(
                "SENSOR ONLINE"
            );


            // =================================================
            // 10. AMBIL READING TERBARU
            //
            // Karena sensor ONLINE, kita ambil reading
            // dari 5 menit terakhir untuk menghitung rata-rata.
            // =================================================

            const fiveMinutesAgo =
                new Date(
                    now.getTime() -
                    (
                        5 *
                        60 *
                        1000
                    )
                );


            const readings =
                await SensorReading.findAll({

                    where: {

                        sensorId: {

                            [Op.in]: sensorIds

                        },

                        recordedAt: {

                            [Op.gte]: fiveMinutesAgo,

                            [Op.lte]: now

                        }

                    },

                    include: [

                        {

                            model: Sensor,

                            required: false

                        }

                    ],

                    order: [

                        [

                            "recordedAt",

                            "DESC"

                        ]

                    ]

                });


            console.log(
                "Jumlah Reading 5 Menit Terakhir:",
                readings.length
            );


            // =================================================
            // 11. TEMPAT DATA SENSOR
            // =================================================

            const sensorData = {

                SOIL_MOISTURE: [],

                TEMPERATURE: [],

                HUMIDITY: []

            };


            // =================================================
            // 12. PROSES READING
            // =================================================

            for (
                const reading of readings
            ) {

                let sensor =
                    reading.Sensor;


                // -------------------------------------------------
                // Fallback jika association tidak terbaca
                // -------------------------------------------------

                if (
                    !sensor
                ) {

                    sensor =
                        sensors.find(
                            item =>
                            Number(item.id) ===
                            Number(reading.sensorId)
                        );

                }


                if (
                    !sensor
                ) {

                    continue;

                }


                let sensorType =
                    String(
                        sensor.sensorType || ""
                    )
                    .trim()
                    .toUpperCase();


                sensorType =
                    sensorType
                    .replace(
                        /[\s-]+/g,
                        "_"
                    );


                const value =
                    Number(
                        reading.value
                    );


                if (
                    Number.isNaN(value)
                ) {

                    continue;

                }


                // =================================================
                // SOIL MOISTURE
                // =================================================

                if (

                    sensorType.includes(
                        "SOIL"
                    )

                    &&

                    sensorType.includes(
                        "MOISTURE"
                    )

                ) {

                    sensorData
                        .SOIL_MOISTURE
                        .push(value);

                    continue;

                }


                // =================================================
                // TEMPERATURE
                // =================================================

                if (

                    sensorType.includes(
                        "TEMP"
                    )

                    ||

                    sensorType.includes(
                        "TEMPERATURE"
                    )

                ) {

                    sensorData
                        .TEMPERATURE
                        .push(value);

                    continue;

                }


                // =================================================
                // HUMIDITY
                // =================================================

                if (

                    sensorType.includes(
                        "HUMIDITY"
                    )

                ) {

                    sensorData
                        .HUMIDITY
                        .push(value);

                    continue;

                }

            }


            // =================================================
            // 13. AVERAGE
            // =================================================

            const average =
                values => {

                    if (
                        !values ||
                        values.length === 0
                    ) {

                        return null;

                    }


                    return (

                        values.reduce(
                            (
                                sum,
                                value
                            ) =>
                            sum + value,

                            0
                        )

                        /

                        values.length

                    );

                };


            // =================================================
            // 14. HASIL SENSOR
            // =================================================

            const result = {

                sensorStatus: "ONLINE",

                message: "Sensor aktif dan mengirim data.",

                lastReadingAt: lastReadingAt,

                minutesSinceLastReading: minutesSinceLastReading,

                soilMoisture: average(
                    sensorData.SOIL_MOISTURE
                ),

                temperature: average(
                    sensorData.TEMPERATURE
                ),

                humidity: average(
                    sensorData.HUMIDITY
                ),

                totalReadings: readings.length,

                soilMoistureReadings: sensorData
                    .SOIL_MOISTURE
                    .length,

                temperatureReadings: sensorData
                    .TEMPERATURE
                    .length,

                humidityReadings: sensorData
                    .HUMIDITY
                    .length

            };


            // =================================================
            // 15. DEBUG
            // =================================================

            console.log(
                "===================================="
            );

            console.log(
                "SENSOR STATUS:",
                result.sensorStatus
            );

            console.log(
                "LAST READING:",
                result.lastReadingAt
            );

            console.log(
                "MINUTES SINCE LAST READING:",
                result.minutesSinceLastReading
            );

            console.log(
                "SENSOR DATA:",
                result
            );

            console.log(
                "===================================="
            );


            return result;


        } catch (error) {

            console.error(
                "CropHealthService getSensorData error:",
                error
            );

            throw error;

        }

    }


    // =====================================================
    // IoT SOIL SCORE
    // =====================================================

    static calculateIoTSoilScore(
        soilMoisture
    ) {

        if (
            soilMoisture === null ||
            soilMoisture === undefined
        ) {

            return null;

        }


        const moisture =
            Number(
                soilMoisture
            );


        if (
            Number.isNaN(moisture)
        ) {

            return null;

        }


        /*
         * Threshold sementara.
         *
         * Nanti threshold ini idealnya dibuat
         * berdasarkan jenis tanaman/crop.
         */


        if (moisture < 20) {

            return 20;

        }


        if (moisture < 30) {

            return 45;

        }


        if (moisture < 40) {

            return 80;

        }


        if (moisture < 60) {

            return 95;

        }


        return 75;

    }


    // =====================================================
    // IoT TEMPERATURE SCORE
    // =====================================================

    static calculateIoTTemperatureScore(
        temperature
    ) {

        if (
            temperature === null ||
            temperature === undefined
        ) {

            return null;

        }


        const temp =
            Number(
                temperature
            );


        if (
            Number.isNaN(temp)
        ) {

            return null;

        }


        if (temp < 15) {

            return 30;

        }


        if (temp < 20) {

            return 60;

        }


        if (temp <= 30) {

            return 100;

        }


        if (temp <= 35) {

            return 65;

        }


        return 30;

    }


    // =====================================================
    // IoT HUMIDITY SCORE
    // =====================================================

    static calculateIoTHumidityScore(
        humidity
    ) {

        if (
            humidity === null ||
            humidity === undefined
        ) {

            return null;

        }


        const value =
            Number(
                humidity
            );


        if (
            Number.isNaN(value)
        ) {

            return null;

        }


        if (value < 30) {

            return 40;

        }


        if (value < 40) {

            return 65;

        }


        if (value <= 70) {

            return 100;

        }


        if (value <= 85) {

            return 70;

        }


        return 40;

    }


    // =====================================================
    // IoT SCORE
    // =====================================================

    static calculateIoTScore(
        sensorData
    ) {

        const scores = [];


        const soilScore =
            this.calculateIoTSoilScore(
                sensorData.soilMoisture
            );


        const temperatureScore =
            this.calculateIoTTemperatureScore(
                sensorData.temperature
            );


        const humidityScore =
            this.calculateIoTHumidityScore(
                sensorData.humidity
            );


        if (
            soilScore !== null
        ) {

            scores.push(
                soilScore
            );

        }


        if (
            temperatureScore !== null
        ) {

            scores.push(
                temperatureScore
            );

        }


        if (
            humidityScore !== null
        ) {

            scores.push(
                humidityScore
            );

        }


        if (
            scores.length === 0
        ) {

            return null;

        }


        const average =
            scores.reduce(
                (sum, value) =>
                sum + value,
                0
            ) /
            scores.length;


        return Math.round(
            average
        );

    }


    // =====================================================
    // OVERALL SCORE
    // =====================================================

    static calculateOverallScore({

        vegetationScore,

        climateScore,

        soilScore,

        iotScore

    }) {

        const components = [];


        // -------------------------------------------------
        // Vegetation
        // -------------------------------------------------

        if (
            vegetationScore !== null &&
            vegetationScore !== undefined
        ) {

            components.push({

                score: vegetationScore,

                weight: 0.40

            });

        }


        // -------------------------------------------------
        // Climate
        // -------------------------------------------------

        if (
            climateScore !== null &&
            climateScore !== undefined
        ) {

            components.push({

                score: climateScore,

                weight: 0.25

            });

        }


        // -------------------------------------------------
        // Soil
        // -------------------------------------------------

        if (
            soilScore !== null &&
            soilScore !== undefined
        ) {

            components.push({

                score: soilScore,

                weight: 0.20

            });

        }


        // -------------------------------------------------
        // IoT
        // -------------------------------------------------

        if (
            iotScore !== null &&
            iotScore !== undefined
        ) {

            components.push({

                score: iotScore,

                weight: 0.15

            });

        }


        if (
            components.length === 0
        ) {

            return null;

        }


        const totalWeight =
            components.reduce(
                (
                    sum,
                    item
                ) =>
                sum + item.weight,
                0
            );


        const weightedScore =
            components.reduce(
                (
                    sum,
                    item
                ) =>
                sum +
                (
                    item.score *
                    item.weight
                ),
                0
            );


        return Math.round(
            weightedScore /
            totalWeight
        );

    }


    // =====================================================
    // STATUS
    // =====================================================

    static determineStatus(
        overallScore
    ) {

        if (
            overallScore === null ||
            overallScore === undefined
        ) {

            return "UNKNOWN";

        }


        if (
            overallScore >= 80
        ) {

            return "HEALTHY";

        }


        if (
            overallScore >= 60
        ) {

            return "MODERATE";

        }


        if (
            overallScore >= 40
        ) {

            return "WARNING";

        }


        return "CRITICAL";

    }


    // =====================================================
    // ANALYZE CROP HEALTH
    // =====================================================

    static async analyzeCropHealth(
        farmId,
        cropId,
        targetDate
    ) {

        try {

            // =============================================
            // 1. VALIDASI PARAMETER
            // =============================================

            if (!farmId) {

                throw new Error(
                    "farmId wajib diisi"
                );

            }


            if (!cropId) {

                throw new Error(
                    "cropId wajib diisi"
                );

            }


            if (!targetDate) {

                throw new Error(
                    "targetDate wajib diisi"
                );

            }


            // =============================================
            // 2. VALIDASI CROP
            // =============================================

            const crop =
                await Crop.findByPk(
                    cropId
                );


            if (!crop) {

                throw new Error(
                    "Crop tidak ditemukan"
                );

            }


            // =============================================
            // 3. VALIDASI CROP → FARM
            // =============================================

            if (
                Number(crop.farmId) !==
                Number(farmId)
            ) {

                throw new Error(
                    "Crop tidak terdaftar pada farm tersebut"
                );

            }


            // =============================================
            // 4. DATE RANGE
            // =============================================

            const {
                startDate,
                endDate
            } =
            this.getDateRange(
                targetDate
            );


            console.log(
                "===================================="
            );


            console.log(
                "CropHealth Analysis"
            );


            console.log(
                "Farm:",
                farmId
            );


            console.log(
                "Crop:",
                cropId
            );


            console.log(
                "Date:",
                targetDate
            );


            console.log(
                "Date Range:",
                startDate,
                endDate
            );


            // =============================================
            // 5. GEE HISTORY
            // =============================================

            const geeHistory =
                await GeeHistory.findOne({

                    where: {

                        farmId: farmId,

                        cropId: cropId,

                        date: {

                            [Op.gte]: startDate,

                            [Op.lt]: endDate

                        }

                    },

                    order: [

                        [
                            "date",
                            "DESC"
                        ]

                    ]

                });


            if (!geeHistory) {

                throw new Error(
                    `GeeHistory tidak ditemukan untuk crop ${cropId} pada tanggal ${targetDate}`
                );

            }


            // =============================================
            // 6. WEATHER FORECAST
            // =============================================

            const weatherForecast =
                await WeatherForecast.findOne({

                    where: {

                        farmId: farmId,

                        date: {

                            [Op.gte]: startDate,

                            [Op.lt]: endDate

                        }

                    },

                    order: [

                        [
                            "date",
                            "DESC"
                        ]

                    ]

                });


            if (!weatherForecast) {

                throw new Error(
                    `WeatherForecast tidak ditemukan untuk tanggal ${targetDate}`
                );

            }


            // =============================================
            // 7. SENSOR READING
            // =============================================

            const sensorData =
                await this.getSensorData(

                    farmId,

                    startDate,

                    endDate

                );


            // =============================================
            // 8. LOG DATA
            // =============================================

            console.log(
                "GeeHistory:",
                geeHistory.toJSON()
            );


            console.log(
                "WeatherForecast:",
                weatherForecast.toJSON()
            );


            console.log(
                "SensorData:",
                sensorData
            );


            // =============================================
            // 9. VEGETATION SCORE
            // =============================================

            const vegetationScore =
                this.calculateVegetationScore({

                    ndvi: geeHistory.ndvi,

                    evi: geeHistory.evi,

                    gndvi: geeHistory.gndvi,

                    ndmi: geeHistory.ndmi

                });


            // =============================================
            // 10. SOIL SCORE
            //
            // Gunakan GEE/Weather sebagai environmental
            // reference.
            // =============================================

            const soilScore =
                this.calculateSoilScore({

                    soilMoisture:

                        geeHistory.soilMoisture ??
                        weatherForecast.soilMoisture

                });


            // =============================================
            // 11. CLIMATE SCORE
            // =============================================

            const rainfall =
                weatherForecast.rainfall ??
                weatherForecast.rain ??
                geeHistory.rainfall ??
                null;


            const temperature =
                weatherForecast.temperature ??
                geeHistory.temperature ??
                null;


            const radiation =
                weatherForecast.radiation ??
                geeHistory.radiation ??
                null;


            const climateScore =
                this.calculateClimateScore({

                    rainfall: rainfall,

                    temperature: temperature,

                    radiation: radiation

                });


            // =============================================
            // 12. IoT SCORE
            // =============================================

            const iotScore =
                this.calculateIoTScore(
                    sensorData
                );


            // =============================================
            // 13. OVERALL SCORE
            // =============================================

            const overallScore =
                this.calculateOverallScore({

                    vegetationScore:

                        vegetationScore,

                    climateScore:

                        climateScore,

                    soilScore:

                        soilScore,

                    iotScore:

                        iotScore

                });


            // =============================================
            // 14. STATUS
            // =============================================

            const status =
                this.determineStatus(
                    overallScore
                );


            // =============================================
            // 15. HEALTH DATA
            // =============================================

            const healthData = {

                date: targetDate,

                vegetationScore:

                    this.clampScore(
                        vegetationScore
                    ),

                climateScore:

                    this.clampScore(
                        climateScore
                    ),

                soilScore:

                    this.clampScore(
                        soilScore
                    ),

                iotScore:

                    this.clampScore(
                        iotScore
                    ),

                overallScore:

                    this.clampScore(
                        overallScore
                    ),

                farmId: farmId,

                cropId: cropId

            };


            console.log(
                "===================================="
            );


            console.log(
                "CropHealth Result:"
            );


            console.log(
                healthData
            );


            console.log(
                "Status:",
                status
            );


            console.log(
                "===================================="
            );


            // =============================================
            // 16. CEK DATA LAMA
            // =============================================

            const existing =
                await CropHealth.findOne({

                    where: {

                        farmId: farmId,

                        cropId: cropId,

                        date: {

                            [Op.gte]: startDate,

                            [Op.lt]: endDate

                        }

                    }

                });


            // =============================================
            // 17. UPDATE
            // =============================================

            if (existing) {

                await existing.update(
                    healthData
                );


                return {

                    action: "updated",

                    status: status,

                    data: existing,

                    analysis: {

                        vegetationScore: vegetationScore,

                        climateScore: climateScore,

                        soilScore: soilScore,

                        iotScore: iotScore,

                        overallScore: overallScore

                    },

                    sensorData: sensorData

                };

            }


            // =============================================
            // 18. CREATE
            // =============================================

            const result =
                await CropHealth.create(
                    healthData
                );


            // =============================================
            // 19. RETURN
            // =============================================

            return {

                action: "created",

                status: status,

                data: result,

                analysis: {

                    vegetationScore: vegetationScore,

                    climateScore: climateScore,

                    soilScore: soilScore,

                    iotScore: iotScore,

                    overallScore: overallScore

                },

                sensorData: sensorData

            };


        } catch (error) {

            console.error(
                "CropHealthService analyzeCropHealth error:",
                error
            );


            throw error;

        }

    }

}


module.exports =
    CropHealthService;