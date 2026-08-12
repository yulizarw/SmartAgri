const express = require("express");

const router =
    express.Router();

const decisionLogController =
    require("../controller/decisionLogController");


// =====================================================
// CREATE DECISION LOG
// =====================================================

router.post(
    "/:recommendationId",
    decisionLogController.createDecisionLog
);


// =====================================================
// GET DECISION TERBARU
// =====================================================

router.get(
    "/latest/:recommendationId",
    decisionLogController.getLatestDecision
);


// =====================================================
// COMMAND RELAY
// =====================================================

router.get(
    "/relay/:recommendationId",
    decisionLogController.getRelayCommand
);


module.exports = router;