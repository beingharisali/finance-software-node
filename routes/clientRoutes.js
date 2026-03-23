const express = require("express");
const router = express.Router();
const multer = require("multer");
const { importClients, createClient, getClients,  updateClient, 
  deleteClient } = require("../controllers/clientController");

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

// CRUD
router.post("/", createClient);
router.get("/", getClients);

// CSV Import
router.post("/import", upload.single("file"), importClients);
// Update client
router.put("/:clientNumber", updateClient);

// Delete client
router.delete("/:clientNumber", deleteClient);

module.exports = router;