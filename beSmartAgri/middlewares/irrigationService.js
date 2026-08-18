// const { DecisionLog, Recommendation } = require("../models");

// const IrrigationService = {
//   // =================================================
//   // MANUAL OVERRIDE
//   // =================================================

//   async override(recommendationId, command) {
//     const recommendation = await Recommendation.findByPk(recommendationId);

//     if (!recommendation) {
//       throw new Error("Recommendation tidak ditemukan");
//     }

//     const decisionLog = await DecisionLog.create({
//       recommendationId,

//       sensorValue: null,

//       geeValue: null,

//       confidence: null,

//       decision: command,

//       source: "MANUAL_OVERRIDE",

//       reason:
//         command === "WATERING_OFF"
//           ? "Pompa dimatikan manual oleh user"
//           : "Pompa dinyalakan manual oleh user",
//     });

//     return {
//       data: decisionLog,

//       relayCommand: command,
//     };
//   },

//   // =================================================
//   // RESUME AUTO
//   // =================================================

//   async resumeAuto(recommendationId) {
//     // =============================================
//     // CARI DECISION TERAKHIR
//     // BERDASARKAN RECOMMENDATION
//     // =============================================

//     const latestDecision = await DecisionLog.findOne({
//       where: {
//         recommendationId: recommendationId,
//       },

//       order: [["createdAt", "DESC"]],
//     });

//     // =============================================
//     // VALIDASI
//     // =============================================

//     if (!latestDecision) {
//       throw new Error(
//         "Decision log untuk recommendation tersebut belum tersedia",
//       );
//     }

//     // =============================================
//     // AMBIL COMMAND TERAKHIR
//     // =============================================

//     const command = latestDecision.decision;

//     if (command !== "WATERING_ON" && command !== "WATERING_OFF") {
//       throw new Error(`Decision terakhir tidak valid: ${command}`);
//     }

//     // =============================================
//     // BUAT DECISION LOG BARU
//     // =============================================

//     const decisionLog = await DecisionLog.create({
//       recommendationId: recommendationId,

//       sensorValue: latestDecision.sensorValue,

//       geeValue: latestDecision.geeValue,

//       confidence: latestDecision.confidence,

//       decision: command,

//       source: "RESUME_AUTO",

//       reason: `Automatic irrigation resumed berdasarkan decision terakhir: ${command}`,
//     });

//     // =============================================
//     // RETURN
//     // =============================================

//     return {
//       data: decisionLog,

//       relayCommand: command,
//     };
//   },
// };

// module.exports = IrrigationService;

const { DecisionLog, Recommendation, CropHealth } = require("../models");

const IrrigationService = {
  // =========================================================
  // MANUAL OVERRIDE
  // =========================================================

  async override(recommendationId, command) {
    // =======================================================
    // 1. GET RECOMMENDATION
    // =======================================================

    const recommendation = await Recommendation.findByPk(recommendationId);

    if (!recommendation) {
      throw new Error("Recommendation tidak ditemukan");
    }

    // =======================================================
    // 2. VALIDASI COMMAND
    // =======================================================

    if (command !== "WATERING_ON" && command !== "WATERING_OFF") {
      throw new Error("Command harus WATERING_ON atau WATERING_OFF");
    }

    // =======================================================
    // 3. GET CROP HEALTH
    // =======================================================

    const cropHealth = recommendation.cropHealthId
      ? await CropHealth.findByPk(recommendation.cropHealthId)
      : null;

    // =======================================================
    // 4. SENSOR / GEE VALUE
    // =======================================================

    const sensorValue =
      cropHealth?.iotScore !== null && cropHealth?.iotScore !== undefined
        ? Number(cropHealth.iotScore)
        : null;

    const geeValue =
      cropHealth?.vegetationScore !== null &&
      cropHealth?.vegetationScore !== undefined
        ? Number(cropHealth.vegetationScore)
        : null;

    // =======================================================
    // 5. MANUAL DECISION LOG
    // =======================================================

    const decisionLog = await DecisionLog.create({
      recommendationId,

      sensorValue,

      geeValue,

      confidence: null,

      decision: command,

      source: "MANUAL_OVERRIDE",

      reason:
        command === "WATERING_OFF"
          ? "Pompa dimatikan manual oleh user"
          : "Pompa dinyalakan manual oleh user",
    });

    // =======================================================
    // 6. RETURN COMMAND
    // =======================================================

    return {
      action: "manual_override",

      data: decisionLog,

      relayCommand: command,
    };
  },

  // =========================================================
  // RESUME AUTO
  // =========================================================

  async resumeAuto(recommendationId) {
    // =======================================================
    // 1. GET RECOMMENDATION
    // =======================================================

    const recommendation = await Recommendation.findByPk(recommendationId);

    if (!recommendation) {
      throw new Error("Recommendation tidak ditemukan");
    }

    // =======================================================
    // 2. TENTUKAN COMMAND DARI RECOMMENDATION
    // =======================================================
    //
    // INI BAGIAN PALING PENTING.
    //
    // Resume Auto:
    //
    // watering true
    //      ↓
    // WATERING_ON
    //
    // watering false
    //      ↓
    // WATERING_OFF
    //
    // =======================================================

    const relayCommand =
      recommendation.watering === true ? "WATERING_ON" : "WATERING_OFF";

    // =======================================================
    // 3. GET CROP HEALTH
    // =======================================================

    const cropHealth = recommendation.cropHealthId
      ? await CropHealth.findByPk(recommendation.cropHealthId)
      : null;

    // =======================================================
    // 4. SENSOR VALUE
    // =======================================================

    const sensorValue =
      cropHealth?.iotScore !== null && cropHealth?.iotScore !== undefined
        ? Number(cropHealth.iotScore)
        : null;

    // =======================================================
    // 5. GEE VALUE
    // =======================================================

    const geeValue =
      cropHealth?.vegetationScore !== null &&
      cropHealth?.vegetationScore !== undefined
        ? Number(cropHealth.vegetationScore)
        : null;

    // =======================================================
    // 6. CONFIDENCE
    // =======================================================

    let confidence = 0.5;

    if (cropHealth?.iotScore !== null && cropHealth?.iotScore !== undefined) {
      confidence = 0.9;
    } else if (
      cropHealth?.soilScore !== null &&
      cropHealth?.soilScore !== undefined
    ) {
      confidence = 0.75;
    }

    // =======================================================
    // 7. REASON
    // =======================================================

    let reason;

    if (relayCommand === "WATERING_ON") {
      reason =
        `Automatic irrigation dilanjutkan. ` +
        `Pompa dinyalakan berdasarkan recommendation: ` +
        `${recommendation.recommendation}`;
    } else {
      reason =
        `Automatic irrigation dilanjutkan. ` +
        `Pompa tetap dimatikan berdasarkan recommendation: ` +
        `${recommendation.recommendation}`;
    }

    // =======================================================
    // 8. CREATE NEW AUTO DECISION
    // =======================================================

    const decisionLog = await DecisionLog.create({
      recommendationId,

      sensorValue,

      geeValue,

      confidence,

      decision: relayCommand,

      source: "RESUME_AUTO",

      reason,
    });

    // =======================================================
    // 9. RETURN
    // =======================================================

    return {
      action: "resume_auto",

      data: decisionLog,

      relayCommand,
    };
  },
};

module.exports = IrrigationService;