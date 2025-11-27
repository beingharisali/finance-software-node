
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
  allowRoles("admin"),
  upload.single("file"),
  uploadCSV
);

module.exports = router;
