// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const { importClients, createClient, getClients,  updateClient, 
//   deleteClient } = require("../controllers/clientController");

// // Multer setup for file uploads
// const upload = multer({ dest: "uploads/" });

// // CRUD
// router.post("/", createClient);
// router.get("/", getClients);

// // CSV Import
// router.post("/import", upload.single("file"), importClients);
// // Update client
// router.put("/:clientNumber", updateClient);

// // Delete client
// router.delete("/:clientNumber", deleteClient);

// module.exports = router;
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { importClients, createClient, getClients, updateClient, deleteClient } = require("../controllers/clientController");

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

// CRUD
router.post("/", createClient);
router.get("/", getClients);
router.put("/:clientNumber", updateClient);
router.delete("/:clientNumber", deleteClient);

// CSV Import
router.post("/import", upload.single("file"), importClients);

// ✅ NEW: Get deals by client name
router.get("/deals", async (req, res) => {
  const clientName = req.query.name;
  if (!clientName) return res.status(400).json({ msg: "Client name required" });

  try {
    const Deal = require("../models/Deal");
    const deals = await Deal.find({ client: clientName });
    res.json(deals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;