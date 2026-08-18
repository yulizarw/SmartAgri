// // ============================================================
// // automation.service.js
// // ============================================================

// const { CropHealth } = require("../models");

// const { RecommendationService } = require("./recommendation.service");

// const { DecisionLogService } = require("./decisionLog.service");

// const { IrrigationService } = require("./irrigation.service");

// class automationService {
//   // ==========================================================
//   // PROCESS 1 CROP HEALTH
//   // ==========================================================

//   static async processCropHealth(cropHealthId) {
//     console.log(`\n========== AUTOMATION START ==========`);

//     console.log(`CropHealth ID: ${cropHealthId}`);

//     // ========================================================
//     // 1. VALIDASI CROP HEALTH
//     // ========================================================

//     const cropHealth = await CropHealth.findByPk(cropHealthId);

//     if (!cropHealth) {
//       throw new Error(`CropHealth ${cropHealthId} tidak ditemukan`);
//     }

//     console.log("CropHealth ditemukan:", cropHealth.id);

//     // ========================================================
//     // 2. CREATE / UPDATE RECOMMENDATION
//     // ========================================================

//     const recommendationResult =
//       await RecommendationService.generateRecommendation(cropHealth.id);

//     console.log("Recommendation:", recommendationResult);

//     // ========================================================
//     // 3. GET RECOMMENDATION TERAKHIR
//     // ========================================================

//     const recommendation = await RecommendationService.getLatestRecommendation(
//       cropHealth.id,
//     );

//     if (!recommendation) {
//       throw new Error(
//         `Recommendation untuk CropHealth ${cropHealth.id} tidak ditemukan`,
//       );
//     }

//     console.log("Latest Recommendation:", recommendation.id);

//     console.log("Recommendation:", recommendation.recommendation);

//     console.log("Watering:", recommendation.watering);

//     console.log("Fertilize:", recommendation.fertilize);

//     console.log("Priority:", recommendation.priority);

//     // ========================================================
//     // 4. CREATE DECISION LOG
//     // ========================================================

//     const decisionResult = await DecisionLogService.createDecisionLog(
//       recommendation.id,
//     );

//     console.log("Decision:", decisionResult.relayCommand);

//     // ========================================================
//     // 5. COMMAND RELAY
//     // ========================================================

//     const relayCommand = decisionResult.relayCommand;

//     let relayResult = null;

//     // ========================================================
//     // WATERING
//     // ========================================================

//     if (relayCommand === "WATERING_ON") {
//       console.log("🚰 COMMAND RELAY: WATERING ON");

//       relayResult = await IrrigationService.executeRelay(
//         cropHealth.farmId,
//         "WATERING_ON",
//       );
//     }

//     // ========================================================
//     // WATERING OFF
//     // ========================================================
//     else if (relayCommand === "WATERING_OFF") {
//       console.log("🚰 COMMAND RELAY: WATERING OFF");

//       relayResult = await IrrigationService.executeRelay(
//         cropHealth.farmId,
//         "WATERING_OFF",
//       );
//     }

//     // ========================================================
//     // FERTILIZE
//     // ========================================================
//     else if (relayCommand === "FERTILIZE_ON") {
//       console.log("🌱 COMMAND RELAY: FERTILIZE ON");

//       relayResult = await IrrigationService.executeRelay(
//         cropHealth.farmId,
//         "FERTILIZE_ON",
//       );
//     }

//     // ========================================================
//     // OFF
//     // ========================================================
//     else {
//       console.log("⏹ COMMAND RELAY: OFF");

//       relayResult = await IrrigationService.executeRelay(
//         cropHealth.farmId,
//         "OFF",
//       );
//     }

//     // ========================================================
//     // RETURN
//     // ========================================================

//     console.log(`========== AUTOMATION END ==========\n`);

//     return {
//       cropHealth,

//       recommendation,

//       decision: decisionResult.data,

//       relayCommand,

//       relayResult,
//     };
//   }
// }

// module.exports = {
//   automationService,
// };

// ============================================================
// automationService.js
// ============================================================

const cron = require("node-cron");

const { Crop, Farm, CropHealth } = require("../models");

const CropHealthService= require("./cropHealthService");
const RecommendationService = require("./recomendationService")
const DecisionLogService= require("./decisionLogService");

// Jika nanti sudah ada service untuk mengirim command ke IoT,
// import di sini.
//
// const IoTService = require("./iotService");

// ============================================================
// GET TARGET DATE
// ============================================================

const getJakartaDate = () => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
};

// ============================================================
// PROCESS ONE CROP
// ============================================================

const processCrop = async ({ farm, crop, targetDate }) => {
  console.log("--------------------------------------------");

  console.log(`AUTOMATION | Farm ${farm.id} - ${farm.name}`);

  console.log(`AUTOMATION | Crop ${crop.id} - ${crop.cropName}`);

  console.log(`AUTOMATION | Date ${targetDate}`);

  // ==========================================================
  // 1. CREATE / UPDATE CROP HEALTH
  // ==========================================================

  console.log(`1. Analyzing CropHealth...`);

  const cropHealthResult = await CropHealthService.analyzeCropHealth(
    farm.id,
    crop.id,
    targetDate,
  );

  const cropHealth = cropHealthResult?.data || cropHealthResult;

  if (!cropHealth || !cropHealth.id) {
    throw new Error(
      `CropHealth gagal dibuat untuk Farm ${farm.id} / Crop ${crop.id}`,
    );
  }

  console.log(`CropHealth berhasil | ID ${cropHealth.id}`);

  // ==========================================================
  // 2. GENERATE RECOMMENDATION
  // ==========================================================

  console.log(`2. Generating Recommendation...`);

  const recommendationResult =
    await RecommendationService.generateRecommendation(cropHealth.id);

  const recommendation = recommendationResult?.data;

  if (!recommendation || !recommendation.id) {
    throw new Error(
      `Recommendation gagal dibuat untuk CropHealth ${cropHealth.id}`,
    );
  }

  console.log(
    `Recommendation ${recommendationResult.action} | ID ${recommendation.id}`,
  );

  console.log(`Recommendation: ${recommendation.recommendation}`);

  console.log(`Watering: ${recommendation.watering}`);

  console.log(`Fertilize: ${recommendation.fertilize}`);

  console.log(`Priority: ${recommendation.priority}`);

  // ==========================================================
  // 3. CREATE DECISION LOG
  // ==========================================================

  console.log(`3. Creating Decision...`);

  const decisionResult = await DecisionLogService.createDecisionLog(
    recommendation.id,
  );

  if (!decisionResult) {
    throw new Error(
      `Decision gagal dibuat untuk Recommendation ${recommendation.id}`,
    );
  }

  console.log(`Decision: ${decisionResult.relayCommand}`);

  // ==========================================================
  // 4. RELAY COMMAND
  // ==========================================================

  const relayCommand = decisionResult.relayCommand;

  console.log(`4. Relay Command: ${relayCommand}`);

  /*
   * ========================================================
   * NANTI HUBUNGKAN KE IOT DI SINI
   * ========================================================
   *
   * Contoh:
   *
   * await IoTService.sendRelayCommand(
   *   farm.id,
   *   relayCommand
   * );
   *
   * Untuk sekarang kita hanya menghasilkan
   * decision/command.
   */

  return {
    farmId: farm.id,

    farmName: farm.name,

    cropId: crop.id,

    cropName: crop.cropName,

    date: targetDate,

    cropHealth: cropHealth,

    recommendation: recommendation,

    decision: decisionResult.data,

    relayCommand: relayCommand,
  };
};

// ============================================================
// RUN AUTOMATION
// ============================================================

const runAutomation = async () => {
  console.log("");
  console.log("================================================");
  console.log("SMART AGRICULTURE AUTOMATION START");
  console.log(new Date().toISOString());
  console.log("================================================");

  try {
    // ========================================================
    // TARGET DATE
    // ========================================================

    const targetDate = getJakartaDate();

    console.log(`Target date: ${targetDate}`);

    // ========================================================
    // AMBIL CROP YANG MEMILIKI FARM
    // ========================================================

    /*
     * Kita sengaja mulai dari Crop.
     *
     * Karena proses bisnis kita:
     *
     * Crop → Farm → CropHealth
     *
     * Crop tanpa farm tidak boleh diproses.
     */

    const crops = await Crop.findAll({
      include: [
        {
          model: Farm,

          required: true,
        },
      ],

      where: {
        farmId: {
          [require("sequelize").Op.ne]: null,
        },
      },
    });

    console.log(`Found ${crops.length} crop(s) with farm`);

    if (crops.length === 0) {
      console.log("Tidak ada crop yang memiliki farm.");

      return;
    }

    // ========================================================
    // PROCESS SATU PER SATU
    // ========================================================

    const results = [];

    for (const crop of crops) {
      const farm = crop.Farm;

      if (!farm) {
        console.log(`Skip Crop ${crop.id}: Farm tidak ditemukan`);

        continue;
      }

      try {
        const result = await processCrop({
          farm,

          crop,

          targetDate,
        });

        results.push(result);

        console.log(`Automation SUCCESS | Farm ${farm.id} | Crop ${crop.id}`);
      } catch (error) {
        console.error(
          `Automation FAILED | Farm ${farm.id} | Crop ${crop.id}`,
          error.message,
        );
      }
    }

    // ========================================================
    // SUMMARY
    // ========================================================

    console.log("");
    console.log("================================================");
    console.log("SMART AGRICULTURE AUTOMATION FINISHED");
    console.log(`Processed: ${results.length}`);
    console.log("================================================");

    return results;
  } catch (error) {
    console.error("SMART AGRICULTURE AUTOMATION ERROR:", error);

    throw error;
  }
};

// ============================================================
// START AUTOMATION SCHEDULER
// ============================================================

const startAutomationScheduler = () => {
  /*
   * Setiap 1 jam
   *
   * Menit 0
   *
   * 09:00
   * 10:00
   * 11:00
   * 12:00
   * dst.
   */

  cron.schedule(
    "0 * * * *",

    async () => {
      try {
        await runAutomation();
      } catch (error) {
        console.error("Scheduled automation failed:", error);
      }
    },

    {
      timezone: "Asia/Jakarta",
    },
  );

  console.log("Smart Agriculture Automation Scheduler started");

  console.log("Schedule: every 1 hour");

  console.log("Timezone: Asia/Jakarta");
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  runAutomation,

  startAutomationScheduler,
};
