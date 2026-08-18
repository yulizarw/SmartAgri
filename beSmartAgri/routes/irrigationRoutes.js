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

router.get("/status", IrrigationController.getStatus);

router.get("/history", IrrigationController.getHistory);

module.exports = router;
