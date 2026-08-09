const {
    WeatherForecast,
    Farm
} = require("../models");

const GeeService = require("./geeService");


class WeatherForecastService {


    // =========================================
    // SAVE WEATHER FROM GEE
    // =========================================

    static async saveWeather(
        farmId,
        date
    ) {

        // =========================================
        // 1. VALIDASI FARM
        // =========================================

        const farm =
            await Farm.findByPk(farmId);

        if (!farm) {

            throw new Error(
                "Farm tidak ditemukan"
            );

        }


        // =========================================
        // 2. AMBIL DATA DARI GEE
        // =========================================

        const weather =
            await GeeService.analyzeWeather(
                farmId,
                date
            );


        console.log(
            "Weather dari GEE:",
            weather
        );


        // =========================================
        // 3. CEK DATA SUDAH ADA ATAU BELUM
        // =========================================

        const existing =
            await WeatherForecast.findOne({

                where: {

                    farmId: farmId,

                    date: date

                }

            });


        // =========================================
        // 4. DATA WEATHER
        // =========================================

        const weatherData = {

            farmId: farmId,

            date: date,
            observationDate:
                weather.observationDate ?? null,

            rain: weather.rainfall ?? null,

            temperature: weather.temperature ?? null,

            soilMoisture: weather.soilMoisture ?? null,

            radiation: weather.radiation ?? null,

            source: "CHIRPS + ERA5-Land"

        };


        // =========================================
        // 5. UPDATE JIKA SUDAH ADA
        // =========================================

        if (existing) {

            await existing.update(
                weatherData
            );

            return {

                action: "updated",

                data: existing

            };

        }


        // =========================================
        // 6. CREATE JIKA BELUM ADA
        // =========================================

        const result =
            await WeatherForecast.create(
                weatherData
            );


        return {

            action: "created",

            data: result

        };

    }

}


module.exports =
    WeatherForecastService;