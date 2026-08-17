
const {
    Crop,
    GeeHistory,
    WeatherForecast,
    CropHealth
} = require("../models");
const CropHealthService =
    require("../middlewares/cropHealthService");



class CropHealthController {
  static async analyze(req, res) {
    try {
      const { farmId, cropId, date } = req.body;

      const result = await CropHealthService.analyzeCropHealth(
        farmId,
        cropId,
        date,
      );

      return res.status(result.action === "created" ? 201 : 200).json({
        success: true,

        message:
          result.action === "created"
            ? "Crop health berhasil dianalisis dan disimpan"
            : "Crop health berhasil diperbarui",

        data: result.data,
        analysis: result.analysis,

        sensor: result.sensorData,
      });
    } catch (error) {
      console.error("CropHealthController analyze error:", error);

      return res.status(500).json({
        success: false,

        message: error.message,
      });
    }
  }

  static async cariSatuCropHealth(req, res) {
    try {
      let id = req.params.id;
      console.log(id,'test')
      const data = await CropHealth.findOne({
        where: {
          farmId:id,
        },
        order: [["createdAt", "DESC"]],
      });

      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json("Tidak ada data Tanaman Tersebut");
      }
    } catch (err) {
      return res.status(500).json({
        success: false,

        message: error.message,
      });
    }
  }
}


module.exports =
    CropHealthController;