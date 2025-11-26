// const express = require("express");
// const router = express.Router();
// // Multer ek middleware hai jo Express ko file uploads handle karna sikhata hai.
// // multer() yahan memory storage use karta hai
// // → matlab file ko RAM buffer mein rakhta hai
// // → is liye tum req.file.buffer se CSV read kar sakti ho.
// // ✔ File receive karna
// // ✔ req.file object banana
// // ✔ File ko buffer mein store karna
// // ✔ Server ko batana ke request ke andar file hai
// const multer = require("multer");
// const upload = multer();
// const auth = require("../middleware/authentication");

// const { uploadCSV } = require("../controllers/uploadcsv");

// router.post("/", auth, allowRoles("admin", "manager"),  upload.single("file"), uploadCSV);

// module.exports = router;



// module.exports = router;
// routes/uploadcsv.js
const express = require("express");
const router = express.Router();

// Multer ek middleware hai jo Express ko file uploads handle karna sikhata hai
const multer = require("multer");
const upload = multer(); // memory storage

// Middlewares
const auth = require("../middleware/authentication"); // authentication middleware
const allowRoles = require("../middleware/roleMiddleware"); // role-based access

// Controller
const { uploadCSV } = require("../controllers/uploadcsv");

// Route: Upload CSV only for admin and manager
router.post(
  "/",
  auth,
  allowRoles("admin", "manager"),
  upload.single("file"),
  uploadCSV
);

module.exports = router;
