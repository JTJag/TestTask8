const router = require("express").Router();
const generateReportMW = require("../middlewares/generateReport");
const processImageMW = require("../middlewares/processImage");

router.post("/generate_report", generateReportMW);

router.post("/process_image", processImageMW);

module.exports = router;
