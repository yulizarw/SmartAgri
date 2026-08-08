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

module.exports = router;