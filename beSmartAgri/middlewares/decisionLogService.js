// // // ============================================================
// // // decisionLog.service.js
// // // ============================================================

// // const { DecisionLog, Recommendation } = require("../models");

// // class DecisionLogService {
// //   // ========================================================
// //   // MEMBUAT DECISION LOG DARI RECOMMENDATION
// //   // ========================================================

// //   static async createDecisionLog(recommendationId) {
// //     // ----------------------------------------------------
// //     // 1. Ambil Recommendation
// //     // ----------------------------------------------------

// //     const recommendation = await Recommendation.findByPk(recommendationId);

// //     if (!recommendation) {
// //       throw new Error("Recommendation tidak ditemukan");
// //     }

// //     // ====================================================
// //     // 2. Tentukan decision
// //     // ====================================================

// //     let decision = "OFF";

// //     // ----------------------------------------------------
// //     // WATERING
// //     // ----------------------------------------------------

// //     if (recommendation.watering === true) {
// //       decision = "WATERING_ON";
// //     }

// //     // ----------------------------------------------------
// //     // FERTILIZE
// //     // ----------------------------------------------------

// //     if (recommendation.fertilize === true) {
// //       /*
// //        * Jika penyiraman dan pemupukan sama-sama true,
// //        * kita prioritaskan watering sebagai command
// //        * pertama.
// //        *
// //        * Pemupukan dapat dibuat decision berikutnya.
// //        */

// //       if (decision === "OFF") {
// //         decision = "FERTILIZE_ON";
// //       }
// //     }

// //     // ====================================================
// //     // 3. SENSOR VALUE
// //     // ====================================================

// //     /*
// //      * Untuk sementara sensorValue dan geeValue
// //      * kita isi berdasarkan data yang tersedia dari
// //      * CropHealth.
// //      *
// //      * Nanti kalau kita sudah menentukan sensor mana
// //      * yang menjadi trigger utama, nilainya bisa dibuat
// //      * lebih spesifik.
// //      */

// //     let sensorValue = null;

// //     let geeValue = null;

// //     let confidence = 0;

// //     // ====================================================
// //     // 4. Ambil CropHealth
// //     // ====================================================

// //     const cropHealth = (await recommendation.getCropHealth)
// //       ? await recommendation.getCropHealth()
// //       : null;

// //     /*
// //      * Jika association belum dibuat di model,
// //      * kita fallback dengan query biasa.
// //      */

// //     let health = cropHealth;

// //     if (!health) {
// //       const { CropHealth } = require("../models");

// //       health = await CropHealth.findByPk(recommendation.cropHealthId);
// //     }

// //     if (health) {
// //       // ----------------------------------------------
// //       // IoT
// //       // ----------------------------------------------

// //       if (health.iotScore !== null && health.iotScore !== undefined) {
// //         sensorValue = Number(health.iotScore);
// //       }

// //       // ----------------------------------------------
// //       // GEE / Vegetation
// //       // ----------------------------------------------

// //       if (
// //         health.vegetationScore !== null &&
// //         health.vegetationScore !== undefined
// //       ) {
// //         geeValue = Number(health.vegetationScore);
// //       }

// //       // ----------------------------------------------
// //       // Confidence
// //       // ----------------------------------------------

// //       /*
// //        * Confidence sederhana.
// //        *
// //        * Nanti dapat dikembangkan menjadi
// //        * confidence berbasis data sensor,
// //        * jumlah reading, dan kualitas data.
// //        */

// //       if (health.iotScore !== null && health.iotScore !== undefined) {
// //         confidence = 0.9;
// //       } else if (health.soilScore !== null && health.soilScore !== undefined) {
// //         confidence = 0.75;
// //       } else {
// //         confidence = 0.5;
// //       }
// //     }

// //     // ====================================================
// //     // 5. Reason
// //     // ====================================================

// //     let reason = recommendation.recommendation;

// //     if (decision === "WATERING_ON") {
// //       reason = `Penyiraman diaktifkan karena: ${recommendation.recommendation}`;
// //     } else if (decision === "FERTILIZE_ON") {
// //       reason = `Pemupukan diaktifkan karena: ${recommendation.recommendation}`;
// //     } else {
// //       reason = `Tidak ada tindakan relay: ${recommendation.recommendation}`;
// //     }

// //     // ====================================================
// //     // 6. DATA DECISION LOG
// //     // ====================================================

// //     const decisionData = {
// //       sensorValue: sensorValue,

// //       geeValue: geeValue,

// //       confidence: confidence,

// //       decision: decision,

// //       reason: reason,

// //       recommendationId: recommendationId,
// //     };

// //     // ====================================================
// //     // 7. CREATE DECISION LOG
// //     // ====================================================

// //     const result = await DecisionLog.create(decisionData);

// //     // ====================================================
// //     // 8. RETURN
// //     // ====================================================

// //     return {
// //       action: "created",

// //       data: result,

// //       relayCommand: decision,

// //       recommendation: recommendation,
// //     };
// //   }

// //   // ========================================================
// //   // GET DECISION TERAKHIR
// //   // ========================================================

// //   static async getLatestDecision(recommendationId) {
// //     return await DecisionLog.findOne({
// //       where: {
// //         recommendationId: recommendationId,
// //       },

// //       order: [["createdAt", "DESC"]],
// //     });
// //   }

// //   // ========================================================
// //   // GET DECISION YANG SIAP DIEKSEKUSI RELAY
// //   // ========================================================

// //   static async getLatestRelayCommand(recommendationId) {
// //     const decision = await DecisionLog.findOne({
// //       where: {
// //         recommendationId: recommendationId,
// //       },

// //       order: [["createdAt", "DESC"]],
// //     });

// //     if (!decision) {
// //       return {
// //         command: "OFF",

// //         decisionLog: null,
// //       };
// //     }

// //     return {
// //       command: decision.decision,

// //       decisionLog: decision,
// //     };
// //   }
// // }
// // // ============================================================
// // // EXPORT
// // // ============================================================

// // module.exports = {
// //   DecisionLogService,
// // };

// // ============================================================
// // decisionLog.service.js
// // ============================================================

// const { DecisionLog, Recommendation, CropHealth } = require("../models");

// class DecisionLogService {
//   // ========================================================
//   // CREATE DECISION LOG
//   // ========================================================

//   static async createDecisionLog(recommendationId) {
//     // ======================================================
//     // 1. AMBIL RECOMMENDATION
//     // ======================================================

//     const recommendation = await Recommendation.findByPk(recommendationId);

//     if (!recommendation) {
//       throw new Error("Recommendation tidak ditemukan");
//     }

//     // ======================================================
//     // 2. TENTUKAN DECISION
//     // ======================================================

//     let decision = "WATERING_OFF";

//     if (recommendation.watering === true) {
//       decision = "WATERING_ON";
//     }

//     // ======================================================
//     // 3. AMBIL CROP HEALTH
//     // ======================================================

//     const health = await CropHealth.findByPk(recommendation.cropHealthId);

//     // ======================================================
//     // 4. SENSOR VALUE
//     // ======================================================

//     let sensorValue = null;

//     let geeValue = null;

//     let confidence = 0;

//     if (health) {
//       // ----------------------------------------------
//       // IoT
//       // ----------------------------------------------

//       if (health.iotScore !== null && health.iotScore !== undefined) {
//         sensorValue = Number(health.iotScore);
//       }

//       // ----------------------------------------------
//       // GEE
//       // ----------------------------------------------

//       if (
//         health.vegetationScore !== null &&
//         health.vegetationScore !== undefined
//       ) {
//         geeValue = Number(health.vegetationScore);
//       }

//       // ----------------------------------------------
//       // CONFIDENCE
//       // ----------------------------------------------

//       if (health.iotScore !== null && health.iotScore !== undefined) {
//         confidence = 0.9;
//       } else if (health.soilScore !== null && health.soilScore !== undefined) {
//         confidence = 0.75;
//       } else {
//         confidence = 0.5;
//       }
//     }

//     // ======================================================
//     // 5. CEK DECISION TERAKHIR
//     // ======================================================

//     const latestDecision = await DecisionLog.findOne({
//       where: {
//         recommendationId: recommendationId,
//       },

//       order: [["createdAt", "DESC"]],
//     });

//     // ======================================================
//     // 6. JIKA COMMAND SAMA
//     // ======================================================

//     if (latestDecision && latestDecision.decision === decision) {
//       console.log(`Decision unchanged | ${decision}`);

//       return {
//         action: "unchanged",

//         data: latestDecision,

//         relayCommand: decision,

//         recommendation: recommendation,
//       };
//     }

//     // ======================================================
//     // 7. REASON
//     // ======================================================

//     let reason = recommendation.recommendation;

//     if (decision === "WATERING_ON") {
//       reason = `Penyiraman diaktifkan karena: ${recommendation.recommendation}`;
//     } else {
//       reason = `Pompa dimatikan karena: ${recommendation.recommendation}`;
//     }

//     // ======================================================
//     // 8. CREATE DECISION
//     // ======================================================

//     const result = await DecisionLog.create({
//       sensorValue,

//       geeValue,

//       confidence,

//       decision,

//       reason,

//       recommendationId,

//       source: "AUTO",
//     });

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
//   // GET RELAY COMMAND
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
//         command: "WATERING_OFF",

//         decisionLog: null,
//       };
//     }

//     return {
//       command: decision.decision,

//       decisionLog: decision,
//     };
//   }
// }

// module.exports = DecisionLogService;


// ============================================================
// decisionLogService.js
// ============================================================

const {
  DecisionLog,
  Recommendation,
  CropHealth,
} = require("../models");

// ============================================================
// CONFIG
// ============================================================

const CONFIDENCE = {
  // Sensor benar-benar online
  SENSOR_ONLINE: 0.9,

  // Sensor offline tetapi GEE + Soil + Climate cukup lengkap
  FALLBACK_STRONG: 0.75,

  // Sensor offline, hanya sebagian fallback tersedia
  FALLBACK_MEDIUM: 0.65,

  // Data sangat minim
  FALLBACK_WEAK: 0.4,
};

// ============================================================
// BATAS MINIMUM UNTUK MENYALAKAN POMPA OTOMATIS
// ============================================================

const MIN_CONFIDENCE_FOR_WATERING_ON = 0.7;

// ============================================================
// CLASS
// ============================================================

class DecisionLogService {
  // ==========================================================
  // HELPER
  // CEK VALUE
  // ==========================================================

  static hasValue(value) {
    return (
      value !== null &&
      value !== undefined &&
      value !== "" &&
      !Number.isNaN(Number(value))
    );
  }

  // ==========================================================
  // HELPER
  // NORMALIZE SOURCE
  // ==========================================================

  static normalizeSource(source) {
    return String(source || "")
      .trim()
      .toUpperCase();
  }

  // ==========================================================
  // HELPER
  // CEK MANUAL OVERRIDE
  // ==========================================================

  static isManualOverride(source) {
    const normalized =
      this.normalizeSource(source);

    return (
      normalized.includes("MANUAL") ||
      normalized.includes("OVERRIDE") ||
      normalized.includes("USER")
    );
  }

  // ==========================================================
  // HELPER
  // CEK SOURCE AUTO
  // ==========================================================

  static isAutomaticSource(source) {
    const normalized =
      this.normalizeSource(source);

    return (
      normalized === "AUTO" ||
      normalized === "AUTOMATIC"
    );
  }

  // ==========================================================
  // CALCULATE CONFIDENCE
  // ==========================================================

  static calculateConfidence({
    sensorOnline,

    iotAvailable,

    vegetationAvailable,

    soilAvailable,

    climateAvailable,
  }) {
    // ========================================================
    // 1. SENSOR ONLINE
    // ========================================================

    if (
      sensorOnline &&
      iotAvailable
    ) {
      return {
        confidence:
          CONFIDENCE.SENSOR_ONLINE,

        dataMode:
          "IOT_PRIMARY",
      };
    }

    // ========================================================
    // 2. SENSOR OFFLINE
    // HITUNG SUMBER FALLBACK
    // ========================================================

    const fallbackSources = [
      vegetationAvailable,
      soilAvailable,
      climateAvailable,
    ].filter(Boolean).length;

    // ========================================================
    // 3 sumber tersedia
    // ========================================================

    if (
      fallbackSources >= 3
    ) {
      return {
        confidence:
          CONFIDENCE.FALLBACK_STRONG,

        dataMode:
          "FALLBACK_STRONG",
      };
    }

    // ========================================================
    // 2 sumber tersedia
    // ========================================================

    if (
      fallbackSources === 2
    ) {
      return {
        confidence:
          CONFIDENCE.FALLBACK_MEDIUM,

        dataMode:
          "FALLBACK_MEDIUM",
      };
    }

    // ========================================================
    // 0 - 1 sumber
    // ========================================================

    return {
      confidence:
        CONFIDENCE.FALLBACK_WEAK,

      dataMode:
        "FALLBACK_WEAK",
    };
  }

  // ==========================================================
  // BUILD REASON
  // ==========================================================

  static buildReason({
    recommendation,

    sensorOnline,

    sensorData,

    confidence,

    dataMode,

    desiredDecision,

    finalDecision,

    safetyApplied,

    vegetationAvailable,

    soilAvailable,

    climateAvailable,
  }) {
    const recommendationText =
      recommendation?.recommendation ||
      "Tidak ada keterangan recommendation.";

    // ========================================================
    // SENSOR DESCRIPTION
    // ========================================================

    let sensorDescription =
      "";

    if (sensorOnline) {
      sensorDescription =
        "Sensor IoT ONLINE dan digunakan sebagai sumber data utama.";
    } else {
      if (
        sensorData?.lastReadingAt
      ) {
        sensorDescription =
          `Sensor IoT OFFLINE. ` +
          `Reading terakhir ${sensorData.minutesSinceLastReading ?? "-"} menit yang lalu.`;
      } else {
        sensorDescription =
          "Sensor IoT OFFLINE dan belum tersedia reading aktif.";
      }
    }

    // ========================================================
    // FALLBACK DESCRIPTION
    // ========================================================

    const fallbackSources =
      [];

    if (
      vegetationAvailable
    ) {
      fallbackSources.push(
        "GEE/vegetation",
      );
    }

    if (soilAvailable) {
      fallbackSources.push(
        "soil",
      );
    }

    if (
      climateAvailable
    ) {
      fallbackSources.push(
        "weather/climate",
      );
    }

    let fallbackDescription =
      "";

    if (!sensorOnline) {
      if (
        fallbackSources.length >
        0
      ) {
        fallbackDescription =
          ` Sistem menggunakan fallback ${fallbackSources.join(
            ", ",
          )}.`;
      } else {
        fallbackDescription =
          " Tidak tersedia data fallback yang memadai.";
      }
    }

    // ========================================================
    // SAFETY
    // ========================================================

    if (safetyApplied) {
      return (
        `${sensorDescription}` +
        `${fallbackDescription} ` +
        `Recommendation meminta WATERING_ON, ` +
        `tetapi confidence ${confidence} berada di bawah batas aman ` +
        `${MIN_CONFIDENCE_FOR_WATERING_ON}. ` +
        `Pompa dipertahankan WATERING_OFF. ` +
        `Mode data: ${dataMode}. ` +
        `Recommendation: ${recommendationText}`
      );
    }

    // ========================================================
    // WATERING ON
    // ========================================================

    if (
      finalDecision ===
      "WATERING_ON"
    ) {
      return (
        `${sensorDescription}` +
        `${fallbackDescription} ` +
        `Confidence ${confidence}. ` +
        `Pompa diaktifkan berdasarkan recommendation. ` +
        `Mode data: ${dataMode}. ` +
        `Recommendation: ${recommendationText}`
      );
    }

    // ========================================================
    // WATERING OFF
    // ========================================================

    return (
      `${sensorDescription}` +
      `${fallbackDescription} ` +
      `Confidence ${confidence}. ` +
      `Pompa dimatikan berdasarkan recommendation. ` +
      `Mode data: ${dataMode}. ` +
      `Recommendation: ${recommendationText}`
    );
  }

  // ==========================================================
  // CREATE DECISION LOG
  //
  // sensorContext optional.
  //
  // Contoh:
  //
  // {
  //    sensorData: {
  //      sensorStatus: "ONLINE",
  //      lastReadingAt: "...",
  //      minutesSinceLastReading: 1,
  //      soilMoisture: 35,
  //      temperature: 29,
  //      humidity: 70
  //    }
  // }
  //
  // ==========================================================

  static async createDecisionLog(
    recommendationId,
    sensorContext = {},
  ) {
    // ========================================================
    // 1. RECOMMENDATION
    // ========================================================

    const recommendation =
      await Recommendation.findByPk(
        recommendationId,
      );

    if (!recommendation) {
      throw new Error(
        "Recommendation tidak ditemukan",
      );
    }

    // ========================================================
    // 2. CROP HEALTH
    // ========================================================

    let cropHealth = null;

    if (
      recommendation.cropHealthId
    ) {
      cropHealth =
        await CropHealth.findByPk(
          recommendation.cropHealthId,
        );
    }

    if (!cropHealth) {
      throw new Error(
        "CropHealth dari recommendation tidak ditemukan",
      );
    }

    // ========================================================
    // 3. SENSOR DATA DARI AUTOMATION SERVICE
    // ========================================================

    const sensorData =
      sensorContext?.sensorData ||
      null;

    // ========================================================
    // 4. SENSOR STATUS
    // ========================================================

    /*
     * Prioritas:
     *
     * 1. sensorData.sensorStatus
     * 2. fallback ke keberadaan iotScore
     */

    let sensorOnline =
      false;

    if (
      sensorData?.sensorStatus
    ) {
      sensorOnline =
        String(
          sensorData.sensorStatus,
        )
          .trim()
          .toUpperCase() ===
        "ONLINE";
    } else {
      sensorOnline =
        this.hasValue(
          cropHealth.iotScore,
        );
    }

    // ========================================================
    // 5. DATA AVAILABILITY
    // ========================================================

    const iotAvailable =
      this.hasValue(
        cropHealth.iotScore,
      );

    const vegetationAvailable =
      this.hasValue(
        cropHealth.vegetationScore,
      );

    const soilAvailable =
      this.hasValue(
        cropHealth.soilScore,
      );

    const climateAvailable =
      this.hasValue(
        cropHealth.climateScore,
      );

    // ========================================================
    // 6. VALUE UNTUK DECISION LOG
    // ========================================================

    /*
     * Kita tetap mempertahankan perilaku lama:
     *
     * sensorValue = IoT score
     * geeValue    = vegetation score
     *
     * Jadi history existing kamu tidak berubah arti.
     */

    const sensorValue =
      iotAvailable
        ? Number(
            cropHealth.iotScore,
          )
        : null;

    const geeValue =
      vegetationAvailable
        ? Number(
            cropHealth.vegetationScore,
          )
        : null;

    // ========================================================
    // 7. CALCULATE CONFIDENCE
    // ========================================================

    const confidenceResult =
      this.calculateConfidence({
        sensorOnline,

        iotAvailable,

        vegetationAvailable,

        soilAvailable,

        climateAvailable,
      });

    const confidence =
      confidenceResult.confidence;

    const dataMode =
      confidenceResult.dataMode;

    // ========================================================
    // 8. RECOMMENDATION COMMAND
    // ========================================================

    const desiredDecision =
      recommendation.watering ===
      true
        ? "WATERING_ON"
        : "WATERING_OFF";

    let finalDecision =
      desiredDecision;

    let safetyApplied =
      false;

    // ========================================================
    // 9. SAFETY RULE
    // ========================================================

    /*
     * WATERING_ON membutuhkan confidence minimal.
     *
     * WATERING_OFF tidak diblokir karena merupakan
     * safe state.
     */

    if (
      desiredDecision ===
        "WATERING_ON" &&
      confidence <
        MIN_CONFIDENCE_FOR_WATERING_ON
    ) {
      finalDecision =
        "WATERING_OFF";

      safetyApplied =
        true;
    }

    // ========================================================
    // 10. CEK DECISION TERAKHIR
    // ========================================================

    const latestDecision =
      await DecisionLog.findOne({
        where: {
          recommendationId,
        },

        order: [
          [
            "createdAt",
            "DESC",
          ],
        ],
      });

    // ========================================================
    // 11. MANUAL OVERRIDE PROTECTION
    // ========================================================

    /*
     * Ini penting.
     *
     * Kalau user sedang MANUAL_OVERRIDE,
     * scheduler TIDAK BOLEH langsung menimpa command user.
     */

    if (
      latestDecision &&
      this.isManualOverride(
        latestDecision.source,
      )
    ) {
      console.log(
        "============================================",
      );

      console.log(
        "AUTOMATION BLOCKED BY MANUAL OVERRIDE",
      );

      console.log(
        "Recommendation:",
        recommendationId,
      );

      console.log(
        "Current command:",
        latestDecision.decision,
      );

      console.log(
        "============================================",
      );

      return {
        action:
          "manual_override_active",

        data:
          latestDecision,

        relayCommand:
          latestDecision.decision,

        desiredRelayCommand:
          desiredDecision,

        recommendation,

        confidence,

        dataMode,

        sensorData,

        safetyApplied:
          false,

        automationBlocked:
          true,
      };
    }

    // ========================================================
    // 12. DUPLICATE AUTOMATIC DECISION
    // ========================================================

    if (
      latestDecision &&
      this.isAutomaticSource(
        latestDecision.source,
      ) &&
      latestDecision.decision ===
        finalDecision
    ) {
      console.log(
        "============================================",
      );

      console.log(
        "DECISION UNCHANGED",
      );

      console.log(
        "Recommendation:",
        recommendationId,
      );

      console.log(
        "Decision:",
        finalDecision,
      );

      console.log(
        "Confidence:",
        confidence,
      );

      console.log(
        "============================================",
      );

      return {
        action:
          "unchanged",

        data:
          latestDecision,

        relayCommand:
          finalDecision,

        desiredRelayCommand:
          desiredDecision,

        recommendation,

        confidence,

        dataMode,

        sensorData,

        safetyApplied,

        automationBlocked:
          false,
      };
    }

    // ========================================================
    // 13. BUILD REASON
    // ========================================================

    const reason =
      this.buildReason({
        recommendation,

        sensorOnline,

        sensorData,

        confidence,

        dataMode,

        desiredDecision,

        finalDecision,

        safetyApplied,

        vegetationAvailable,

        soilAvailable,

        climateAvailable,
      });

    // ========================================================
    // 14. CREATE
    // ========================================================

    const result =
      await DecisionLog.create({
        recommendationId,

        sensorValue,

        geeValue,

        confidence,

        decision:
          finalDecision,

        reason,

        source:
          "AUTO",
      });

    // ========================================================
    // 15. DEBUG
    // ========================================================

    console.log(
      "============================================",
    );

    console.log(
      "AUTOMATIC DECISION CREATED",
    );

    console.log(
      "Recommendation ID:",
      recommendationId,
    );

    console.log(
      "Sensor Status:",
      sensorOnline
        ? "ONLINE"
        : "OFFLINE",
    );

    console.log(
      "Last Sensor Reading:",
      sensorData?.lastReadingAt ||
        null,
    );

    console.log(
      "Minutes Since Reading:",
      sensorData?.minutesSinceLastReading ??
        null,
    );

    console.log(
      "IoT Score:",
      cropHealth.iotScore,
    );

    console.log(
      "Vegetation Score:",
      cropHealth.vegetationScore,
    );

    console.log(
      "Soil Score:",
      cropHealth.soilScore,
    );

    console.log(
      "Climate Score:",
      cropHealth.climateScore,
    );

    console.log(
      "Data Mode:",
      dataMode,
    );

    console.log(
      "Confidence:",
      confidence,
    );

    console.log(
      "Desired Decision:",
      desiredDecision,
    );

    console.log(
      "Final Decision:",
      finalDecision,
    );

    console.log(
      "Safety Applied:",
      safetyApplied,
    );

    console.log(
      "============================================",
    );

    // ========================================================
    // 16. RETURN
    // ========================================================

    return {
      action:
        "created",

      data:
        result,

      relayCommand:
        finalDecision,

      desiredRelayCommand:
        desiredDecision,

      recommendation,

      confidence,

      dataMode,

      sensorData,

      safetyApplied,

      automationBlocked:
        false,
    };
  }

  // ==========================================================
  // GET LATEST DECISION
  // ==========================================================

  static async getLatestDecision(
    recommendationId,
  ) {
    const result =
      await DecisionLog.findOne({
        where: {
          recommendationId,
        },

        order: [
          [
            "createdAt",
            "DESC",
          ],
        ],
      });

    return result;
  }

  // ==========================================================
  // GET LATEST RELAY COMMAND
  // ==========================================================

  static async getLatestRelayCommand(
    recommendationId,
  ) {
    const decision =
      await DecisionLog.findOne({
        where: {
          recommendationId,
        },

        order: [
          [
            "createdAt",
            "DESC",
          ],
        ],
      });

    if (!decision) {
      return {
        command:
          "WATERING_OFF",

        decisionLog:
          null,
      };
    }

    return {
      command:
        decision.decision,

      decisionLog:
        decision,
    };
  }
}

module.exports =
  DecisionLogService;
