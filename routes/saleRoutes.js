
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authentication");
const allowRoles = require("../middleware/roleMiddleware");
const { createSale, getSales, updateSale, deleteSale } = require("../controllers/saleController");

// Create Sale → all roles can create
router.post("/", auth, allowRoles("admin", "manager", "assistant", "broker"), createSale);

// Get Sales → admin/manager/assistant see all, broker sees own
router.get("/", auth, allowRoles("admin", "manager", "assistant", "broker"), getSales);

// Update Sale → admin/manager/assistant can update any, broker only own
router.put("/:id", auth, allowRoles("admin", "manager", "assistant", "broker"), updateSale);

// Delete Sale → admin/manager/assistant can delete any, broker only own
router.delete("/:id", auth, allowRoles("admin", "manager", "assistant", "broker"), deleteSale);

module.exports = router;
