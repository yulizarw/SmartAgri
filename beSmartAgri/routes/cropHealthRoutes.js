const express =
    require("express");

const router =
    express.Router();

const CropHealthController =
    require("../controller/cropHealthController");


router.post(
    "/analyze",
    CropHealthController.analyze
);


module.exports =
    router;