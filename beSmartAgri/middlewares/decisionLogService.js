// ============================================================
// decisionLog.service.js
// ============================================================

const {
    DecisionLog,
    Recommendation
} = require("../models");


class DecisionLogService {


    // ========================================================
    // MEMBUAT DECISION LOG DARI RECOMMENDATION
    // ========================================================

    static async createDecisionLog(
        recommendationId
    ) {

        // ----------------------------------------------------
        // 1. Ambil Recommendation
        // ----------------------------------------------------

        const recommendation =
            await Recommendation.findByPk(
                recommendationId
            );


        if (!recommendation) {

            throw new Error(
                "Recommendation tidak ditemukan"
            );

        }


        // ====================================================
        // 2. Tentukan decision
        // ====================================================

        let decision =
            "OFF";


        // ----------------------------------------------------
        // WATERING
        // ----------------------------------------------------

        if (
            recommendation.watering === true
        ) {

            decision =
                "WATERING_ON";

        }


        // ----------------------------------------------------
        // FERTILIZE
        // ----------------------------------------------------

        if (
            recommendation.fertilize === true
        ) {

            /*
             * Jika penyiraman dan pemupukan sama-sama true,
             * kita prioritaskan watering sebagai command
             * pertama.
             *
             * Pemupukan dapat dibuat decision berikutnya.
             */

            if (
                decision === "OFF"
            ) {

                decision =
                    "FERTILIZE_ON";

            }

        }


        // ====================================================
        // 3. SENSOR VALUE
        // ====================================================

        /*
         * Untuk sementara sensorValue dan geeValue
         * kita isi berdasarkan data yang tersedia dari
         * CropHealth.
         *
         * Nanti kalau kita sudah menentukan sensor mana
         * yang menjadi trigger utama, nilainya bisa dibuat
         * lebih spesifik.
         */

        let sensorValue =
            null;

        let geeValue =
            null;

        let confidence =
            0;


        // ====================================================
        // 4. Ambil CropHealth
        // ====================================================

        const cropHealth =
            await recommendation.getCropHealth ?
            await recommendation.getCropHealth() :
            null;


        /*
         * Jika association belum dibuat di model,
         * kita fallback dengan query biasa.
         */

        let health = cropHealth;


        if (!health) {

            const {
                CropHealth
            } = require("../models");


            health =
                await CropHealth.findByPk(
                    recommendation.cropHealthId
                );

        }


        if (health) {

            // ----------------------------------------------
            // IoT
            // ----------------------------------------------

            if (
                health.iotScore !== null &&
                health.iotScore !== undefined
            ) {

                sensorValue =
                    Number(
                        health.iotScore
                    );

            }


            // ----------------------------------------------
            // GEE / Vegetation
            // ----------------------------------------------

            if (
                health.vegetationScore !== null &&
                health.vegetationScore !== undefined
            ) {

                geeValue =
                    Number(
                        health.vegetationScore
                    );

            }


            // ----------------------------------------------
            // Confidence
            // ----------------------------------------------

            /*
             * Confidence sederhana.
             *
             * Nanti dapat dikembangkan menjadi
             * confidence berbasis data sensor,
             * jumlah reading, dan kualitas data.
             */

            if (
                health.iotScore !== null &&
                health.iotScore !== undefined
            ) {

                confidence =
                    0.90;

            } else if (
                health.soilScore !== null &&
                health.soilScore !== undefined
            ) {

                confidence =
                    0.75;

            } else {

                confidence =
                    0.50;

            }

        }


        // ====================================================
        // 5. Reason
        // ====================================================

        let reason =
            recommendation.recommendation;


        if (
            decision === "WATERING_ON"
        ) {

            reason =
                `Penyiraman diaktifkan karena: ${recommendation.recommendation}`;

        } else if (
            decision === "FERTILIZE_ON"
        ) {

            reason =
                `Pemupukan diaktifkan karena: ${recommendation.recommendation}`;

        } else {

            reason =
                `Tidak ada tindakan relay: ${recommendation.recommendation}`;

        }


        // ====================================================
        // 6. DATA DECISION LOG
        // ====================================================

        const decisionData = {

            sensorValue: sensorValue,

            geeValue: geeValue,

            confidence: confidence,

            decision: decision,

            reason: reason,

            recommendationId: recommendationId

        };


        // ====================================================
        // 7. CREATE DECISION LOG
        // ====================================================

        const result =
            await DecisionLog.create(
                decisionData
            );


        // ====================================================
        // 8. RETURN
        // ====================================================

        return {

            action: "created",

            data: result,

            relayCommand: decision,

            recommendation: recommendation

        };

    }


    // ========================================================
    // GET DECISION TERAKHIR
    // ========================================================

    static async getLatestDecision(
        recommendationId
    ) {

        return await DecisionLog.findOne({

            where: {

                recommendationId: recommendationId

            },

            order: [

                [
                    "createdAt",
                    "DESC"
                ]

            ]

        });

    }


    // ========================================================
    // GET DECISION YANG SIAP DIEKSEKUSI RELAY
    // ========================================================

    static async getLatestRelayCommand(
        recommendationId
    ) {

        const decision =
            await DecisionLog.findOne({

                where: {

                    recommendationId: recommendationId

                },

                order: [

                    [
                        "createdAt",
                        "DESC"
                    ]

                ]

            });


        if (!decision) {

            return {

                command: "OFF",

                decisionLog: null

            };

        }


        return {

            command: decision.decision,

            decisionLog: decision

        };

    }

}
// ============================================================
// EXPORT
// ============================================================

module.exports = {


    DecisionLogService

};