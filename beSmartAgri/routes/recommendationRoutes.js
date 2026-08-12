const express = require("express");

const router =
    express.Router();

const recommendationController =
    require("../controller/recomendationController");


// =====================================================
// GENERATE RECOMMENDATION DARI CROPHHEALTH
// =====================================================

router.post(
    "/generate/:cropHealthId",
    recommendationController.generateRecommendation
);


// =====================================================
// GET RECOMMENDATION TERBARU
// =====================================================

router.get(
    "/latest/:cropHealthId",
    recommendationController.getLatestRecommendation
);


module.exports = router;