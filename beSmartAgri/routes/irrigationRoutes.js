const express = require("express");

const router = express.Router();

const IrrigationController = require("../controller/irrigationController");

// =====================================================
// MANUAL OVERRIDE
// =====================================================

router.post("/override", IrrigationController.override);

// =====================================================
// RESUME AUTOMATIC
// =====================================================

router.post("/resume-auto", IrrigationController.resumeAuto);

module.exports = router;
