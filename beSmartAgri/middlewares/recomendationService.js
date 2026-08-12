// ============================================================
// recommendation.service.js
// ============================================================

const {
    Recommendation,
    CropHealth
} = require("../models");

const {
    Op
} = require("sequelize");


class RecommendationService {

    // ========================================================
    // MEMBUAT RECOMMENDATION DARI HASIL CROP HEALTH
    // ========================================================

    static async generateRecommendation(cropHealthId) {

        // ----------------------------------------------------
        // 1. Ambil CropHealth
        // ----------------------------------------------------

        const cropHealth =
            await CropHealth.findByPk(
                cropHealthId
            );

        if (!cropHealth) {

            throw new Error(
                "CropHealth tidak ditemukan"
            );

        }


        const {

            vegetationScore,
            climateScore,
            soilScore,
            iotScore,
            overallScore,
            farmId,
            cropId

        } = cropHealth;


        // ----------------------------------------------------
        // 2. Normalisasi nilai
        // ----------------------------------------------------

        const soil =
            soilScore !== null &&
            soilScore !== undefined ?
            Number(soilScore) :
            null;

        const iot =
            iotScore !== null &&
            iotScore !== undefined ?
            Number(iotScore) :
            null;

        const overall =
            overallScore !== null &&
            overallScore !== undefined ?
            Number(overallScore) :
            null;


        // ====================================================
        // 3. DEFAULT
        // ====================================================

        let recommendation =
            "Tidak ada tindakan";

        let watering = false;

        let fertilize = false;

        let priority = "LOW";

        let status = "ACTIVE";


        // ====================================================
        // 4. LOGIC PENYIRAMAN
        // ====================================================

        /*
         * Prioritas menggunakan:
         *
         * 1. IoT Score
         * 2. Soil Score
         *
         * Jika IoT tersedia maka IoT lebih dipercaya
         * karena berasal dari sensor aktual.
         */

        const moistureScore =
            iot !== null ?
            iot :
            soil;


        // ----------------------------------------------------
        // SANGAT KERING
        // ----------------------------------------------------

        if (
            moistureScore !== null &&
            moistureScore < 40
        ) {

            watering = true;

            priority = "HIGH";

            recommendation =
                "Segera lakukan penyiraman tanaman";

        }


        // ----------------------------------------------------
        // CUKUP KERING
        // ----------------------------------------------------
        else if (
            moistureScore !== null &&
            moistureScore < 60
        ) {

            watering = true;

            priority = "MEDIUM";

            recommendation =
                "Lakukan penyiraman tanaman";

        }


        // ====================================================
        // 5. LOGIC PEMUPUKAN
        // ====================================================

        /*
         * Pemupukan jangan hanya berdasarkan soil moisture.
         *
         * Kita gunakan:
         *
         * - vegetationScore
         * - overallScore
         *
         * Jika kondisi vegetasi rendah,
         * tanaman berpotensi membutuhkan nutrisi.
         */

        const vegetation =
            vegetationScore !== null &&
            vegetationScore !== undefined ?
            Number(vegetationScore) :
            null;


        const climate =
            climateScore !== null &&
            climateScore !== undefined ?
            Number(climateScore) :
            null;


        // ----------------------------------------------------
        // VEGETASI RENDAH
        // ----------------------------------------------------

        if (
            vegetation !== null &&
            vegetation < 40
        ) {

            fertilize = true;

            if (
                priority === "LOW"
            ) {

                priority = "MEDIUM";

            }

            recommendation =
                watering ?
                "Lakukan penyiraman dan evaluasi kebutuhan pemupukan tanaman" :
                "Evaluasi dan lakukan pemupukan tanaman";

        }


        // ----------------------------------------------------
        // KONDISI SANGAT BURUK
        // ----------------------------------------------------

        if (
            overall !== null &&
            overall < 40
        ) {

            priority = "HIGH";

            if (
                watering &&
                fertilize
            ) {

                recommendation =
                    "Segera lakukan penyiraman dan pemupukan tanaman";

            } else if (
                watering
            ) {

                recommendation =
                    "Segera lakukan penyiraman tanaman";

            } else if (
                fertilize
            ) {

                recommendation =
                    "Segera lakukan pemupukan tanaman";

            } else {

                recommendation =
                    "Lakukan pemeriksaan kondisi tanaman";

            }

        }


        // ====================================================
        // 6. KONDISI BAIK
        // ====================================================

        if (
            overall !== null &&
            overall >= 80 &&
            !watering &&
            !fertilize
        ) {

            recommendation =
                "Kondisi tanaman baik, tidak diperlukan tindakan";

            priority = "LOW";

        }


        // ====================================================
        // 7. CEK RECOMMENDATION LAMA
        // ====================================================

        /*
         * Kita tidak ingin setiap kali endpoint dipanggil
         * membuat recommendation baru.
         *
         * Satu CropHealth hanya memiliki satu recommendation
         * aktif.
         */

        const existing =
            await Recommendation.findOne({

                where: {

                    cropHealthId: cropHealthId,

                    status: "ACTIVE"

                },

                order: [

                    [
                        "createdAt",
                        "DESC"
                    ]

                ]

            });


        // ====================================================
        // 8. DATA RECOMMENDATION
        // ====================================================

        const recommendationData = {

            recommendation: recommendation,

            watering: watering,

            fertilize: fertilize,

            priority: priority,

            status: status,

            cropHealthId: cropHealthId

        };


        // ====================================================
        // 9. UPDATE
        // ====================================================

        if (existing) {

            await existing.update(
                recommendationData
            );


            return {

                action: "updated",

                data: existing,

                analysis: {

                    vegetationScore: vegetation,

                    climateScore: climate,

                    soilScore: soil,

                    iotScore: iot,

                    overallScore: overall

                }

            };

        }


        // ====================================================
        // 10. CREATE
        // ====================================================

        const result =
            await Recommendation.create(
                recommendationData
            );


        return {

            action: "created",

            data: result,

            analysis: {

                vegetationScore: vegetation,

                climateScore: climate,

                soilScore: soil,

                iotScore: iot,

                overallScore: overall

            }

        };

    }


    // ========================================================
    // GET RECOMMENDATION TERAKHIR
    // ========================================================

    static async getLatestRecommendation(
        cropHealthId
    ) {

        return await Recommendation.findOne({

            where: {

                cropHealthId: cropHealthId

            },

            order: [

                [
                    "createdAt",
                    "DESC"
                ]

            ]

        });

    }

}





// ============================================================
// EXPORT
// ============================================================

module.exports = {

    RecommendationService,



};