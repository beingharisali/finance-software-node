const express = require("express");
const router = express.Router();
const multer = require("multer");
const { importClients, createClient, getClients } = require("../controllers/clientController");

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

// CRUD
router.post("/", createClient);
router.get("/", getClients);

// CSV Import
router.post("/import", upload.single("file"), importClients);

module.exports = router;