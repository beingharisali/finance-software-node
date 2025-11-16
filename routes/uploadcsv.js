const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer();

const { uploadCSV } = require("../controllers/uploadcsv");

router.post("/", upload.single("file"), uploadCSV);

module.exports = router;
