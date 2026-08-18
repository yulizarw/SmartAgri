const IrrigationService = require("../middlewares/irrigationService");
const {Farm,Crop,CropHealth,Recommendation,DecisionLog} = require("../models")
// =====================================================
// MANUAL OVERRIDE
// POST /api/irrigation/override
// =====================================================

exports.override = async (req, res) => {
  try {
    const { recommendationId, command } = req.body;
    console.log(recommendationId);

    // =============================================
    // VALIDASI
    // =============================================

    if (!recommendationId) {
      return res.status(400).json({
        success: false,

        message: "recommendationId wajib diisi",
      });
    }

    if (!command) {
      return res.status(400).json({
        success: false,

        message: "command wajib diisi",
      });
    }

    if (command !== "WATERING_ON" && command !== "WATERING_OFF") {
      return res.status(400).json({
        success: false,

        message: "command harus WATERING_ON atau WATERING_OFF",
      });
    }

    // =============================================
    // EXECUTE
    // =============================================

    const result = await IrrigationService.override(
      recommendationId,

      command,
    );

    return res.status(201).json({
      success: true,

      message:
        command === "WATERING_OFF"
          ? "Pompa berhasil dimatikan secara manual"
          : "Pompa berhasil dinyalakan secara manual",

      data: result.data,

      relayCommand: result.relayCommand,
    });
  } catch (error) {
    console.error("Irrigation override error:", error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// =====================================================
// RESUME AUTOMATIC
// POST /api/irrigation/resume-auto
// =====================================================

exports.resumeAuto = async (req, res) => {
  try {
    const { recommendationId } = req.body;

    // =============================================
    // VALIDASI
    // =============================================

    if (!recommendationId) {
      return res.status(400).json({
        success: false,

        message: "recommendationId wajib diisi",
      });
    }

    // =============================================
    // RESUME AUTO
    // =============================================

    const result = await IrrigationService.resumeAuto(recommendationId);

    return res.status(201).json({
      success: true,

      message: "Automatic irrigation berhasil dilanjutkan",

      data: result.data,

      relayCommand: result.relayCommand,
    });
  } catch (error) {
    console.error("Irrigation resume auto error:", error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// =====================================================
// GET IRRIGATION STATUS
// GET /api/irrigation/status?farmId=7&cropId=15
// =====================================================

exports.getStatus = async (req, res) => {
  try {
    const { farmId, cropId } = req.query;

    // =================================================
    // VALIDASI
    // =================================================

    if (!farmId) {
      return res.status(400).json({
        success: false,
        message: "farmId wajib diisi",
      });
    }

    if (!cropId) {
      return res.status(400).json({
        success: false,
        message: "cropId wajib diisi",
      });
    }

    // =================================================
    // 1. FARM
    // =================================================

    const farm = await Farm.findByPk(farmId);

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: "Farm tidak ditemukan",
      });
    }

    // =================================================
    // 2. CROP
    // =================================================

    const crop = await Crop.findOne({
      where: {
        id: cropId,
        farmId,
      },
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop tidak ditemukan pada farm tersebut",
      });
    }

    // =================================================
    // 3. LATEST CROP HEALTH
    // =================================================

    const cropHealth = await CropHealth.findOne({
      where: {
        farmId,
        cropId,
      },

      order: [["createdAt", "DESC"]],
    });

    // Belum ada automation sama sekali
    if (!cropHealth) {
      return res.status(200).json({
        success: true,

        data: {
          farm,
          crop,

          cropHealth: null,
          recommendation: null,
          decision: null,

          relay: {
            command: "WATERING_OFF",
          },

          controlMode: "AUTO",
        },
      });
    }

    // =================================================
    // 4. LATEST RECOMMENDATION
    // =================================================

    const recommendation = await Recommendation.findOne({
      where: {
        cropHealthId: cropHealth.id,
      },

      order: [["createdAt", "DESC"]],
    });

    // =================================================
    // 5. LATEST DECISION
    // =================================================

    let decision = null;

    if (recommendation) {
      decision = await DecisionLog.findOne({
        where: {
          recommendationId: recommendation.id,
        },

        order: [["createdAt", "DESC"]],
      });
    }

    // =================================================
    // 6. RELAY COMMAND
    // =================================================

    const relayCommand = decision?.decision || "WATERING_OFF";

    // =================================================
    // 7. CONTROL MODE
    // =================================================

    let controlMode = "AUTO";

    if (decision?.source) {
      const source = String(decision.source).toUpperCase();

      if (
        source.includes("MANUAL") ||
        source.includes("OVERRIDE") ||
        source.includes("USER")
      ) {
        controlMode = "OVERRIDE";
      }
    }

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,

      data: {
        farm,

        crop,

        cropHealth,

        recommendation,

        decision,

        relay: {
          command: relayCommand,

          decisionLog: decision,
        },

        controlMode,
      },
    });
  } catch (error) {
    console.error("get irrigation status error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET IRRIGATION HISTORY
// GET /api/irrigation/history
// ?farmId=7&cropId=15&page=1&limit=20
// =====================================================

exports.getHistory = async (req, res) => {
  try {
    const {
      farmId,
      cropId,
      page = 1,
      limit = 20,
    } = req.query;

    // =================================================
    // VALIDASI
    // =================================================

    if (!farmId || !cropId) {
      return res.status(400).json({
        success: false,
        message: "farmId dan cropId wajib diisi",
      });
    }

    // =================================================
    // NORMALISASI PAGINATION
    // =================================================

    const parsedPage = Math.max(
      Number(page) || 1,
      1,
    );

    const parsedLimit = Math.min(
      Math.max(Number(limit) || 20, 1),
      100,
    );

    const offset =
      (parsedPage - 1) * parsedLimit;

    // =================================================
    // VALIDASI FARM
    // =================================================

    const farm = await Farm.findByPk(
      farmId,
    );

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: "Farm tidak ditemukan",
      });
    }

    // =================================================
    // VALIDASI CROP
    // =================================================

    const crop = await Crop.findOne({
      where: {
        id: cropId,
        farmId,
      },
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message:
          "Crop tidak ditemukan pada farm tersebut",
      });
    }

    // =================================================
    // COUNT + GET CROP HEALTH
    // =================================================

    const {
      count,
      rows: cropHealthList,
    } =
      await CropHealth.findAndCountAll({
        where: {
          farmId,
          cropId,
        },

        order: [
          ["createdAt", "DESC"],
        ],

        limit: parsedLimit,

        offset,
      });

    // =================================================
    // BUILD HISTORY
    // =================================================

    const history = [];

    for (
      const cropHealth
      of cropHealthList
    ) {
      // ===============================================
      // LATEST RECOMMENDATION
      // ===============================================

      const recommendation =
        await Recommendation.findOne({
          where: {
            cropHealthId:
              cropHealth.id,
          },

          order: [
            ["createdAt", "DESC"],
          ],
        });

      // ===============================================
      // LATEST DECISION
      // ===============================================

      let decision = null;

      if (recommendation) {
        decision =
          await DecisionLog.findOne({
            where: {
              recommendationId:
                recommendation.id,
            },

            order: [
              ["createdAt", "DESC"],
            ],
          });
      }

      // ===============================================
      // PUSH HISTORY
      // ===============================================

      history.push({
        cropHealth,

        recommendation,

        decision,

        relayCommand:
          decision?.decision ||
          "WATERING_OFF",

        controlMode:
          getControlModeFromDecision(
            decision,
          ),

        createdAt:
          decision?.createdAt ||
          recommendation?.createdAt ||
          cropHealth.createdAt,
      });
    }

    // =================================================
    // PAGINATION INFO
    // =================================================

    const totalItems =
      Number(count);

    const totalPages =
      Math.ceil(
        totalItems /
          parsedLimit,
      );

    const hasNextPage =
      parsedPage <
      totalPages;

    const hasPrevPage =
      parsedPage > 1;

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,

      data: history,

      pagination: {
        page:
          parsedPage,

        limit:
          parsedLimit,

        totalItems,

        totalPages,

        hasNextPage,

        hasPrevPage,
      },
    });
  } catch (error) {
    console.error(
      "get irrigation history error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET CONTROL MODE FROM DECISION
// =====================================================

const getControlModeFromDecision = (
  decision,
) => {
  if (!decision?.source) {
    return "AUTO";
  }

  const source =
    String(
      decision.source,
    ).toUpperCase();

  if (
    source.includes(
      "MANUAL",
    ) ||
    source.includes(
      "OVERRIDE",
    ) ||
    source.includes(
      "USER",
    )
  ) {
    return "OVERRIDE";
  }

  return "AUTO";
};




// exports.getHistory = async (req, res) => {
//   try {

//     const { farmId, cropId, limit = 20 } = req.query;

//     if (!farmId || !cropId) {
//       return res.status(400).json({
//         success: false,
//         message: "farmId dan cropId wajib diisi",
//       });
//     }
//     const parsedLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);

//     // =================================================
//     // CROP HEALTH HISTORY
//     // =================================================

//     const cropHealthList = await CropHealth.findAll({
//       where: {
//         farmId,
//         cropId,
//       },

//       order: [["createdAt", "DESC"]],

//       limit: Number(limit),
//     });

//     const history = [];

//     // =================================================
//     // BUILD AUTOMATION HISTORY
//     // =================================================

//     for (const cropHealth of cropHealthList) {
//       const recommendation = await Recommendation.findOne({
//         where: {
//           cropHealthId: cropHealth.id,
//         },

//         order: [["createdAt", "DESC"]],
//       });

//       let decision = null;

//       if (recommendation) {
//         decision = await DecisionLog.findOne({
//           where: {
//             recommendationId: recommendation.id,
//           },

//           order: [["createdAt", "DESC"]],
//         });
//       }

//       history.push({
//         cropHealth,

//         recommendation,

//         decision,

//         relayCommand: decision?.decision || "WATERING_OFF",

//         controlMode: getControlModeFromDecision(decision),

//         createdAt:
//           decision?.createdAt ||
//           recommendation?.createdAt ||
//           cropHealth.createdAt,
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       data: history,
//     });
//   } catch (error) {
//     console.error("get irrigation history error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// const getControlModeFromDecision = (decision) => {
//   if (!decision?.source) {
//     return "AUTO";
//   }

//   const source = String(decision.source).toUpperCase();

//   if (
//     source.includes("MANUAL") ||
//     source.includes("OVERRIDE") ||
//     source.includes("USER")
//   ) {
//     return "OVERRIDE";
//   }

//   return "AUTO";
// };