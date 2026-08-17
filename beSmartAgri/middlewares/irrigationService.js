const { DecisionLog, Recommendation } = require("../models");

const IrrigationService = {
  // =================================================
  // MANUAL OVERRIDE
  // =================================================

  async override(recommendationId, command) {
    const recommendation = await Recommendation.findByPk(recommendationId);

    if (!recommendation) {
      throw new Error("Recommendation tidak ditemukan");
    }

    const decisionLog = await DecisionLog.create({
      recommendationId,

      sensorValue: null,

      geeValue: null,

      confidence: null,

      decision: command,

      source: "MANUAL_OVERRIDE",

      reason:
        command === "WATERING_OFF"
          ? "Pompa dimatikan manual oleh user"
          : "Pompa dinyalakan manual oleh user",
    });

    return {
      data: decisionLog,

      relayCommand: command,
    };
  },

  // =================================================
  // RESUME AUTO
  // =================================================

  async resumeAuto(recommendationId) {
    // =============================================
    // CARI DECISION TERAKHIR
    // BERDASARKAN RECOMMENDATION
    // =============================================

    const latestDecision = await DecisionLog.findOne({
      where: {
        recommendationId: recommendationId,
      },

      order: [["createdAt", "DESC"]],
    });

    // =============================================
    // VALIDASI
    // =============================================

    if (!latestDecision) {
      throw new Error(
        "Decision log untuk recommendation tersebut belum tersedia",
      );
    }

    // =============================================
    // AMBIL COMMAND TERAKHIR
    // =============================================

    const command = latestDecision.decision;

    if (command !== "WATERING_ON" && command !== "WATERING_OFF") {
      throw new Error(`Decision terakhir tidak valid: ${command}`);
    }

    // =============================================
    // BUAT DECISION LOG BARU
    // =============================================

    const decisionLog = await DecisionLog.create({
      recommendationId: recommendationId,

      sensorValue: latestDecision.sensorValue,

      geeValue: latestDecision.geeValue,

      confidence: latestDecision.confidence,

      decision: command,

      source: "RESUME_AUTO",

      reason: `Automatic irrigation resumed berdasarkan decision terakhir: ${command}`,
    });

    // =============================================
    // RETURN
    // =============================================

    return {
      data: decisionLog,

      relayCommand: command,
    };
  },
};

module.exports = {
  IrrigationService,
};
