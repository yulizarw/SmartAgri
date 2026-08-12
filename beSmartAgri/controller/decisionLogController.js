const {
    DecisionLogService
} = require("../middlewares/decisionLogService");


// =====================================================
// CREATE DECISION LOG
// POST /api/decision-logs/:recommendationId
// =====================================================

exports.createDecisionLog = async (
    req,
    res
) => {

    try {

        const {
            recommendationId
        } = req.params;


        if (!recommendationId) {

            return res.status(400).json({

                success: false,

                message: "recommendationId wajib diisi"

            });

        }


        const result =
            await DecisionLogService.createDecisionLog(
                recommendationId
            );


        return res.status(201).json({

            success: true,

            message: "Decision log berhasil dibuat",

            data: result.data,

            relayCommand: result.relayCommand,

            recommendation: result.recommendation

        });


    } catch (error) {

        console.error(
            "createDecisionLog error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// =====================================================
// GET DECISION TERBARU
// GET /api/decision-logs/latest/:recommendationId
// =====================================================

exports.getLatestDecision = async (
    req,
    res
) => {

    try {

        const {
            recommendationId
        } = req.params;


        const result =
            await DecisionLogService.getLatestDecision(
                recommendationId
            );


        if (!result) {

            return res.status(404).json({

                success: false,

                message: "Decision log belum tersedia"

            });

        }


        return res.status(200).json({

            success: true,

            data: result

        });


    } catch (error) {

        console.error(
            "getLatestDecision error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// =====================================================
// GET COMMAND UNTUK RELAY
// GET /api/decision-logs/relay/:recommendationId
// =====================================================

exports.getRelayCommand = async (
    req,
    res
) => {

    try {

        const {
            recommendationId
        } = req.params;


        const result =
            await DecisionLogService.getLatestRelayCommand(
                recommendationId
            );


        return res.status(200).json({

            success: true,

            command: result.command,

            decisionLog: result.decisionLog

        });


    } catch (error) {

        console.error(
            "getRelayCommand error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};