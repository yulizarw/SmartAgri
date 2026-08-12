const {
    RecommendationService
} = require("../middlewares/recomendationService");


// =====================================================
// GENERATE RECOMMENDATION
// POST /api/recommendations/generate/:cropHealthId
// =====================================================

exports.generateRecommendation = async (req, res) => {

    try {

        const {
            cropHealthId
        } = req.params;


        if (!cropHealthId) {

            return res.status(400).json({

                success: false,

                message: "cropHealthId wajib diisi"

            });

        }


        const result =
            await RecommendationService.generateRecommendation(
                cropHealthId
            );


        return res.status(
            result.action === "created" ?
            201 :
            200
        ).json({

            success: true,

            message: result.action === "created" ?
                "Recommendation berhasil dibuat" :
                "Recommendation berhasil diperbarui",

            data: result.data,

            analysis: result.analysis

        });


    } catch (error) {

        console.error(
            "generateRecommendation error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// =====================================================
// GET RECOMMENDATION TERBARU
// GET /api/recommendations/latest/:cropHealthId
// =====================================================

exports.getLatestRecommendation = async (
    req,
    res
) => {

    try {

        const {
            cropHealthId
        } = req.params;


        if (!cropHealthId) {

            return res.status(400).json({

                success: false,

                message: "cropHealthId wajib diisi"

            });

        }


        const result =
            await RecommendationService.getLatestRecommendation(
                cropHealthId
            );


        if (!result) {

            return res.status(404).json({

                success: false,

                message: "Recommendation belum tersedia"

            });

        }


        return res.status(200).json({

            success: true,

            data: result

        });


    } catch (error) {

        console.error(
            "getLatestRecommendation error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};