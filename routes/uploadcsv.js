const express = require("express");
const router = express.Router();
// Multer ek middleware hai jo Express ko file uploads handle karna sikhata hai.
// multer() yahan memory storage use karta hai
// → matlab file ko RAM buffer mein rakhta hai
// → is liye tum req.file.buffer se CSV read kar sakti ho.
// ✔ File receive karna
// ✔ req.file object banana
// ✔ File ko buffer mein store karna
// ✔ Server ko batana ke request ke andar file hai
const multer = require("multer");
const upload = multer();

const { uploadCSV } = require("../controllers/uploadcsv");

router.post("/", upload.single("file"), uploadCSV);

module.exports = router;
