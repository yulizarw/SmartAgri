const { IrrigationService } = require("../middlewares/irrigationService");

// =====================================================
// MANUAL OVERRIDE
// POST /api/irrigation/override
// =====================================================

exports.override = async (req, res) => {
  try {
    const { recommendationId, command } = req.body;
    console.log(recommendationId)

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
