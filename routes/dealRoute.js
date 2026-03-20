
const express = require("express");
const router = express.Router();
const dealController = require("../controllers/dealController");

// GET all deals
router.get("/", dealController.getDeals);

// POST new deal
router.post("/", dealController.createDeal);

// PUT update deal status
// router.put("/:id", dealController.updateDealStatus);
// router.put("/:id", dealController.updateDeal);
// Full deal update (edit form)
router.put("/:id", dealController.updateDeal);

// Only status update (dropdown)
router.put("/:id/status", dealController.updateDealStatus);

// DELETE deal
router.delete("/:id", dealController.deleteDeal);

module.exports = router;