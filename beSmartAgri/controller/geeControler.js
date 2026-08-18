const GeeService = require("../middlewares/geeService");

const WeatherForecastService = require("../middlewares/weatherForecastService");

const {Crop, Farm, GeeHistory, WeatherForecast} = require("../models")
const { Op } = require("sequelize");

class GeeController {
  static async testConnection(req, res) {
    try {
      const result = await GeeService.initialize();

      res.status(200).json(result);
    } catch (error) {
      console.error("GEE Controller Error:", error);

      res.status(500).json({
        success: false,

        message: "Google Earth Engine gagal terhubung",

        error: error.message,
      });
    }
  }
  static async getNDVI(req, res) {
    try {
      const { farmId, startDate, endDate } = req.body;

      if (!farmId) {
        return res.status(400).json({
          success: false,
          message: "farmId wajib diisi",
        });
      }

      const result = await GeeService.getNDVI(farmId, startDate, endDate);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: "Gagal mengambil NDVI",
        error: error.message,
      });
    }
  }

  static async analyzeSatellite(req, res) {
    try {
      const { farmId, date } = req.body;

      if (!farmId) {
        return res.status(400).json({
          success: false,

          message: "farmId wajib diisi",
        });
      }

      if (!date) {
        return res.status(400).json({
          success: false,

          message: "date wajib diisi",
        });
      }

      const result = await GeeService.analyzeSatellite(farmId, date);

      return res.status(200).json({
        success: true,

        data: result,
      });
    } catch (error) {
      console.error("GEE analyzeSatellite error:", error);

      return res.status(500).json({
        success: false,

        message: "Gagal menganalisis data GEE",

        error: error.message,
      });
    }
  }

  static async analyzeWeather(req, res) {
    try {
      const { farmId, date } = req.body;

      if (!farmId) {
        return res.status(400).json({
          success: false,

          message: "farmId wajib diisi",
        });
      }

      if (!date) {
        return res.status(400).json({
          success: false,

          message: "date wajib diisi",
        });
      }

      const result = await GeeService.analyzeWeather(farmId, date);

      return res.status(200).json({
        success: true,

        data: result,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,

        message: "Gagal mengambil data weather GEE",

        error: error.message,
      });
    }
  }

  static async saveWeather(req, res) {
    try {
      const { farmId, date } = req.body;

      if (!farmId) {
        return res.status(400).json({
          success: false,

          message: "farmId wajib diisi",
        });
      }

      if (!date) {
        return res.status(400).json({
          success: false,

          message: "date wajib diisi",
        });
      }

      const result = await WeatherForecastService.saveWeather(farmId, date);

      return res.status(200).json({
        success: true,

        message:
          result.action === "created"
            ? "Weather berhasil disimpan"
            : "Weather berhasil diperbarui",

        data: result.data,
      });
    } catch (error) {
      console.error("Save Weather Error:", error);

      return res.status(500).json({
        success: false,

        message: "Gagal menyimpan data weather",

        error: error.message,
      });
    }
  }
  static async saveGeeHistory(req, res) {
    try {
      const { farmId, date, cropId } = req.body;

      // =========================================
      // VALIDASI FARM
      // =========================================

      if (!farmId) {
        return res.status(400).json({
          success: false,

          message: "farmId wajib diisi",
        });
      }

      // =========================================
      // VALIDASI DATE
      // =========================================

      if (!date) {
        return res.status(400).json({
          success: false,

          message: "date wajib diisi",
        });
      }

      // =========================================
      // SAVE GEE HISTORY
      // =========================================

      const result = await GeeService.saveGeeHistory(
        farmId,
        date,
        cropId ?? null,
      );

      return res.status(200).json({
        success: true,

        message:
          result.action === "created"
            ? "Data GEE berhasil disimpan"
            : "Data GEE berhasil diperbarui",

        data: result.data,
      });
    } catch (error) {
      console.error("saveGeeHistory controller error:", error);

      return res.status(500).json({
        success: false,

        message: "Gagal menyimpan data GEE",

        error: error.message,
      });
    }
  }

  static async getHistory(req, res) {
    try {
      // =========================================
      // 1. AMBIL SEMUA CROP YANG TERHUBUNG FARM
      // =========================================

      const crops = await Crop.findAll({
        where: {
          farmId: {
            [Op.ne]: null,
          },
        },

        include: [
          {
            model: Farm,
            required: true,
          },
        ],
      });

      // =========================================
      // 2. TIDAK ADA DATA
      // =========================================

      if (!crops.length) {
        return res.status(200).json({
          success: true,
          message: "Belum ada farm yang memiliki crop",
          data: [],
        });
      }

      // =========================================
      // 3. AMBIL SEMUA CROP ID
      // =========================================

      const cropIds = crops.map((crop) => crop.id);

      // =========================================
      // 4. AMBIL GEE HISTORY
      // =========================================

      const histories = await GeeHistory.findAll({
        where: {
          cropId: {
            [Op.in]: cropIds,
          },
        },

        order: [["date", "DESC"]],
      });

      // =========================================
      // 5. GABUNGKAN FARM + CROP + HISTORY
      // =========================================

      const data = crops.map((crop) => {
        const cropData = crop.toJSON();

        const farm = cropData.Farm;

        const farmHistories = histories
          .filter(
            (history) =>
              Number(history.farmId) === Number(farm.id) &&
              Number(history.cropId) === Number(crop.id),
          )
          .map((history) => history.toJSON());

        return {
          farm,
          crop: {
            id: cropData.id,
            name: cropData.name,
            farmId: cropData.farmId,
          },
          histories: farmHistories,
        };
      });

      // =========================================
      // 6. RESPONSE
      // =========================================

      return res.status(200).json({
        success: true,
        message: "GEE history berhasil diambil",
        data,
      });
    } catch (error) {
      console.error("getHistory controller error:", error);

      return res.status(500).json({
        success: false,
        message: "Gagal mengambil GEE history",
        error: error.message,
      });
    }
  }
  static async fetchWeatherHistory(req, res) {
    try {
      const result = await GeeService.fetchWeatherHistory();

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("fetchWeatherHistory controller error:", error);

      return res.status(500).json({
        success: false,
        message: "Gagal mengambil weather history",
        error: error.message,
      });
    }
  }
}

module.exports = GeeController;
