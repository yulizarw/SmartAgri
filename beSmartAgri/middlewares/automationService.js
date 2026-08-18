// // // ============================================================
// // // automation.service.js
// // // ============================================================

// // const { CropHealth } = require("../models");

// // const { RecommendationService } = require("./recommendation.service");

// // const { DecisionLogService } = require("./decisionLog.service");

// // const { IrrigationService } = require("./irrigation.service");

// // class automationService {
// //   // ==========================================================
// //   // PROCESS 1 CROP HEALTH
// //   // ==========================================================

// //   static async processCropHealth(cropHealthId) {
// //     console.log(`\n========== AUTOMATION START ==========`);

// //     console.log(`CropHealth ID: ${cropHealthId}`);

// //     // ========================================================
// //     // 1. VALIDASI CROP HEALTH
// //     // ========================================================

// //     const cropHealth = await CropHealth.findByPk(cropHealthId);

// //     if (!cropHealth) {
// //       throw new Error(`CropHealth ${cropHealthId} tidak ditemukan`);
// //     }

// //     console.log("CropHealth ditemukan:", cropHealth.id);

// //     // ========================================================
// //     // 2. CREATE / UPDATE RECOMMENDATION
// //     // ========================================================

// //     const recommendationResult =
// //       await RecommendationService.generateRecommendation(cropHealth.id);

// //     console.log("Recommendation:", recommendationResult);

// //     // ========================================================
// //     // 3. GET RECOMMENDATION TERAKHIR
// //     // ========================================================

// //     const recommendation = await RecommendationService.getLatestRecommendation(
// //       cropHealth.id,
// //     );

// //     if (!recommendation) {
// //       throw new Error(
// //         `Recommendation untuk CropHealth ${cropHealth.id} tidak ditemukan`,
// //       );
// //     }

// //     console.log("Latest Recommendation:", recommendation.id);

// //     console.log("Recommendation:", recommendation.recommendation);

// //     console.log("Watering:", recommendation.watering);

// //     console.log("Fertilize:", recommendation.fertilize);

// //     console.log("Priority:", recommendation.priority);

// //     // ========================================================
// //     // 4. CREATE DECISION LOG
// //     // ========================================================

// //     const decisionResult = await DecisionLogService.createDecisionLog(
// //       recommendation.id,
// //     );

// //     console.log("Decision:", decisionResult.relayCommand);

// //     // ========================================================
// //     // 5. COMMAND RELAY
// //     // ========================================================

// //     const relayCommand = decisionResult.relayCommand;

// //     let relayResult = null;

// //     // ========================================================
// //     // WATERING
// //     // ========================================================

// //     if (relayCommand === "WATERING_ON") {
// //       console.log("🚰 COMMAND RELAY: WATERING ON");

// //       relayResult = await IrrigationService.executeRelay(
// //         cropHealth.farmId,
// //         "WATERING_ON",
// //       );
// //     }

// //     // ========================================================
// //     // WATERING OFF
// //     // ========================================================
// //     else if (relayCommand === "WATERING_OFF") {
// //       console.log("🚰 COMMAND RELAY: WATERING OFF");

// //       relayResult = await IrrigationService.executeRelay(
// //         cropHealth.farmId,
// //         "WATERING_OFF",
// //       );
// //     }

// //     // ========================================================
// //     // FERTILIZE
// //     // ========================================================
// //     else if (relayCommand === "FERTILIZE_ON") {
// //       console.log("🌱 COMMAND RELAY: FERTILIZE ON");

// //       relayResult = await IrrigationService.executeRelay(
// //         cropHealth.farmId,
// //         "FERTILIZE_ON",
// //       );
// //     }

// //     // ========================================================
// //     // OFF
// //     // ========================================================
// //     else {
// //       console.log("⏹ COMMAND RELAY: OFF");

// //       relayResult = await IrrigationService.executeRelay(
// //         cropHealth.farmId,
// //         "OFF",
// //       );
// //     }

// //     // ========================================================
// //     // RETURN
// //     // ========================================================

// //     console.log(`========== AUTOMATION END ==========\n`);

// //     return {
// //       cropHealth,

// //       recommendation,

// //       decision: decisionResult.data,

// //       relayCommand,

// //       relayResult,
// //     };
// //   }
// // }

// // module.exports = {
// //   automationService,
// // };

// // ============================================================
// // automationService.js
// // ============================================================

// const cron = require("node-cron");

// const { Crop, Farm, CropHealth } = require("../models");

// const CropHealthService= require("./cropHealthService");
// const RecommendationService = require("./recomendationService")
// const DecisionLogService= require("./decisionLogService");

// // Jika nanti sudah ada service untuk mengirim command ke IoT,
// // import di sini.
// //
// // const IoTService = require("./iotService");

// // ============================================================
// // GET TARGET DATE
// // ============================================================

// const getJakartaDate = () => {
//   return new Intl.DateTimeFormat("en-CA", {
//     timeZone: "Asia/Jakarta",
//     year: "numeric",
//     month: "2-digit",
//     day: "2-digit",
//   }).format(new Date());
// };

// // ============================================================
// // PROCESS ONE CROP
// // ============================================================

// const processCrop = async ({ farm, crop, targetDate }) => {
//   console.log("--------------------------------------------");

//   console.log(`AUTOMATION | Farm ${farm.id} - ${farm.name}`);

//   console.log(`AUTOMATION | Crop ${crop.id} - ${crop.cropName}`);

//   console.log(`AUTOMATION | Date ${targetDate}`);

//   // ==========================================================
//   // 1. CREATE / UPDATE CROP HEALTH
//   // ==========================================================

//   console.log(`1. Analyzing CropHealth...`);

//   const cropHealthResult = await CropHealthService.analyzeCropHealth(
//     farm.id,
//     crop.id,
//     targetDate,
//   );

//   const cropHealth = cropHealthResult?.data || cropHealthResult;

//   if (!cropHealth || !cropHealth.id) {
//     throw new Error(
//       `CropHealth gagal dibuat untuk Farm ${farm.id} / Crop ${crop.id}`,
//     );
//   }

//   console.log(`CropHealth berhasil | ID ${cropHealth.id}`);

//   // ==========================================================
//   // 2. GENERATE RECOMMENDATION
//   // ==========================================================

//   console.log(`2. Generating Recommendation...`);

//   const recommendationResult =
//     await RecommendationService.generateRecommendation(cropHealth.id);

//   const recommendation = recommendationResult?.data;

//   if (!recommendation || !recommendation.id) {
//     throw new Error(
//       `Recommendation gagal dibuat untuk CropHealth ${cropHealth.id}`,
//     );
//   }

//   console.log(
//     `Recommendation ${recommendationResult.action} | ID ${recommendation.id}`,
//   );

//   console.log(`Recommendation: ${recommendation.recommendation}`);

//   console.log(`Watering: ${recommendation.watering}`);

//   console.log(`Fertilize: ${recommendation.fertilize}`);

//   console.log(`Priority: ${recommendation.priority}`);

//   // ==========================================================
//   // 3. CREATE DECISION LOG
//   // ==========================================================

//   console.log(`3. Creating Decision...`);

//   const decisionResult = await DecisionLogService.createDecisionLog(
//     recommendation.id,
//   );

//   if (!decisionResult) {
//     throw new Error(
//       `Decision gagal dibuat untuk Recommendation ${recommendation.id}`,
//     );
//   }

//   console.log(`Decision: ${decisionResult.relayCommand}`);

//   // ==========================================================
//   // 4. RELAY COMMAND
//   // ==========================================================

//   const relayCommand = decisionResult.relayCommand;

//   console.log(`4. Relay Command: ${relayCommand}`);

//   /*
//    * ========================================================
//    * NANTI HUBUNGKAN KE IOT DI SINI
//    * ========================================================
//    *
//    * Contoh:
//    *
//    * await IoTService.sendRelayCommand(
//    *   farm.id,
//    *   relayCommand
//    * );
//    *
//    * Untuk sekarang kita hanya menghasilkan
//    * decision/command.
//    */

//   return {
//     farmId: farm.id,

//     farmName: farm.name,

//     cropId: crop.id,

//     cropName: crop.cropName,

//     date: targetDate,

//     cropHealth: cropHealth,

//     recommendation: recommendation,

//     decision: decisionResult.data,

//     relayCommand: relayCommand,
//   };
// };

// // ============================================================
// // RUN AUTOMATION
// // ============================================================

// const runAutomation = async () => {
//   console.log("");
//   console.log("================================================");
//   console.log("SMART AGRICULTURE AUTOMATION START");
//   console.log(new Date().toISOString());
//   console.log("================================================");

//   try {
//     // ========================================================
//     // TARGET DATE
//     // ========================================================

//     const targetDate = getJakartaDate();

//     console.log(`Target date: ${targetDate}`);

//     // ========================================================
//     // AMBIL CROP YANG MEMILIKI FARM
//     // ========================================================

//     /*
//      * Kita sengaja mulai dari Crop.
//      *
//      * Karena proses bisnis kita:
//      *
//      * Crop → Farm → CropHealth
//      *
//      * Crop tanpa farm tidak boleh diproses.
//      */

//     const crops = await Crop.findAll({
//       include: [
//         {
//           model: Farm,

//           required: true,
//         },
//       ],

//       where: {
//         farmId: {
//           [require("sequelize").Op.ne]: null,
//         },
//       },
//     });

//     console.log(`Found ${crops.length} crop(s) with farm`);

//     if (crops.length === 0) {
//       console.log("Tidak ada crop yang memiliki farm.");

//       return;
//     }

//     // ========================================================
//     // PROCESS SATU PER SATU
//     // ========================================================

//     const results = [];

//     for (const crop of crops) {
//       const farm = crop.Farm;

//       if (!farm) {
//         console.log(`Skip Crop ${crop.id}: Farm tidak ditemukan`);

//         continue;
//       }

//       try {
//         const result = await processCrop({
//           farm,

//           crop,

//           targetDate,
//         });

//         results.push(result);

//         console.log(`Automation SUCCESS | Farm ${farm.id} | Crop ${crop.id}`);
//       } catch (error) {
//         console.error(
//           `Automation FAILED | Farm ${farm.id} | Crop ${crop.id}`,
//           error.message,
//         );
//       }
//     }

//     // ========================================================
//     // SUMMARY
//     // ========================================================

//     console.log("");
//     console.log("================================================");
//     console.log("SMART AGRICULTURE AUTOMATION FINISHED");
//     console.log(`Processed: ${results.length}`);
//     console.log("================================================");

//     return results;
//   } catch (error) {
//     console.error("SMART AGRICULTURE AUTOMATION ERROR:", error);

//     throw error;
//   }
// };

// // ============================================================
// // START AUTOMATION SCHEDULER
// // ============================================================

// const startAutomationScheduler = () => {
//   /*
//    * Setiap 1 jam
//    *
//    * Menit 0
//    *
//    * 09:00
//    * 10:00
//    * 11:00
//    * 12:00
//    * dst.
//    */

//   cron.schedule(
//     "0 * * * *",

//     async () => {
//       try {
//         await runAutomation();
//       } catch (error) {
//         console.error("Scheduled automation failed:", error);
//       }
//     },

//     {
//       timezone: "Asia/Jakarta",
//     },
//   );

//   console.log("Smart Agriculture Automation Scheduler started");

//   console.log("Schedule: every 1 hour");

//   console.log("Timezone: Asia/Jakarta");
// };

// // ============================================================
// // EXPORT
// // ============================================================

// module.exports = {
//   runAutomation,

//   startAutomationScheduler,
// };


// ============================================================
// automationService.js
// ============================================================

const cron = require("node-cron");

const {
  Crop,
  Farm,
} = require("../models");

const { Op } = require("sequelize");

const CropHealthService =
  require("./cropHealthService");

const RecommendationService =
  require("./recomendationService");

const DecisionLogService =
  require("./decisionLogService");

// ============================================================
// GET TARGET DATE - ASIA/JAKARTA
// ============================================================

const getJakartaDate = () => {
  return new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone:
        "Asia/Jakarta",

      year:
        "numeric",

      month:
        "2-digit",

      day:
        "2-digit",
    },
  ).format(
    new Date(),
  );
};

// ============================================================
// PROCESS ONE CROP
// ============================================================

const processCrop =
  async ({
    farm,
    crop,
    targetDate,
  }) => {
    console.log("");
    console.log(
      "--------------------------------------------",
    );

    console.log(
      `AUTOMATION | Farm ${farm.id} - ${farm.name}`,
    );

    console.log(
      `AUTOMATION | Crop ${crop.id} - ${crop.cropName}`,
    );

    console.log(
      `AUTOMATION | Date ${targetDate}`,
    );

    console.log(
      "--------------------------------------------",
    );

    // ========================================================
    // 1. CREATE / UPDATE CROP HEALTH
    // ========================================================

    console.log(
      "1. Analyzing CropHealth...",
    );

    const cropHealthResult =
      await CropHealthService
        .analyzeCropHealth(
          farm.id,
          crop.id,
          targetDate,
        );

    // ========================================================
    // CROP HEALTH
    // ========================================================

    const cropHealth =
      cropHealthResult?.data ||
      cropHealthResult;

    if (
      !cropHealth ||
      !cropHealth.id
    ) {
      throw new Error(
        `CropHealth gagal dibuat untuk Farm ${farm.id} / Crop ${crop.id}`,
      );
    }

    console.log(
      `CropHealth berhasil | ID ${cropHealth.id}`,
    );

    // ========================================================
    // SENSOR DATA
    // ========================================================

    /*
     * CropHealthService sudah mengembalikan:
     *
     * sensorData: {
     *   sensorStatus,
     *   lastReadingAt,
     *   minutesSinceLastReading,
     *   soilMoisture,
     *   temperature,
     *   humidity,
     *   ...
     * }
     */

    const sensorData =
      cropHealthResult?.sensorData ||
      null;

    console.log(
      "Sensor Status:",
      sensorData?.sensorStatus ||
        "UNKNOWN",
    );

    console.log(
      "Last Sensor Reading:",
      sensorData?.lastReadingAt ||
        null,
    );

    console.log(
      "Minutes Since Last Reading:",
      sensorData?.minutesSinceLastReading ??
        null,
    );

    console.log(
      "Soil Moisture:",
      sensorData?.soilMoisture ??
        null,
    );

    console.log(
      "Temperature:",
      sensorData?.temperature ??
        null,
    );

    console.log(
      "Humidity:",
      sensorData?.humidity ??
        null,
    );

    // ========================================================
    // 2. GENERATE RECOMMENDATION
    // ========================================================

    console.log(
      "2. Generating Recommendation...",
    );

    const recommendationResult =
      await RecommendationService
        .generateRecommendation(
          cropHealth.id,
        );

    /*
     * Support dua kemungkinan:
     *
     * 1.
     * {
     *   action: "...",
     *   data: recommendation
     * }
     *
     * 2.
     * langsung Sequelize model Recommendation
     */

    const recommendation =
      recommendationResult?.data ||
      recommendationResult;

    if (
      !recommendation ||
      !recommendation.id
    ) {
      throw new Error(
        `Recommendation gagal dibuat untuk CropHealth ${cropHealth.id}`,
      );
    }

    console.log(
      `Recommendation ${
        recommendationResult?.action ||
        "processed"
      } | ID ${recommendation.id}`,
    );

    console.log(
      "Recommendation:",
      recommendation.recommendation,
    );

    console.log(
      "Watering:",
      recommendation.watering,
    );

    console.log(
      "Fertilize:",
      recommendation.fertilize,
    );

    console.log(
      "Priority:",
      recommendation.priority,
    );

    // ========================================================
    // 3. CREATE DECISION LOG
    // ========================================================

    console.log(
      "3. Creating Decision...",
    );

    /*
     * SENSOR DATA DITERUSKAN KE DECISION LOG SERVICE
     *
     * Jadi DecisionLogService bisa membedakan:
     *
     * SENSOR ONLINE
     * SENSOR OFFLINE
     *
     * tanpa hanya mengandalkan iotScore.
     */

    const decisionResult =
      await DecisionLogService
        .createDecisionLog(
          recommendation.id,
          {
            sensorData,
          },
        );

    if (!decisionResult) {
      throw new Error(
        `Decision gagal dibuat untuk Recommendation ${recommendation.id}`,
      );
    }

    // ========================================================
    // DECISION INFO
    // ========================================================

    const relayCommand =
      decisionResult.relayCommand ||
      "WATERING_OFF";

    const decisionAction =
      decisionResult.action ||
      "unknown";

    const confidence =
      decisionResult.confidence ??
      null;

    const dataMode =
      decisionResult.dataMode ||
      null;

    const safetyApplied =
      decisionResult.safetyApplied ===
      true;

    const automationBlocked =
      decisionResult.automationBlocked ===
      true;

    console.log(
      "Decision Action:",
      decisionAction,
    );

    console.log(
      "Relay Command:",
      relayCommand,
    );

    console.log(
      "Desired Relay Command:",
      decisionResult
        .desiredRelayCommand ||
        null,
    );

    console.log(
      "Confidence:",
      confidence,
    );

    console.log(
      "Data Mode:",
      dataMode,
    );

    console.log(
      "Safety Applied:",
      safetyApplied,
    );

    console.log(
      "Automation Blocked:",
      automationBlocked,
    );

    // ========================================================
    // 4. MANUAL OVERRIDE PROTECTION
    // ========================================================

    /*
     * Kalau user sudah melakukan:
     *
     * MANUAL_OVERRIDE
     *
     * maka DecisionLogService akan return:
     *
     * automationBlocked: true
     *
     * Scheduler tidak boleh menimpa relay user.
     */

    if (
      automationBlocked
    ) {
      console.log(
        "============================================",
      );

      console.log(
        "AUTOMATION RELAY SKIPPED",
      );

      console.log(
        "Manual override masih aktif.",
      );

      console.log(
        `Current command: ${relayCommand}`,
      );

      console.log(
        "============================================",
      );

      return {
        farmId:
          farm.id,

        farmName:
          farm.name,

        cropId:
          crop.id,

        cropName:
          crop.cropName,

        date:
          targetDate,

        cropHealth,

        sensorData,

        recommendation,

        decision:
          decisionResult.data,

        decisionAction,

        relayCommand,

        desiredRelayCommand:
          decisionResult
            .desiredRelayCommand ||
          null,

        confidence,

        dataMode,

        safetyApplied,

        automationBlocked:
          true,

        relayExecuted:
          false,
      };
    }

    // ========================================================
    // 5. RELAY COMMAND
    // ========================================================

    console.log(
      `4. Relay Command: ${relayCommand}`,
    );

    /*
     * ========================================================
     * BELUM DIHUBUNGKAN KE HARDWARE
     * ========================================================
     *
     * Nanti di sini:
     *
     * await IoTService.sendRelayCommand(
     *   farm.id,
     *   relayCommand
     * );
     *
     * Untuk sekarang automation menghasilkan
     * decision command terlebih dahulu.
     */

    // ========================================================
    // WATERING ON
    // ========================================================

    if (
      relayCommand ===
      "WATERING_ON"
    ) {
      console.log(
        "🚰 AUTOMATION COMMAND: WATERING_ON",
      );
    }

    // ========================================================
    // WATERING OFF
    // ========================================================

    else if (
      relayCommand ===
      "WATERING_OFF"
    ) {
      console.log(
        "⏹ AUTOMATION COMMAND: WATERING_OFF",
      );
    }

    // ========================================================
    // UNKNOWN COMMAND
    // ========================================================

    else {
      console.log(
        `⚠ UNKNOWN RELAY COMMAND: ${relayCommand}`,
      );
    }

    // ========================================================
    // 6. FINAL LOG
    // ========================================================

    console.log(
      "============================================",
    );

    console.log(
      "AUTOMATION CROP FINISHED",
    );

    console.log(
      `Farm: ${farm.id}`,
    );

    console.log(
      `Crop: ${crop.id}`,
    );

    console.log(
      `Sensor: ${
        sensorData?.sensorStatus ||
        "UNKNOWN"
      }`,
    );

    console.log(
      `Confidence: ${
        confidence ?? "-"
      }`,
    );

    console.log(
      `Data Mode: ${
        dataMode || "-"
      }`,
    );

    console.log(
      `Relay: ${relayCommand}`,
    );

    console.log(
      `Safety: ${
        safetyApplied
          ? "YES"
          : "NO"
      }`,
    );

    console.log(
      "============================================",
    );

    // ========================================================
    // 7. RETURN
    // ========================================================

    return {
      farmId:
        farm.id,

      farmName:
        farm.name,

      cropId:
        crop.id,

      cropName:
        crop.cropName,

      date:
        targetDate,

      cropHealth,

      sensorData,

      recommendation,

      decision:
        decisionResult.data,

      decisionAction,

      relayCommand,

      desiredRelayCommand:
        decisionResult
          .desiredRelayCommand ||
        null,

      confidence,

      dataMode,

      safetyApplied,

      automationBlocked:
        false,

      relayExecuted:
        false,
    };
  };

// ============================================================
// RUN AUTOMATION
// ============================================================

const runAutomation =
  async () => {
    console.log("");
    console.log(
      "================================================",
    );

    console.log(
      "SMART AGRICULTURE AUTOMATION START",
    );

    console.log(
      new Date().toISOString(),
    );

    console.log(
      "================================================",
    );

    try {
      // ======================================================
      // 1. TARGET DATE
      // ======================================================

      const targetDate =
        getJakartaDate();

      console.log(
        `Target date: ${targetDate}`,
      );

      // ======================================================
      // 2. AMBIL SEMUA CROP YANG MEMILIKI FARM
      // ======================================================

      const crops =
        await Crop.findAll({
          include: [
            {
              model:
                Farm,

              required:
                true,
            },
          ],

          where: {
            farmId: {
              [Op.ne]:
                null,
            },
          },

          order: [
            [
              "id",
              "ASC",
            ],
          ],
        });

      console.log(
        `Found ${crops.length} crop(s) with farm`,
      );

      // ======================================================
      // TIDAK ADA CROP
      // ======================================================

      if (
        crops.length === 0
      ) {
        console.log(
          "Tidak ada crop yang memiliki farm.",
        );

        return [];
      }

      // ======================================================
      // 3. PROCESS SATU PER SATU
      // ======================================================

      const results =
        [];

      const failed =
        [];

      for (
        const crop of crops
      ) {
        const farm =
          crop.Farm;

        if (!farm) {
          console.log(
            `Skip Crop ${crop.id}: Farm tidak ditemukan`,
          );

          continue;
        }

        try {
          const result =
            await processCrop({
              farm,

              crop,

              targetDate,
            });

          results.push(
            result,
          );

          console.log(
            `Automation SUCCESS | Farm ${farm.id} | Crop ${crop.id}`,
          );
        } catch (
          error
        ) {
          console.error(
            `Automation FAILED | Farm ${farm.id} | Crop ${crop.id}`,
          );

          console.error(
            error,
          );

          failed.push({
            farmId:
              farm.id,

            cropId:
              crop.id,

            error:
              error.message,
          });
        }
      }

      // ======================================================
      // 4. SUMMARY
      // ======================================================

      console.log("");
      console.log(
        "================================================",
      );

      console.log(
        "SMART AGRICULTURE AUTOMATION FINISHED",
      );

      console.log(
        `Success: ${results.length}`,
      );

      console.log(
        `Failed: ${failed.length}`,
      );

      console.log(
        `Total: ${crops.length}`,
      );

      console.log(
        "================================================",
      );

      if (
        failed.length >
        0
      ) {
        console.log(
          "FAILED ITEMS:",
          failed,
        );
      }

      return results;
    } catch (error) {
      console.error(
        "SMART AGRICULTURE AUTOMATION ERROR:",
        error,
      );

      throw error;
    }
  };

// ============================================================
// START AUTOMATION SCHEDULER
// ============================================================

const startAutomationScheduler =
  () => {
    /*
     * Jalan setiap 1 jam:
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
          console.log(
            "",
          );

          console.log(
            "⏰ AUTOMATION SCHEDULER TRIGGERED",
          );

          await runAutomation();
        } catch (
          error
        ) {
          console.error(
            "Scheduled automation failed:",
            error,
          );
        }
      },

      {
        timezone:
          "Asia/Jakarta",
      },
    );

    console.log(
      "Smart Agriculture Automation Scheduler started",
    );

    console.log(
      "Schedule: every 1 hour",
    );

    console.log(
      "Timezone: Asia/Jakarta",
    );
  };

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  runAutomation,

  startAutomationScheduler,
};