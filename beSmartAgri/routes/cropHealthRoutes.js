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
// list crophealth pada salah satu jenis crop
router.get("/list-crophealth/:id",CropHealthController.cariSatuCropHealth)


module.exports =
    router;