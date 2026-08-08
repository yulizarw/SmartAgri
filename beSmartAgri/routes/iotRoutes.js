const express = require("express");

const router = express.Router();

const IoTController =
    require("../controller/iotController");


// Device connect
router.post(
    "/connect",
    IoTController.connect
);


/*
|--------------------------------------------------------------------------
| DEVICE INFO
|--------------------------------------------------------------------------
*/
router.post(
    "/device-info",
    IoTController.info
);
/*
|--------------------------------------------------------------------------
| SENSOR READING
|--------------------------------------------------------------------------
*/

router.post(
    "/sensor-reading",
    IoTController.sensorReading
);

/*
|--------------------------------------------------------------------------
| DEVICE DETAIL
|--------------------------------------------------------------------------
*/
router.get(
    "/device/:deviceCode",
    IoTController.getDevice
);

module.exports = router;


// 192.168.31.197
// HTTPClient http;

// http.begin(
//     "192.168.31.197/api/iot/connect"
// );

// http.addHeader(
//     "Content-Type",
//     "application/json"
// );

// String json = "{"
//     "\"deviceCode\":\"ESP32-001\","
//     "\"apiKey\":\"T4nahairku\""
// "}";

// int httpCode = http.POST(json);