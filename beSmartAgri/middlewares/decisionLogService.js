// // ============================================================
// // decisionLog.service.js
// // ============================================================

// const { DecisionLog, Recommendation } = require("../models");

// class DecisionLogService {
//   // ========================================================
//   // MEMBUAT DECISION LOG DARI RECOMMENDATION
//   // ========================================================

//   static async createDecisionLog(recommendationId) {
//     // ----------------------------------------------------
//     // 1. Ambil Recommendation
//     // ----------------------------------------------------

//     const recommendation = await Recommendation.findByPk(recommendationId);

//     if (!recommendation) {
//       throw new Error("Recommendation tidak ditemukan");
//     }

//     // ====================================================
//     // 2. Tentukan decision
//     // ====================================================

//     let decision = "OFF";

//     // ----------------------------------------------------
//     // WATERING
//     // ----------------------------------------------------

//     if (recommendation.watering === true) {
//       decision = "WATERING_ON";
//     }

//     // ----------------------------------------------------
//     // FERTILIZE
//     // ----------------------------------------------------

//     if (recommendation.fertilize === true) {
//       /*
//        * Jika penyiraman dan pemupukan sama-sama true,
//        * kita prioritaskan watering sebagai command
//        * pertama.
//        *
//        * Pemupukan dapat dibuat decision berikutnya.
//        */

//       if (decision === "OFF") {
//         decision = "FERTILIZE_ON";
//       }
//     }

//     // ====================================================
//     // 3. SENSOR VALUE
//     // ====================================================

//     /*
//      * Untuk sementara sensorValue dan geeValue
//      * kita isi berdasarkan data yang tersedia dari
//      * CropHealth.
//      *
//      * Nanti kalau kita sudah menentukan sensor mana
//      * yang menjadi trigger utama, nilainya bisa dibuat
//      * lebih spesifik.
//      */

//     let sensorValue = null;

//     let geeValue = null;

//     let confidence = 0;

//     // ====================================================
//     // 4. Ambil CropHealth
//     // ====================================================

//     const cropHealth = (await recommendation.getCropHealth)
//       ? await recommendation.getCropHealth()
//       : null;

//     /*
//      * Jika association belum dibuat di model,
//      * kita fallback dengan query biasa.
//      */

//     let health = cropHealth;

//     if (!health) {
//       const { CropHealth } = require("../models");

//       health = await CropHealth.findByPk(recommendation.cropHealthId);
//     }

//     if (health) {
//       // ----------------------------------------------
//       // IoT
//       // ----------------------------------------------

//       if (health.iotScore !== null && health.iotScore !== undefined) {
//         sensorValue = Number(health.iotScore);
//       }

//       // ----------------------------------------------
//       // GEE / Vegetation
//       // ----------------------------------------------

//       if (
//         health.vegetationScore !== null &&
//         health.vegetationScore !== undefined
//       ) {
//         geeValue = Number(health.vegetationScore);
//       }

//       // ----------------------------------------------
//       // Confidence
//       // ----------------------------------------------

//       /*
//        * Confidence sederhana.
//        *
//        * Nanti dapat dikembangkan menjadi
//        * confidence berbasis data sensor,
//        * jumlah reading, dan kualitas data.
//        */

//       if (health.iotScore !== null && health.iotScore !== undefined) {
//         confidence = 0.9;
//       } else if (health.soilScore !== null && health.soilScore !== undefined) {
//         confidence = 0.75;
//       } else {
//         confidence = 0.5;
//       }
//     }

//     // ====================================================
//     // 5. Reason
//     // ====================================================

//     let reason = recommendation.recommendation;

//     if (decision === "WATERING_ON") {
//       reason = `Penyiraman diaktifkan karena: ${recommendation.recommendation}`;
//     } else if (decision === "FERTILIZE_ON") {
//       reason = `Pemupukan diaktifkan karena: ${recommendation.recommendation}`;
//     } else {
//       reason = `Tidak ada tindakan relay: ${recommendation.recommendation}`;
//     }

//     // ====================================================
//     // 6. DATA DECISION LOG
//     // ====================================================

//     const decisionData = {
//       sensorValue: sensorValue,

//       geeValue: geeValue,

//       confidence: confidence,

//       decision: decision,

//       reason: reason,

//       recommendationId: recommendationId,
//     };

//     // ====================================================
//     // 7. CREATE DECISION LOG
//     // ====================================================

//     const result = await DecisionLog.create(decisionData);

//     // ====================================================
//     // 8. RETURN
//     // ====================================================

//     return {
//       action: "created",

//       data: result,

//       relayCommand: decision,

//       recommendation: recommendation,
//     };
//   }

//   // ========================================================
//   // GET DECISION TERAKHIR
//   // ========================================================

//   static async getLatestDecision(recommendationId) {
//     return await DecisionLog.findOne({
//       where: {
//         recommendationId: recommendationId,
//       },

//       order: [["createdAt", "DESC"]],
//     });
//   }

//   // ========================================================
//   // GET DECISION YANG SIAP DIEKSEKUSI RELAY
//   // ========================================================

//   static async getLatestRelayCommand(recommendationId) {
//     const decision = await DecisionLog.findOne({
//       where: {
//         recommendationId: recommendationId,
//       },

//       order: [["createdAt", "DESC"]],
//     });

//     if (!decision) {
//       return {
//         command: "OFF",

//         decisionLog: null,
//       };
//     }

//     return {
//       command: decision.decision,

//       decisionLog: decision,
//     };
//   }
// }
// // ============================================================
// // EXPORT
// // ============================================================

// module.exports = {
//   DecisionLogService,
// };

// ============================================================
// decisionLog.service.js
// ============================================================

const { DecisionLog, Recommendation, CropHealth } = require("../models");

class DecisionLogService {
  // ========================================================
  // CREATE DECISION LOG
  // ========================================================

  static async createDecisionLog(recommendationId) {
    // ======================================================
    // 1. AMBIL RECOMMENDATION
    // ======================================================

    const recommendation = await Recommendation.findByPk(recommendationId);

    if (!recommendation) {
      throw new Error("Recommendation tidak ditemukan");
    }

    // ======================================================
    // 2. TENTUKAN DECISION
    // ======================================================

    let decision = "WATERING_OFF";

    if (recommendation.watering === true) {
      decision = "WATERING_ON";
    }

    // ======================================================
    // 3. AMBIL CROP HEALTH
    // ======================================================

    const health = await CropHealth.findByPk(recommendation.cropHealthId);

    // ======================================================
    // 4. SENSOR VALUE
    // ======================================================

    let sensorValue = null;

    let geeValue = null;

    let confidence = 0;

    if (health) {
      // ----------------------------------------------
      // IoT
      // ----------------------------------------------

      if (health.iotScore !== null && health.iotScore !== undefined) {
        sensorValue = Number(health.iotScore);
      }

      // ----------------------------------------------
      // GEE
      // ----------------------------------------------

      if (
        health.vegetationScore !== null &&
        health.vegetationScore !== undefined
      ) {
        geeValue = Number(health.vegetationScore);
      }

      // ----------------------------------------------
      // CONFIDENCE
      // ----------------------------------------------

      if (health.iotScore !== null && health.iotScore !== undefined) {
        confidence = 0.9;
      } else if (health.soilScore !== null && health.soilScore !== undefined) {
        confidence = 0.75;
      } else {
        confidence = 0.5;
      }
    }

    // ======================================================
    // 5. CEK DECISION TERAKHIR
    // ======================================================

    const latestDecision = await DecisionLog.findOne({
      where: {
        recommendationId: recommendationId,
      },

      order: [["createdAt", "DESC"]],
    });

    // ======================================================
    // 6. JIKA COMMAND SAMA
    // ======================================================

    if (latestDecision && latestDecision.decision === decision) {
      console.log(`Decision unchanged | ${decision}`);

      return {
        action: "unchanged",

        data: latestDecision,

        relayCommand: decision,

        recommendation: recommendation,
      };
    }

    // ======================================================
    // 7. REASON
    // ======================================================

    let reason = recommendation.recommendation;

    if (decision === "WATERING_ON") {
      reason = `Penyiraman diaktifkan karena: ${recommendation.recommendation}`;
    } else {
      reason = `Pompa dimatikan karena: ${recommendation.recommendation}`;
    }

    // ======================================================
    // 8. CREATE DECISION
    // ======================================================

    const result = await DecisionLog.create({
      sensorValue,

      geeValue,

      confidence,

      decision,

      reason,

      recommendationId,

      source: "AUTO",
    });

    return {
      action: "created",

      data: result,

      relayCommand: decision,

      recommendation: recommendation,
    };
  }

  // ========================================================
  // GET DECISION TERAKHIR
  // ========================================================

  static async getLatestDecision(recommendationId) {
    return await DecisionLog.findOne({
      where: {
        recommendationId: recommendationId,
      },

      order: [["createdAt", "DESC"]],
    });
  }

  // ========================================================
  // GET RELAY COMMAND
  // ========================================================

  static async getLatestRelayCommand(recommendationId) {
    const decision = await DecisionLog.findOne({
      where: {
        recommendationId: recommendationId,
      },

      order: [["createdAt", "DESC"]],
    });

    if (!decision) {
      return {
        command: "WATERING_OFF",

        decisionLog: null,
      };
    }

    return {
      command: decision.decision,

      decisionLog: decision,
    };
  }
}

module.exports = DecisionLogService;
