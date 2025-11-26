// const express = require("express");
// const router = express.Router();
// const authenticateUser = require("../middleware/authentication");
// const { getTransactions ,  addCustomCategory, deleteCustomCategory } = require("../controllers/transactionController");

// router.get("/", authenticateUser, getTransactions);

// // Add custom category
// router.post("/add-category", authenticateUser, addCustomCategory);

// // Delete custom category
// router.delete("/delete-category", authenticateUser, deleteCustomCategory);

// module.exports = router;
const express = require("express");
const router = express.Router();
// const auth = require("../middleware/auth");
const authenticateUser = require("../middleware/authentication");
const allowRoles = require("../middleware/roleMiddleware");
const { getTransactions, addCustomCategory, deleteCustomCategory } = require("../controllers/transactionController");

// Get transactions → Admin, Manager, Broker
router.get("/", authenticateUser,  allowRoles("admin", "manager", "broker"), getTransactions);

// Add custom category → Admin, Manager
router.post("/add-category", authenticateUser,  allowRoles("admin", "manager"), addCustomCategory);

// Delete custom category → Admin, Manager
router.delete("/delete-category", authenticateUser,  allowRoles("admin", "manager"), deleteCustomCategory);

module.exports = router;

