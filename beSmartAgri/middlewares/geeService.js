const {
    ee,
    initializeGee
} = require("../config/gee");

const {
    Farm,
    GeeHistory,
    Crop
} = require('../models')

class GeeService {

    static async initialize() {

        try {

            await initializeGee();

            return {
                success: true,
                message: "Google Earth Engine siap digunakan"
            };

        } catch (error) {

            console.error(
                "GeeService initialize error:",
                error
            );

            throw error;

        }

    }
    // static async getNDVI(farmId, startDate, endDate) {

    //     try {

    //         // Pastikan GEE sudah initialize
    //         await initializeGee();

    //         // Ambil data farm
    //         const farm = await Farm.findByPk(farmId);

    //         if (!farm) {
    //             throw new Error("Farm tidak ditemukan");
    //         }

    //         if (!farm.polygon) {
    //             throw new Error(
    //                 "Polygon farm belum tersedia"
    //             );
    //         }

    //         console.log("Farm:", farm.name);
    //         console.log("Polygon:", farm.polygon);

    //         // Polygon dari database
    //         const geometry = ee.Geometry(
    //             farm.polygon
    //         );

    //         // Sentinel-2
    //         const collection =
    //             ee.ImageCollection(
    //                 "COPERNICUS/S2_SR_HARMONIZED"
    //             )
    //             .filterBounds(geometry)
    //             .filterDate(
    //                 startDate,
    //                 endDate
    //             )
    //             .filter(
    //                 ee.Filter.lt(
    //                     "CLOUDY_PIXEL_PERCENTAGE",
    //                     20
    //                 )
    //             );

    //         // Ambil median image
    //         const image =
    //             collection.median();

    //         // NDVI
    //         const ndvi =
    //             image.normalizedDifference([
    //                 "B8",
    //                 "B4"
    //             ]).rename("NDVI");

    //         // Rata-rata NDVI pada polygon farm
    //         const result =
    //             await new Promise(
    //                 (resolve, reject) => {

    //                     ndvi.reduceRegion({
    //                         reducer:
    //                             ee.Reducer.mean(),

    //                         geometry:
    //                             geometry,

    //                         scale: 10,

    //                         maxPixels: 1e9

    //                     }).evaluate(
    //                         (result, error) => {

    //                             if (error) {
    //                                 reject(error);
    //                             } else {
    //                                 resolve(result);
    //                             }

    //                         }
    //                     );

    //                 }
    //             );

    //         return {
    //             farmId: farm.id,
    //             farmName: farm.name,
    //             startDate,
    //             endDate,
    //             ndvi: result.NDVI
    //         };

    //     } catch (error) {

    //         console.error(
    //             "GEE getNDVI error:",
    //             error
    //         );

    //         throw error;

    //     }

    // }
    //-------------------------------------------
    // ini udah jalan yg dibawah ini
    // static async getNDVI(farmId, startDate, endDate) {

    //     try {

    //         await initializeGee();

    //         const farm = await Farm.findByPk(farmId);

    //         if (!farm) {
    //             throw new Error("Farm tidak ditemukan");
    //         }

    //         if (!farm.polygon) {
    //             throw new Error("Polygon farm belum tersedia");
    //         }

    //         // Validasi format tanggal
    //         const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    //         if (!dateRegex.test(startDate) ||
    //             !dateRegex.test(endDate)) {

    //             throw new Error(
    //                 "Format tanggal harus YYYY-MM-DD"
    //             );
    //         }

    //         const geometry = ee.Geometry(
    //             farm.polygon
    //         );

    //         const collection =
    //             ee.ImageCollection(
    //                 "COPERNICUS/S2_SR_HARMONIZED"
    //             )
    //             .filterBounds(geometry)
    //             .filterDate(
    //                 startDate,
    //                 endDate
    //             )
    //             .filter(
    //                 ee.Filter.lt(
    //                     "CLOUDY_PIXEL_PERCENTAGE",
    //                     20
    //                 )
    //             );

    //         const image =
    //             collection.median();

    //         const ndvi =
    //             image.normalizedDifference([
    //                 "B8",
    //                 "B4"
    //             ]).rename("NDVI");

    //         const result =
    //             await new Promise((resolve, reject) => {

    //                 ndvi.reduceRegion({
    //                     reducer: ee.Reducer.mean(),
    //                     geometry: geometry,
    //                     scale: 10,
    //                     maxPixels: 1e9
    //                 }).evaluate(
    //                     (result, error) => {

    //                         if (error) {
    //                             reject(error);
    //                         } else {
    //                             resolve(result);
    //                         }

    //                     }
    //                 );

    //             });

    //         return {
    //             farmId: farm.id,
    //             farmName: farm.name,
    //             startDate,
    //             endDate,
    //             ndvi: result.NDVI
    //         };

    //     } catch (error) {

    //         console.error(
    //             "GEE getNDVI error:",
    //             error
    //         );

    //         throw error;
    //     }
    // }
    //------------------------------------------
    // dibawah ini kita mau jadikan satu semua satelit reading
    static async analyzeSatellite(
        farmId,
        targetDate
    ) {

        try {

            // =========================================
            // 1. INITIALIZE GEE
            // =========================================

            await initializeGee();


            // =========================================
            // 2. AMBIL FARM
            // =========================================

            const farm =
                await Farm.findByPk(farmId);


            if (!farm) {

                throw new Error(
                    "Farm tidak ditemukan"
                );

            }


            if (!farm.polygon) {

                throw new Error(
                    "Polygon farm belum tersedia"
                );

            }


            console.log(
                "Farm:",
                farm.name
            );


            console.log(
                "Polygon:",
                farm.polygon
            );


            // =========================================
            // 3. VALIDASI TANGGAL
            // =========================================

            const dateRegex =
                /^\d{4}-\d{2}-\d{2}$/;


            if (
                !dateRegex.test(targetDate)
            ) {

                throw new Error(
                    "Format tanggal harus YYYY-MM-DD"
                );

            }


            // =========================================
            // 4. GEOJSON → EE GEOMETRY
            // =========================================

            const geometry =
                ee.Geometry(
                    farm.polygon
                );


            // =========================================
            // 5. AMBIL SENTINEL-2 TERBARU
            // =========================================

            const collection =
                ee.ImageCollection(
                    "COPERNICUS/S2_SR_HARMONIZED"
                )

                .filterBounds(
                    geometry
                )

                .filterDate(
                    "2025-01-01",
                    targetDate
                )

                .filter(
                    ee.Filter.lt(
                        "CLOUDY_PIXEL_PERCENTAGE",
                        30
                    )
                )

                .sort(
                    "system:time_start",
                    false
                );


            // =========================================
            // 6. AMBIL IMAGE TERBARU
            // =========================================

            const image =
                collection.first();


            // =========================================
            // 7. CEK IMAGE
            // =========================================

            const imageInfo =
                await new Promise(
                    (resolve, reject) => {

                        image.evaluate(
                            (
                                result,
                                error
                            ) => {

                                if (error) {

                                    reject(error);

                                } else {

                                    resolve(result);

                                }

                            }
                        );

                    }
                );


            if (!imageInfo) {

                throw new Error(
                    "Tidak ada citra Sentinel-2 untuk periode tersebut"
                );

            }


            // =========================================
            // 8. TANGGAL CITRA SEBENARNYA
            // =========================================

            const observationDate =
                await new Promise(
                    (resolve, reject) => {

                        image
                            .date()
                            .format(
                                "YYYY-MM-dd"
                            )
                            .evaluate(
                                (
                                    result,
                                    error
                                ) => {

                                    if (error) {

                                        reject(error);

                                    } else {

                                        resolve(result);

                                    }

                                }
                            );

                    }
                );


            console.log(
                "Tanggal citra:",
                observationDate
            );


            // =========================================
            // 9. HITUNG NDVI
            // =========================================

            const ndvi =
                image
                .normalizedDifference([
                    "B8",
                    "B4"
                ])
                .rename("NDVI");


            // =========================================
            // 10. HITUNG EVI
            // =========================================

            const evi =
                image.expression(
                    "2.5 * ((NIR - RED) / " +
                    "(NIR + 6 * RED - 7.5 * BLUE + 1))",

                    {
                        NIR: image.select("B8"),

                        RED: image.select("B4"),

                        BLUE: image.select("B2")
                    }

                )
                .rename("EVI");


            // =========================================
            // 11. HITUNG GNDVI
            // =========================================

            const gndvi =
                image
                .normalizedDifference([
                    "B8",
                    "B3"
                ])
                .rename("GNDVI");


            // =========================================
            // 12. HITUNG SAVI
            // =========================================

            const savi =
                image.expression(

                    "((NIR - RED) / " +
                    "(NIR + RED + L)) * (1 + L)",

                    {

                        NIR: image.select("B8"),

                        RED: image.select("B4"),

                        L: 0.5

                    }

                )
                .rename("SAVI");


            // =========================================
            // 13. HITUNG NDMI
            // =========================================

            const ndmi =
                image
                .normalizedDifference([
                    "B8",
                    "B11"
                ])
                .rename("NDMI");


            // =========================================
            // 14. HITUNG NDWI
            // =========================================

            const ndwi =
                image
                .normalizedDifference([
                    "B3",
                    "B8"
                ])
                .rename("NDWI");


            // =========================================
            // 15. HITUNG MSI
            // =========================================

            const msi =
                image
                .select("B11")
                .divide(
                    image.select("B8")
                )
                .rename("MSI");


            // =========================================
            // 16. GABUNGKAN SEMUA INDEKS
            // =========================================

            const indices =
                ee.Image.cat([

                    ndvi,

                    evi,

                    gndvi,

                    savi,

                    ndmi,

                    ndwi,

                    msi

                ]);


            // =========================================
            // 17. HITUNG NILAI RATA-RATA FARM
            // =========================================

            const result =
                await new Promise(
                    (resolve, reject) => {

                        indices.reduceRegion({

                                reducer: ee.Reducer.mean(),

                                geometry: geometry,

                                scale: 10,

                                maxPixels: 1e9

                            })

                            .evaluate(
                                (
                                    result,
                                    error
                                ) => {

                                    if (error) {

                                        reject(error);

                                    } else {

                                        resolve(result);

                                    }

                                }
                            );

                    }
                );


            // =========================================
            // 18. RETURN HASIL
            // =========================================

            // =========================================
            // 18. RETURN HASIL
            // =========================================

            return {

                farmId: farm.id,

                farmName: farm.name,

                requestedDate: targetDate,

                observationDate: observationDate,

                source: "Sentinel-2",

                indices: {

                    NDVI: result.NDVI ?? null,

                    EVI: result.EVI ?? null,

                    GNDVI: result.GNDVI ?? null,

                    SAVI: result.SAVI ?? null,

                    NDMI: result.NDMI ?? null,

                    NDWI: result.NDWI ?? null,

                    MSI: result.MSI ?? null

                }

            };


        } catch (error) {

            console.error(
                "GEE analyzeSatellite error:",
                error
            );

            throw error;

        }

    }

    static async analyzeWeather(farmId, targetDate) {

        try {

            // =========================================
            // 1. INITIALIZE GOOGLE EARTH ENGINE
            // =========================================

            await initializeGee();

            console.log(
                "Google Earth Engine berhasil diinisialisasi"
            );


            // =========================================
            // 2. AMBIL DATA FARM
            // =========================================

            const farm =
                await Farm.findByPk(farmId);


            if (!farm) {

                throw new Error(
                    "Farm tidak ditemukan"
                );

            }


            if (
                farm.latitude === null ||
                farm.latitude === undefined ||
                farm.longitude === null ||
                farm.longitude === undefined
            ) {

                throw new Error(
                    "Latitude dan longitude farm belum tersedia"
                );

            }


            console.log(
                "Farm:",
                farm.name
            );


            console.log(
                "Farm coordinate:",
                farm.longitude,
                farm.latitude
            );


            // =========================================
            // 3. VALIDASI TANGGAL
            // =========================================

            const dateRegex =
                /^\d{4}-\d{2}-\d{2}$/;


            if (
                !dateRegex.test(targetDate)
            ) {

                throw new Error(
                    "Format tanggal harus YYYY-MM-DD"
                );

            }


            // =========================================
            // 4. FARM POINT
            // =========================================

            /*
             * Weather menggunakan titik koordinat farm.
             *
             * CHIRPS dan ERA5-Land memiliki resolusi
             * jauh lebih besar daripada ukuran lahan.
             */

            const point =
                ee.Geometry.Point([
                    farm.longitude,
                    farm.latitude
                ]);


            // =========================================
            // 5. TANGGAL REQUEST
            // =========================================

            const startDate =
                ee.Date(targetDate);


            const endDate =
                startDate.advance(
                    1,
                    "day"
                );


            console.log(
                "Requested weather date:",
                targetDate
            );


            // =====================================================
            // =====================================================
            //                    CHIRPS
            // =====================================================
            // =====================================================


            // =========================================
            // 6. AMBIL CHIRPS
            // =========================================

            /*
             * Kita tidak membatasi hanya 30 hari.
             *
             * Karena CHIRPS memiliki latency,
             * kita mengambil observasi terakhir
             * yang tersedia sebelum / sampai tanggal request.
             */

            const chirps =
                ee.ImageCollection(
                    "UCSB-CHG/CHIRPS/DAILY"
                )
                .filterBounds(
                    point
                )
                .filterDate(
                    "2025-01-01",
                    endDate
                )
                .sort(
                    "system:time_start",
                    false
                );


            // =========================================
            // 7. JUMLAH DATA CHIRPS
            // =========================================

            const chirpsCount =
                await new Promise(
                    (resolve, reject) => {

                        chirps
                            .size()
                            .evaluate(
                                (
                                    result,
                                    error
                                ) => {

                                    if (error) {

                                        reject(error);

                                    } else {

                                        resolve(result);

                                    }

                                }
                            );

                    }
                );


            console.log(
                "Jumlah CHIRPS:",
                chirpsCount
            );


            if (
                chirpsCount === 0
            ) {

                throw new Error(
                    "Data CHIRPS tidak tersedia"
                );

            }


            // =========================================
            // 8. CHIRPS TERBARU
            // =========================================

            const latestChirps =
                chirps.first();


            // =========================================
            // 9. TANGGAL OBSERVASI CHIRPS
            // =========================================

            const rainfallDate =
                await new Promise(
                    (resolve, reject) => {

                        latestChirps
                            .date()
                            .format(
                                "YYYY-MM-dd"
                            )
                            .evaluate(
                                (
                                    result,
                                    error
                                ) => {

                                    if (error) {

                                        reject(error);

                                    } else {

                                        resolve(result);

                                    }

                                }
                            );

                    }
                );


            console.log(
                "CHIRPS latest observation:",
                rainfallDate
            );


            // =========================================
            // 10. RAINFALL
            // =========================================

            const rainfall =
                latestChirps
                .select(
                    "precipitation"
                )
                .rename(
                    "rainfall"
                );


            // =====================================================
            // =====================================================
            //                   ERA5-LAND
            // =====================================================
            // =====================================================


            // =========================================
            // 11. AMBIL ERA5-LAND
            // =========================================

            /*
             * Ambil semua data ERA5 sejak 2025
             * sampai tanggal request.
             *
             * Kemudian sort descending untuk mendapatkan
             * observasi terbaru yang tersedia.
             */

            const era5 =
                ee.ImageCollection(
                    "ECMWF/ERA5_LAND/HOURLY"
                )
                .filterBounds(
                    point
                )
                .filterDate(
                    "2025-01-01",
                    endDate
                )
                .sort(
                    "system:time_start",
                    false
                );


            // =========================================
            // 12. JUMLAH DATA ERA5
            // =========================================

            const era5Count =
                await new Promise(
                    (resolve, reject) => {

                        era5
                            .size()
                            .evaluate(
                                (
                                    result,
                                    error
                                ) => {

                                    if (error) {

                                        reject(error);

                                    } else {

                                        resolve(result);

                                    }

                                }
                            );

                    }
                );


            console.log(
                "Jumlah ERA5-Land:",
                era5Count
            );


            if (
                era5Count === 0
            ) {

                throw new Error(
                    "Data ERA5-Land tidak tersedia"
                );

            }


            // =========================================
            // 13. AMBIL IMAGE ERA5 TERBARU
            // =========================================

            const latestEra5 =
                era5.first();


            // =========================================
            // 14. TANGGAL OBSERVASI ERA5
            // =========================================

            const era5ObservationDate =
                await new Promise(
                    (resolve, reject) => {

                        latestEra5
                            .date()
                            .format(
                                "YYYY-MM-dd"
                            )
                            .evaluate(
                                (
                                    result,
                                    error
                                ) => {

                                    if (error) {

                                        reject(error);

                                    } else {

                                        resolve(result);

                                    }

                                }
                            );

                    }
                );


            console.log(
                "ERA5 observation date:",
                era5ObservationDate
            );


            // =========================================
            // 15. TANGGAL ERA5
            // =========================================

            const era5Date =
                ee.Date(
                    era5ObservationDate
                );


            const era5NextDate =
                era5Date.advance(
                    1,
                    "day"
                );


            // =========================================
            // 16. AMBIL SELURUH DATA ERA5
            //     PADA TANGGAL OBSERVASI
            // =========================================

            const era5Daily =
                ee.ImageCollection(
                    "ECMWF/ERA5_LAND/HOURLY"
                )
                .filterBounds(
                    point
                )
                .filterDate(
                    era5Date,
                    era5NextDate
                );


            // =========================================
            // 17. JUMLAH IMAGE ERA5 HARIAN
            // =========================================

            const era5DailyCount =
                await new Promise(
                    (resolve, reject) => {

                        era5Daily
                            .size()
                            .evaluate(
                                (
                                    result,
                                    error
                                ) => {

                                    if (error) {

                                        reject(error);

                                    } else {

                                        resolve(result);

                                    }

                                }
                            );

                    }
                );


            console.log(
                "Jumlah ERA5 pada tanggal observasi:",
                era5DailyCount
            );


            if (
                era5DailyCount === 0
            ) {

                throw new Error(
                    "Data ERA5-Land harian tidak tersedia"
                );

            }


            // =====================================================
            // 18. TEMPERATURE
            // =====================================================

            /*
             * temperature_2m dalam Kelvin.
             *
             * Diubah menjadi Celsius.
             */

            const temperature =
                era5Daily
                .select(
                    "temperature_2m"
                )
                .mean()
                .subtract(
                    273.15
                )
                .rename(
                    "temperature"
                );


            // =====================================================
            // 19. SOIL MOISTURE
            // =====================================================

            /*
             * Gunakan observasi terakhir
             * pada hari tersebut.
             *
             * Layer 1 = lapisan tanah paling atas.
             */

            const soilMoisture =
                era5Daily
                .sort(
                    "system:time_start",
                    false
                )
                .first()
                .select(
                    "volumetric_soil_water_layer_1"
                )
                .rename(
                    "soilMoisture"
                );


            // =====================================================
            // 20. SOLAR RADIATION
            // =====================================================

            /*
             * Menggunakan band hourly.
             *
             * Dijumlahkan untuk mendapatkan
             * akumulasi solar radiation harian.
             */

            const radiation =
                era5Daily
                .select(
                    "surface_solar_radiation_downwards_hourly"
                )
                .sum()
                .rename(
                    "radiation"
                );


            // =====================================================
            // 21. GABUNGKAN SEMUA WEATHER
            // =====================================================

            const weather =
                ee.Image.cat([

                    rainfall,

                    temperature,

                    soilMoisture,

                    radiation

                ]);


            // =====================================================
            // 22. REDUCE KE FARM POINT
            // =====================================================

            const result =
                await new Promise(
                    (resolve, reject) => {

                        weather
                            .reduceRegion({

                                reducer: ee.Reducer.mean(),

                                geometry: point,

                                scale: 10000,

                                maxPixels: 1e9

                            })
                            .evaluate(
                                (
                                    result,
                                    error
                                ) => {

                                    if (error) {

                                        reject(error);

                                    } else {

                                        resolve(result);

                                    }

                                }
                            );

                    }
                );


            console.log(
                "Weather result:",
                result
            );


            // =====================================================
            // 23. RETURN
            // =====================================================

            return {

                farmId: farm.id,

                farmName: farm.name,

                requestedDate: targetDate,
                observationDate:
                     era5ObservationDate,

                observation: {

                    rainfall: rainfallDate,

                    environment: era5ObservationDate

                },

                source: {

                    rainfall: "CHIRPS",

                    environment: "ERA5-Land"

                },

                rainfall: result.rainfall !== null &&
                    result.rainfall !== undefined ?
                    result.rainfall :
                    null,

                temperature: result.temperature !== null &&
                    result.temperature !== undefined ?
                    result.temperature :
                    null,

                soilMoisture: result.soilMoisture !== null &&
                    result.soilMoisture !== undefined ?
                    result.soilMoisture :
                    null,

                radiation: result.radiation !== null &&
                    result.radiation !== undefined ?
                    result.radiation :
                    null

            };


        } catch (error) {

            console.error(
                "GEE analyzeWeather error:",
                error
            );

            throw error;

        }

    }
     static async saveGeeHistory(
         farmId,
         targetDate,
         cropId
     ) {

         try {

             // =========================================
             // 1. VALIDASI FARM DAN CROP
             // =========================================

             const farm =
                 await Farm.findByPk(farmId);

             if (!farm) {

                 throw new Error(
                     "Farm tidak ditemukan"
                 );

             }
             const crop = await Crop.findByPk(cropId);

             if (!crop) {
                 throw new Error(
                     "Crop tidak ditemukan"
                 );
             }

             if (crop.farmId !== farmId) {
                 throw new Error(
                     "Crop tidak terdaftar pada farm tersebut"
                 );
             }


             // =========================================
             // 2. ANALISIS SATELLITE
             // =========================================

             const satellite =
                 await this.analyzeSatellite(
                     farmId,
                     targetDate
                 );


             console.log(
                 "Satellite untuk GeeHistory:",
                 satellite
             );


             // =========================================
             // 3. ANALISIS WEATHER
             // =========================================

             const weather =
                 await this.analyzeWeather(
                     farmId,
                     targetDate
                 );


             console.log(
                 "Weather untuk GeeHistory:",
                 weather
             );


             // =========================================
             // 4. SIAPKAN DATA HISTORY
             // =========================================

             const historyData = {

                 date: targetDate,

                 farmId: farmId,

                 cropId: cropId,
                 observationDate:
                     satellite.observationDate ??
                     weather.observationDate ??
                     null,


                 // =====================================
                 // SATELLITE
                 // =====================================

                 ndvi: satellite.indices.NDVI ?? null,

                 evi: satellite.indices.EVI ?? null,

                 gndvi: satellite.indices.GNDVI ?? null,

                 savi: satellite.indices.SAVI ?? null,

                 ndmi: satellite.indices.NDMI ?? null,

                 ndwi: satellite.indices.NDWI ?? null,

                 msi: satellite.indices.MSI ?? null,


                 // =====================================
                 // WEATHER
                 // =====================================

                 rainfall: weather.rainfall ?? null,

                 soilMoisture: weather.soilMoisture ?? null,

                 temperature: weather.temperature ?? null,

                 radiation: weather.radiation ?? null,


                 // =====================================
                 // BELUM ADA SUMBER DATA
                 // =====================================

                 lai: null,

                 fvc: null,

                 wind: null,

                 humidity: null

             };


             console.log(
                 "Data yang akan disimpan GeeHistory:",
                 historyData
             );


             // =========================================
             // 5. CEK DATA SUDAH ADA
             // =========================================

             const existing =
                 await GeeHistory.findOne({

                     where: {

                         farmId: farmId,

                         date: targetDate

                     }

                 });


             // =========================================
             // 6. UPDATE
             // =========================================

             if (existing) {

                 await existing.update(
                     historyData
                 );

                 return {

                     action: "updated",

                     data: existing

                 };

             }


             // =========================================
             // 7. CREATE
             // =========================================

             const result =
                 await GeeHistory.create(
                     historyData
                 );


             return {

                 action: "created",

                 data: result

             };


         } catch (error) {

             console.error(
                 "GEE saveGeeHistory error:",
                 error
             );

             throw error;

         }

     }
}

module.exports = GeeService;