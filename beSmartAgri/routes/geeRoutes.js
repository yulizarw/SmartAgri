const express = require("express");

const router = express.Router();

const GeeController =
    require("../controller/geeControler");


router.get(
    "/test",
    GeeController.testConnection
);
router.get(
    "/ndvi",
    GeeController.getNDVI
);
// ini yg allinone
router.post(
    "/satellite",
    GeeController.analyzeSatellite
);

router.post(
    "/weather",
    GeeController.analyzeWeather
);

router.post(
    "/weather/save",
    GeeController.saveWeather
);

// save geehistory
router.post(
    "/history",
    GeeController.saveGeeHistory
);

// get geehistory
router.get("/get-history",GeeController.getHistory)
//get weatherhistory
router.get("/get-weather-history", GeeController.fetchWeatherHistory)


module.exports = router;