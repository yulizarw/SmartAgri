const GeeService =
    require("../middlewares/geeService");

class GeeController {

    static async testConnection(req, res) {

        try {

            const result =
                await GeeService.initialize();

            res.status(200).json(result);

        } catch (error) {

            console.error(
                "GEE Controller Error:",
                error
            );

            res.status(500).json({

                success: false,

                message: "Google Earth Engine gagal terhubung",

                error: error.message

            });

        }

    }
    static async getNDVI(req, res) {

        try {

            const {
                farmId,
                startDate,
                endDate
            } = req.body;

            if (!farmId) {
                return res.status(400).json({
                    success: false,
                    message: "farmId wajib diisi"
                });
            }

            const result =
                await GeeService.getNDVI(
                    farmId,
                    startDate,
                    endDate
                );

            res.status(200).json({
                success: true,
                data: result
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                success: false,
                message: "Gagal mengambil NDVI",
                error: error.message
            });

        }

    }

    static async analyzeSatellite(req, res) {

        try {

            const {
                farmId,
                date
            } = req.body;


            if (!farmId) {

                return res.status(400).json({

                    success: false,

                    message: "farmId wajib diisi"

                });

            }


            if (!date) {

                return res.status(400).json({

                    success: false,

                    message: "date wajib diisi"

                });

            }


            const result =
                await GeeService.analyzeSatellite(
                    farmId,
                    date
                );


            return res.status(200).json({

                success: true,

                data: result

            });


        } catch (error) {

            console.error(
                "GEE analyzeSatellite error:",
                error
            );


            return res.status(500).json({

                success: false,

                message: "Gagal menganalisis data GEE",

                error: error.message

            });

        }

    }

    static async analyzeWeather(req, res) {

        try {

            const {
                farmId,
                date
            } = req.body;


            if (!farmId) {

                return res.status(400).json({

                    success: false,

                    message: "farmId wajib diisi"

                });

            }


            if (!date) {

                return res.status(400).json({

                    success: false,

                    message: "date wajib diisi"

                });

            }


            const result =
                await GeeService.analyzeWeather(
                    farmId,
                    date
                );


            return res.status(200).json({

                success: true,

                data: result

            });


        } catch (error) {

            console.error(error);


            return res.status(500).json({

                success: false,

                message: "Gagal mengambil data weather GEE",

                error: error.message

            });

        }

    }

}

module.exports = GeeController;