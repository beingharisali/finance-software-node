


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

// Get transactions → Admin, manager
router.get("/", authenticateUser, allowRoles("admin", "manager"), getTransactions);

// Add custom category → Admin, manager
router.post("/add-category", authenticateUser, allowRoles("admin", "manager"), addCustomCategory);

// Delete custom category → Admin, manager
router.delete("/delete-category", authenticateUser, allowRoles("admin", "manager"), deleteCustomCategory);

// Update transaction category → Admin, manager
router.put("/:id/update-category", authenticateUser, allowRoles("admin", "manager"), updateTransactionCategory);

module.exports = router;
