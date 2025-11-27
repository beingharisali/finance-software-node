


const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");
const allowRoles = require("../middleware/roleMiddleware");
const {
  getTransactions,
  addCustomCategory,
  deleteCustomCategory,
  updateTransactionCategory
} = require("../controllers/transactionController");

// ---------------------- ROUTES ----------------------

// Get transactions → Admin
router.get("/", authenticateUser, allowRoles("admin"), getTransactions);

// Add custom category → Admin
router.post("/add-category", authenticateUser, allowRoles("admin"), addCustomCategory);

// Delete custom category → Admin
router.delete("/delete-category", authenticateUser, allowRoles("admin"), deleteCustomCategory);

// Update transaction category → Admin
router.put("/:id/update-category", authenticateUser, allowRoles("admin"), updateTransactionCategory);

module.exports = router;
